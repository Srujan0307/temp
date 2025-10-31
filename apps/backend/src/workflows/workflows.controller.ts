import { Controller, Post, Body } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post('/templates')
  async createWorkflowTemplate(
    @Body()
    body: {
      name: string;
      description: string;
      stages: { name: string; order: number; required_roles: string[] }[];
    },
  ) {
    const { name, description, stages } = body;
    return this.workflowsService.createWorkflowTemplate(
      name,
      description,
      stages,
    );
  }
}
