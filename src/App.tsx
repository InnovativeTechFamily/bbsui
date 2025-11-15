import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { SeatSelection } from './pages/SeatSelection';
import { AuthModal } from './components/common/AuthModal';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/seat-selection" element={<SeatSelection />} />
        </Routes>
        <AuthModal />
      </div>
    </Router>
  );
}

export default App;
