import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Query Optimizer Simulator</h3>
            <p className="text-gray-400">DSA Meets Analytics</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold">Algorithms</h4>
              <ul className="text-gray-400">
                <li>Linear Search O(n)</li>
                <li>Binary Search O(log n)</li>
                <li>Hash Lookup O(1)</li>
                <li>Sorting-based Grouping O(n log n)</li>
                <li>Hash-based Grouping O(n)</li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold">Technologies</h4>
              <ul className="text-gray-400">
                <li>Python</li>
                <li>Node.js + Express</li>
                <li>MongoDB</li>
                <li>React + Tailwind</li>
                <li>Chart.js</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Query Optimizer Simulator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;