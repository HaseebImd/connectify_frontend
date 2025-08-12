import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import { colors } from '../../constants/theme';

const Layout = ({ children, showNavbar = true }) => {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggingOut(true);
    logout(() => {
      navigate('/');
      setLoggingOut(false);
    });
  };
  const layoutStyles = {
    minHeight: '100vh',
    backgroundColor: colors.background,
    display: 'flex',
    flexDirection: 'column',
  };

  const mainStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={layoutStyles}>
      {showNavbar && <Navbar user={user} onLogout={handleLogout} loggingOut={loggingOut} />}
      <main style={mainStyles}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
