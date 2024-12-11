import {BooleanTerm} from "./BooleanTerm.ts";

export class BooleanTermValue implements BooleanTerm {

    value: boolean

    constructor(value: boolean) {
        this.value = value;
    }

    evaluateBooleanTerm(context: Map<string, any>): boolean {
        return this.value;
    }

}
