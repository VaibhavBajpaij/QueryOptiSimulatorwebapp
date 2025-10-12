import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">Query Optimizer Simulator</Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition duration-300">Dashboard</Link>
            <Link to="/search" className="hover:text-blue-200 transition duration-300">Search</Link>
            <Link to="/groupby" className="hover:text-blue-200 transition duration-300">GroupBy</Link>
            <Link to="/join" className="hover:text-blue-200 transition duration-300">Join</Link>
            <Link to="/history" className="hover:text-blue-200 transition duration-300">History</Link>
            <Link to="/about" className="hover:text-blue-200 transition duration-300">About</Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="mobile-menu-button focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="mobile-menu hidden md:hidden">
          <div className="flex flex-col space-y-3 py-4">
            <Link to="/" className="hover:text-blue-200 transition duration-300">Dashboard</Link>
            <Link to="/search" className="hover:text-blue-200 transition duration-300">Search</Link>
            <Link to="/groupby" className="hover:text-blue-200 transition duration-300">GroupBy</Link>
            <Link to="/join" className="hover:text-blue-200 transition duration-300">Join</Link>
            <Link to="/history" className="hover:text-blue-200 transition duration-300">History</Link>
            <Link to="/about" className="hover:text-blue-200 transition duration-300">About</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;