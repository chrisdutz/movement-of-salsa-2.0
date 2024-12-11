export interface StringTerm {
    evaluateStringTerm(context: Map<string, any>): string
}

export function isStringTerm(object: any): object is StringTerm {
    return 'evaluateStringTerm' in object
}
