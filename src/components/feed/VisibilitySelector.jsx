import React, { useState, useRef, useEffect } from 'react';
import { Globe, Users, Lock, ChevronDown } from 'lucide-react';

/**
 * Visibility selector dropdown component
 * Allows users to choose post visibility (public, followers, private)
 */
const VisibilitySelector = ({ value = 'public', onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const visibilityOptions = [
    {
      value: 'public',
      label: 'Public',
      description: 'Anyone can see this post',
      icon: Globe,
      iconColor: 'text-blue-500'
    },
    {
      value: 'followers',
      label: 'Followers',
      description: 'Only your followers can see this post',
      icon: Users,
      iconColor: 'text-green-500'
    },
    {
      value: 'private',
      label: 'Only me',
      description: 'Only you can see this post',
      icon: Lock,
      iconColor: 'text-gray-500'
    }
  ];

  const selectedOption = visibilityOptions.find(option => option.value === value) || visibilityOptions[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event, optionValue) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(optionValue);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg
          text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-gray-400 cursor-pointer'
          }
        `}
      >
        <div className="flex items-center space-x-3">
          <selectedOption.icon className={`w-5 h-5 ${selectedOption.iconColor}`} />
          <div>
            <p className="text-sm font-medium text-gray-900">{selectedOption.label}</p>
            <p className="text-xs text-gray-500">{selectedOption.description}</p>
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg animate-fade-in">
          <div className="py-1">
            {visibilityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onKeyDown={(e) => handleKeyDown(e, option.value)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 text-left
                  hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                  transition-colors duration-150
                  ${option.value === value ? 'bg-blue-50' : ''}
                `}
              >
                <option.icon className={`w-5 h-5 ${option.iconColor}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    option.value === value ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </p>
                  <p className={`text-xs ${
                    option.value === value ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {option.description}
                  </p>
                </div>
                {option.value === value && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisibilitySelector;
