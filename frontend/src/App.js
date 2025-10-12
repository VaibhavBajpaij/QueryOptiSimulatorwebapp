import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import SearchSimulation from './pages/SearchSimulation';
import GroupBySimulation from './pages/GroupBySimulation';
import JoinSimulation from './pages/JoinSimulation';
import ExperimentHistory from './pages/ExperimentHistory';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<SearchSimulation />} />
            <Route path="/groupby" element={<GroupBySimulation />} />
            <Route path="/join" element={<JoinSimulation />} />
            <Route path="/history" element={<ExperimentHistory />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;