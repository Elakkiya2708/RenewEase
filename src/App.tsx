import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RenewalProvider, useRenewal } from './context/RenewalContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { RenewalsPage } from './pages/RenewalsPage';
import { RenewalDetailsPage } from './pages/RenewalDetailsPage';
import { CalendarPage } from './pages/CalendarPage';
import { RemindersPage } from './pages/RemindersPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PublicNavbar, PublicNavTab } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';
import { LandingHomePage } from './pages/public/LandingHomePage';
import { AboutPage } from './pages/public/AboutPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { ContactPage } from './pages/public/ContactPage';
import { RenewalFormModal } from './components/renewals/RenewalFormModal';
import { RenewActionModal } from './components/renewals/RenewActionModal';
import { EmailSimulationModal } from './components/reminders/EmailSimulationModal';
import { Renewal } from './types';
import { ShieldCheck, Loader2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { currentView } = useRenewal();

  // Public website navigation states
  const [publicTab, setPublicTab] = useState<PublicNavTab>('home');
  const [authMode, setAuthMode] = useState<'none' | 'login' | 'register'>('none');

  // Authenticated workspace states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [renewalToEdit, setRenewalToEdit] = useState<Renewal | null>(null);

  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewalToRenew, setRenewalToRenew] = useState<Renewal | null>(null);

  const [isEmailSimModalOpen, setIsEmailSimModalOpen] = useState(false);
  const [emailSimPayload, setEmailSimPayload] = useState<any>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070e1b] flex flex-col items-center justify-center text-slate-800 dark:text-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white flex items-center justify-center shadow-xl shadow-blue-950/20 mb-4 animate-pulse">
          <ShieldCheck className="w-9 h-9 text-indigo-300" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          RenewEase
        </h2>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-900 dark:text-blue-400" />
          <span>Initializing secure private vault...</span>
        </p>
      </div>
    );
  }

  // 1. PUBLIC WEBSITE EXPERIENCE (When not logged in)
  if (!isAuthenticated) {
    // Optional login view
    if (authMode === 'login') {
      return (
        <LoginPage
          onSwitchToRegister={() => setAuthMode('register')}
          onBackToPublic={() => setAuthMode('none')}
        />
      );
    }

    // Optional register view
    if (authMode === 'register') {
      return (
        <RegisterPage
          onSwitchToLogin={() => setAuthMode('login')}
          onBackToPublic={() => setAuthMode('none')}
        />
      );
    }

    // Default: Commercial Public Website with Home, About, Features, Contact
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070e1b] text-slate-900 dark:text-white transition-colors duration-200">
        <PublicNavbar
          currentTab={publicTab}
          onSelectTab={(tab) => {
            setPublicTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToLogin={() => setAuthMode('login')}
          onGoToRegister={() => setAuthMode('register')}
        />

        <main className="flex-1">
          {publicTab === 'home' && (
            <LandingHomePage
              onNavigate={(tab) => {
                setPublicTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToLogin={() => setAuthMode('login')}
              onGoToRegister={() => setAuthMode('register')}
            />
          )}

          {publicTab === 'about' && (
            <AboutPage
              onGoToLogin={() => setAuthMode('login')}
              onGoToRegister={() => setAuthMode('register')}
            />
          )}

          {publicTab === 'features' && (
            <FeaturesPage
              onGoToLogin={() => setAuthMode('login')}
              onGoToRegister={() => setAuthMode('register')}
            />
          )}

          {publicTab === 'contact' && <ContactPage />}
        </main>

        <PublicFooter
          onSelectTab={(tab) => {
            setPublicTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToLogin={() => setAuthMode('login')}
          onGoToRegister={() => setAuthMode('register')}
        />
      </div>
    );
  }

  // 2. AUTHENTICATED PRIVATE WORKSPACE (When logged in)
  const handleOpenAdd = () => {
    setRenewalToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (r: Renewal) => {
    setRenewalToEdit(r);
    setIsAddEditModalOpen(true);
  };

  const handleOpenRenew = (r: Renewal) => {
    setRenewalToRenew(r);
    setIsRenewModalOpen(true);
  };

  const handleOpenEmailSim = (payload: any) => {
    setEmailSimPayload(payload);
    setIsEmailSimModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070e1b] flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
      {/* Authenticated Workspace Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex w-full">
        {/* Navy Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          onOpenAddModal={handleOpenAdd}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardPage
              onOpenAddModal={handleOpenAdd}
              onOpenRenewModal={handleOpenRenew}
            />
          )}

          {currentView === 'renewals' && (
            <RenewalsPage
              onOpenAddModal={handleOpenAdd}
              onOpenEditModal={handleOpenEdit}
              onOpenRenewModal={handleOpenRenew}
            />
          )}

          {currentView === 'renewal-details' && (
            <RenewalDetailsPage
              onOpenEditModal={handleOpenEdit}
              onOpenRenewModal={handleOpenRenew}
              onSimulateEmail={handleOpenEmailSim}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarPage
              onOpenAddModal={handleOpenAdd}
              onOpenRenewModal={handleOpenRenew}
            />
          )}

          {currentView === 'reminders' && (
            <RemindersPage
              onSimulateEmail={handleOpenEmailSim}
            />
          )}

          {currentView === 'documents' && <DocumentsPage />}

          {currentView === 'history' && <HistoryPage />}

          {currentView === 'reports' && <ReportsPage />}

          {currentView === 'profile' && <ProfilePage />}

          {currentView === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Modals */}
      <RenewalFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        renewalToEdit={renewalToEdit}
      />

      <RenewActionModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        renewal={renewalToRenew}
      />

      <EmailSimulationModal
        isOpen={isEmailSimModalOpen}
        onClose={() => setIsEmailSimModalOpen(false)}
        payload={emailSimPayload}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RenewalProvider>
        <MainAppContent />
      </RenewalProvider>
    </AuthProvider>
  );
}
