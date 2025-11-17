import "../style/NavBarCSS.css";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from 'react';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Assetly</div>
      
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
          onClick={closeMenu}
        >
          Home
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
          onClick={closeMenu}
        >
          About
        </NavLink>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
          onClick={closeMenu}
        >
          Contact Us
        </NavLink>

        {user && (
          <>
            <NavLink 
              to="/notifications" 
              className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              onClick={closeMenu}
            >
              Notifications
            </NavLink>

            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>
          </>
        )}

        {!user ? (
          <NavLink 
            to="/signup" 
            className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
            onClick={closeMenu}
          >
            Signup
          </NavLink>
        ) : (
          <>
            <button onClick={() => { handleLogout(); closeMenu(); }} className="logout-link">Logout</button>
            <div className="user-circle">{user.Name.charAt(0)}</div>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar;