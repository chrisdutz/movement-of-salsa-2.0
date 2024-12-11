
export class Counter {

    private _value:number = 0;

    public  getAndIncrement():number {
        return this._value++
    }

}
