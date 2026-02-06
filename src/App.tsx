import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppLayout } from './components/AppLayout' 
import { HomePage } from './pages/HomePage'
import { BrowsePage } from './pages/BrowsePage'
import { SkillDetailPage } from './pages/SkillDetailPage'
import { DashboardPage } from './pages/DashboardPage'
import { DocsPage } from './pages/DocsPage'
import { FAQPage } from './pages/FAQPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { BookmarksPage } from './pages/BookmarksPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { TerminalSplash } from './components/TerminalSplash'

function AppContent() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/skill/:slug" element={<SkillDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Routes>
    </AppLayout>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('splashShown');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  return (
    <BrowserRouter>
      {showSplash ? (
        <TerminalSplash onComplete={handleSplashComplete} />
      ) : (
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      )}
    </BrowserRouter>
  )
}

export default App