import React from 'react';
import { CATEGORIES } from '../constants';
import { useAppStore } from '../store/useStore';

const CategoryGrid: React.FC = () => {
  const { setCategory, selectedCategory } = useAppStore();

  return (
    <section className="py-2">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
           Prehľadávať kategórie
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
            <div 
              key={cat.id} 
              onClick={() => setCategory(isSelected ? null : cat.id)} // Toggle selection
              className={`group flex flex-col items-center p-4 rounded-xl transition-all duration-200 border cursor-pointer
                ${isSelected 
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'
                }`}
            >
              <div className={`mb-3 p-2 rounded-lg transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-500 group-hover:text-indigo-500 group-hover:bg-indigo-50'}`}>
                 {React.cloneElement(cat.iconComponent as React.ReactElement<any>, { size: 20 })}
              </div>
              
              <span className={`font-semibold text-sm text-center transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                {cat.name}
              </span>
              <span className={`text-[10px] mt-1 font-medium transition-colors ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`}>
                {cat.count} inzerátov
              </span>
            </div>
          )})}
        </div>
    </section>
  );
};

export default CategoryGrid;