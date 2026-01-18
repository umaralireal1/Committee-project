import React from 'react';
import { AppSettings, Member, Cycle, PaymentRecord } from '../types';
import { Wallet, Users, Trophy, CalendarDays } from 'lucide-react';

interface DashboardProps {
  settings: AppSettings;
  members: Member[];
  cycles: Cycle[];
  payments: PaymentRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({ settings, members, cycles, payments }) => {
  const currentCycle = cycles.length > 0 ? cycles[0] : null;
  const totalMembers = members.length;
  
  // LOGIC FIX:
  // If Daily: Pot = Members * Amount * 30
  // If Monthly: Pot = Members * Amount * 1
  let multiplier = 1;
  if (settings.frequency === 'DAILY') multiplier = 30;
  if (settings.frequency === 'WEEKLY') multiplier = 4;

  const perPersonMonthly = settings.installmentAmount * multiplier;
  const totalPotValue = totalMembers * perPersonMonthly;

  const StatCard = ({ label, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white p-5 rounded-3xl flex items-center justify-between mb-3 shadow-sm border border-slate-100">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-slate-800 tracking-tight">{value}</p>
        {subtext && <p className="text-xs font-medium text-slate-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">Active Committee</p>
          <h1 className="text-3xl font-extrabold mb-4">{settings.committeeName}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1">
               <Wallet className="w-3 h-3" />
               {settings.currency} {settings.installmentAmount} / {settings.frequency}
            </span>
            <span className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md border border-white/20">
               {totalMembers} Members
            </span>
          </div>
        </div>
        {/* Decor */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/30 rounded-full blur-2xl -ml-10 -mb-10"></div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard 
          label="Total Pot (Winner)" 
          value={`${settings.currency} ${totalPotValue.toLocaleString()}`} 
          icon={Trophy} 
          color="bg-purple-600"
          subtext={`Based on ${multiplier} days/month`}
        />
        <StatCard 
          label="Collected Today" 
          value={currentCycle ? (
            `${settings.currency} ${(payments.filter(p => p.cycleId === currentCycle.id && p.status === 'PAID').length * settings.installmentAmount).toLocaleString()}`
          ) : 0}
          icon={CalendarDays} 
          color="bg-emerald-600"
          subtext="Daily Collection"
        />
      </div>

      {/* Logic Explanation Card for User */}
      <div className="glass-panel p-5 rounded-3xl mb-6">
         <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Contribution Summary
         </h3>
         <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
               <span className="text-slate-500">1 Person Pays ({settings.frequency})</span>
               <span className="font-bold text-slate-800">{settings.installmentAmount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
               <span className="text-slate-500">1 Person Pays (Monthly Total)</span>
               <span className="font-bold text-slate-800">{perPersonMonthly.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
               <span className="text-blue-700 font-bold">Winner Gets (Total Pot)</span>
               <span className="font-extrabold text-blue-700 text-lg">{totalPotValue.toLocaleString()}</span>
            </div>
         </div>
      </div>

      {/* Active Cycle Status */}
      <div className="mb-2 px-2">
        <h3 className="font-bold text-slate-800">Current Day Status</h3>
      </div>
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          {currentCycle ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Date</p>
                  <p className="text-xl font-bold text-slate-800">{currentCycle.startDate}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${currentCycle.isCompleted ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {currentCycle.isCompleted ? 'Closed' : 'Open / Active'}
                </div>
              </div>
              
              {currentCycle.winnerId ? (
                <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <p className="text-xs font-bold text-purple-600 uppercase mb-1">Lucky Draw Winner</p>
                    <p className="text-lg font-bold text-slate-800">
                      {members.find(m => m.id === currentCycle.winnerId)?.name}
                    </p>
                </div>
              ) : (
                <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2">
                   {/* Progress bar for today's collection */}
                   <div 
                     className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                     style={{ width: `${(payments.filter(p => p.cycleId === currentCycle.id && p.status === 'PAID').length / (totalMembers || 1)) * 100}%` }}
                   ></div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400 text-center font-medium">No active date found. Go to "Pay" to start.</p>
          )}
      </div>
    </div>
  );
};