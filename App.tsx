import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ServicesPage } from './components/ServicesPage';
import { WorkPage } from './components/WorkPage';
import { ContactPage } from './components/ContactPage';
import { BookingPage } from './components/BookingPage';
import { IntroAnimation } from './components/IntroAnimation';
import { CustomCursor } from './components/CustomCursor';
import { PageView } from './types';

const App: React.FC = () => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro && (
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      )}
      
      {!showIntro && (
        <div className={`relative w-full min-h-screen bg-[#0a0a0a] ${showIntro ? 'fixed inset-0 overflow-hidden' : ''}`}>
          <CustomCursor />
          
          {currentPage === 'home' && (
            <HomePage onNavigate={setCurrentPage} />
          )}
          {currentPage === 'about' && (
            <AboutPage onBack={() => setCurrentPage('home')} />
          )}
          {currentPage === 'services' && (
            <ServicesPage onBack={() => setCurrentPage('home')} />
          )}
          {currentPage === 'work' && (
            <WorkPage onBack={() => setCurrentPage('home')} />
          )}
          {currentPage === 'contact' && (
            <ContactPage onBack={() => setCurrentPage('home')} />
          )}
          {currentPage === 'booking' && (
            <BookingPage onBack={() => setCurrentPage('home')} />
          )}
        </div>
      )}
    </>
  );
};

export default App;