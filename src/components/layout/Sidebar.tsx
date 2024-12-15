import React from 'react';
import { FaFile, FaGasPump, FaCode } from 'react-icons/fa';
import CardanoLogo from '../icons/CardanoLogo';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-16 bg-[#1a1533] flex flex-col items-center py-4 border-r border-[#2d2150]">
      <div className="mb-8 text-[#7C3AED] flex flex-col items-center">
        <CardanoLogo className="w-8 h-8" />
        <span className="text-xs mt-1">ADA</span>
      </div>
      <nav className="flex flex-col gap-6 text-[#94A3B8]">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-[#2d2150] hover:text-[#7C3AED] rounded transition-colors">
          <FaFile />
        </button>
        <button className="p-2 hover:bg-[#2d2150] hover:text-[#7C3AED] rounded transition-colors">
          <FaGasPump />
        </button>
        <button
          onClick={() => navigate('/mint-tokens')}
          className="p-2 hover:bg-[#2d2150] hover:text-[#7C3AED] rounded transition-colors"
        >
          <FaCode />
        </button>
      </nav>
    </div>
  );
};

export default Sidebar; 