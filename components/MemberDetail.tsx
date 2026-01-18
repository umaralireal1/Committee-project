import React from 'react';
import { Member, Cycle, PaymentRecord, AppSettings } from '../types';
import { ArrowLeft, Phone, Calendar, CheckCircle2, XCircle, Wallet, Trophy } from 'lucide-react';

interface MemberDetailProps {
  member: Member;
  cycles: Cycle[];
  payments: PaymentRecord[];
  settings: AppSettings;
  onBack: () => void;
  onTogglePayment: (cycleId: string) => void;
}

export const MemberDetail: React.FC<MemberDetailProps> = ({ 
  member, 
  cycles, 
  payments, 
  settings, 
  onBack,
  onTogglePayment
}) => {
  // Calculations
  const totalPaidCycles = payments.filter(p => p.memberId === member.id && p.status === 'PAID').length;
  const totalPaidAmount = totalPaidCycles * settings.installmentAmount;
  const totalCycles = cycles.length;
  const pendingCycles = totalCycles - totalPaidCycles;
  const pendingAmount = pendingCycles * settings.installmentAmount;
  
  // Sort cycles newest first
  const sortedCycles = [...cycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="pb-24 animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-3 bg-white rounded-full shadow-sm border border-slate-200 active:scale-95 transition-transform">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Member Details</h2>
      </div>

      {/* Profile Card */}
      <div className="glass-panel p-6 rounded-3xl mb-6 flex flex-col items-center text-center relative overflow-hidden">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg ${
          member.hasReceivedPot 
            ? 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700' 
            : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700'
        }`}>
          {member.name.charAt(0).toUpperCase()}
        </div>
        
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">{member.name}</h1>
        <div className="flex items-center gap-2 text-slate-500 font-medium mb-4">
          <Phone className="w-4 h-4" />
          <span>{member.phone || "No Phone Number"}</span>
        </div>

        {member.hasReceivedPot ? (
           <div className="bg-purple-100 text-purple-700 px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm">
             <Trophy className="w-5 h-5" />
             Pot Received (Winner)
           </div>
        ) : (
           <div className="bg-slate-100 text-slate-600 px-6 py-2 rounded-full font-bold flex items-center gap-2">
             <Calendar className="w-5 h-5" />
             Waiting for Pot
           </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-emerald-600">{settings.currency} {totalPaidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">Remaining</p>
          <p className="text-2xl font-bold text-red-500">{settings.currency} {pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment History List */}
      <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-blue-600" />
        Payment History
      </h3>
      
      <div className="space-y-3">
        {sortedCycles.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No cycles started yet.</p>
        ) : (
          sortedCycles.map(cycle => {
            const isPaid = payments.some(p => p.memberId === member.id && p.cycleId === cycle.id && p.status === 'PAID');
            return (
              <div key={cycle.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{cycle.label}</p>
                  <p className="text-xs text-slate-500">{cycle.startDate}</p>
                </div>
                
                <button
                  onClick={() => onTogglePayment(cycle.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {isPaid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Paid
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Unpaid
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
