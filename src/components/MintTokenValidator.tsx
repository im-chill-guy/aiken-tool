import React, { useState } from 'react';
import { fromText, Script } from "lucid-cardano";
import { useLucid } from '../context/LucidProvider';

export const MintTokenValidator = () => {
    const { lucid } = useLucid();
    const [txHash, setTxHash] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [isFungible, setIsFungible] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsFungible(event.target.value === 'ft');
        // Reset quantity to 1 for NFT
        if (event.target.value === 'nft') {
            setQuantity(1);
        }
    };

    const mintingPolicyId = async function () {
        if (!lucid) {
            throw new Error("Lucid instance not found");
        }

        const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address());

        if (!paymentCredential) {
            throw new Error("Payment credential not found");
        }

        const mintingPolicy: Script = lucid.utils.nativeScriptFromJson({
            type: "all",
            scripts: [
                { type: "sig", keyHash: paymentCredential.hash },
                // { type: "before", slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000) },
            ],
        });

        const policyId: string = lucid.utils.mintingPolicyToId(mintingPolicy);

        return { policyId: policyId, mintingPolicy: mintingPolicy };
    };

    const mintAssetService = async function () {
        try {
            setLoading(true);
            if (!lucid) {
                throw new Error("Lucid instance not found");
            }

            const { mintingPolicy, policyId } = await mintingPolicyId();
            const assetName = fromText(name);
            const tx = await lucid
                .newTx()
                .mintAssets({ [policyId + assetName]: BigInt(quantity) })
                .attachMetadata(isFungible ? 20 : 721, {
                    [policyId]: {
                        [name]: {
                            name: name,
                            description: description,
                            image: image,
                            mediaType: "image/png",
                        },
                    },
                })
                .validTo(Date.now() + 200000)
                .attachMintingPolicy(mintingPolicy)
                .complete();
            const signedTx = await tx.sign().complete();
            const txHash = await signedTx.submit();
            await lucid.awaitTx(txHash);

            setTxHash(txHash);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-blue-400">Mint Tokens</h2>
            
            <div className="space-y-4 bg-gradient-to-br from-[#1a1533]/50 to-[#0f1729]/50 p-6 rounded-lg border border-white/10">
                <div className="flex gap-4 items-center">
                    <label className="flex items-center cursor-pointer text-white/80 hover:text-white transition-colors">
                        <input
                            type="radio"
                            name="tokenType"
                            value="nft"
                            checked={!isFungible}
                            onChange={handleTypeChange}
                            className="mr-2"
                        />
                        NFT
                    </label>
                    <label className="flex items-center cursor-pointer text-white/80 hover:text-white transition-colors">
                        <input
                            type="radio"
                            name="tokenType"
                            value="ft"
                            checked={isFungible}
                            onChange={handleTypeChange}
                            className="mr-2"
                        />
                        Fungible Token
                    </label>
                </div>

                {isFungible && (
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        placeholder="Quantity"
                        className="w-full bg-[#1a1533]/30 border border-white/10 rounded-md p-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                    />
                )}

                <input
                    type="text"
                    placeholder="NFT Name"
                    className="w-full bg-[#1a1533]/30 border border-white/10 rounded-md p-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Description"
                    className="w-full bg-[#1a1533]/30 border border-white/10 rounded-md p-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Image URL"
                    className="w-full bg-[#1a1533]/30 border border-white/10 rounded-md p-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                    onChange={(e) => setImage(e.target.value)}
                />

                <button
                    onClick={mintAssetService}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                    {loading ? 'Processing...' : 'Mint Tokens'}
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
            </div>
        </div>
    );
};
