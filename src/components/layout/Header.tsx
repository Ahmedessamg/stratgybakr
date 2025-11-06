import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import SearchIcon from '../icons/svg/search';
import MessageIcon from '../icons/svg/message';
import NotificationIcon from '../icons/svg/notification';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';
import './Header.scss';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate(ROUTES.LOGIN);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo Section */}
        <div className="header__logo-section">
          <img 
            src="/logo.svg" 
            alt="Ministry Logo"
            className="logo"
          />
         </div>

        {/* Navigation Links */}
        <nav className="header__nav">
          <Link to={ROUTES.HOME}>{t('nav.home')}</Link>
          <Link to={ROUTES.STRATEGY}>{t('nav.strategy')}</Link>
          <Link to={ROUTES.REPORTS}>{t('nav.reports')}</Link>
          <Link to={ROUTES.TICKETS}>{t('nav.tickets')}</Link>
          <Link to={ROUTES.MAIL}>{t('nav.mail')}</Link>
        </nav>

        {/* Actions Section */}
        <div className="header__actions">
          {/* Language Toggle */}
          <button 
            className="header__lang-btn"
            onClick={toggleLanguage}
          >
            {i18n.language === 'ar' ? 'EN' : 'AR'}
          </button>

          {/* Search */}
          <button className="header__icon-btn">
            <SearchIcon />
          </button>

          {/* Notification */}
          <button className="header__icon-btn">
            <NotificationIcon />
          </button>

          {/* Messages */}
          <button className="header__icon-btn">
            <MessageIcon />
          </button>

          {/* User Avatar with Dropdown */}
          <div className="header__user-dropdown" ref={dropdownRef}>
            <button 
              className="header__user"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src="/user.svg" alt="User" />
            </button>

            {isDropdownOpen && (
              <div className="header__dropdown">
                <div className="header__dropdown-header">
                  <p className="header__dropdown-email">{user?.email}</p>
                  <p className="header__dropdown-username">
                    {user?.user_metadata?.username || 'User'}
                  </p>
                </div>
                <div className="header__dropdown-divider" />
                <button 
                  className="header__dropdown-item"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>{t('auth.logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
