import React, { useState } from 'react';
import { FilterPanel } from '../components/patterns/FilterPanel';

const PatternsDemo: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 py-12 px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Compound Component Pattern
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Implementation of a <code className="text-blue-600">&lt;FilterPanel&gt;</code> system using Context and Composition.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8">
        <section className="space-y-8">
          <div className="border-l-4 border-emerald-500 pl-6">
            <h2 className="text-2xl font-bold text-slate-800">FilterPanel Demo</h2>
            <p className="text-slate-500 mt-2">
              This component uses the Compound Component pattern to share filter state between independent groups and items.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <FilterPanel onChange={setActiveFilters}>
              <FilterPanel.Group name="status" title="Candidate Status">
                <FilterPanel.Item group="status" value="Hired">Hired</FilterPanel.Item>
                <FilterPanel.Item group="status" value="In Review">In Review</FilterPanel.Item>
                <FilterPanel.Item group="status" value="Pending">Pending</FilterPanel.Item>
                <FilterPanel.Item group="status" value="Rejected">Rejected</FilterPanel.Item>
              </FilterPanel.Group>

              <FilterPanel.Group name="experience" title="Experience Level">
                <FilterPanel.Item group="experience" value="Entry">Entry Level</FilterPanel.Item>
                <FilterPanel.Item group="experience" value="Junior">Junior (1-3y)</FilterPanel.Item>
                <FilterPanel.Item group="experience" value="Senior">Senior (5y+)</FilterPanel.Item>
              </FilterPanel.Group>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <FilterPanel.ClearButton>Reset All Filters</FilterPanel.ClearButton>
              </div>
            </FilterPanel>

            {/* State Preview */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800">
              <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">Active Filters (JSON)</h4>
              <pre className="text-slate-300 font-mono text-sm">
                {JSON.stringify(activeFilters, null, 2)}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatternsDemo;
