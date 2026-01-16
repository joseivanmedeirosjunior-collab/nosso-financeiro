
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction';
import Budgets from './pages/Budgets';
import Bills from './pages/Bills';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Settlement from './pages/Settlement';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/orcamentos" element={<Budgets />} />
          <Route path="/contas" element={<Bills />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/config" element={<Settings />} />
          <Route path="/settlement" element={<Settlement />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
