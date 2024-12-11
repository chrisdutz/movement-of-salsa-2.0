export interface BooleanTerm {
    evaluateBooleanTerm(context: Map<string, any>): boolean
}

export function isBooleanTerm(object: any): object is BooleanTerm {
    return 'evaluateBooleanTerm' in object
}
