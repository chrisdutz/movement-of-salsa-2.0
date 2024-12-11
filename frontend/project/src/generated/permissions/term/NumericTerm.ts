export interface NumericTerm {
    evaluateNumericTerm(context: Map<string, any>): number
}

export function isNumericTerm(object: any): object is NumericTerm {
    return 'evaluateNumericTerm' in object
}
