import {StringTerm} from "./StringTerm.ts";

export class StringTermValue implements StringTerm {

    value: string

    constructor(value: string) {
        this.value = value;
    }

    evaluateStringTerm(context: Map<string, any>): string {
        return this.value;
    }

}
