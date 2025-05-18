
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Monitor from '@/pages/Monitor';
import Clients from '@/pages/Clients';
import Removal from '@/pages/Removal';
import CommandCenterPage from '@/pages/dashboard/CommandCenterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/command-center" element={<CommandCenterPage />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/removal" element={<Removal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
