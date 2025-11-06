import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppLayout } from './components/layout';
import { BreadcrumbProvider } from './contexts/BreadcrumbProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import { ROUTES } from './constants';
import Home from './pages/Home';
 
import Login from './pages/Login';
import Register from './pages/Register';
import StrategyList from './pages/StrategyList';
import CreateStrategy from './pages/CreateStrategy';
import StrategyView from './pages/StrategyView';
import StrategicPlansList from './pages/StrategicPlansList';
import CreateStrategicPlan from './pages/CreateStrategicPlan';
import StrategicPlansView from './pages/StrategicPlansView';
import StrategicInitiatives from './pages/StrategicInitiatives';
import StrategicServices from './pages/StrategicServices';
import MainObjectives from './pages/MainObjectives';
import KPIs from './pages/KPIs';
import TaskManagement from './pages/TaskManagement';
import ComparisonsStats from './pages/ComparisonsStats';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Tickets from './pages/Tickets';
import Mail from './pages/Mail';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('language');
    const lang = savedLang || i18n.language || 'ar';
    
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
    
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [i18n.language, i18n]);

  return (
    <BrowserRouter>
 
      <AuthProvider>
        <BreadcrumbProvider>
          <Routes>
            {/* Public Routes - Only accessible when NOT authenticated */}
            <Route element={<PublicRoute />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
            </Route>

            {/* Protected Routes - Only accessible when authenticated */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.STRATEGY} element={<StrategyList />} />
                <Route path={ROUTES.STRATEGY_NEW} element={<CreateStrategy />} />
                <Route path={ROUTES.STRATEGY_EDIT} element={<CreateStrategy />} />
                <Route path={ROUTES.STRATEGY_VIEW} element={<StrategyView />} />
                <Route path={ROUTES.STRATEGIC_PLANS} element={<StrategicPlansList />} />
                <Route path={ROUTES.STRATEGIC_PLANS_NEW} element={<CreateStrategicPlan />} />
                <Route path={ROUTES.STRATEGIC_PLANS_EDIT} element={<CreateStrategicPlan />} />
                <Route path={ROUTES.STRATEGIC_PLANS_VIEW} element={<StrategicPlansView />} />
                <Route path={ROUTES.STRATEGIC_INITIATIVES} element={<StrategicInitiatives />} />
                <Route path={ROUTES.STRATEGIC_SERVICES} element={<StrategicServices />} />
                <Route path={ROUTES.MAIN_OBJECTIVES} element={<MainObjectives />} />
                <Route path={ROUTES.KPIS} element={<KPIs />} />
                <Route path={ROUTES.TASK_MANAGEMENT} element={<TaskManagement />} />
                <Route path={ROUTES.COMPARISONS_STATS} element={<ComparisonsStats />} />
                <Route path={ROUTES.DOCUMENTS} element={<Documents />} />
                <Route path={ROUTES.REPORTS} element={<Reports />} />
                <Route path={ROUTES.TICKETS} element={<Tickets />} />
                <Route path={ROUTES.MAIL} element={<Mail />} />
              </Route>
            </Route>
          </Routes>
          
          {/* Toast Container */}
          <ToastContainer
            position={i18n.language === 'ar' ? 'top-left' : 'top-right'}
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={i18n.language === 'ar'}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BreadcrumbProvider>
      </AuthProvider>
 
    </BrowserRouter>
  );
}

export default App;