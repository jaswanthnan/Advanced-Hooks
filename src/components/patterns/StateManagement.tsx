import React from 'react';

export const StateManagementOverview: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* 1. Limits of Context API */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">1</span>
          Limits of Context API
        </h3>
        <p className="text-slate-600 leading-relaxed font-medium">
          While React Context is excellent for Dependency Injection (like theme or auth), it has significant limitations for high-frequency state management:
        </p>
        <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
          <li><strong>Performance Pitfalls:</strong> Any change to a Context provider's value re-renders <em>all</em> consumers, regardless of whether they use the changed property.</li>
          <li><strong>No Native Selectors:</strong> You cannot easily "subscribe" to a slice of state. (Though use-context-selector exists, it's not native).</li>
          <li><strong>Provider Hell:</strong> Complex apps often end up with deeply nested providers, making the component tree hard to read.</li>
        </ul>
      </div>

      {/* 2. Zustand */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">2</span>
          Zustand (The Modern Standard)
        </h3>
        <p className="text-slate-600 leading-relaxed font-medium">
          Zustand is a small, fast, and scalable bearbones state-management solution. It fixes Context's performance issues via hooks and selectors.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-2">Key Features</h4>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li><strong>Stores:</strong> Global state without Provider wrappers.</li>
              <li><strong>Selectors:</strong> <code className="text-amber-600 bg-amber-50 px-1 rounded">{'useStore(state => state.slice)'}</code> ensures components only re-render when their specific slice changes.</li>
              <li><strong>Middleware:</strong> Native support for <code className="font-bold">persist</code> (localStorage), <code className="font-bold">devtools</code> (Redux extension), and <code className="font-bold">immer</code> (mutable drafts).</li>
            </ul>
          </div>
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto flex items-center">
            <pre>
{`const useStore = create(
  devtools(
    persist(
      immer((set) => ({
        filters: {},
        setFilters: (f) => set(
          state => { state.filters = f }
        )
      }))
    )
  )
)`}
            </pre>
          </div>
        </div>
      </div>

      {/* 3. Redux Toolkit Overview */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">3</span>
          Redux Toolkit (RTK) Overview
        </h3>
        <p className="text-slate-600 leading-relaxed font-medium">
          RTK is the official, opinionated, batteries-included toolset for efficient Redux development.
        </p>
        <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
          <li><strong>Slices:</strong> <code className="text-purple-600 bg-purple-50 px-1 rounded">createSlice</code> combines reducers and actions automatically, using Immer under the hood.</li>
          <li><strong>RTK Query:</strong> A powerful data fetching and caching tool built right in, eliminating the need for `useFetch` or thunks.</li>
        </ul>
        
        <div className="mt-6 p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2">When to choose RTK vs Zustand?</h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            Choose <strong>Zustand</strong> for most modern React apps. It's lighter, simpler, and requires far less boilerplate. 
            Choose <strong>Redux Toolkit</strong> if your application is incredibly massive, has complex interconnected state, relies heavily on time-travel debugging, or if your team is already deeply experienced in the Redux ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
};
