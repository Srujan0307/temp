import { Model } from 'objection';
import { WorkflowTemplate } from './workflow-template.entity';
import { Filing } from '../filings/filing.entity';

export class WorkflowInstance extends Model {
  static tableName = 'workflow_instances';

  id!: number;
  workflow_template_id!: number;
  status!: string;
  filing_id!: number;
  created_at!: Date;
  updated_at!: Date;

  workflowTemplate?: WorkflowTemplate;
  filing?: Filing;

  static relationMappings = {
    workflowTemplate: {
      relation: Model.BelongsToOneRelation,
      modelClass: WorkflowTemplate,
      join: {
        from: 'workflow_instances.workflow_template_id',
        to: 'workflow_templates.id',
      },
    },
    filing: {
      relation: Model.BelongsToOneRelation,
      modelClass: Filing,
      join: {
        from: 'workflow_instances.filing_id',
        to: 'filings.id',
      },
    },
  };
}
