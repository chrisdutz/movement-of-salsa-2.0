import {BooleanTerm} from "./BooleanTerm.ts";
import {VariableTerm} from "./VariableTerm.ts";

export class BooleanTermVar implements BooleanTerm {

    term:VariableTerm

    constructor(term: VariableTerm) {
        this.term = term;
    }

    evaluateBooleanTerm(context: Map<string, any>): boolean {
        if(!context.has(this.term.name)) {
            throw new Error("Variable '" + this.term.name + "' not found in context")
        }
        const root = context.get(this.term.name)
        const value = this.term.evaluate(root)
        return value as boolean
    }

    markerFunctionForBooleanTermVar(): boolean {
        return true
    }

}

export function isBooleanTermVar(object: any): object is BooleanTerm {
    return 'markerFunctionForBooleanTermVar' in object
}

