import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Target,
  ClipboardList,
  Rocket,
  Briefcase,
  Goal,
  BarChart3,
  ListTodo,
  TrendingUp,
  FileText
} from 'lucide-react';
import { ROUTES } from '../../constants';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isRTL: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isActive, isRTL }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-[var(--primary)] text-white'
          : 'text-[var(--text)] hover:bg-[var(--hover)]'
      } ${isRTL ? 'flex-row-reverse' : ''} gap-3`}
    >
      {isRTL ? (
        <>
          <span className="text-sm font-medium flex-1 text-left">{label}</span>
          <span className="w-5 h-5 flex-shrink-0">{icon}</span>
        </>
      ) : (
        <>
          <span className="w-5 h-5 flex-shrink-0">{icon}</span>
          <span className="text-sm font-medium flex-1 text-left">{label}</span>
        </>
      )}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  const menuItems = [
    { to: ROUTES.HOME, icon: <Home />, label: t('nav.home') },
    { to: ROUTES.STRATEGY, icon: <Target />, label: t('nav.strategy') },
    { to: ROUTES.STRATEGIC_PLANS, icon: <ClipboardList />, label: t('nav.strategicPlans') },
    { to: ROUTES.STRATEGIC_INITIATIVES, icon: <Rocket />, label: t('nav.strategicInitiatives') },
    { to: ROUTES.STRATEGIC_SERVICES, icon: <Briefcase />, label: t('nav.strategicServices') },
    { to: ROUTES.MAIN_OBJECTIVES, icon: <Goal />, label: t('nav.mainObjectives') },
    { to: ROUTES.KPIS, icon: <BarChart3 />, label: t('nav.kpis') },
    { to: ROUTES.TASK_MANAGEMENT, icon: <ListTodo />, label: t('nav.taskManagement') },
    { to: ROUTES.COMPARISONS_STATS, icon: <TrendingUp />, label: t('nav.comparisonsStats') },
    { to: ROUTES.DOCUMENTS, icon: <FileText />, label: t('nav.documents') },
  ];

  return (
    <aside className={`w-64 bg-white h-[calc(100vh-4rem)] fixed top-16 overflow-y-auto ${
      isRTL ? 'right-0 border-l border-[var(--border)]' : 'left-0 border-r border-[var(--border)]'
    }`}>
      {/* Sidebar Header */}
      <div className="px-4 py-4 ">
        <p className="text-xs text-[var(--muted)]">{isRTL ? 'القوائم الاستراتيجية' : 'Strategic Menus'}</p>
      </div>
      
      <nav className="p-3 space-y-0.5">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            {...item}
            isActive={location.pathname === item.to || location.pathname.startsWith(item.to + '/')}
            isRTL={isRTL}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
