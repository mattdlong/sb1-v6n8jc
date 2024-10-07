import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import HamburgerMenu from './components/HamburgerMenu';
import OpportunityKanban from './components/OpportunityKanban';
import { mockApi } from './mockApi';
import { ThemeProvider } from './components/theme-provider';

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await mockApi.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication failed', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      {isAuthenticated ? (
        <div className="flex flex-col h-screen">
          <Header onMenuToggle={toggleMenu} />
          <div className="flex flex-1 pt-[60px]">
            <HamburgerMenu isOpen={isMenuOpen} onClose={toggleMenu} onLogout={handleLogout} />
            <main className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${isMenuOpen ? 'ml-[250px]' : 'ml-[60px]'}`}>
              <OpportunityKanban />
            </main>
          </div>
        </div>
      ) : (
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </ThemeProvider>
  );
}

export default App;