import {BooleanTerm} from "./BooleanTerm.ts";

export class BooleanTermNot implements BooleanTerm {

    term: BooleanTerm;

    constructor(term: BooleanTerm) {
        this.term = term;
    }

    evaluateBooleanTerm(context: Map<string, any>): boolean {
        return !this.term.evaluateBooleanTerm(context);
    }

}
