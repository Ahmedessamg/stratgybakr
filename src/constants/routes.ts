// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STRATEGY: '/strategy',
  STRATEGY_NEW: '/strategy/new',
  STRATEGY_EDIT: '/strategy/edit/:id',
  STRATEGY_VIEW: '/strategy/view/:id',
  STRATEGIC_PLANS: '/strategic-plans',
  STRATEGIC_PLANS_VIEW: '/strategic-plans/view/:id',
  STRATEGIC_PLANS_NEW: '/strategic-plans/new',
  STRATEGIC_PLANS_EDIT: '/strategic-plans/edit/:id',
  STRATEGIC_INITIATIVES: '/strategic-initiatives',
  STRATEGIC_SERVICES: '/strategic-services',
  MAIN_OBJECTIVES: '/main-objectives',
  KPIS: '/kpis',
  TASK_MANAGEMENT: '/task-management',
  COMPARISONS_STATS: '/comparisons-stats',
  DOCUMENTS: '/documents',
  REPORTS: '/reports',
  TICKETS: '/tickets',
  MAIL: '/mail',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];

