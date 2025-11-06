import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Home as HomeIcon } from 'lucide-react';
import { useBreadcrumb } from '../hooks/useBreadcrumb';
import { ROUTES } from '../constants';

const Mail: React.FC = () => {
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb(
      [
        { label: <HomeIcon size={16} />, url: ROUTES.HOME },
        { label: t('nav.home'), url: ROUTES.HOME },
      ],
      t('nav.mail')
    );
  }, [t, setBreadcrumb]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--text)] mb-6">{t('nav.mail')}</h2>
      <div className="text-center py-20">
        <p className="text-[var(--muted)]">محتوى صفحة البريد</p>
      </div>
    </div>
  );
};

export default Mail;

