import React from 'react';
import { Member, PaymentRecord, Cycle, AppSettings } from '../types';
import { Check, X, Calendar, PlusCircle, Trophy, CheckCheck, CircleDollarSign } from 'lucide-react';

interface PaymentsProps {
  members: Member[];
  cycles: Cycle[];
  setCycles: React.Dispatch<React.SetStateAction<Cycle[]>>;
  payments: PaymentRecord[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentRecord[]>>;
  settings: AppSettings;
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

export const Payments: React.FC<PaymentsProps> = ({
  members,
  cycles,
  setCycles,
  payments,
  setPayments,
  settings,
  setMembers
}) => {
  const [activeCycleId, setActiveCycleId] = React.useState<string>(cycles.length > 0 ? cycles[0].id : '');

  React.useEffect(() => {
    if (!activeCycleId && cycles.length > 0) {
      setActiveCycleId(cycles[0].id);
    }
  }, [cycles, activeCycleId]);

  const createNewCycle = () => {
    const cycleNum = cycles.length + 1;
    const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const newCycle: Cycle = {
      id: `cycle-${Date.now()}`,
      label: `${settings.frequency === 'MONTHLY' ? 'Month' : 'Day'} ${cycleNum}`,
      startDate: today,
      isCompleted: false
    };
    setCycles([newCycle, ...cycles]); // Newest first
    setActiveCycleId(newCycle.id);
  };

  const togglePayment = (memberId: string, cycleId: string) => {
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

  const handleDrawWinner = (cycleId: string) => {
    const eligibleMembers = members.filter(m => !m.hasReceivedPot);
    if (eligibleMembers.length === 0) {
      alert("Everyone has received the pot!");
      return;
    }
    const winnerIndex = Math.floor(Math.random() * eligibleMembers.length);
    const winner = eligibleMembers[winnerIndex];
    if (confirm(`🎉 Conduct Lucky Draw?\n\nWinner: ${winner.name}`)) {
      const updatedCycles = cycles.map(c => c.id === cycleId ? { ...c, winnerId: winner.id, isCompleted: true } : c);
      setCycles(updatedCycles);
      setMembers(members.map(m => m.id === winner.id ? { ...m, hasReceivedPot: true, receivedDate: new Date().toISOString() } : m));
    }
  };

  const currentCycle = cycles.find(c => c.id === activeCycleId);
  const getPaymentStatus = (memberId: string, cycleId: string) => {
    return payments.some(p => p.memberId === memberId && p.cycleId === cycleId && p.status === 'PAID');
  };

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Header Card */}
      <div className="glass-panel p-5 rounded-3xl mb-6">
        <div className="flex justify-between items-center mb-4">
           <div>
             <h2 className="text-xl font-bold text-slate-800">Attendance / Payments</h2>
             <p className="text-sm text-slate-500">Mark who paid today</p>
           </div>
           <button 
            onClick={createNewCycle}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl font-bold shadow-lg"
          >
            <PlusCircle className="w-5 h-5" /> New Date
          </button>
        </div>

        {cycles.length > 0 && (
          <div className="bg-white/50 p-2 rounded-2xl border border-white flex items-center gap-2">
            <select 
              value={activeCycleId} 
              onChange={(e) => setActiveCycleId(e.target.value)}
              className="flex-1 bg-transparent font-bold text-slate-800 text-lg outline-none px-2"
            >
              {cycles.map(c => (
                <option key={c.id} value={c.id}>{c.label} ({c.startDate})</option>
              ))}
            </select>
            {currentCycle && !currentCycle.winnerId && (
               <button onClick={() => handleDrawWinner(currentCycle.id)} className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
                 Draw Winner
               </button>
            )}
          </div>
        )}
      </div>

      {/* Simplified List */}
      {cycles.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <p className="font-bold text-slate-500">Create a New Date to start</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map(member => {
            const isPaid = currentCycle ? getPaymentStatus(member.id, currentCycle.id) : false;
            return (
              <div key={member.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${member.hasReceivedPot ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                    {member.name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-700">{member.name}</span>
                </div>

                <div className="flex gap-2">
                   {/* Toggle Button */}
                   <button
                    disabled={!currentCycle}
                    onClick={() => currentCycle && togglePayment(member.id, currentCycle.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                      isPaid 
                        ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-md' 
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {isPaid ? <Check className="w-5 h-5" /> : <span className="text-sm">Unpaid</span>}
                  </button>

                  {/* Pay Full (Simulated by just paying the cycle visually prominent) */}
                   <button 
                    disabled={!currentCycle || isPaid}
                    onClick={() => currentCycle && togglePayment(member.id, currentCycle.id)}
                    className={`p-2.5 rounded-xl border-2 font-bold transition-all ${isPaid ? 'border-transparent text-emerald-600' : 'border-blue-100 text-blue-600 hover:bg-blue-50'}`}
                    title="Pay Full"
                   >
                     <CircleDollarSign className="w-6 h-6" />
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
