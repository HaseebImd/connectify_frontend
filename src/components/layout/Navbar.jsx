import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Bell, Search, Menu, LogOut } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../ui/Button';
import { colors, spacing, shadows } from '../../constants/theme';

const Navbar = ({ user = null, onLogout, loggingOut = false }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const navbarStyles = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: colors.surface,
    borderBottom: `1px solid ${colors.borderLight}`,
    boxShadow: shadows.sm,
    padding: `${spacing.md} 0`,
  };

  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing.md}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  };

  const searchContainerStyles = {
    flex: 1,
    maxWidth: '600px',
    position: 'relative',
    display: user ? 'block' : 'none',
  };

  const searchInputStyles = {
    width: '100%',
    height: '40px',
    padding: `${spacing.sm} ${spacing.md} ${spacing.sm} 40px`,
    backgroundColor: colors.background,
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '20px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const searchIconStyles = {
    position: 'absolute',
    left: spacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.textSecondary,
    width: '16px',
    height: '16px',
  };

  const actionsStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  };

  const iconButtonStyles = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.background,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: colors.textSecondary,
  };

  const userMenuStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: '20px',
    backgroundColor: colors.background,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const mobileMenuStyles = {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  };

  if (isAuthPage) {
    return (
      <nav style={navbarStyles}>
        <div style={containerStyles}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo size="sm" />
          </Link>
          <div style={actionsStyles}>
            {location.pathname === '/login' ? (
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </Link>
            ) : (
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav style={navbarStyles}>
      <div style={containerStyles}>
        {/* Logo */}
        <Link to={user ? "/feed" : "/"} style={{ textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>

        {/* Search Bar */}
        <div style={searchContainerStyles}>
          <div style={{ position: 'relative' }}>
            <Search style={searchIconStyles} />
            <input
              type="text"
              placeholder="Search Connectify"
              style={searchInputStyles}
              onFocus={(e) => {
                e.target.style.backgroundColor = colors.surface;
                e.target.style.borderColor = colors.primary;
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = colors.background;
                e.target.style.borderColor = colors.borderLight;
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={actionsStyles}>
          {user ? (
            <>
              {/* Notifications */}
              <button
                style={iconButtonStyles}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.surfaceHover;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.background;
                }}
              >
                <Bell size={20} />
              </button>

              {/* User Menu */}
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <div
                  style={userMenuStyles}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.surfaceHover;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.background;
                  }}
                >
                  {user.profile_image ? (
                    <img
                      src={`http://127.0.0.1:7000${user.profile_image}`}
                      alt={user.username || 'User'}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <User size={20} color={colors.textSecondary} />
                  )}
                  <span style={{ fontSize: '14px', fontWeight: '500', color: colors.textPrimary }}>
                    {user.username || user.name || user.email || 'User'}
                  </span>
                </div>
              </Link>

              {/* Logout */}
              <button
                style={iconButtonStyles}
                onClick={onLogout}
                disabled={loggingOut}
                onMouseEnter={(e) => {
                  if (!loggingOut) {
                    e.target.style.backgroundColor = colors.errorLight;
                    e.target.style.color = colors.error;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loggingOut) {
                    e.target.style.backgroundColor = colors.background;
                    e.target.style.color = colors.textSecondary;
                  }
                }}
              >
                {loggingOut ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                ) : (
                  <LogOut size={20} />
                )}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <button style={{ ...iconButtonStyles, ...mobileMenuStyles }}>
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
