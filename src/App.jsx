import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import RequestForm from './pages/RequestForm';
import Transactions from './pages/Transactions';
import AdminLogs from './pages/AdminLogs';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/request" element={<RequestForm />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/admin-logs" element={<AdminLogs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
