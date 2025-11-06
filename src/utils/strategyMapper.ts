import type { Strategy as DbStrategy, StrategyWithRelations } from '../services/supabase/strategy/types';
import type { Strategy as UIStrategy, StrategyValue as UIStrategyValue, StrategyPillar as UIStrategyPillar } from '../pages/StrategyList/components/StrategyCard/StrategyCard';
import { formatISOToArabicDate } from './dateFormatter';

// Calculate strategy status based on dates and draft status
const calculateStatus = (strategy: DbStrategy): 'active' | 'draft' | 'completed' | 'archived' => {
  if (strategy.is_draft) {
    return 'draft';
  }

  const now = new Date();
  const startDate = new Date(strategy.start_date);
  const endDate = new Date(strategy.end_date);

  if (now < startDate) {
    return 'draft';
  } else if (now > endDate) {
    return 'archived';
  } else {
    return 'active';
  }
};

// Calculate progress based on goals completion
const calculateProgress = (strategy: StrategyWithRelations): number => {
  const strategicGoals = strategy.strategic_goals || [];
  const operationalGoals = strategy.operational_goals || [];
  const allGoals = [...strategicGoals, ...operationalGoals];
  
  if (allGoals.length === 0) {
    return 0;
  }

  const completedGoals = allGoals.filter(goal => goal.status).length;
  return Math.round((completedGoals / allGoals.length) * 100);
};

// Extract goals names for card display
const extractGoals = (strategy: StrategyWithRelations): string[] => {
  const strategicGoals = strategy.strategic_goals || [];
  const operationalGoals = strategy.operational_goals || [];
  
  return [
    ...strategicGoals.map(goal => goal.name),
    ...operationalGoals.map(goal => goal.name)
  ];
};

// Parse focus areas from JSON string
const parseFocusAreas = (focusAreas: string | null): string[] => {
  if (!focusAreas) return [];
  
  try {
    const parsed = JSON.parse(focusAreas);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Map database values to UI format
const mapValues = (values: any[]): UIStrategyValue[] => {
  return values.map(value => ({
    name: value.name,
    description: value.description || ''
  }));
};

// Map database pillars to UI format
const mapPillars = (pillars: any[]): UIStrategyPillar[] => {
  return pillars.map(pillar => ({
    name: pillar.name,
    description: pillar.description || ''
  }));
};

// Main mapper function
export const mapStrategyToUI = (dbStrategy: StrategyWithRelations): UIStrategy => {
  const status = calculateStatus(dbStrategy);
  const progress = calculateProgress(dbStrategy);
  const goals = extractGoals(dbStrategy);
  const focusAreas = parseFocusAreas(dbStrategy.focus_areas);
  const values = mapValues(dbStrategy.values || []);
  const pillars = mapPillars(dbStrategy.pillars || []);

  return {
    id: dbStrategy.id,
    name: dbStrategy.name,
    description: dbStrategy.description || undefined,
    startDate: formatISOToArabicDate(dbStrategy.start_date),
    endDate: formatISOToArabicDate(dbStrategy.end_date),
    status,
    progress,
    goals,
    visionMission: dbStrategy.vision_mission || undefined,
    focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
    strategicDetails: dbStrategy.strategic_details || undefined,
    values: values.length > 0 ? values : undefined,
    pillars: pillars.length > 0 ? pillars : undefined,
    owner: undefined, // Not available in database
    ownerRole: undefined // Not available in database
  };
};

// Map array of strategies
export const mapStrategiesToUI = (dbStrategies: StrategyWithRelations[]): UIStrategy[] => {
  return dbStrategies.map(mapStrategyToUI);
};
