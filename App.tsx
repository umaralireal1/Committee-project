import React, { useState, useEffect } from 'react';
import { Home, Users, Wallet, Settings as SettingsIcon, BrainCircuit } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Members } from './components/Members';
import { Payments } from './components/Payments';
import { Settings } from './components/Settings';
import { MemberDetail } from './components/MemberDetail'; // New Component
import { getCommitteeAdvice } from './services/geminiService';
import { AppSettings, Cycle, Member, PaymentRecord, ViewState } from './types';

// Initial Mock Data
const INITIAL_SETTINGS: AppSettings = {
  committeeName: 'My Committee',
  installmentAmount: 1000,
  currency: 'PKR',
  frequency: 'MONTHLY'
};

export default function App() {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('qisst_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('qisst_members');
    return saved ? JSON.parse(saved) : [];
  });
  const [cycles, setCycles] = useState<Cycle[]>(() => {
    const saved = localStorage.getItem('qisst_cycles');
    return saved ? JSON.parse(saved) : [];
  });
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('qisst_payments');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('qisst_settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('qisst_members', JSON.stringify(members)), [members]);
  useEffect(() => localStorage.setItem('qisst_cycles', JSON.stringify(cycles)), [cycles]);
  useEffect(() => localStorage.setItem('qisst_payments', JSON.stringify(payments)), [payments]);

  // Helper for toggle payment from Detail View
  const handleTogglePayment = (memberId: string, cycleId: string) => {
    const existingPaymentIndex = payments.findIndex(p => p.memberId === memberId && p.cycleId === cycleId);
    if (existingPaymentIndex >= 0) {
      const newPayments = [...payments];
      newPayments.splice(existingPaymentIndex, 1);
      setPayments(newPayments);
    } else {
      const newPayment: PaymentRecord = {
        memberId,
        cycleId,
        status: 'PAID',
        datePaid: new Date().toISOString()
      };
      setPayments([...payments, newPayment]);
    }
  };

  // Main Render Logic
  const renderContent = () => {
    if (selectedMember) {
      return (
        <MemberDetail 
          member={selectedMember}
          cycles={cycles}
          payments={payments}
          settings={settings}
          onBack={() => setSelectedMember(null)}
          onTogglePayment={(cycleId) => handleTogglePayment(selectedMember.id, cycleId)}
        />
      );
    }

    switch (view) {
      case 'DASHBOARD':
        return <Dashboard settings={settings} members={members} cycles={cycles} payments={payments} />;
      case 'MEMBERS':
        return <Members members={members} setMembers={setMembers} onMemberClick={setSelectedMember} />;
      case 'PAYMENTS':
        return <Payments members={members} cycles={cycles} setCycles={setCycles} payments={payments} setPayments={setPayments} settings={settings} setMembers={setMembers} />;
      case 'SETTINGS':
        return <Settings settings={settings} onSave={setSettings} />;
      default:
        return <Dashboard settings={settings} members={members} cycles={cycles} payments={payments} />;
    }
  };

  const NavButton = ({ id, label, icon: Icon }: { id: ViewState, label: string, icon: any }) => (
    <button
      onClick={() => {
        setView(id);
        setSelectedMember(null); // Reset detail view on nav change
      }}
      className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
        view === id 
          ? 'text-blue-600 bg-blue-50' 
          : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon className={`w-6 h-6 mb-1 ${view === id ? 'fill-blue-600/20' : ''}`} />
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen font-sans text-slate-800">
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 glass-nav z-20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">Q</div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800">QisstPro</span>
        </div>
        {/* Optional AI helper button could go here */}
      </div>

      {/* Main Content Area */}
      <main className="pt-24 px-4 pb-28 max-w-lg mx-auto min-h-screen">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile First) */}
      <div className="fixed bottom-0 left-0 right-0 glass-nav z-30 pb-safe">
        <div className="flex justify-around items-center p-3 max-w-lg mx-auto">
          <NavButton id="DASHBOARD" label="Home" icon={Home} />
          <NavButton id="MEMBERS" label="Members" icon={Users} />
          <NavButton id="PAYMENTS" label="Pay" icon={Wallet} />
          <NavButton id="SETTINGS" label="Setup" icon={SettingsIcon} />
        </div>
      </div>

    </div>
  );
}
