import {VariableTerm} from "./VariableTerm.ts";

export class VariableTermMap extends VariableTerm {
    key:string

    constructor(name: string, child: VariableTerm, key: string) {
        super(name, child);
        this.key = key;
    }

    evaluate(value: any):any {
        const mapValue = value as Map<string, any>
        const curVariableValue = mapValue.get(this.key);
        if(this.child) {
            return this.child.evaluate(this.child.getPropertyValue(curVariableValue))
        }
        return curVariableValue
    }

}