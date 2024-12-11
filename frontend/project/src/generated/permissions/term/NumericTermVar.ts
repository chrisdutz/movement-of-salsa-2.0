import {VariableTerm} from "./VariableTerm.ts";
import {NumericTerm} from "./NumericTerm.ts";

export class NumericTermVar implements NumericTerm {

    term:VariableTerm

    constructor(term: VariableTerm) {
        this.term = term;
    }

    evaluateNumericTerm(context: Map<string, any>): number {
        if(!context.has(this.term.name)) {
            throw new Error("Variable '" + this.term.name + "' not found in context")
        }
        const root = context.get(this.term.name)
        const value = this.term.evaluate(root)
        return value as number
    }

}
