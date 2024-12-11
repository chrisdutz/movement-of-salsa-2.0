function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName]; // o[propertyName] is of type T[K]
}

export class VariableTerm {
    name:string
    child:VariableTerm

    constructor(name: string, child: VariableTerm) {
        this.name = name;
        this.child = child;
    }

    public evaluate(value: any):any {
        if(this.child != null) {
            return this.child.evaluate(this.getPropertyValue(value))
        }
        return value;
    }

    public getPropertyValue(parent: any): any {
        if(this.name in parent) {
            return getProperty(parent, this.name)
        }
        throw new Error("Missing property with name " + this.name)
    }

}