import React from 'react';
import { tools } from '../../constants/tools';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Tools
        </h2>
        <nav className="space-y-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTab === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white/20'
                    : 'bg-slate-800 group-hover:bg-slate-700'
                }`}>
                  <Icon size={18} />
                </div>
                <span className="font-medium text-sm">{tool.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
