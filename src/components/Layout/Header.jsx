import React from 'react';
import { Sparkles, Video } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20">
      <div className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <Video className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              DeskGif
            </h1>
            <p className="text-sm text-purple-300/60">Local gif manipulation</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
