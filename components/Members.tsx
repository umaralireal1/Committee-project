import React, { useState } from 'react';
import { Member } from '../types';
import { UserPlus, Trash2, CheckCircle2, ChevronRight, User, Plus } from 'lucide-react';

interface MembersProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  onMemberClick: (member: Member) => void;
}

export const Members: React.FC<MembersProps> = ({ members, setMembers, onMemberClick }) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [isAddMode, setIsAddMode] = useState(false);

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: Member = {
      id: Date.now().toString(),
      name: newMemberName,
      phone: newMemberPhone,
      joinDate: new Date().toISOString(),
      hasReceivedPot: false,
      avatarSeed: Math.random().toString(36).substring(7)
    };

    setMembers([...members, newMember]);
    setNewMemberName('');
    setNewMemberPhone('');
    setIsAddMode(false);
  };

  const removeMember = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this member? All their data will be lost.')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const MemberCard: React.FC<{ member: Member; isDone: boolean }> = ({ member, isDone }) => (
    <div 
      onClick={() => onMemberClick(member)}
      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-3 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold ${
          isDone 
            ? 'bg-purple-100 text-purple-600' 
            : 'bg-blue-50 text-blue-600'
        }`}>
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{member.name}</h3>
          <p className="text-sm text-slate-400 font-medium">{member.phone || 'No phone'}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {isDone && (
          <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <CheckCircle2 className="w-5 h-5" />
          </span>
        )}
        <button
          onClick={(e) => removeMember(e, member.id)}
          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <ChevronRight className="w-5 h-5 text-slate-300" />
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Members</h2>
        <button
          onClick={() => setIsAddMode(!isAddMode)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-200 transition-all"
        >
          {isAddMode ? 'Close' : <><UserPlus className="w-5 h-5" /> Add</>}
        </button>
      </div>

      {isAddMode && (
        <form onSubmit={addMember} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg mb-8 animate-in slide-in-from-top-4">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Add New Member</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Name</label>
              <input
                type="text"
                placeholder="Name"
                required
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl outline-none font-semibold text-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
              <input
                type="tel"
                placeholder="03XX-XXXXXXX"
                value={newMemberPhone}
                onChange={e => setNewMemberPhone(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl outline-none font-semibold text-lg"
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 shadow-xl">
              Save Member
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {members.length === 0 ? (
          <div className="text-center py-10 bg-white/50 rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-400 font-medium">No members yet</p>
          </div>
        ) : (
          members.map(m => (
            <MemberCard key={m.id} member={m} isDone={m.hasReceivedPot} />
          ))
        )}
      </div>
    </div>
  );
};