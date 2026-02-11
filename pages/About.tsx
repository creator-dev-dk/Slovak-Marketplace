import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PRD_CONTENT } from '../constants';
import ReactMarkdown from 'react-markdown';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                <span className="text-slovak-blue font-bold uppercase tracking-wide text-sm mb-2 block">Product Concept</span>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                    O projekte "Prémiov"
                </h1>
                
                <div className="prose prose-blue prose-lg max-w-none text-gray-600">
                   <div className="space-y-6 whitespace-pre-line">
                      {PRD_CONTENT}
                   </div>
                </div>

                <div className="mt-12 bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-bold text-slovak-blue mb-2">User Flow (3-Click Rule)</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li><strong>Click 1:</strong> "Pridať inzerát" (Hero/Sticky Nav).</li>
                        <li><strong>Click 2:</strong> Upload fotky (AI auto-fillne kategóriu a popis).</li>
                        <li><strong>Click 3:</strong> Potvrdiť cez BankID a Zverejniť.</li>
                    </ol>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;