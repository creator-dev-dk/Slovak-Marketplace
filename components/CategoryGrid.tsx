import React from 'react';
import { CATEGORIES } from '../constants';
import { useAppStore } from '../store/useStore';

const CategoryGrid: React.FC = () => {
  const { setCategory, selectedCategory } = useAppStore();

  return (
    <section className="py-2">
        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
           Prehľadávať kategórie
           <span className="text-slovak-gold text-2xl leading-none">.</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
            <div 
              key={cat.id} 
              onClick={() => setCategory(isSelected ? null : cat.id)} // Toggle selection
              className={`group flex flex-col items-center p-6 rounded-2xl transition-all duration-300 border cursor-pointer
                ${isSelected 
                  ? 'bg-slovak-blue text-white shadow-lg border-slovak-blue scale-105' 
                  : 'bg-gray-50/50 hover:bg-white border-transparent hover:border-gray-100 hover:shadow-soft'
                }`}
            >
              <div className="relative w-16 h-16 mb-4">
                 {!isSelected && <div className="absolute inset-0 bg-slovak-blue/5 rounded-full group-hover:scale-110 transition-transform duration-300"></div>}
                 <div className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${isSelected ? 'text-slovak-gold' : 'text-slovak-blue group-hover:text-slovak-gold'}`}>
                    {cat.iconComponent}
                 </div>
              </div>
              
              <span className={`font-semibold text-center transition-colors ${isSelected ? 'text-white' : 'text-gray-800 group-hover:text-slovak-blue'}`}>
                {cat.name}
              </span>
              <span className={`text-xs mt-1 font-medium transition-colors ${isSelected ? 'text-blue-200' : 'text-gray-400 group-hover:text-slovak-gold/80'}`}>
                {cat.count} inzerátov
              </span>
            </div>
          )})}
        </div>
    </section>
  );
};

export default CategoryGrid;