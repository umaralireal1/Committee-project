import React from 'react';
import { AppSettings } from '../types';
import { Save, Settings as SettingsIcon, Coins, CalendarClock, Trash2 } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState<AppSettings>(settings);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleChange = (field: keyof AppSettings, value: string | number) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    onSave(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetData = () => {
    if (confirm('DANGER ZONE:\n\nAre you sure you want to delete ALL members, payments, and cycles?\n\nThis cannot be undone.')) {
        localStorage.removeItem('qisst_members');
        localStorage.removeItem('qisst_cycles');
        localStorage.removeItem('qisst_payments');
        // We keep settings
        window.location.reload();
    }
  };

  // Helper calculation for display
  const monthlyPerPerson = localSettings.frequency === 'DAILY' 
    ? localSettings.installmentAmount * 30 
    : localSettings.frequency === 'WEEKLY' 
      ? localSettings.installmentAmount * 4 
      : localSettings.installmentAmount;

  return (
    <div className="max-w-2xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-3xl text-white shadow-lg mb-6 flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Committee Settings</h2>
          <p className="text-blue-100 text-sm">Set up your amounts & frequency</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-6">
        
        {/* Committee Name */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Committee Name</label>
          <input
            type="text"
            value={localSettings.committeeName}
            onChange={(e) => handleChange('committeeName', e.target.value)}
            className="glass-input w-full px-5 py-3 rounded-xl outline-none text-slate-800 font-bold placeholder-slate-400"
            placeholder="e.g. Friends Committee 2026"
          />
        </div>

        {/* Frequency Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Collection Frequency <span className="text-slate-400 font-normal">(Kab paise lene hain?)</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => handleChange('frequency', freq)}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                  localSettings.frequency === freq
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                }`}
              >
                {freq === 'DAILY' ? 'Rozana (Daily)' : freq === 'WEEKLY' ? 'Haftawar (Weekly)' : 'Mahana (Monthly)'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Currency */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Currency</label>
            <select
              value={localSettings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl outline-none text-slate-800 font-bold appearance-none bg-white"
            >
              <option value="PKR">PKR (Rs)</option>
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="AED">AED (Dh)</option>
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Amount per Checkmark
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Coins className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                value={localSettings.installmentAmount}
                onChange={(e) => handleChange('installmentAmount', Number(e.target.value))}
                className="glass-input w-full pl-12 pr-4 py-3 rounded-xl outline-none text-slate-800 font-extrabold text-xl"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 pl-1">
              Enter <b>{localSettings.installmentAmount || 100}</b> here if you collect {localSettings.installmentAmount || 100} {localSettings.frequency.toLowerCase()}.
            </p>
          </div>
        </div>

        {/* Calculation Preview Box */}
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
          <CalendarClock className="w-5 h-5 text-blue-600 mt-1" />
          <div className="text-sm text-slate-700">
            <p className="font-bold mb-1 text-blue-800">Calculation Preview:</p>
            <p>If 1 person pays <b>{localSettings.installmentAmount}</b> {localSettings.frequency.toLowerCase()}...</p>
            <p className="mt-1 font-bold">
              Total Monthly per person: {localSettings.currency} {monthlyPerPerson.toLocaleString()}
            </p>
            {localSettings.frequency === 'DAILY' && (
              <p className="text-xs text-slate-500 mt-1">(Calculated as 30 days)</p>
            )}
             {localSettings.frequency === 'WEEKLY' && (
              <p className="text-xs text-slate-500 mt-1">(Calculated as 4 weeks)</p>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          <Save className="w-5 h-5" />
          {isSaved ? 'Settings Saved!' : 'Save Settings'}
        </button>

        <div className="pt-8 border-t border-slate-200">
            <button
            onClick={handleResetData}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors"
            >
            <Trash2 className="w-5 h-5" />
            Reset All Data (Clear Members)
            </button>
        </div>
      </div>
    </div>
  );
};