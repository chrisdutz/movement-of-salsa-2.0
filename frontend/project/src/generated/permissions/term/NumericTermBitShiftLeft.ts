import {NumericTerm} from "./NumericTerm.ts";

export class NumericTermBitShiftLeft implements NumericTerm {

    termA: NumericTerm;
    termB: NumericTerm;

    constructor(termA: NumericTerm, termB: NumericTerm) {
        this.termA = termA;
        this.termB = termB;
    }

    evaluateNumericTerm(context: Map<string, any>): number {
        return this.termA.evaluateNumericTerm(context) << this.termB.evaluateNumericTerm(context);
    }

}
