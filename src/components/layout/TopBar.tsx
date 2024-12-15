import React, { useState } from 'react';
import { useLucid } from '../../context/LucidProvider';
import { LuAArrowDown } from 'react-icons/lu';

interface TopBarProps {
  environment: string;
  setEnvironment: (env: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ environment, setEnvironment }) => {
  const { connectWallet, address, lucid } = useLucid();
  const [showFullAddress, setShowFullAddress] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optionally add a toast notification here
  };

  return (
    <div className="h-14 border-b border-[#2d2150] flex items-center justify-end px-6 bg-[#1a1533]">
      <div className="flex items-center gap-4">
        <select
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          className="bg-[#2d2150] rounded px-3 py-1.5 text-[#F8FAFC] border border-[#2d2150] 
                     hover:border-[#6D28D9] transition-colors cursor-pointer"
        >
          <option>No Environment</option>
          <option>Mainnet</option>
          <option>Preprod</option>
          <option>Preview</option>
        </select>
        <button
          className={`px-4 py-1.5 rounded transition-colors flex items-center gap-2 relative
            ${address
              ? 'bg-[#2d2150] hover:bg-[#3d2d60]'
              : 'bg-[#6D28D9] hover:bg-[#7C3AED]'
            }`}
          onClick={address ? undefined : connectWallet}
          onMouseEnter={() => setShowFullAddress(true)}
          onMouseLeave={() => setShowFullAddress(false)}
        >
          <span>
            {address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : 'Connect Wallet'
            }
          </span>
          {showFullAddress && address && (
            <div
              className="absolute right-0 top-full mt-2 p-2 bg-[#2d2150] rounded shadow-lg z-10 w-fit"
              onMouseEnter={() => setShowFullAddress(true)}
              onMouseLeave={() => setShowFullAddress(false)}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs break-all">
                  Payment Hash
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const hash = lucid?.utils.getAddressDetails(address).paymentCredential?.hash;
                    if (hash) copyToClipboard(hash);
                  }}
                  className="text-xs bg-[#6D28D9] px-2 py-1 rounded hover:bg-[#7C3AED] whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
