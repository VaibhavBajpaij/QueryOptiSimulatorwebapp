import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About Query Optimizer Simulator</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
        <p className="text-gray-700 mb-4">
          The Query Optimizer Simulator is an educational tool that demonstrates how different data structures and algorithms (DSA) 
          affect analytics performance. This project bridges the gap between theoretical computer science concepts and 
          practical database query optimization techniques.
        </p>
        <p className="text-gray-700">
          By simulating various search, grouping, and join algorithms on different dataset sizes, users can visualize 
          and understand the performance implications of algorithm choices in data processing and database systems.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Key Features</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-blue-600">Python Simulation Engine</h3>
            <p className="text-gray-700">
              Implements various algorithms with different time complexities:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li>Linear Search (O(n))</li>
              <li>Binary Search (O(log n))</li>
              <li>Hash Lookup (O(1))</li>
              <li>Sorting-based Grouping (O(n log n))</li>
              <li>Hash-based Grouping (O(n))</li>
              <li>Nested Loop Join (O(n²))</li>
              <li>Hash Join (O(n+m))</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-green-600">Visualization</h3>
            <p className="text-gray-700">
              Uses Matplotlib/Seaborn in Python for backend visualization and Chart.js for interactive frontend charts:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li>Execution time vs dataset size (line charts)</li>
              <li>Comparative performance of algorithms (bar charts)</li>
              <li>Dynamic visualization of experiment results</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-purple-600">Full Stack Architecture</h3>
            <p className="text-gray-700">
              Built with modern web technologies:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li>Backend: Node.js with Express</li>
              <li>Database: MongoDB for storing experiment results</li>
              <li>Frontend: React with Tailwind CSS and Chart.js</li>
              <li>Python integration for simulation and data processing</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-yellow-600">Additional Features</h3>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li>Big-O complexity explanations alongside results</li>
              <li>Export experiment results as CSV/JSON</li>
              <li>Experiment history tracking and visualization</li>
              <li>Comparative analysis across different algorithms and dataset sizes</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Educational Value</h2>
        
        <div className="space-y-4">
          <p className="text-gray-700">
            This simulator serves as an educational tool for students, developers, and data professionals to understand:
          </p>
          
          <div>
            <h3 className="text-lg font-medium text-indigo-600">Algorithm Performance</h3>
            <p className="text-gray-700">
              Visualize how different algorithms scale with increasing dataset sizes, demonstrating 
              the practical implications of Big-O complexity analysis.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-indigo-600">Database Query Optimization</h3>
            <p className="text-gray-700">
              Understand how database query optimizers make decisions about execution plans based on 
              algorithm performance characteristics and data properties.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-indigo-600">Trade-offs in Algorithm Selection</h3>
            <p className="text-gray-700">
              Learn about the trade-offs between different algorithms in terms of time complexity, 
              memory usage, and implementation complexity.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Technical Implementation</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Architecture</h3>
            <p className="text-gray-700">
              The project follows a microservices-inspired architecture with clear separation of concerns:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li>Python simulation engine for algorithm implementation and benchmarking</li>
              <li>Node.js/Express backend for API endpoints and database interaction</li>
              <li>MongoDB for persistent storage of experiment results</li>
              <li>React frontend for user interface and interactive visualizations</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800">API Design</h3>
            <p className="text-gray-700">
              RESTful API endpoints for running simulations and retrieving results:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li><code>/api/simulation/run-search</code> - Run search algorithm simulations</li>
              <li><code>/api/simulation/run-groupby</code> - Run grouping algorithm simulations</li>
              <li><code>/api/simulation/run-join</code> - Run join algorithm simulations</li>
              <li><code>/api/experiment</code> - Retrieve and manage experiment history</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800">Data Flow</h3>
            <ol className="list-decimal pl-6 mt-2 text-gray-700">
              <li>User selects algorithm, task type, and dataset size in the frontend</li>
              <li>Request is sent to the appropriate backend API endpoint</li>
              <li>Backend invokes the Python simulation engine with the specified parameters</li>
              <li>Python code runs the algorithm, measures performance, and returns results</li>
              <li>Results are stored in MongoDB and returned to the frontend</li>
              <li>Frontend displays the results with interactive visualizations</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;