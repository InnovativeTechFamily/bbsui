import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { SeatSelection } from './pages/SeatSelection';
import { AuthModal } from './components/common/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { realTimeService } from './services';
import { useEffect } from 'react';

function App() {
  // Initialize real-time service on app load
  useEffect(() => {
    // Connect to real-time service using SSE (more reliable for this use case)
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//api.swiftbus.com/ws`;
    const sseUrl = `${window.location.protocol === 'https:' ? 'https:' : 'http:'}//api.swiftbus.com/events`;
    
    // Try WebSocket first, fallback to SSE
    try {
      realTimeService.connectWebSocket(wsUrl);
    } catch (error) {
      console.warn('WebSocket connection failed, falling back to SSE:', error);
      realTimeService.connectSSE(sseUrl);
    }

    return () => {
      realTimeService.disconnect();
    };
  }, []);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
