/*-
 * #%L
 * ToddysoftConnect: Java: Tools: UI: Frontend
 * %%
 * Copyright (C) 2024 The Apache Software Foundation
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
import {ExpressionListener} from "./ExpressionListener";
import {Stack} from "../../../utils/stack/Stack";
import {BooleanTermAnd} from "../term/BooleanTermAnd";
import {BooleanTerm, isBooleanTerm} from "../term/BooleanTerm";
import {
    BooleanVarContext,
    FunctionCallContext,
    NumericValFloatContext,
    NumericValIntContext, NumericVarContext,
    StringValContext, StringVarContext, VariableExprContext,
} from "./ExpressionParser";
import {BooleanTermValue} from "../term/BooleanTermValue";
import {BooleanTermOr} from "../term/BooleanTermOr";
import {BooleanTermNot} from "../term/BooleanTermNot";
import {isStringTerm, StringTerm} from "../term/StringTerm";
import {StringTermValue} from "../term/StringTermValue";
import {StringTermConcat} from "../term/StringTermConcat";
import {isNumericTerm, NumericTerm} from "../term/NumericTerm";
import {NumericTermBitAnd} from "../term/NumericTermBitAnd";
import {NumericTermSub} from "../term/NumericTermSub";
import {NumericTermMul} from "../term/NumericTermMul";
import {NumericTermDiv} from "../term/NumericTermDiv";
import {NumericTermMod} from "../term/NumericTermMod";
import {NumericTermBitOr} from "../term/NumericTermBitOr";
import {NumericTermBitShiftLeft} from "../term/NumericTermBitShiftLeft";
import {NumericTermBitShiftRight} from "../term/NumericTermBitShiftRight";
import {NumericTermValue} from "../term/NumericTermValue";
import {NumericTermAdd} from "../term/NumericTermAdd";
import {ComparisonTermEq} from "../term/ComparisonTermEq";
import {ComparisonTermNeq} from "../term/ComparisonTermNeq";
import {ComparisonTermGt} from "../term/ComparisonTermGt";
import {ComparisonTermGeq} from "../term/ComparisonTermGeq";
import {ComparisonTermLt} from "../term/ComparisonTermLt";
import {ComparisonTermLeq} from "../term/ComparisonTermLeq";
import {TermFunction} from "../function/TermFunction";
import {TermType} from "../term/TermType";
import {isTermFunctionBoolean, TermFunctionBoolean} from "../function/TermFunctionBoolean";
import {isTermFunctionNumeric, TermFunctionNumeric} from "../function/TermFunctionNumeric";
import {isTermFunctionString, TermFunctionString} from "../function/TermFunctionString";
import {VariableTermArray} from "../term/VariableTermArray";
import {VariableTerm} from "../term/VariableTerm";
import {VariableTermMap} from "../term/VariableTermMap";
import {BooleanTermVar, isBooleanTermVar} from "../term/BooleanTermVar";
import {NumericTermVar} from "../term/NumericTermVar";
import {StringTermVar} from "../term/StringTermVar";

export class PermissionTermListener implements ExpressionListener {

    functions:Map<string, TermFunction>
    parserContexts:Stack<any[]>

    constructor(functions: Map<string, TermFunction>) {
        this.functions = functions;
        this.parserContexts = new Stack<any[]>()
        this.parserContexts.push([])
    }

    public getRootTerm(): any {
        const root = this.parserContexts?.peek();
        if(root && (root.length > 0)) {
            return root[0]
        }
        return undefined
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Boolean Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    enterBooleanAnd(): void {
        this.parserContexts.push([])
    }

    exitBooleanAnd(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isBooleanTerm(args[0]))) {
            throw new Error("The first argument is expected to be a boolean term")
        }
        if(!args[1] || !(isBooleanTerm(args[1]))) {
            throw new Error("The second argument is expected to be a boolean term")
        }
        this.addBooleanTermToCurrentContext(
            new BooleanTermAnd(args[0] as BooleanTerm, args[1] as BooleanTerm))
    }

    enterBooleanOr(): void {
        this.parserContexts.push([])
    }

    exitBooleanOr(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isBooleanTerm(args[0]))) {
            throw new Error("The first argument is expected to be a boolean term")
        }
        if(!args[1] || !(isBooleanTerm(args[1]))) {
            throw new Error("The second argument is expected to be a boolean term")
        }
        this.addBooleanTermToCurrentContext(
            new BooleanTermOr(args[0] as BooleanTerm, args[1] as BooleanTerm))
    }

    enterBooleanNot(): void {
        this.parserContexts.push([])
    }

    exitBooleanNot(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 1)) {
            throw new Error("Expecting 1 argument")
        }
        if(!args[0] || !(isBooleanTerm(args[0]))) {
            throw new Error("The argument is expected to be a boolean term")
        }
        this.addBooleanTermToCurrentContext(
            new BooleanTermNot(args[0] as BooleanTerm))
    }

    enterBooleanFunc(): void {
        this.parserContexts.push([])
    }

    exitBooleanFunc(): void {
        let parent = this.parserContexts.pop();
        if(!parent || parent.length == 0) {
            throw new Error("Missing args")
        }
        const func = parent[0] as TermFunction;
        if(!isTermFunctionBoolean(func)) {
            throw new Error("Expecting a boolean term function")
        }
        const booleanFunc = func as TermFunctionBoolean
        const args = parent.slice(1)
        this.addBooleanTermToCurrentContext(booleanFunc.createBooleanTerm(args))
    }

    exitBooleanTrueVal(): void {
        this.addBooleanTermToCurrentContext(new BooleanTermValue(true))
    }

    exitBooleanFalseVal(): void {
        this.addBooleanTermToCurrentContext(new BooleanTermValue(false))
    }

    enterBooleanVar(ctx: BooleanVarContext): void {
        this.parserContexts.push([])
    }

    exitBooleanVar(ctx: BooleanVarContext): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 1)) {
            throw new Error("Expected one argument")
        }
        const arg = args[0];
        if(!(arg instanceof VariableTerm)) {
            throw new Error("Expected a VariableTerm")
        }
        this.addBooleanTermToCurrentContext(new BooleanTermVar(arg))
    }

    private addBooleanTermToCurrentContext(tern: BooleanTerm): void {
        const context = this.parserContexts.peek();
        if(!context) {
            throw new Error("No Context available")
        }
        context.push(tern)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Numeric Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    enterNumericAdd(): void {
        this.parserContexts.push([])
    }

    exitNumericAdd(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addNumericTermToCurrentContext(
            new NumericTermAdd(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterNumericSub(): void {
        this.parserContexts.push([])
    }

    exitNumericSub(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addNumericTermToCurrentContext(
            new NumericTermSub(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterNumericMul(): void {
        this.parserContexts.push([])
    }

    exitNumericMul(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addNumericTermToCurrentContext(
            new NumericTermMul(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterNumericDiv(): void {
        this.parserContexts.push([])
    }

    exitNumericDiv(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addNumericTermToCurrentContext(
            new NumericTermDiv(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterNumericMod(): void {
        this.parserContexts.push([])
    }

    exitNumericMod(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addNumericTermToCurrentContext(
            new NumericTermMod(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterNumericBitAnd(): void {
        this.parserContexts.push([])
    }

    exitNumericBitAnd(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addNumericTermToCurrentContext(
            new NumericTermBitAnd(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterNumericBitOr(): void {
        this.parserContexts.push([])
    }

    exitNumericBitOr(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addNumericTermToCurrentContext(
            new NumericTermBitOr(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterNumericBitShiftLeft(): void {
        this.parserContexts.push([])
    }

    exitNumericBitShiftLeft(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addNumericTermToCurrentContext(
            new NumericTermBitShiftLeft(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterNumericBitShiftRight(): void {
        this.parserContexts.push([])
    }

    exitNumericBitShiftRight(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addNumericTermToCurrentContext(
            new NumericTermBitShiftRight(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterNumericFunc(): void {
        this.parserContexts.push([])
    }

    exitNumericFunc(): void {
        let parent = this.parserContexts.pop();
        if(!parent || parent.length == 0) {
            throw new Error("Missing args")
        }
        const func = parent[0] as TermFunction;
        if(!isTermFunctionNumeric(func)) {
            throw new Error("Expecting a numeric term function")
        }
        const numericFunc = func as TermFunctionNumeric
        const args = parent.slice(1)
        this.addNumericTermToCurrentContext(numericFunc.createNumericTerm(args))
    }

    exitNumericValInt(ctx: NumericValIntContext): void {
        let str = ctx.INT().toString();
        this.addNumericTermToCurrentContext(new NumericTermValue(parseInt(str)))
    }

    exitNumericValFloat(ctx: NumericValFloatContext): void {
        let str = ctx.FLOAT().toString();
        this.addNumericTermToCurrentContext(new NumericTermValue(parseFloat(str)))
    }

    enterNumericVar(ctx: NumericVarContext): void {
        this.parserContexts.push([])
    }

    exitNumericVar(ctx: NumericVarContext): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 1)) {
            throw new Error("Expected one argument")
        }
        const arg = args[0];
        if(!(arg instanceof VariableTerm)) {
            throw new Error("Expected a VariableTerm")
        }
        this.addNumericTermToCurrentContext(new NumericTermVar(arg))
    }

    private addNumericTermToCurrentContext(tern: NumericTerm): void {
        const context = this.parserContexts.peek();
        if(!context) {
            throw new Error("No Context available")
        }
        context.push(tern)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // String Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    enterStringConcat(): void {
        this.parserContexts.push([])
    }

    exitStringConcat(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isStringTerm(args[0]))) {
            throw new Error("The first argument is expected to be a boolean term")
        }
        if(!args[1] || !(isStringTerm(args[1]))) {
            throw new Error("The second argument is expected to be a boolean term")
        }
        this.addStringTermToCurrentContext(
            new StringTermConcat(args[0] as StringTerm, args[1] as StringTerm))
    }

    enterStringFunc(): void {
        this.parserContexts.push([])
    }

    exitStringFunc(): void {
        let parent = this.parserContexts.pop();
        if(!parent || parent.length == 0) {
            throw new Error("Missing args")
        }
        const func = parent[0] as TermFunction;
        if(!isTermFunctionString(func)) {
            throw new Error("Expecting a string term function")
        }
        const stringFunc = func as TermFunctionString
        const args = parent.slice(1)
        this.addStringTermToCurrentContext(stringFunc.createStringTerm(args))
    }

    exitStringVal(ctx: StringValContext): void {
        let str = ctx.STRING().toString();
        if(str && str.length > 1) {
            str = str.substring(1, str.length -1)
        }
        this.addStringTermToCurrentContext(new StringTermValue(str))
    }

    enterStringVar(ctx: StringVarContext): void {
        this.parserContexts.push([])
    }

    exitStringVar(ctx: StringVarContext): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 1)) {
            throw new Error("Expected one argument")
        }
        const arg = args[0];
        if(!(arg instanceof VariableTerm)) {
            throw new Error("Expected a VariableTerm")
        }
        this.addStringTermToCurrentContext(new StringTermVar(arg))
    }

    private addStringTermToCurrentContext(tern: StringTerm): void {
        const context = this.parserContexts.peek();
        if(!context) {
            throw new Error("No Context available")
        }
        context.push(tern)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Comparison Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    enterComparisonEq(): void {
        this.parserContexts.push([])
    }

    exitComparisonEq(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addBooleanTermToCurrentContext(
            new ComparisonTermEq(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterComparisonNeq(): void {
        this.parserContexts.push([])
    }

    exitComparisonNeq(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addBooleanTermToCurrentContext(
            new ComparisonTermNeq(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterComparisonGt(): void {
        this.parserContexts.push([])
    }

    exitComparisonGt(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addBooleanTermToCurrentContext(
            new ComparisonTermGt(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterComparisonGeq(): void {
        this.parserContexts.push([])
    }

    exitComparisonGeq(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addBooleanTermToCurrentContext(
            new ComparisonTermGeq(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterComparisonLt(): void {
        this.parserContexts.push([])
    }

    exitComparisonLt(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a numeric term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a numeric term")
        }
        this.addBooleanTermToCurrentContext(
            new ComparisonTermLt(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterComparisonLeq(): void {
        this.parserContexts.push([])
    }

    exitComparisonLeq(): void {
        let args = this.parserContexts.pop();
        if(!args || (args.length != 2)) {
            throw new Error("Expecting 2 arguments")
        }
        if(!args[0] || !(isNumericTerm(args[0]))) {
            throw new Error("The first argument is expected to be a boolean term")
        }
        if(!args[1] || !(isNumericTerm(args[1]))) {
            throw new Error("The second argument is expected to be a boolean term")
        }
        this.addBooleanTermToCurrentContext(
            new ComparisonTermLeq(args[0] as NumericTerm, args[1] as NumericTerm))
    }

    enterFunctionCall(): void {
        this.parserContexts.push([])
    }

    exitFunctionCall(ctx: FunctionCallContext): void {
        const functionName = ctx.ID().toString();
        const func = this.functions.get(functionName);
        if(func == undefined) {
            throw new Error("Unknown function " + functionName)
        }
        const argTypes = func.getArgTypes();
        const args = this.parserContexts.pop();

        // Check the number of arguments
        if(!args || args.length != argTypes.length) {
            throw new Error("Expected " + argTypes.length + " arguments for function " + functionName)
        }

        // Check the types of arguments
        for(let i = 0; i < argTypes.length; i++) {
            // All variable terms are parsed as boolean terms in this case.
            // If we're not expecting a boolean argument, we need to re-package the term inside.
            if(isBooleanTermVar(args[i])) {
                const booleanTermVar = args[i] as BooleanTermVar
                switch (argTypes[i]) {
                    case TermType.BOOLEAN:
                        break
                    case TermType.NUMERIC:
                        args[i] = new NumericTermVar(booleanTermVar.term)
                        break
                    case TermType.STRING:
                        args[i] = new StringTermVar(booleanTermVar.term)
                        break
                }
            }
        }

        // Push the args to the current context
        const context = this.parserContexts.peek();
        if(!context) {
            throw new Error("No Context available")
        }
        context.push(func)
        context.push(...args)
    }

    enterVariableExpr(ctx: VariableExprContext): void {
        this.parserContexts.push([])
    }

    exitVariableExpr(ctx: VariableExprContext): void {
        const childVariableTerm = this.parserContexts.pop();
        var child = null;
        if(childVariableTerm?.length == 1) {
            child = childVariableTerm[0]
        }
        const variableName = ctx.ID().text
        var variableTerm
        if(ctx.INT().length == 1) {
            variableTerm = new VariableTermArray(variableName, child, Number(ctx.INT().toString()))
        } else if(ctx.STRING().length == 1) {
            variableTerm = new VariableTermMap(variableName, child, ctx.STRING().toString().substring(1, ctx.STRING().toString().length - 1))
        } else {
            variableTerm = new VariableTerm(variableName, child)
        }

        const context = this.parserContexts.peek();
        if(!context) {
            throw new Error("No Context available")
        }
        context.push(variableTerm)
    }

    // This seems to be needed in order for TS to recognize it as ParseTree
    visitTerminal(): void {
    }

}
