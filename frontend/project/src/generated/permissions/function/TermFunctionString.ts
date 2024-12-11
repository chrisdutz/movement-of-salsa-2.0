import {StringTerm} from "../term/StringTerm.ts";
import {TermFunction} from "./TermFunction.ts";

export interface TermFunctionString extends TermFunction {
    createStringTerm(args: any[]):StringTerm
}

export function isTermFunctionString(object: any): object is TermFunctionString {
    return 'createStringTerm' in object
}
