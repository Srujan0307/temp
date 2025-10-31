export type Filing = {
  id: string;
  name: string;
  stage: FilingStage;
};

export type FilingStage =
  | 'new'
  | 'in-progress'
  | 'review'
  | 'ready-to-file'
  | 'filed'
  | 'done'
  | 'blocked';

export const FILING_STAGES: FilingStage[] = [
  'new',
  'in-progress',
  'review',
  'ready-to-file',
  'filed',
  'done',
  'blocked',
];
