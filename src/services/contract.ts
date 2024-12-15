import { Lucid, SpendingValidator } from "lucid-cardano";

class ContractService {
    private compiledCode: string;
    private contractAddress: string;
    private lucid: Lucid;

    constructor(lucid: Lucid, compiledCode: string) {
        this.compiledCode = compiledCode;
        this.lucid = lucid;

        const validator = this.getSpendingValidator();

        this.contractAddress = this.lucid.utils.validatorToAddress(validator);
    }

    getSpendingValidator(): SpendingValidator {
        return {
            type: "PlutusV2",
            script: this.compiledCode,
        }
    }

    getContractAddress() {
        return this.contractAddress;
    }

    async getUTxOs() {
        return this.lucid.utxosAt(this.contractAddress);
    }
}

export { ContractService };