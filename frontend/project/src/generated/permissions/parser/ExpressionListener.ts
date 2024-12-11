// Generated from src/generated/permissions/parser/Expression.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { StringConcatContext } from "./ExpressionParser";
import { StringFuncContext } from "./ExpressionParser";
import { StringValContext } from "./ExpressionParser";
import { StringVarContext } from "./ExpressionParser";
import { ParensStringContext } from "./ExpressionParser";
import { ArgListContext } from "./ExpressionParser";
import { NoArgsContext } from "./ExpressionParser";
import { NumericMulContext } from "./ExpressionParser";
import { NumericDivContext } from "./ExpressionParser";
import { NumericAddContext } from "./ExpressionParser";
import { NumericSubContext } from "./ExpressionParser";
import { NumericModContext } from "./ExpressionParser";
import { NumericBitShiftRightContext } from "./ExpressionParser";
import { NumericBitShiftLeftContext } from "./ExpressionParser";
import { NumericBitAndContext } from "./ExpressionParser";
import { NumericBitOrContext } from "./ExpressionParser";
import { NumericFuncContext } from "./ExpressionParser";
import { NumericValIntContext } from "./ExpressionParser";
import { NumericValFloatContext } from "./ExpressionParser";
import { NumericVarContext } from "./ExpressionParser";
import { ParensNumContext } from "./ExpressionParser";
import { BooleanAndContext } from "./ExpressionParser";
import { BooleanOrContext } from "./ExpressionParser";
import { BooleanNotContext } from "./ExpressionParser";
import { BooleanCompContext } from "./ExpressionParser";
import { BooleanFuncContext } from "./ExpressionParser";
import { BooleanTrueValContext } from "./ExpressionParser";
import { BooleanFalseValContext } from "./ExpressionParser";
import { BooleanVarContext } from "./ExpressionParser";
import { ParensBoolContext } from "./ExpressionParser";
import { VariableExprContext } from "./ExpressionParser";
import { ComparisonEqContext } from "./ExpressionParser";
import { ComparisonNeqContext } from "./ExpressionParser";
import { ComparisonLtContext } from "./ExpressionParser";
import { ComparisonLeqContext } from "./ExpressionParser";
import { ComparisonGtContext } from "./ExpressionParser";
import { ComparisonGeqContext } from "./ExpressionParser";
import { FunctionCallContext } from "./ExpressionParser";
import { ParseNumericExprContext } from "./ExpressionParser";
import { ParseBooleanExprContext } from "./ExpressionParser";
import { ParseStringExprContext } from "./ExpressionParser";
import { ExprContext } from "./ExpressionParser";
import { BooleanExprContext } from "./ExpressionParser";
import { NumericExprContext } from "./ExpressionParser";
import { StringExprContext } from "./ExpressionParser";
import { ComparisonExprContext } from "./ExpressionParser";
import { VariableContext } from "./ExpressionParser";
import { ArgsContext } from "./ExpressionParser";
import { FuncCallContext } from "./ExpressionParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `ExpressionParser`.
 */
