
import React from 'react';
import { SalesPage, Testimonial } from '../../types/salesPage';
import { Plus, Trash2, User } from 'lucide-react';

interface TestimonialsEditorProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const TestimonialsEditor: React.FC<TestimonialsEditorProps> = ({ data, onChange }) => {
  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: 'Happy Customer',
      quote: 'This product changed my life!',
      role: 'Verified Buyer'
    };
    onChange('testimonials', [...data.testimonials, newTestimonial]);
  };

  const removeTestimonial = (index: number) => {
    const list = [...data.testimonials];
    list.splice(index, 1);
    onChange('testimonials', list);
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
    const list = [...data.testimonials];
    list[index] = { ...list[index], [field]: value };
    onChange('testimonials', list);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">Testimonials</label>
        <button onClick={addTestimonial} className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1 dark:text-emerald-400">
          <Plus size={14} /> Add New
        </button>
      </div>

      <div className="space-y-4">
        {data.testimonials.map((t, idx) => (
          <div key={t.id} className="border border-slate-200 rounded-xl p-3 md:p-4 relative bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
            <button 
              onClick={() => removeTestimonial(idx)}
              className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
            <div className="space-y-3">
              <input 
                type="text" 
                value={t.quote}
                onChange={(e) => updateTestimonial(idx, 'quote', e.target.value)}
                maxLength={280}
                className="w-full text-xs md:text-sm italic bg-white border border-slate-200 rounded p-2 focus:border-emerald-500 outline-none text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Quote... (Max 280 chars)"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  value={t.name}
                  onChange={(e) => updateTestimonial(idx, 'name', e.target.value)}
                  maxLength={30}
                  className="flex-1 text-xs font-bold bg-white border border-slate-200 rounded p-2 outline-none text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Customer Name"
                />
                <input 
                  type="text" 
                  value={t.role || ''}
                  onChange={(e) => updateTestimonial(idx, 'role', e.target.value)}
                  maxLength={30}
                  className="flex-1 text-xs bg-white border border-slate-200 rounded p-2 outline-none text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Role (Optional)"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsEditor;
