import {StringTerm} from "./StringTerm.ts";

export class StringTermConcat implements StringTerm {

    termA: StringTerm;
    termB: StringTerm;

    constructor(termA: StringTerm, termB: StringTerm) {
        this.termA = termA;
        this.termB = termB;
    }

    evaluateStringTerm(context: Map<string, any>): string {
        return this.termA.evaluateStringTerm(context) + this.termB.evaluateStringTerm(context);
    }

}
