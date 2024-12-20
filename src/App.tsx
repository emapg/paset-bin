import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { ViewPaste } from './pages/ViewPaste';
import { CreatePaste } from './pages/CreatePaste';
import { Profile } from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreatePaste />} />
                <Route path="/p/:id" element={<ViewPaste />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;