export interface ExpressionListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `StringConcat`
	 * labeled alternative in `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	enterStringConcat?: (ctx: StringConcatContext) => void;
	/**
	 * Exit a parse tree produced by the `StringConcat`
	 * labeled alternative in `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	exitStringConcat?: (ctx: StringConcatContext) => void;

	/**
	 * Enter a parse tree produced by the `StringFunc`
	 * labeled alternative in `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	enterStringFunc?: (ctx: StringFuncContext) => void;
	/**
	 * Exit a parse tree produced by the `StringFunc`
	 * labeled alternative in `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	exitStringFunc?: (ctx: StringFuncContext) => void;

	/**
	 * Enter a parse tree produced by the `StringVal`
	 * labeled alternative in `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	enterStringVal?: (ctx: StringValContext) => void;
	/**
	 * Exit a parse tree produced by the `StringVal`
	 * labeled alternative in `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	exitStringVal?: (ctx: StringValContext) => void;

	/**
	 * Enter a parse tree produced by the `StringVar`
	 * labeled alternative in `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	enterStringVar?: (ctx: StringVarContext) => void;
	/**
	 * Exit a parse tree produced by the `StringVar`
	 * labeled alternative in `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	exitStringVar?: (ctx: StringVarContext) => void;

	/**
	 * Enter a parse tree produced by the `ParensString`
	 * labeled alternative in `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	enterParensString?: (ctx: ParensStringContext) => void;
	/**
	 * Exit a parse tree produced by the `ParensString`
	 * labeled alternative in `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	exitParensString?: (ctx: ParensStringContext) => void;

	/**
	 * Enter a parse tree produced by the `ArgList`
	 * labeled alternative in `ExpressionParser.args`.
	 * @param ctx the parse tree
	 */
	enterArgList?: (ctx: ArgListContext) => void;
	/**
	 * Exit a parse tree produced by the `ArgList`
	 * labeled alternative in `ExpressionParser.args`.
	 * @param ctx the parse tree
	 */
	exitArgList?: (ctx: ArgListContext) => void;

	/**
	 * Enter a parse tree produced by the `NoArgs`
	 * labeled alternative in `ExpressionParser.args`.
	 * @param ctx the parse tree
	 */
	enterNoArgs?: (ctx: NoArgsContext) => void;
	/**
	 * Exit a parse tree produced by the `NoArgs`
	 * labeled alternative in `ExpressionParser.args`.
	 * @param ctx the parse tree
	 */
	exitNoArgs?: (ctx: NoArgsContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericMul`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericMul?: (ctx: NumericMulContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericMul`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericMul?: (ctx: NumericMulContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericDiv`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericDiv?: (ctx: NumericDivContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericDiv`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericDiv?: (ctx: NumericDivContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericAdd`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericAdd?: (ctx: NumericAddContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericAdd`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericAdd?: (ctx: NumericAddContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericSub`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericSub?: (ctx: NumericSubContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericSub`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericSub?: (ctx: NumericSubContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericMod`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericMod?: (ctx: NumericModContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericMod`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericMod?: (ctx: NumericModContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericBitShiftRight`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericBitShiftRight?: (ctx: NumericBitShiftRightContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericBitShiftRight`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericBitShiftRight?: (ctx: NumericBitShiftRightContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericBitShiftLeft`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericBitShiftLeft?: (ctx: NumericBitShiftLeftContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericBitShiftLeft`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericBitShiftLeft?: (ctx: NumericBitShiftLeftContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericBitAnd`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericBitAnd?: (ctx: NumericBitAndContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericBitAnd`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericBitAnd?: (ctx: NumericBitAndContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericBitOr`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericBitOr?: (ctx: NumericBitOrContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericBitOr`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericBitOr?: (ctx: NumericBitOrContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericFunc`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericFunc?: (ctx: NumericFuncContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericFunc`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericFunc?: (ctx: NumericFuncContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericValInt`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericValInt?: (ctx: NumericValIntContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericValInt`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericValInt?: (ctx: NumericValIntContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericValFloat`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericValFloat?: (ctx: NumericValFloatContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericValFloat`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericValFloat?: (ctx: NumericValFloatContext) => void;

	/**
	 * Enter a parse tree produced by the `NumericVar`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericVar?: (ctx: NumericVarContext) => void;
	/**
	 * Exit a parse tree produced by the `NumericVar`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericVar?: (ctx: NumericVarContext) => void;

	/**
	 * Enter a parse tree produced by the `ParensNum`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterParensNum?: (ctx: ParensNumContext) => void;
	/**
	 * Exit a parse tree produced by the `ParensNum`
	 * labeled alternative in `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitParensNum?: (ctx: ParensNumContext) => void;

	/**
	 * Enter a parse tree produced by the `BooleanAnd`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	enterBooleanAnd?: (ctx: BooleanAndContext) => void;
	/**
	 * Exit a parse tree produced by the `BooleanAnd`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	exitBooleanAnd?: (ctx: BooleanAndContext) => void;

	/**
	 * Enter a parse tree produced by the `BooleanOr`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	enterBooleanOr?: (ctx: BooleanOrContext) => void;
	/**
	 * Exit a parse tree produced by the `BooleanOr`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	exitBooleanOr?: (ctx: BooleanOrContext) => void;

	/**
	 * Enter a parse tree produced by the `BooleanNot`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	enterBooleanNot?: (ctx: BooleanNotContext) => void;
	/**
	 * Exit a parse tree produced by the `BooleanNot`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	exitBooleanNot?: (ctx: BooleanNotContext) => void;

	/**
	 * Enter a parse tree produced by the `BooleanComp`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	enterBooleanComp?: (ctx: BooleanCompContext) => void;
	/**
	 * Exit a parse tree produced by the `BooleanComp`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	exitBooleanComp?: (ctx: BooleanCompContext) => void;

	/**
	 * Enter a parse tree produced by the `BooleanFunc`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	enterBooleanFunc?: (ctx: BooleanFuncContext) => void;
	/**
	 * Exit a parse tree produced by the `BooleanFunc`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	exitBooleanFunc?: (ctx: BooleanFuncContext) => void;

	/**
	 * Enter a parse tree produced by the `BooleanTrueVal`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	enterBooleanTrueVal?: (ctx: BooleanTrueValContext) => void;
	/**
	 * Exit a parse tree produced by the `BooleanTrueVal`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	exitBooleanTrueVal?: (ctx: BooleanTrueValContext) => void;

	/**
	 * Enter a parse tree produced by the `BooleanFalseVal`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	enterBooleanFalseVal?: (ctx: BooleanFalseValContext) => void;
	/**
	 * Exit a parse tree produced by the `BooleanFalseVal`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	exitBooleanFalseVal?: (ctx: BooleanFalseValContext) => void;

	/**
	 * Enter a parse tree produced by the `BooleanVar`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	enterBooleanVar?: (ctx: BooleanVarContext) => void;
	/**
	 * Exit a parse tree produced by the `BooleanVar`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	exitBooleanVar?: (ctx: BooleanVarContext) => void;

	/**
	 * Enter a parse tree produced by the `ParensBool`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	enterParensBool?: (ctx: ParensBoolContext) => void;
	/**
	 * Exit a parse tree produced by the `ParensBool`
	 * labeled alternative in `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	exitParensBool?: (ctx: ParensBoolContext) => void;

	/**
	 * Enter a parse tree produced by the `VariableExpr`
	 * labeled alternative in `ExpressionParser.variable`.
	 * @param ctx the parse tree
	 */
	enterVariableExpr?: (ctx: VariableExprContext) => void;
	/**
	 * Exit a parse tree produced by the `VariableExpr`
	 * labeled alternative in `ExpressionParser.variable`.
	 * @param ctx the parse tree
	 */
	exitVariableExpr?: (ctx: VariableExprContext) => void;

	/**
	 * Enter a parse tree produced by the `ComparisonEq`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	enterComparisonEq?: (ctx: ComparisonEqContext) => void;
	/**
	 * Exit a parse tree produced by the `ComparisonEq`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	exitComparisonEq?: (ctx: ComparisonEqContext) => void;

	/**
	 * Enter a parse tree produced by the `ComparisonNeq`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	enterComparisonNeq?: (ctx: ComparisonNeqContext) => void;
	/**
	 * Exit a parse tree produced by the `ComparisonNeq`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	exitComparisonNeq?: (ctx: ComparisonNeqContext) => void;

	/**
	 * Enter a parse tree produced by the `ComparisonLt`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	enterComparisonLt?: (ctx: ComparisonLtContext) => void;
	/**
	 * Exit a parse tree produced by the `ComparisonLt`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	exitComparisonLt?: (ctx: ComparisonLtContext) => void;

	/**
	 * Enter a parse tree produced by the `ComparisonLeq`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	enterComparisonLeq?: (ctx: ComparisonLeqContext) => void;
	/**
	 * Exit a parse tree produced by the `ComparisonLeq`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	exitComparisonLeq?: (ctx: ComparisonLeqContext) => void;

	/**
	 * Enter a parse tree produced by the `ComparisonGt`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	enterComparisonGt?: (ctx: ComparisonGtContext) => void;
	/**
	 * Exit a parse tree produced by the `ComparisonGt`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	exitComparisonGt?: (ctx: ComparisonGtContext) => void;

	/**
	 * Enter a parse tree produced by the `ComparisonGeq`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	enterComparisonGeq?: (ctx: ComparisonGeqContext) => void;
	/**
	 * Exit a parse tree produced by the `ComparisonGeq`
	 * labeled alternative in `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	exitComparisonGeq?: (ctx: ComparisonGeqContext) => void;

	/**
	 * Enter a parse tree produced by the `FunctionCall`
	 * labeled alternative in `ExpressionParser.funcCall`.
	 * @param ctx the parse tree
	 */
	enterFunctionCall?: (ctx: FunctionCallContext) => void;
	/**
	 * Exit a parse tree produced by the `FunctionCall`
	 * labeled alternative in `ExpressionParser.funcCall`.
	 * @param ctx the parse tree
	 */
	exitFunctionCall?: (ctx: FunctionCallContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.parseNumericExpr`.
	 * @param ctx the parse tree
	 */
	enterParseNumericExpr?: (ctx: ParseNumericExprContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.parseNumericExpr`.
	 * @param ctx the parse tree
	 */
	exitParseNumericExpr?: (ctx: ParseNumericExprContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.parseBooleanExpr`.
	 * @param ctx the parse tree
	 */
	enterParseBooleanExpr?: (ctx: ParseBooleanExprContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.parseBooleanExpr`.
	 * @param ctx the parse tree
	 */
	exitParseBooleanExpr?: (ctx: ParseBooleanExprContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.parseStringExpr`.
	 * @param ctx the parse tree
	 */
	enterParseStringExpr?: (ctx: ParseStringExprContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.parseStringExpr`.
	 * @param ctx the parse tree
	 */
	exitParseStringExpr?: (ctx: ParseStringExprContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	enterBooleanExpr?: (ctx: BooleanExprContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.booleanExpr`.
	 * @param ctx the parse tree
	 */
	exitBooleanExpr?: (ctx: BooleanExprContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	enterNumericExpr?: (ctx: NumericExprContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.numericExpr`.
	 * @param ctx the parse tree
	 */
	exitNumericExpr?: (ctx: NumericExprContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	enterStringExpr?: (ctx: StringExprContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.stringExpr`.
	 * @param ctx the parse tree
	 */
	exitStringExpr?: (ctx: StringExprContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	enterComparisonExpr?: (ctx: ComparisonExprContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.comparisonExpr`.
	 * @param ctx the parse tree
	 */
	exitComparisonExpr?: (ctx: ComparisonExprContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.variable`.
	 * @param ctx the parse tree
	 */
	enterVariable?: (ctx: VariableContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.variable`.
	 * @param ctx the parse tree
	 */
	exitVariable?: (ctx: VariableContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.args`.
	 * @param ctx the parse tree
	 */
	enterArgs?: (ctx: ArgsContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.args`.
	 * @param ctx the parse tree
	 */
	exitArgs?: (ctx: ArgsContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.funcCall`.
	 * @param ctx the parse tree
	 */
	enterFuncCall?: (ctx: FuncCallContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.funcCall`.
	 * @param ctx the parse tree
	 */
	exitFuncCall?: (ctx: FuncCallContext) => void;
}

