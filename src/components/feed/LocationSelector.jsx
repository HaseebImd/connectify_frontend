import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, X, Loader } from 'lucide-react';

/**
 * Location Selector Component with Geolocation and Search
 * Features: Current location detection, location search, recent locations
 */
const LocationSelector = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recentLocations, setRecentLocations] = useState([]);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Load recent locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('connectify_recent_locations');
    if (saved) {
      try {
        setRecentLocations(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent locations:', e);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
        setError('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search for locations using a geocoding service
  const searchLocations = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Using OpenStreetMap Nominatim API (free alternative to Google Places)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const results = data.map(item => ({
          id: item.place_id,
          name: item.display_name,
          shortName: formatLocationName(item),
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          type: item.type || 'location'
        }));
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Location search error:', error);
      setError('Failed to search locations');
    }
  };

  // Format location name for display
  const formatLocationName = (item) => {
    const address = item.address || {};
    const parts = [];
    
    if (address.amenity || address.shop || address.tourism) {
      parts.push(address.amenity || address.shop || address.tourism);
    }
    
    if (address.road) parts.push(address.road);
    if (address.neighbourhood || address.suburb) {
      parts.push(address.neighbourhood || address.suburb);
    }
    if (address.city || address.town || address.village) {
      parts.push(address.city || address.town || address.village);
    }
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    
    return parts.slice(0, 3).join(', ') || item.display_name;
  };

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            const locationName = formatLocationName(data);
            
            const location = {
              id: `current_${Date.now()}`,
              name: locationName,
              shortName: locationName,
              lat: latitude,
              lon: longitude,
              type: 'current',
              isCurrent: true
            };
            
            selectLocation(location);
          } else {
            setError('Failed to get location details');
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setError('Failed to get location details');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while getting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setError('');

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  };

  // Select a location
  const selectLocation = (location) => {
    onChange(location.shortName);
    
    // Add to recent locations
    const newRecentLocations = [
      location,
      ...recentLocations.filter(loc => loc.id !== location.id)
    ].slice(0, 5); // Keep only 5 recent locations
    
    setRecentLocations(newRecentLocations);
    localStorage.setItem('connectify_recent_locations', JSON.stringify(newRecentLocations));
    
    // Close dropdown
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setError('');
  };

  // Clear location
  const clearLocation = () => {
    onChange('');
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setError('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Location Input */}
      <div className="flex items-center space-x-2">
        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Add location"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
            maxLength={255}
          />
          {value && (
            <button
              onClick={clearLocation}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a location..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Current Location Button */}
          <div className="p-2">
            <button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
            >
              {isGettingLocation ? (
                <Loader className="w-5 h-5 text-blue-500 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5 text-blue-500" />
              )}
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {isGettingLocation ? 'Getting location...' : 'Use current location'}
                </p>
                <p className="text-sm text-gray-500">
                  {isGettingLocation ? 'Please wait...' : 'Automatically detect your location'}
                </p>
              </div>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border-b border-gray-100">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border-b border-gray-100">
              <div className="p-2 bg-gray-50">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Search Results
                </p>
              </div>
              {searchResults.map((location) => (
                <button
                  key={location.id}
                  onClick={() => selectLocation(location)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{location.shortName}</p>
                    {location.name !== location.shortName && (
                      <p className="text-sm text-gray-500 truncate">{location.name}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Locations */}
          {recentLocations.length > 0 && searchQuery === '' && (
            <div>
              <div className="p-2 bg-gray-50">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Recent Locations
                </p>
              </div>
              {recentLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => selectLocation(location)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  {location.isCurrent ? (
                    <Navigation className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  ) : (
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {location.shortName}
                      {location.isCurrent && (
                        <span className="ml-2 text-xs text-blue-500">(Current)</span>
                      )}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchQuery && searchResults.length === 0 && !error && (
            <div className="p-4 text-center text-gray-500">
              <p>No locations found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
