import {VariableTerm} from "./VariableTerm.ts";

export class VariableTermArray extends VariableTerm {
    index:number

    constructor(name: string, child: VariableTerm, index: number) {
        super(name, child)
        this.index = index
    }

    evaluate(value: any):any {
        const curVariableValue = value[this.index]
        if(this.child) {
            return this.child.evaluate(this.child.getPropertyValue(curVariableValue))
        }
        return curVariableValue
    }

}