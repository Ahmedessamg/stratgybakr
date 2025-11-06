import { useState, useEffect } from 'react';
import { strategicPlanService, Strategy, StrategicGoal, Element, SubElement } from '../services/supabase/strategicPlan/strategicPlan.service';

interface UseStrategicPlanFormDataReturn {
  strategies: Strategy[];
  strategicGoals: StrategicGoal[];
  elements: Element[];
  subElements: SubElement[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStrategicPlanFormData = (): UseStrategicPlanFormDataReturn => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [strategicGoals, setStrategicGoals] = useState<StrategicGoal[]>([]);
  const [elements, setElements] = useState<Element[]>([]);
  const [subElements, setSubElements] = useState<SubElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [strategiesData, goalsData, elementsData, subElementsData] = await Promise.all([
        strategicPlanService.getStrategies(),
        strategicPlanService.getStrategicGoals(),
        strategicPlanService.getElements(),
        strategicPlanService.getSubElements(),
      ]);

      setStrategies(strategiesData);
      setStrategicGoals(goalsData);
      setElements(elementsData);
      setSubElements(subElementsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    strategies,
    strategicGoals,
    elements,
    subElements,
    loading,
    error,
    refetch: fetchData,
  };
};
