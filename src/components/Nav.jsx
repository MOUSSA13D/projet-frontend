// src/components/Nav.jsx
import React, { useState, useEffect, useRef } from 'react';
import { GoTriangleDown } from "react-icons/go";
import { Link } from 'react-router-dom';
import DefaultImage from '/image/Ellipse 9.png';
import authService from '../services/authService';

function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const dropdownRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://projet-backend-1-8z5p.onrender.com';

  useEffect(() => {
    loadUserData();
    
    // Écouter les mises à jour du profil
    const handleStorageChange = () => {
      loadUserData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadUserData = () => {
    const userData = authService.getCurrentUser();
    const type = authService.getUserType();
    setUser(userData);
    setUserType(type);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      authService.logout();
    }
  };

  const getPhotoUrl = () => {
    if (user?.photo) {
      return `${API_URL}/uploads/${user.photo}`;
    }
    return DefaultImage;
  };

  return (
    <div className="relative h-16">
      <nav className="bg-white w-full h-16 fixed top-0 left-0 right-0 shadow-xl flex justify-between items-center px-4 ">
        {/* Logo / Titre */}
        <div className="flex items-center gap-x-2">
          <p className="font-bold lg:text-xl font-italic sm:ps-56 ps-0">
            Admin Dashboard
          </p>
        </div>

        {/* Section droite */}
        <div className="flex items-center gap-x-2">
          {/* Profil utilisateur */}
          <div className="flex items-center gap-x-2">
            <img 
              className="block rounded-full w-10 h-10 object-cover border-2 border-gray-200" 
              src={getPhotoUrl()} 
              alt="Profil"
              onError={(e) => {
                e.target.src = DefaultImage;
              }}
            />
            
            <div className="hidden sm:flex flex-col">
              <p className="lg:text-md text-black md:font-semibold lg:font-bold leading-tight">
                {user ? `${user.prenom} ${user.nom}` : 'Chargement...'}
              </p>
              <p className="text-slate-600 font-light text-xs">
                {userType || 'Agent'}
              </p>  
            </div>
            
            {/* Menu déroulant */}
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <button 
                type="button"
                className="cursor-pointer hover:opacity-70 transition-opacity p-1"
                onClick={toggleMobileMenu}
              >
                <GoTriangleDown className="text-xl" />
              </button>

              {isMobileMenuOpen && (
                <div 
                  className="absolute right-0 z-10 mt-2 w-52 divide-y divide-gray-100 rounded-lg bg-white shadow-lg border border-gray-200" 
                >
                  {/* Info mobile */}
                  <div className="px-4 py-3 sm:hidden border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        className="rounded-full w-12 h-12 object-cover border-2 border-gray-200" 
                        src={getPhotoUrl()} 
                        alt="Profil"
                        onError={(e) => {
                          e.target.src = DefaultImage;
                        }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user ? `${user.prenom} ${user.nom}` : 'Utilisateur'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userType || 'Agent'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      💰 Solde: {user?.solde || 0} FCFA
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link 
                      to="/profil" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>👤</span>
                      <span>Mon Profil</span>
                    </Link>
                  </div>

                  <div className="py-1">
                    <button 
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold" 
                    >
                      <span>🚪</span>
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Nav;