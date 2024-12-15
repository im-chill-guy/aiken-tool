import React, { useEffect } from 'react';
import { usePlutus } from '../../context/PlutusProvider';
import { ContractService } from '../../services/contract';
import { useLucid } from '../../context/LucidProvider';


interface ContractAddressProps {
  contractAddress: string;
  setContractAddress: (address: string) => void;
}

const ContractAddress: React.FC<ContractAddressProps> = ({ contractAddress, setContractAddress }) => {
  const { currentValidatorIndex, plutusSchema } = usePlutus();
  const { lucid } = useLucid();

  useEffect(() => {
    async function getContractAddress() {
      if (!lucid || !plutusSchema || currentValidatorIndex === null) return;
      const contractService = new ContractService(lucid, plutusSchema?.validators[currentValidatorIndex as number].compiledCode);
      const contractAddress = contractService.getContractAddress();
      setContractAddress(contractAddress);
    }
    getContractAddress();
  }, [currentValidatorIndex, plutusSchema, lucid, setContractAddress])


  return (
    <div className="mb-6">
      <label className="text-[#94A3B8]">Contract (Script) Address</label>
      <div className="flex gap-2 mt-1">
        <input
          type="text"
          className="flex-1 bg-[#334155] rounded px-3 py-2 text-[#F8FAFC]"
          value={contractAddress ?? ""}
          readOnly
        />
        <button
          className="bg-[#334155] hover:bg-[#475569] px-4 rounded transition-colors"
        >
          Copy Address
        </button>
      </div>
    </div>
  );
};

export default ContractAddress; 