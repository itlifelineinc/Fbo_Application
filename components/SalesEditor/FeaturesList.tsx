import React, { useState } from 'react';
import { SalesPage } from '../../types/salesPage';
import { Plus, X } from 'lucide-react';

interface FeaturesListProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const FeaturesList: React.FC<FeaturesListProps> = ({ data, onChange }) => {
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (!newFeature.trim()) return;
    onChange('features', [...data.features, newFeature]);
    setNewFeature('');
  };

  const removeFeature = (index: number) => {
    const newList = [...data.features];
    newList.splice(index, 1);
    onChange('features', newList);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Key Features / Benefits</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addFeature()}
          placeholder="e.g. 100% Organic Aloe Vera"
          className="flex-1 p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 text-slate-900 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
        />
        <button 
          onClick={addFeature}
          className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700"
        >
          <Plus size={20} />
        </button>
      </div>
      <ul className="space-y-2">
        {data.features.map((feat, idx) => (
          <li key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-sm border border-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
            <span className="text-slate-700 dark:text-slate-200">{feat}</span>
            <button onClick={() => removeFeature(idx)} className="text-slate-400 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400">
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturesList;