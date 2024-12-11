import {VariableTerm} from "./VariableTerm.ts";
import {StringTerm} from "./StringTerm.ts";

export class StringTermVar implements StringTerm {

    term:VariableTerm

    constructor(term: VariableTerm) {
        this.term = term;
    }

    evaluateStringTerm(context: Map<string, any>): string {
        if(!context.has(this.term.name)) {
            throw new Error("Variable '" + this.term.name + "' not found in context")
        }
        const root = context.get(this.term.name)
        const value = this.term.evaluate(root)
        return value as string
    }

}
