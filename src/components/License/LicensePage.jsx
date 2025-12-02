import React from 'react';
import licenseText from '../../../LICENSE?raw';

const LicensePage = () => {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl shadow-slate-900/40">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">GNU GPL v2 License</h3>
          <p className="text-sm text-slate-400">DeskGif is distributed under the terms of the GPL-2.0.</p>
        </div>
      </div>
      <div className="mt-2 h-[60vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/70 p-4">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200 font-mono">
          {licenseText}
        </pre>
      </div>
    </div>
  );
};

export default LicensePage;
