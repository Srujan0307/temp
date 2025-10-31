import { Injectable } from '@nestjs/common';
import { Transaction } from 'objection';
import { WorkflowTemplate } from './workflow-template.entity';

@Injectable()
export class WorkflowsService {
  async createWorkflowTemplate(
    name: string,
    description: string,
    stages: { name: string; order: number; required_roles: string[] }[],
    trx?: Transaction,
  ): Promise<WorkflowTemplate> {
    const workflowTemplate = await WorkflowTemplate.query(trx).insert({
      name,
      description,
    });

    for (const stage of stages) {
      await workflowTemplate
        .$relatedQuery('stages', trx)
        .insert(stage);
    }

    return workflowTemplate;
  }
}
