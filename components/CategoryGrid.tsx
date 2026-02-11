import React from 'react';
import { CATEGORIES } from '../constants';

const CategoryGrid: React.FC = () => {
  return (
    <section className="py-2">
        <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
           Prehľadávať kategórie
           <span className="text-slovak-gold text-2xl leading-none">.</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <a 
              key={cat.id} 
              href="#" 
              className="group flex flex-col items-center p-6 rounded-2xl bg-gray-50/50 hover:bg-white transition-all duration-300 border border-transparent hover:border-gray-100 hover:shadow-soft cursor-pointer"
            >
              <div className="relative w-16 h-16 mb-4">
                 <div className="absolute inset-0 bg-slovak-blue/5 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-slovak-blue group-hover:text-slovak-gold transition-colors duration-300">
                    {cat.iconComponent}
                 </div>
              </div>
              
              <span className="font-semibold text-gray-800 group-hover:text-slovak-blue text-center transition-colors">
                {cat.name}
              </span>
              <span className="text-xs text-gray-400 mt-1 font-medium group-hover:text-slovak-gold/80 transition-colors">
                {cat.count} inzerátov
              </span>
            </a>
          ))}
        </div>
    </section>
  );
};

export default CategoryGrid;