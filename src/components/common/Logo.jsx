import React from 'react';

const Logo = ({ size = 'md', variant = 'default', className = '' }) => {
  const sizeStyles = {
    sm: { 
      container: { width: '120px' }, 
      text: { fontSize: '18px' }, 
      icon: { width: '20px', height: '20px' } 
    },
    md: { 
      container: { width: '160px' }, 
      text: { fontSize: '24px' }, 
      icon: { width: '28px', height: '28px' } 
    },
    lg: { 
      container: { width: '200px' }, 
      text: { fontSize: '30px' }, 
      icon: { width: '36px', height: '36px' } 
    },
  };

  const variantStyles = {
    default: { color: '#1877F2' },
    white: { color: '#FFFFFF' },
    dark: { color: '#1C1E21' },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    ...currentSize.container,
    ...currentVariant,
  };

  const iconStyle = {
    ...currentSize.icon,
    background: 'linear-gradient(135deg, #1877F2 0%, #42B883 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const nodesContainerStyle = {
    width: '60%',
    height: '60%',
    position: 'relative',
  };

  const nodeStyle = {
    width: '4px',
    height: '4px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
  };

  const lineStyle = {
    backgroundColor: 'white',
    opacity: 0.8,
    position: 'absolute',
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Connectify Icon */}
      <div style={iconStyle}>
        {/* Connection nodes */}
        <div style={nodesContainerStyle}>
          <div style={{ ...nodeStyle, top: '2px', left: '2px' }} />
          <div style={{ ...nodeStyle, top: '2px', right: '2px' }} />
          <div style={{ ...nodeStyle, bottom: '2px', left: '50%', transform: 'translateX(-50%)' }} />
          
          {/* Connection lines */}
          <div style={{ ...lineStyle, top: '4px', left: '4px', right: '4px', height: '1px' }} />
          <div style={{ 
            ...lineStyle, 
            top: '4px', 
            left: '4px', 
            bottom: '4px', 
            width: '1px',
            transformOrigin: 'top left',
            transform: 'rotate(45deg)'
          }} />
        </div>
      </div>
      
      {/* Text */}
      <span style={currentSize.text}>Connectify</span>
    </div>
  );
};

export default Logo;
