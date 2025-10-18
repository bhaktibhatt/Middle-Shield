import { Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { PreventionRule } from '../types';
import { supabase } from '../lib/supabase';

interface RuleCardProps {
  rule: PreventionRule;
  onRefresh: () => void;
}

const ruleTypeColors = {
  signature: 'bg-purple-100 text-purple-800',
  behavior: 'bg-blue-100 text-blue-800',
  threshold: 'bg-green-100 text-green-800',
};

const actionColors = {
  block: 'bg-red-100 text-red-800',
  alert: 'bg-yellow-100 text-yellow-800',
  quarantine: 'bg-orange-100 text-orange-800',
  rate_limit: 'bg-blue-100 text-blue-800',
};

export default function RuleCard({ rule, onRefresh }: RuleCardProps) {
  const handleToggle = async () => {
    await supabase
      .from('prevention_rules')
      .update({ enabled: !rule.enabled, updated_at: new Date().toISOString() })
      .eq('id', rule.id);
    onRefresh();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{rule.rule_name}</h3>
            <p className="text-sm text-gray-600 capitalize">{rule.threat_type.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
            rule.enabled
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {rule.enabled ? (
            <>
              <ToggleRight className="h-5 w-5" />
              <span className="text-sm">Enabled</span>
            </>
          ) : (
            <>
              <ToggleLeft className="h-5 w-5" />
              <span className="text-sm">Disabled</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ruleTypeColors[rule.rule_type]}`}>
          {rule.rule_type}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${actionColors[rule.action]}`}>
          {rule.action}
        </span>
      </div>

      {Object.keys(rule.parameters).length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
          <p className="text-xs font-semibold text-gray-700 mb-2">Parameters:</p>
          {Object.entries(rule.parameters).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
              <span className="text-gray-900 font-mono">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
