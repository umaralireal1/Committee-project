import React, { useState } from 'react';
import { Member } from '../types';
import { UserPlus, Trash2, CheckCircle2, ChevronRight, Edit2, X } from 'lucide-react';

interface MembersProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  onMemberClick: (member: Member) => void;
}

export const Members: React.FC<MembersProps> = ({ members, setMembers, onMemberClick }) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    if (editingId) {
      // Edit Mode
      setMembers(members.map(m => 
        m.id === editingId 
          ? { ...m, name: newMemberName, phone: newMemberPhone } 
          : m
      ));
      setEditingId(null);
    } else {
      // Add Mode
      const newMember: Member = {
        id: Date.now().toString(),
        name: newMemberName,
        phone: newMemberPhone,
        joinDate: new Date().toISOString(),
        hasReceivedPot: false,
        avatarSeed: Math.random().toString(36).substring(7)
      };
      setMembers([...members, newMember]);
    }
    
    // Reset Form
    setNewMemberName('');
    setNewMemberPhone('');
    setIsAddMode(false);
  };

  const startEdit = (e: React.MouseEvent, member: Member) => {
    e.stopPropagation();
    setNewMemberName(member.name);
    setNewMemberPhone(member.phone);
    setEditingId(member.id);
    setIsAddMode(true);
  };

  const removeMember = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this member? All their data will be lost.')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const cancelForm = () => {
    setIsAddMode(false);
    setEditingId(null);
    setNewMemberName('');
    setNewMemberPhone('');
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
      
      <div className="flex items-center gap-2">
        {isDone && (
          <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <CheckCircle2 className="w-5 h-5" />
          </span>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
          <button
            onClick={(e) => startEdit(e, member)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => removeMember(e, member.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300" />
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Members</h2>
        <button
          onClick={() => {
             if (isAddMode) cancelForm();
             else setIsAddMode(true);
          }}
          className={`${isAddMode ? 'bg-slate-200 text-slate-800' : 'bg-blue-600 text-white shadow-blue-200'} px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all`}
        >
          {isAddMode ? <X className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          {isAddMode ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {isAddMode && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in">
           <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 text-xl">{editingId ? 'Edit Member' : 'New Member'}</h3>
               <button type="button" onClick={cancelForm} className="p-2 bg-slate-100 rounded-full text-slate-500">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ali Ahmed"
                  required
                  autoFocus
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className="glass-input w-full px-5 py-4 rounded-xl outline-none font-bold text-lg bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="03XX-XXXXXXX"
                  value={newMemberPhone}
                  onChange={e => setNewMemberPhone(e.target.value)}
                  className="glass-input w-full px-5 py-4 rounded-xl outline-none font-bold text-lg bg-slate-50 focus:bg-white"
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 shadow-xl mt-2 flex justify-center items-center gap-2">
                {editingId ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                {editingId ? 'Update Details' : 'Save Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {members.length === 0 ? (
          <div className="text-center py-10 bg-white/50 rounded-3xl border-2 border-dashed border-slate-300">
            <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-bold">No members yet</p>
            <p className="text-slate-400 text-sm">Tap "Add Member" to start</p>
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