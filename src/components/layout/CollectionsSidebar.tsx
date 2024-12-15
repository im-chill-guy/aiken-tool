import React, { useState } from 'react';
import { FaSearch, FaFileUpload } from 'react-icons/fa';
import { VscSymbolMethod } from 'react-icons/vsc';
import { usePlutus } from '../../context/PlutusProvider';

const CollectionsSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { plutusSchema, setPlutusSchema, setCurrentValidatorIndex, currentValidatorIndex } = usePlutus();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setPlutusSchema(json);
          console.log(json);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          // You might want to add error handling UI here
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-64 bg-[#1a1533] border-r border-[#2d2150]">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[#F8FAFC]">Collections</h2>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search"
            className="w-full bg-[#2d2150] rounded px-3 py-2 pl-8 text-[#F8FAFC] placeholder-[#94A3B8]"
          />
          <FaSearch className="absolute left-2 top-3 text-[#94A3B8]" />
          <button
            onClick={handleClear}
            className="absolute right-2 top-2 text-[#94A3B8] text-sm hover:text-[#F8FAFC]"
          >
            Clear
          </button>
        </div>

        <div className="mt-4 border-2 border-dashed border-[#2d2150] rounded-lg p-6 hover:border-[#6D28D9] hover:bg-[#2d2150] transition-colors duration-200">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <FaFileUpload className="text-4xl text-[#6D28D9]" />
              <div className="text-center">
                <p className="font-medium text-[#F8FAFC]">Upload Plutus JSON</p>
                <p className="text-sm text-[#94A3B8] mt-1">Click to browse</p>
              </div>
            </div>
          </label>
        </div>

        {plutusSchema && (
          <div className="space-y-2 mt-4">
            {plutusSchema.validators.map((validator, index) => (
              <div key={validator.title} onClick={() => setCurrentValidatorIndex(index)}>
                <div className={`flex justify-center space-y-1 overflow-hidden transition-all duration-200`}>
                  <div className={`flex items-center gap-2 p-2 rounded cursor-pointer w-full
                    ${currentValidatorIndex === index 
                      ? 'bg-[#334155] text-[#F8FAFC]' 
                      : 'hover:bg-[#334155]'
                    }`}>
                    <VscSymbolMethod className={`${currentValidatorIndex === index ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'}`} />
                    <div className="flex items-center gap-2">
                      <span className="text-[#F8FAFC] text-sm">
                        {validator.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsSidebar; 