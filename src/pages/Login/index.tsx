import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, Globe } from 'lucide-react';
import { Button, InputField, FormField } from '../../components/ui';
import { authService } from '../../services/supabase';
import './Login.scss';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login({
        email: formData.email,
        password: formData.password
      });
      navigate('/');
    } catch (err) {
      const error = err as Error;
      setError(error.message || t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <LogIn size={32} />
            </div>
            <h1 className="login-title">{t('auth.login.title')}</h1>
            <p className="login-subtitle">{t('auth.login.subtitle')}</p>
          </div>

          {/* Language Switch */}
          <div className="login-lang-switch">
            <button 
              className="lang-switch-btn"
              onClick={toggleLanguage}
            >
              <Globe size={18} />
              <span>{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <FormField label={t('auth.login.email')} required>
              <InputField
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('auth.login.emailPlaceholder')}
                required
              />
            </FormField>

            <FormField label={t('auth.login.password')} required>
              <InputField
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('auth.login.passwordPlaceholder')}
                required
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="login-button"
            >
              {loading ? t('common.loading') : t('auth.login.submit')}
            </Button>

            <div className="login-footer">
              <span>{t('auth.login.noAccount')}</span>
              <Link to="/register" className="register-link">
                {t('auth.login.registerLink')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
