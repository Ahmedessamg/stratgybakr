// Strategy Main Table
export interface Strategy {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  strategic_details: string | null;
  vision_mission: string | null;
  focus_areas: string | null;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStrategyInput {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  strategic_details?: string;
  vision_mission?: string;
  focus_areas?: string;
  is_draft?: boolean;
}

export interface UpdateStrategyInput extends Partial<CreateStrategyInput> {
  id: string;
}

// Strategic Goals Table
export interface StrategicGoal {
  id: string;
  strategy_id: string;
  name: string;
  duration: string;
  element: string;
  description: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStrategicGoalInput {
  strategy_id: string;
  name: string;
  duration: string;
  element: string;
  description?: string;
  status: boolean;
}

// Operational Goals Table
export interface OperationalGoal {
  id: string;
  strategy_id: string;
  name: string;
  duration: string;
  element: string;
  description: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOperationalGoalInput {
  strategy_id: string;
  name: string;
  duration: string;
  element: string;
  description?: string;
  status: boolean;
}

// Values Table
export interface StrategyValue {
  id: string;
  strategy_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateValueInput {
  strategy_id: string;
  name: string;
  description?: string;
}

// Pillars Table
export interface StrategyPillar {
  id: string;
  strategy_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePillarInput {
  strategy_id: string;
  name: string;
  description?: string;
}

// Attachments Table
export interface StrategyAttachment {
  id: string;
  strategy_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

export interface CreateAttachmentInput {
  strategy_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
}

// Complete Strategy with Relations
export interface StrategyWithRelations extends Strategy {
  strategic_goals?: StrategicGoal[];
  operational_goals?: OperationalGoal[];
  values?: StrategyValue[];
  pillars?: StrategyPillar[];
  attachments?: StrategyAttachment[];
}
