import { Model } from 'objection';
import { WorkflowTemplateStage } from './workflow-template-stage.entity';

export class WorkflowTemplate extends Model {
  static tableName = 'workflow_templates';

  id!: number;
  name!: string;
  description?: string;
  created_at!: Date;
  updated_at!: Date;

  stages?: WorkflowTemplateStage[];

  static relationMappings = {
    stages: {
      relation: Model.HasManyRelation,
      modelClass: WorkflowTemplateStage,
      join: {
        from: 'workflow_templates.id',
        to: 'workflow_template_stages.workflow_template_id',
      },
    },
  };
}
