import {BooleanTerm} from "./BooleanTerm.ts";
import {NumericTerm} from "./NumericTerm.ts";

export class ComparisonTermEq implements BooleanTerm {

    termA: NumericTerm;
    termB: NumericTerm;

    constructor(termA: NumericTerm, termB: NumericTerm) {
        this.termA = termA;
        this.termB = termB;
    }

    evaluateBooleanTerm(context: Map<string, any>): boolean {
        return this.termA.evaluateNumericTerm(context) == this.termB.evaluateNumericTerm(context);
    }

}
