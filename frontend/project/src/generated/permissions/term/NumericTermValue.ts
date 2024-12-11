import {NumericTerm} from "./NumericTerm.ts";

export class NumericTermValue implements NumericTerm {

    value: number

    constructor(value: number) {
        this.value = value;
    }

    evaluateNumericTerm(context: Map<string, any>): number {
        return this.value;
    }

}
