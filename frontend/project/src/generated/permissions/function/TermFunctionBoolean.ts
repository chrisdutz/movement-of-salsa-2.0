import {BooleanTerm} from "../term/BooleanTerm.ts";
import {TermFunction} from "./TermFunction.ts";

export interface TermFunctionBoolean extends TermFunction {
    createBooleanTerm(args: any[]):BooleanTerm
}

export function isTermFunctionBoolean(object: any): object is TermFunctionBoolean {
    return 'createBooleanTerm' in object
}
