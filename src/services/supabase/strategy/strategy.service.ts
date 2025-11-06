import { supabase } from '../client';
import type {
  Strategy,
  CreateStrategyInput,
  UpdateStrategyInput,
  StrategyWithRelations,
  CreateStrategicGoalInput,
  CreateOperationalGoalInput,
  CreateValueInput,
  CreatePillarInput,
  CreateAttachmentInput,
  StrategicGoal,
  OperationalGoal,
  StrategyValue,
  StrategyPillar,
  StrategyAttachment
} from './types';

export const strategyService = {
  // ==================== STRATEGY CRUD ====================
  
  // Create new strategy
  async createStrategy(input: CreateStrategyInput): Promise<Strategy> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('strategies')
      .insert({
        user_id: user.id,
        ...input
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all strategies for current user
  async getStrategies(): Promise<Strategy[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get single strategy with all relations
  async getStrategy(id: string): Promise<StrategyWithRelations> {
    const { data, error } = await supabase
      .from('strategies')
      .select(`
        *,
        strategic_goals (*),
        operational_goals (*),
        values:strategy_values (*),
        pillars:strategy_pillars (*),
        strategy_attachments (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update strategy
  async updateStrategy(input: UpdateStrategyInput): Promise<Strategy> {
    const { id, ...updateData } = input;
    
    const { data, error } = await supabase
      .from('strategies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete strategy
  async deleteStrategy(id: string): Promise<void> {
    const { error } = await supabase
      .from('strategies')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ==================== STRATEGIC GOALS ====================
  
  // Add strategic goal
  async addStrategicGoal(input: CreateStrategicGoalInput): Promise<StrategicGoal> {
    const { data, error } = await supabase
      .from('strategic_goals')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  

  // Add multiple strategic goals
  async addStrategicGoals(goals: CreateStrategicGoalInput[]): Promise<StrategicGoal[]> {
    const { data, error } = await supabase
      .from('strategic_goals')
      .insert(goals)
      .select();

    if (error) throw error;
    return data;
  },

  // Update strategic goal
  async updateStrategicGoal(id: string, input: Partial<CreateStrategicGoalInput>): Promise<StrategicGoal> {
    const { data, error } = await supabase
      .from('strategic_goals')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete strategic goal
  async deleteStrategicGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('strategic_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get strategic goals for a strategy
  async getStrategicGoals(strategyId: string): Promise<StrategicGoal[]> {
    const { data, error } = await supabase
      .from('strategic_goals')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ==================== OPERATIONAL GOALS ====================
  
  // Add operational goal
  async addOperationalGoal(input: CreateOperationalGoalInput): Promise<OperationalGoal> {
    const { data, error } = await supabase
      .from('operational_goals')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add multiple operational goals
  async addOperationalGoals(goals: CreateOperationalGoalInput[]): Promise<OperationalGoal[]> {
    const { data, error } = await supabase
      .from('operational_goals')
      .insert(goals)
      .select();

    if (error) throw error;
    return data;
  },

  // Update operational goal
  async updateOperationalGoal(id: string, input: Partial<CreateOperationalGoalInput>): Promise<OperationalGoal> {
    const { data, error } = await supabase
      .from('operational_goals')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete operational goal
  async deleteOperationalGoal(id: string): Promise<void> {
    const { error} = await supabase
      .from('operational_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get operational goals for a strategy
  async getOperationalGoals(strategyId: string): Promise<OperationalGoal[]> {
    const { data, error } = await supabase
      .from('operational_goals')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false});

    if (error) throw error;
    return data || [];
  },

  // ==================== VALUES ====================
  
  // Add value
  async addValue(input: CreateValueInput): Promise<StrategyValue> {
    const { data, error } = await supabase
      .from('strategy_values')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add multiple values
  async addValues(values: CreateValueInput[]): Promise<StrategyValue[]> {
    const { data, error } = await supabase
      .from('strategy_values')
      .insert(values)
      .select();

    if (error) throw error;
    return data;
  },

  // Update value
  async updateValue(id: string, input: Partial<CreateValueInput>): Promise<StrategyValue> {
    const { data, error } = await supabase
      .from('strategy_values')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete value
  async deleteValue(id: string): Promise<void> {
    const { error } = await supabase
      .from('strategy_values')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get values for a strategy
  async getValues(strategyId: string): Promise<StrategyValue[]> {
    const { data, error } = await supabase
      .from('strategy_values')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ==================== PILLARS ====================
  
  // Add pillar
  async addPillar(input: CreatePillarInput): Promise<StrategyPillar> {
    const { data, error } = await supabase
      .from('strategy_pillars')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add multiple pillars
  async addPillars(pillars: CreatePillarInput[]): Promise<StrategyPillar[]> {
    const { data, error } = await supabase
      .from('strategy_pillars')
      .insert(pillars)
      .select();

    if (error) throw error;
    return data;
  },

  // Update pillar
  async updatePillar(id: string, input: Partial<CreatePillarInput>): Promise<StrategyPillar> {
    const { data, error } = await supabase
      .from('strategy_pillars')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete pillar
  async deletePillar(id: string): Promise<void> {
    const { error } = await supabase
      .from('strategy_pillars')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get pillars for a strategy
  async getPillars(strategyId: string): Promise<StrategyPillar[]> {
    const { data, error } = await supabase
      .from('strategy_pillars')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ==================== ATTACHMENTS ====================
  
  // Add attachment
  async addAttachment(input: CreateAttachmentInput): Promise<StrategyAttachment> {
    console.log('🔗 Supabase addAttachment called with:', input);
    const { data, error } = await supabase
      .from('strategy_attachments')
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase addAttachment error:', error);
      throw error;
    }
    
    console.log('✅ Supabase addAttachment success:', data);
    return data;
  },

  // Delete attachment
  async deleteAttachment(id: string): Promise<void> {
    const { error } = await supabase
      .from('strategy_attachments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get attachments for a strategy
  async getAttachments(strategyId: string): Promise<StrategyAttachment[]> {
    console.log('🔍 Supabase getAttachments called for strategy:', strategyId);
    const { data, error } = await supabase
      .from('strategy_attachments')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase getAttachments error:', error);
      throw error;
    }
    
    console.log('✅ Supabase getAttachments success:', data);
    return data || [];
  },

  // Upload file to storage
  async uploadFile(file: File, strategyId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${strategyId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('strategy-attachments')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('strategy-attachments')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  // Delete file from storage
  async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from('strategy-attachments')
      .remove([filePath]);

    if (error) throw error;
  },

  // ==================== SEARCH METHODS (ALL STRATEGIES) ====================
  
  // Search strategic goals across all user's strategies
  async searchStrategicGoals(searchTerm: string = ''): Promise<StrategicGoal[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('strategic_goals')
      .select(`
        *,
        strategies!inner(user_id)
      `)
      .eq('strategies.user_id', user.id)
      .order('created_at', { ascending: false });

    if (searchTerm.trim()) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Search operational goals across all user's strategies
  async searchOperationalGoals(searchTerm: string = ''): Promise<OperationalGoal[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('operational_goals')
      .select(`
        *,
        strategies!inner(user_id)
      `)
      .eq('strategies.user_id', user.id)
      .order('created_at', { ascending: false });

    if (searchTerm.trim()) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Search values across all user's strategies
  async searchValues(searchTerm: string = ''): Promise<StrategyValue[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('strategy_values')
      .select(`
        *,
        strategies!inner(user_id)
      `)
      .eq('strategies.user_id', user.id)
      .order('created_at', { ascending: false });

    if (searchTerm.trim()) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Search pillars across all user's strategies
  async searchPillars(searchTerm: string = ''): Promise<StrategyPillar[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('strategy_pillars')
      .select(`
        *,
        strategies!inner(user_id)
      `)
      .eq('strategies.user_id', user.id)
      .order('created_at', { ascending: false });

    if (searchTerm.trim()) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
};
