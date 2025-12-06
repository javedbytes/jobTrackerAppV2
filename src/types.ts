export type Stage =
  | 'Applied'
  | 'First-Round'
  | 'Second-Round'
  | 'Third-Round'
  | 'Fourth-Round'
  | 'Screening-Round'
  | 'Hiring Manager'
  | 'Discussion'
  | 'Fifth-Round'
  | 'OA'
  | 'Referred'
  | 'QA';

export type Verdict = 'Rejected' | 'Declined Offer' | 'Offered' | 'Pending' | '';

export type RoundType = 'DSA' | 'HLD' | 'LLD' | 'HR' | 'API Coding' | 'Hiring Manager' | 'OA' | 'Discussion';

export interface Application {
  id: string;
  company: string;
  emoji?: string;
  currentStage: Stage | string;
  roundType?: RoundType | string;
  position?: string;
  team?: string;
  appliedDate?: string; // ISO date
  offeredDate?: string; // ISO date
  dueDate?: string; // ISO date for next step
  finalVerdict?: Verdict | string;
  notes?: string;
}
