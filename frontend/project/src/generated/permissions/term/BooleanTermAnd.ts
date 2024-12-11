import {BooleanTerm} from "./BooleanTerm.ts";

export class BooleanTermAnd implements BooleanTerm {

    termA: BooleanTerm;
    termB: BooleanTerm;

    constructor(termA: BooleanTerm, termB: BooleanTerm) {
        this.termA = termA;
        this.termB = termB;
    }

    evaluateBooleanTerm(context: Map<string, any>): boolean {
        return this.termA.evaluateBooleanTerm(context) && this.termB.evaluateBooleanTerm(context);
    }

}
