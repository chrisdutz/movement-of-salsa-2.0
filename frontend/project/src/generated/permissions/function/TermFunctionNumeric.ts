import {NumericTerm} from "../term/NumericTerm.ts";
import {TermFunction} from "./TermFunction.ts";

export interface TermFunctionNumeric extends TermFunction {
    createNumericTerm(args: any[]):NumericTerm
}

export function isTermFunctionNumeric(object: any): object is TermFunctionNumeric {
    return 'createNumericTerm' in object
}
