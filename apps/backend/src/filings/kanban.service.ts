import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { KNEX_CONNECTION } from 'nest-knexjs';
import { Knex } from 'knex';
import { Filing, FilingStage } from './filing.entity';
import { AuditService } from '../common/logging/audit.service';
import { UpdateFilingStageDto } from './dtos/update-filing-stage.dto';

interface KanbanFilter {
  tenantId: string;
  clientId?: string;
  vehicleId?: string;
  assigneeId?: string;
  slaStatus?: string;
  search?: string;
}

interface KanbanCard {
  id: string;
  title: string;
  client: { id: string; name: string };
  vehicle: { id: string; name: string };
  dueDate: string;
  slaStatus: string;
  assignee: { id: string; name: string };
  documentCount: number;
}

interface KanbanColumn {
  stage: FilingStage;
  cards: KanbanCard[];
  count: number;
  meta: {
    total: number;
    overdue: number;
    sla: Record<string, number>;
  };
}

@Injectable()
export class KanbanService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly auditService: AuditService,
  ) {}

  async getBoard(filters: KanbanFilter): Promise<KanbanColumn[]> {
    const query = this.knex('filings')
      .select(
        'filings.id',
        'filings.type as title',
        'clients.id as clientId',
        'clients.name as clientName',
        'vehicles.id as vehicleId',
        'vehicles.name as vehicleName',
        'filings.due_date as dueDate',
        'filings.sla_status as slaStatus',
        'users.id as assigneeId',
        'users.name as assigneeName',
        'filings.stage',
      )
      .leftJoin('clients', 'filings.client_id', 'clients.id')
      .leftJoin('vehicles', 'filings.vehicle_id', 'vehicles.id')
      .leftJoin('users', 'filings.assigned_to', 'users.id')
      .where('filings.tenant_id', filters.tenantId)
      .andWhere('filings.deleted_at', null);

    if (filters.clientId) {
      query.andWhere('filings.client_id', filters.clientId);
    }
    if (filters.vehicleId) {
      query.andWhere('filings.vehicle_id', filters.vehicleId);
    }
    if (filters.assigneeId) {
      query.andWhere('filings.assigned_to', filters.assigneeId);
    }
    if (filters.slaStatus) {
      query.andWhere('filings.sla_status', filters.slaStatus);
    }
    if (filters.search) {
      query.andWhere((builder) =>
        builder
          .where('filings.type', 'ilike', `%${filters.search}%`)
          .orWhere('clients.name', 'ilike', `%${filters.search}%`)
          .orWhere('vehicles.name', 'ilike', `%${filters.search}%`),
      );
    }

    const subquery = this.knex('documents')
      .select('filing_id')
      .count('* as document_count')
      .groupBy('filing_id')
      .as('doc_counts');

    const filings = await query.leftJoin(
      subquery,
      'filings.id',
      'doc_counts.filing_id',
    );

    const groupedByStage = filings.reduce((acc, filing) => {
      if (!acc[filing.stage]) {
        acc[filing.stage] = [];
      }
      acc[filing.stage].push({
        id: filing.id,
        title: filing.title,
        client: { id: filing.clientId, name: filing.clientName },
        vehicle: { id: filing.vehicleId, name: filing.vehicleName },
        dueDate: filing.dueDate,
        slaStatus: filing.slaStatus,
        assignee: { id: filing.assigneeId, name: filing.assigneeName },
        documentCount: parseInt(filing.document_count || '0', 10),
      });
      return acc;
    }, {} as Record<FilingStage, KanbanCard[]>);

    return Object.values(FilingStage).map((stage) => {
      const cards = groupedByStage[stage] || [];
      const slaCounts = cards.reduce((acc, card) => {
        acc[card.slaStatus] = (acc[card.slaStatus] || 0) + 1;
        return acc;
      }, {});
      const overdueCount = cards.filter(
        (card) => new Date(card.dueDate) < new Date(),
      ).length;

      return {
        stage,
        cards,
        count: cards.length,
        meta: {
          total: cards.length,
          overdue: overdueCount,
          sla: slaCounts,
        },
      };
    });
  }

  async updateStage(
    id: string,
    tenantId: string,
    updateDto: UpdateFilingStageDto,
  ) {
    const { stage, assigneeId } = updateDto;

    const filing = await this.knex('filings')
      .where({ id, tenant_id: tenantId, deleted_at: null })
      .first();

    if (!filing) {
      throw new NotFoundException('Filing not found');
    }

    const oldStage = filing.stage;
    const isTransitionAllowed = this.isStageTransitionAllowed(
      oldStage,
      stage,
    );
    if (!isTransitionAllowed) {
      throw new BadRequestException(
        `Transition from ${oldStage} to ${stage} is not allowed`,
      );
    }

    const updatedFiling = await this.knex.transaction(async (trx) => {
      const [updated] = await trx('filings')
        .where({ id })
        .update(
          {
            stage,
            assigned_to: assigneeId || filing.assigned_to,
          },
          '*',
        );

      await this.auditService.emit({
        entity: 'filing',
        entityId: id,
        event: 'stage_change',
        timestamp: new Date(),
        details: {
          from: oldStage,
          to: stage,
          assigneeChanged: !!assigneeId,
        },
      });

      return updated;
    });

    return updatedFiling;
  }

  private isStageTransitionAllowed(
    from: FilingStage,
    to: FilingStage,
  ): boolean {
    const allowedTransitions: Partial<Record<FilingStage, FilingStage[]>> = {
      [FilingStage.DRAFT]: [FilingStage.IN_REVIEW, FilingStage.ARCHIVED],
      [FilingStage.IN_REVIEW]: [
        FilingStage.DRAFT,
        FilingStage.APPROVED,
        FilingStage.ARCHIVED,
      ],
      [FilingStage.APPROVED]: [FilingStage.SUBMITTED, FilingStage.ARCHIVED],
      [FilingStage.SUBMITTED]: [FilingStage.ARCHIVED],
    };

    return (allowedTransitions[from] || []).includes(to);
  }
}
