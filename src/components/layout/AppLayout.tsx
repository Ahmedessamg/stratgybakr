import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Sidebar from './Sidebar';
import { Breadcrumb } from '../ui';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';

const AppLayout = () => {
  const { items, currentPage, headerAction } = useBreadcrumb();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />
      <Sidebar />
      <main className={`mt-16 ${isRTL ? 'mr-64' : 'ml-64'}`}>
        {/* Breadcrumb & Header Actions */}
        {items.length > 0 && (
          <div 
            className={`flex items-center px-6 ${isRTL ? 'justify-between' : 'justify-between'}`}
            style={{ boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.05)' }}
          >
            {isRTL ? (
              <>
                {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
                <Breadcrumb items={items} currentPage={currentPage} />
              </>
            ) : (
              <>
                <Breadcrumb items={items} currentPage={currentPage} />
                {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
              </>
            )}
          </div>
        )}
        
        {/* Page Content */}
        <div className="px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
