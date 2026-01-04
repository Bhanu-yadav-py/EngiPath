export enum StudentYear {
  FIRST = '1st Year',
  SECOND = '2nd Year',
  THIRD = '3rd Year',
  FINAL = 'Final Year'
}

export enum CareerGoal {
  FAANG = 'Product / FAANG',
  STARTUP = 'Startup / Development',
  CORE = 'Core Engineering',
  HIGHER_STUDIES = 'Higher Studies (GATE/GRE/CAT)'
}

export interface UserProfile {
  name: string;
  branch: string;
  year: StudentYear;
  goal: CareerGoal;
  strongSubjects: string;
  weakSubjects: string;
}

export interface RoadmapMilestone {
  semester: string;
  academicFocus: string;
  skillsToLearn: string[];
  projectIdea: string;
  resources: string[]; // New field for learning resources
}

export interface WeeklyTask {
  day: string;
  task: string;
  category: 'Study' | 'Skill' | 'Project' | 'Chill';
}

export interface TimeBalance {
  academics: number;
  skills: number;
  leisure: number;
  projects: number;
}

export interface AIRoadmapResponse {
  readinessScore: number;
  realityCheck: string;
  timeBalance: TimeBalance;
  milestones: RoadmapMilestone[];
  nextWeekPlan: WeeklyTask[];
  missingSkills: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}