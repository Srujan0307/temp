
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  log(message: string) {
    console.log(`[AUDIT] ${message}`);
  }
}
