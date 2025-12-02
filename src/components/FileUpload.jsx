import React from 'react';
import { useStore } from '../store/useStore';
import { Upload, Film, Image } from 'lucide-react';

const FileUpload = () => {
  const { handleFileUpload } = useStore();
  return (
    <button
      onClick={() => handleFileUpload()}
      className="group w-full border-2 border-dashed border-slate-700 hover:border-purple-500 bg-slate-800/30 hover:bg-slate-800/50 rounded-2xl p-16 transition-all duration-300"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl group-hover:bg-purple-500/30 transition-all"></div>
          <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border border-slate-700 group-hover:border-purple-500 transition-colors">
            <Upload className="w-12 h-12 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-white">Upload Your Media</h3>
          <p className="text-slate-400 max-w-md">
            Click to browse or drag and drop your video, image, or GIF
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg">
            <Film size={16} className="text-blue-400" />
            <span className="text-xs text-slate-300">MP4, AVI, MOV</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg">
            <Image size={16} className="text-green-400" />
            <span className="text-xs text-slate-300">PNG, JPG, GIF</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default FileUpload;
