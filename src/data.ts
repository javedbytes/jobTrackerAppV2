import { Application } from './types'

export const applications: Application[] = [
  { id: 'mmt', company: 'MakeMyTrip', emoji: '🧳', currentStage: 'First-Round', roundType: 'DSA', position: 'SDE II', appliedDate: '2025-01-12', offeredDate: '2025-01-18', finalVerdict: 'Offered' },
  { id: 'gs', company: 'Goldman Sachs', emoji: '🏦', currentStage: 'First-Round', roundType: 'QA', position: 'Associate', appliedDate: '2025-01-19' },
  { id: 'svc', company: 'ServiceNow', emoji: '🧩', currentStage: 'Fourth-Round', roundType: 'DSA', position: 'SDE II', appliedDate: '2025-01-20', offeredDate: '2025-02-14', finalVerdict: 'Declined Offer' },
  { id: 'ct', company: 'ClearTrip', emoji: '✈️', currentStage: 'First-Round', roundType: 'DSA', position: 'SDE II', appliedDate: '2025-01-26', finalVerdict: 'Rejected' },
  { id: 'tek', company: 'Tekion', emoji: '🚗', currentStage: 'Third-Round', roundType: 'Hiring Manager', position: 'SDE II', team: 'Platform', appliedDate: '2025-01-27', offeredDate: '2025-03-26', finalVerdict: 'Declined Offer' },
  { id: 'zm', company: 'Zest Money', emoji: '💳', currentStage: 'Second-Round', roundType: 'DSA', position: 'SDE II', team: 'Scale', appliedDate: '2025-01-31', finalVerdict: 'Rejected' },
  { id: 'hfm', company: 'HealthifyMe', emoji: '🍏', currentStage: 'Second-Round', roundType: 'LLD', position: 'Sr. Backend Developer', team: 'Growth', appliedDate: '2025-02-02', finalVerdict: 'Rejected' },
  { id: 'quiz', company: 'Quizziz', emoji: '📝', currentStage: 'First-Round', roundType: 'DSA', position: 'SDE II', appliedDate: '2025-02-02' },
  { id: 'vimeo', company: 'Vimeo', emoji: '🎥', currentStage: 'Applied', position: 'SDE II', appliedDate: '2025-02-02' },
  { id: 'bp', company: 'BetterPlace', emoji: '🏗️', currentStage: 'Fourth-Round', roundType: 'Hiring Manager', position: 'SDE II', appliedDate: '2025-02-03', offeredDate: '2025-02-25', finalVerdict: 'Declined Offer' },
  { id: 'gsight', company: 'Gainsight', emoji: '📈', currentStage: 'Applied', position: 'SDE II', appliedDate: '2025-02-07', finalVerdict: 'Rejected' },
  { id: 'fresh', company: 'Freshworks', emoji: '🍋', currentStage: 'Second-Round', roundType: 'HLD', position: 'Sr. Software Engineer', team: 'Platform - Observability', appliedDate: '2025-02-08' },
  { id: 'apna', company: 'Apna', emoji: '🧑‍🔧', currentStage: 'Fourth-Round', roundType: 'HR', position: 'Sr. Software Engineer', team: 'Marketplace', appliedDate: '2025-02-11', offeredDate: '2025-02-26', finalVerdict: 'Declined Offer' },
  { id: 'google', company: 'Google', emoji: '🔎', currentStage: 'First-Round', roundType: 'DSA', position: 'SDE L4', appliedDate: '2025-02-12', finalVerdict: 'Rejected' },
  { id: 'ethos', company: 'Ethos Life', emoji: '🧬', currentStage: 'OA', roundType: 'DSA', position: 'SDE II', appliedDate: '2025-02-15' },
  { id: 'algo', company: 'Algonomy', emoji: '🧠', currentStage: 'Fifth-Round', roundType: 'Discussion', position: 'System Engineer', appliedDate: '2025-02-21', offeredDate: '2025-03-24', finalVerdict: 'Declined Offer' },
  { id: 'hotstar', company: 'Hotstar', emoji: '🔥', currentStage: 'Referred', position: 'SDE II', team: 'Personalization, Grow', appliedDate: '2025-02-24' },
  { id: 'postman', company: 'Postman', emoji: '📮', currentStage: 'Fourth-Round', roundType: 'API Coding', position: 'Software Engineer II', team: 'Search Squad', appliedDate: '2025-02-26', finalVerdict: 'Rejected' },
  { id: 'meesho', company: 'Meesho', emoji: '🛍️', currentStage: 'Referred', position: 'SDE III', appliedDate: '2025-02-26' },
  { id: 'rippling', company: 'Rippling', emoji: '🌀', currentStage: 'Second-Round', roundType: 'DSA', position: 'Software Engineer', team: 'Billing', appliedDate: '2025-02-27' },
  { id: 'myntra', company: 'Myntra', emoji: '👚', currentStage: 'Referred', position: 'Sr. Software Engineer', appliedDate: '2025-02-27' },
  { id: 'twilio', company: 'Twilio', emoji: '📞', currentStage: 'First-Round', roundType: 'OA', position: 'SDE II', team: 'Flex, Developer Exper', appliedDate: '2025-03-01' },
  { id: 'sharechat', company: 'ShareChat', emoji: '💬', currentStage: 'Fourth-Round', roundType: 'Hiring Manager', position: 'SDE II', team: 'ML Platform', appliedDate: '2025-03-02', offeredDate: '2025-03-30', finalVerdict: 'Declined Offer' },
  { id: 'akasa', company: 'Akasa Air', emoji: '✈️', currentStage: 'Applied', position: 'Software Engineer', team: 'Engineering', appliedDate: '2025-03-15' },
]

export const STAGE_ORDER: string[] = [
  'Applied',
  'Referred',
  'OA',
  'Screening-Round',
  'First-Round',
  'Second-Round',
  'Third-Round',
  'Fourth-Round',
  'Hiring Manager',
  'Fifth-Round',
  'Discussion',
]

export const verdictColors: Record<string, string> = {
  'Rejected': 'red',
  'Declined Offer': 'gray',
  'Accept Offer': 'green',
  'Offered': 'green',
  'Pending': 'blue',
  '': 'gray',
}

export const stageColors: Record<string, string> = {
  'Applied': 'gray',
  'Referred': 'blue',
  'OA': 'blue',
  'Screening-Round': 'blue',
  'First-Round': 'yellow',
  'Second-Round': 'yellow',
  'Third-Round': 'yellow',
  'Fourth-Round': 'yellow',
  'Hiring Manager': 'purple',
  'Fifth-Round': 'purple',
  'Discussion': 'green',
}
