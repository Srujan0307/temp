import { TenancyService } from './tenancy.service';

declare global {
  namespace Express {
    export interface Request {
      tenancyService?: TenancyService;
    }
  }
}
