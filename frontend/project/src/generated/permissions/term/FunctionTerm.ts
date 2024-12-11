import {TermFunction} from "../function/TermFunction.ts";

export class FunctionTerm {

    functionTerm: TermFunction;
    args: any[];

    constructor(functionTerm: TermFunction, args:any[]) {
        this.functionTerm = functionTerm
        this.args = args
    }

}