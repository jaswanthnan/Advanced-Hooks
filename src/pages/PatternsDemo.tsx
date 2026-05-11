import React, { useState } from 'react';
import { FilterPanel } from '../components/patterns/FilterPanel';
import { TabsClone, Tab } from '../components/patterns/TabsClone';
import { Tabs } from '../components/patterns/TabsContext';
import { AIPromptBuilder } from '../components/patterns/AIPromptBuilder';
import { MouseTracker, Counter, InputPatterns } from '../components/patterns/MiscPatterns';
import { UserProfileHOC, UserProfileHook } from '../components/patterns/HocVsHooks';
import { StateManagementOverview } from '../components/patterns/StateManagement';

const PatternsDemo: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200 py-16 px-8 mb-16 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
             Engineering Excellence
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tightest mb-4">
            Advanced React Patterns
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
            Deep dive into Compound Components, Composition, Render Props, and the architectural evolution of state management.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 space-y-32">
        
        {/* 1. Compound Components - Tabs */}
        <section className="space-y-12">
          <div className="border-l-8 border-blue-500 pl-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">1. Compound Components: Tabs</h2>
            <p className="text-slate-500 mt-2 text-lg">Comparing <code className="text-blue-600 font-bold">cloneElement</code> versus the <code className="text-blue-600 font-bold">Context API</code>.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-px bg-slate-200"></span> React.Children & cloneElement
              </h3>
              <TabsClone>
                <Tab label="Identity">
                  <h4 className="text-xl font-black mb-3">User Identity</h4>
                  <p className="text-slate-600 leading-relaxed font-medium">This pattern uses cloning to inject props. It's clean but fragile because it only supports direct children.</p>
                </Tab>
                <Tab label="Security">
                  <h4 className="text-xl font-black mb-3">System Security</h4>
                  <p className="text-slate-600 leading-relaxed font-medium">Protected by enterprise-grade encryption. Prop injection happens at the parent level during mapping.</p>
                </Tab>
              </TabsClone>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-px bg-slate-200"></span> Context API Architecture
              </h3>
              <Tabs defaultValue="infra">
                <Tabs.List>
                  <Tabs.Trigger id="infra">Infrastructure</Tabs.Trigger>
                  <Tabs.Trigger id="logs">Activity Logs</Tabs.Trigger>
                  <Tabs.Trigger id="config">Global Config</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content id="infra">
                  <h4 className="text-xl font-black mb-3">Core Infrastructure</h4>
                  <p className="text-slate-600 leading-relaxed font-medium">Context-based compound components allow deep nesting. Triggers and Content can be anywhere in the component tree.</p>
                </Tabs.Content>
                <Tabs.Content id="logs">
                  <h4 className="text-xl font-black mb-3">Activity Stream</h4>
                  <p className="text-slate-600 leading-relaxed font-medium">Real-time event monitoring. State is shared globally within the provider's scope.</p>
                </Tabs.Content>
                <Tabs.Content id="config">
                  <h4 className="text-xl font-black mb-3">System Configuration</h4>
                  <p className="text-slate-600 leading-relaxed font-medium">Manage environment variables and global flags from a centralized interface.</p>
                </Tabs.Content>
              </Tabs>
            </div>
          </div>
        </section>

        {/* 2. AIPromptBuilder */}
        <section className="space-y-12">
          <div className="border-l-8 border-indigo-500 pl-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">2. Advanced: AIPromptBuilder</h2>
            <p className="text-slate-500 mt-2 text-lg">A sophisticated compound component utilizing "Slot" architecture.</p>
          </div>
          
          <AIPromptBuilder>
            <AIPromptBuilder.Role />
            <AIPromptBuilder.Task />
            <AIPromptBuilder.Constraints />
          </AIPromptBuilder>
        </section>

        {/* 3. FilterPanel - Composition */}
        <section className="space-y-12">
          <div className="border-l-8 border-emerald-500 pl-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">3. Composition Pattern: FilterPanel</h2>
            <p className="text-slate-500 mt-2 text-lg">The modular system used on the Candidate List page.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <FilterPanel onChange={setActiveFilters}>
              <FilterPanel.Group name="status" title="Pipeline Status">
                <FilterPanel.Item group="status" value="Hired">Hired</FilterPanel.Item>
                <FilterPanel.Item group="status" value="In Review">In Review</FilterPanel.Item>
                <FilterPanel.Item group="status" value="Pending">Pending</FilterPanel.Item>
                <FilterPanel.Item group="status" value="Rejected">Rejected</FilterPanel.Item>
              </FilterPanel.Group>

              <FilterPanel.Group name="experience" title="Seniority Level">
                <FilterPanel.Item group="experience" value="1">1 Year</FilterPanel.Item>
                <FilterPanel.Item group="experience" value="3">3 Years</FilterPanel.Item>
                <FilterPanel.Item group="experience" value="5">5 Years</FilterPanel.Item>
              </FilterPanel.Group>
              
              <div className="pt-4 border-t border-slate-100">
                 <FilterPanel.ClearButton>Reset Filters</FilterPanel.ClearButton>
              </div>
            </FilterPanel>

            <div className="bg-slate-900 rounded-[2rem] p-10 shadow-2xl">
              <h4 className="text-emerald-400 font-black uppercase text-[10px] tracking-widest mb-6">Real-time State Explorer</h4>
              <pre className="text-slate-300 font-mono text-sm leading-relaxed">
                {JSON.stringify(activeFilters, null, 2)}
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Logic Reuse: Render Props & Children */}
        <section className="space-y-12">
          <div className="border-l-8 border-orange-500 pl-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">4. Logic Reuse: Render Props & Children</h2>
            <p className="text-slate-500 mt-2 text-lg">Patterns for decoupling business logic from presentation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-px bg-slate-200"></span> Render Props
              </h3>
              <MouseTracker render={({ x, y }) => (
                <div 
                  className="absolute w-12 h-12 bg-blue-500/10 border-2 border-blue-500 rounded-full pointer-events-none transition-all duration-75 ease-out flex items-center justify-center shadow-2xl shadow-blue-500/20"
                  style={{ left: x - 24, top: y - 24 }}
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
              )} />
              <p className="text-sm text-slate-500 italic">Open console to see mouse movement events if logged.</p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-px bg-slate-200"></span> Function-as-Children
              </h3>
              <Counter>
                {(count, inc, dec) => (
                  <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 flex flex-col items-center gap-8 shadow-sm">
                    <span className="text-7xl font-black text-slate-900 tracking-tighter">{count}</span>
                    <div className="flex gap-4">
                      <button onClick={() => { console.log('%c[Counter]%c Decremented', 'color: #f59e0b', 'color: inherit'); dec(); }} className="w-16 h-16 rounded-2xl bg-slate-50 hover:bg-slate-100 text-2xl font-black transition-all border border-slate-100 active:scale-90">-</button>
                      <button onClick={() => { console.log('%c[Counter]%c Incremented', 'color: #f59e0b', 'color: inherit'); inc(); }} className="w-16 h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-2xl font-black transition-all shadow-xl active:scale-90">+</button>
                    </div>
                  </div>
                )}
              </Counter>
            </div>
          </div>
        </section>

        {/* 5. Controlled vs Uncontrolled */}
        <section className="space-y-12">
          <div className="border-l-8 border-rose-500 pl-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">5. Controlled vs Uncontrolled</h2>
            <p className="text-slate-500 mt-2 text-lg">Comparing React state management versus direct DOM access.</p>
          </div>
          <InputPatterns />
        </section>

        {/* 6. Evolution: HOCs to Hooks */}
        <section className="space-y-12">
          <div className="border-l-8 border-purple-500 pl-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">6. Evolution: HOCs to Hooks</h2>
            <p className="text-slate-500 mt-2 text-lg">Tracing the transition from component wrapping to functional composition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-px bg-slate-200"></span> HOC (Legacy Pattern)
              </h3>
              <UserProfileHOC />
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-px bg-slate-200"></span> Hook (Modern Standard)
              </h3>
              <UserProfileHook />
            </div>
          </div>
        </section>

        {/* 7. State Management Architecture */}
        <section className="space-y-12 pb-20">
          <div className="border-l-8 border-teal-500 pl-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">7. State Management Architecture</h2>
            <p className="text-slate-500 mt-2 text-lg">Comparing Context API, Zustand, and Redux Toolkit.</p>
          </div>
          <StateManagementOverview />
        </section>

      </div>
    </div>
  );
};

export default PatternsDemo;
