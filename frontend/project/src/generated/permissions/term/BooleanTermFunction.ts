import {BooleanTerm} from "./BooleanTerm.ts";
import {FunctionTerm} from "./FunctionTerm.ts";

export class BooleanTermFunction extends FunctionTerm implements BooleanTerm {

    evaluateBooleanTerm(context: Map<string, any>): boolean {
        return false;
    }

}
