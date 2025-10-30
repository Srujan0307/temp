
import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';
export const Audit = (message: string) => SetMetadata(AUDIT_KEY, message);
