
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
        <label className="block text-sm font-bold text-slate-700">Testimonials</label>
        <button onClick={addTestimonial} className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1">
          <Plus size={14} /> Add New
        </button>
      </div>

      <div className="space-y-4">
        {data.testimonials.map((t, idx) => (
          <div key={t.id} className="border border-slate-200 rounded-xl p-4 relative bg-slate-50">
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
                className="w-full text-sm italic bg-white border border-slate-200 rounded p-2 focus:border-emerald-500 outline-none"
                placeholder="Quote..."
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={t.name}
                  onChange={(e) => updateTestimonial(idx, 'name', e.target.value)}
                  className="flex-1 text-xs font-bold bg-white border border-slate-200 rounded p-2 outline-none"
                  placeholder="Customer Name"
                />
                <input 
                  type="text" 
                  value={t.role || ''}
                  onChange={(e) => updateTestimonial(idx, 'role', e.target.value)}
                  className="flex-1 text-xs bg-white border border-slate-200 rounded p-2 outline-none"
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
