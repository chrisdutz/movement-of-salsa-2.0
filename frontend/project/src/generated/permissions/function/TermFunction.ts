import {TermType} from "../term/TermType.ts";

export interface TermFunction {
    getName():string
    getDescription():string
    getArgTypes():TermType[]
}