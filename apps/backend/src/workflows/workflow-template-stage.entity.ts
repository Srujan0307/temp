import { Model } from 'objection';
import { WorkflowTemplate } from './workflow-template.entity';

export class WorkflowTemplateStage extends Model {
  static tableName = 'workflow_template_stages';

  id!: number;
  workflow_template_id!: number;
  name!: string;
  order!: number;
  required_roles!: string[];
  created_at!: Date;
  updated_at!: Date;

  workflowTemplate?: WorkflowTemplate;

  static relationMappings = {
    workflowTemplate: {
      relation: Model.BelongsToOneRelation,
      modelClass: WorkflowTemplate,
      join: {
        from: 'workflow_template_stages.workflow_template_id',
        to: 'workflow_templates.id',
      },
    },
  };
}
