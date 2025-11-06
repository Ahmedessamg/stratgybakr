import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus, Globe } from 'lucide-react';
import { Button, InputField, FormField } from '../../components/ui';
import { authService } from '../../services/supabase';
import './Register.scss';

const Register = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register.passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      await authService.register({
        email: formData.email,
        password: formData.password,
        username: formData.username
      });
      navigate('/');
    } catch (err) {
      const error = err as Error;
      setError(error.message || t('auth.register.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="register-icon">
              <UserPlus size={32} />
            </div>
            <h1 className="register-title">{t('auth.register.title')}</h1>
            <p className="register-subtitle">{t('auth.register.subtitle')}</p>
          </div>

          {/* Language Switch */}
          <div className="register-lang-switch">
            <button 
              className="lang-switch-btn"
              onClick={toggleLanguage}
            >
              <Globe size={18} />
              <span>{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <FormField label={t('auth.register.username')} required>
              <InputField
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={t('auth.register.usernamePlaceholder')}
                required
              />
            </FormField>

            <FormField label={t('auth.register.email')} required>
              <InputField
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('auth.register.emailPlaceholder')}
                required
              />
            </FormField>

            <FormField label={t('auth.register.password')} required>
              <InputField
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('auth.register.passwordPlaceholder')}
                required
              />
            </FormField>

            <FormField label={t('auth.register.confirmPassword')} required>
              <InputField
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                required
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="register-button"
            >
              {loading ? t('common.loading') : t('auth.register.submit')}
            </Button>

            <div className="register-footer">
              <span>{t('auth.register.hasAccount')}</span>
              <Link to="/login" className="login-link">
                {t('auth.register.loginLink')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
