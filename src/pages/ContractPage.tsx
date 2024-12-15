import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import CollectionsSidebar from "../components/layout/CollectionsSidebar";
import TopBar from "../components/layout/TopBar";
import ContractAddress from "../components/ContractInterface/ContractAddress";
import { usePlutus } from "../context/PlutusProvider";
import { resolveAllRefs } from "../utils/index";
import ContractFields from '../components/ContractInterface/ContractFields';
import { UtXOs } from "../components/ContractInterface/UtXOs";
import { useLucid } from "../context/LucidProvider";
import { Data, fromText } from "lucid-cardano";

// Remove the static HelloWorldDatumSchema and replace with dynamic generation
const generateDatumSchema = (datumFields: Array<{ dataType: string; title: string; value: string }>) => {
  const schemaObj: { [key: string]: any } = {};
  
  datumFields.forEach(field => {
    switch (field.dataType) {
      case 'bytes':
        schemaObj[field.title] = Data.Bytes();
        break;
      case 'integer':
        schemaObj[field.title] = Data.Integer();
        break;
      default:
        schemaObj[field.title] = Data.Bytes(); // fallback to Bytes
    }
  });

  console.log(schemaObj);
  
  return Data.Object(schemaObj);
};

const ContractPage: React.FC = () => {
  const { plutusSchema, currentValidatorIndex, setCurrentValidatorIndex } = usePlutus();
  const [environment, setEnvironment] = useState<string>('No Environment');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [data, setData] = useState({}); // datum | redeemer
  const { lucid, address } = useLucid();
  const [unitsQuantity, setUnitsQuantity] = useState<{ [key: string]: bigint }>({});
  const [txHash, setTxHash] = useState<string | null>(null);

  // Resolve references in validators
  const resolvedValidators = plutusSchema?.validators.map(validator => {
    return {
      ...validator,
      datum: resolveAllRefs(validator.datum, plutusSchema),
      redeemer: resolveAllRefs(validator.redeemer, plutusSchema)
    };
  });

  const handleTransaction = async () => {
    try {
      const datumObject = data.reduce((acc: any, field: any) => {
        if (field.dataType === 'integer') {
          acc[field.title] = BigInt(field.value) * BigInt(1000000);
        } else {
          acc[field.title] = fromText(field.value);
        }
        return acc;
      }, {});

      console.log(datumObject);

      // const ownerPubKeyHash = await lucid?.utils.getAddressDetails(address).paymentCredential?.hash;

      // Use dynamic schema
      const correctData = Data.to(
        datumObject,
        generateDatumSchema(data)
      );

      // const correctData = Data.to(
      //   {
      //     owner: ownerPubKeyHash
      //   },
      //   generateDatumSchema(data)
      // );

      const tx = await lucid?.newTx()
        .payToContract(
          contractAddress,
          { inline: correctData },
          unitsQuantity
        ).complete();

      const signedTx = await tx.sign().complete();
      const hash = await signedTx.submit();
      setTxHash(hash);
      console.log(hash);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1a1533] to-[#0f1729] text-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <CollectionsSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          environment={environment}
          setEnvironment={setEnvironment}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <ContractAddress contractAddress={contractAddress} setContractAddress={setContractAddress} />

          <div className="space-y-4">
            {resolvedValidators?.map((validator, index) => (
              <div key={validator.title} onClick={() => setCurrentValidatorIndex(index)}>
                {currentValidatorIndex === index && (
                  <>
                    <h3 className="text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                      {validator.title}
                    </h3>
                    <ContractFields setData={setData} />
                    <UtXOs
                      unitsQuantity={unitsQuantity}
                      setUnitsQuantity={setUnitsQuantity}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTransaction();
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Execute Transaction
                    </button>
                    {txHash && (
                      <div className="mt-4">
                        <a
                          href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          View transaction on Explorer
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPage;
