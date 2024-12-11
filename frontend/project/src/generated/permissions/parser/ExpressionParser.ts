// Generated from src/generated/permissions/parser/Expression.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { ExpressionListener } from "./ExpressionListener";

export class ExpressionParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly T__15 = 16;
	public static readonly T__16 = 17;
	public static readonly T__17 = 18;
	public static readonly T__18 = 19;
	public static readonly T__19 = 20;
	public static readonly T__20 = 21;
	public static readonly T__21 = 22;
	public static readonly T__22 = 23;
	public static readonly T__23 = 24;
	public static readonly T__24 = 25;
	public static readonly T__25 = 26;
	public static readonly ID = 27;
	public static readonly INT = 28;
	public static readonly FLOAT = 29;
	public static readonly STRING = 30;
	public static readonly NEWLINE = 31;
	public static readonly WS = 32;
	public static readonly RULE_parseNumericExpr = 0;
	public static readonly RULE_parseBooleanExpr = 1;
	public static readonly RULE_parseStringExpr = 2;
	public static readonly RULE_expr = 3;
	public static readonly RULE_booleanExpr = 4;
	public static readonly RULE_numericExpr = 5;
	public static readonly RULE_stringExpr = 6;
	public static readonly RULE_comparisonExpr = 7;
	public static readonly RULE_variable = 8;
	public static readonly RULE_args = 9;
	public static readonly RULE_funcCall = 10;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"parseNumericExpr", "parseBooleanExpr", "parseStringExpr", "expr", "booleanExpr", 
		"numericExpr", "stringExpr", "comparisonExpr", "variable", "args", "funcCall",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'&&'", "'||'", "'!'", "'true'", "'false'", "'('", "')'", "'*'", 
		"'/'", "'+'", "'-'", "'%'", "'>>'", "'<<'", "'&'", "'|'", "'=='", "'!='", 
		"'<'", "'<='", "'>'", "'>='", "'['", "']'", "'.'", "','",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, "ID", 
		"INT", "FLOAT", "STRING", "NEWLINE", "WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(ExpressionParser._LITERAL_NAMES, ExpressionParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return ExpressionParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Expression.g4"; }

	// @Override
	public get ruleNames(): string[] { return ExpressionParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return ExpressionParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(ExpressionParser._ATN, this);
	}
	// @RuleVersion(0)
	public parseNumericExpr(): ParseNumericExprContext {
		let _localctx: ParseNumericExprContext = new ParseNumericExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, ExpressionParser.RULE_parseNumericExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 22;
			this.numericExpr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parseBooleanExpr(): ParseBooleanExprContext {
		let _localctx: ParseBooleanExprContext = new ParseBooleanExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, ExpressionParser.RULE_parseBooleanExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 24;
			this.booleanExpr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parseStringExpr(): ParseStringExprContext {
		let _localctx: ParseStringExprContext = new ParseStringExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, ExpressionParser.RULE_parseStringExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 26;
			this.stringExpr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expr(): ExprContext {
		let _localctx: ExprContext = new ExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, ExpressionParser.RULE_expr);
		try {
			this.state = 31;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 0, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 28;
				this.booleanExpr(0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 29;
				this.numericExpr(0);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 30;
				this.stringExpr(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public booleanExpr(): BooleanExprContext;
	public booleanExpr(_p: number): BooleanExprContext;
	// @RuleVersion(0)
	public booleanExpr(_p?: number): BooleanExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: BooleanExprContext = new BooleanExprContext(this._ctx, _parentState);
		let _prevctx: BooleanExprContext = _localctx;
		let _startState: number = 8;
		this.enterRecursionRule(_localctx, 8, ExpressionParser.RULE_booleanExpr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 45;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 1, this._ctx) ) {
			case 1:
				{
				_localctx = new BooleanNotContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 34;
				this.match(ExpressionParser.T__2);
				this.state = 35;
				this.booleanExpr(7);
				}
				break;

			case 2:
				{
				_localctx = new BooleanCompContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 36;
				this.comparisonExpr();
				}
				break;

			case 3:
				{
				_localctx = new BooleanFuncContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 37;
				this.funcCall();
				}
				break;

			case 4:
				{
				_localctx = new BooleanTrueValContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 38;
				this.match(ExpressionParser.T__3);
				}
				break;

			case 5:
				{
				_localctx = new BooleanFalseValContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 39;
				this.match(ExpressionParser.T__4);
				}
				break;

			case 6:
				{
				_localctx = new BooleanVarContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 40;
				this.variable();
				}
				break;

			case 7:
				{
				_localctx = new ParensBoolContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 41;
				this.match(ExpressionParser.T__5);
				this.state = 42;
				this.booleanExpr(0);
				this.state = 43;
				this.match(ExpressionParser.T__6);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 55;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 3, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 53;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 2, this._ctx) ) {
					case 1:
						{
						_localctx = new BooleanAndContext(new BooleanExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_booleanExpr);
						this.state = 47;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 48;
						this.match(ExpressionParser.T__0);
						this.state = 49;
						this.booleanExpr(10);
						}
						break;

					case 2:
						{
						_localctx = new BooleanOrContext(new BooleanExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_booleanExpr);
						this.state = 50;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 51;
						this.match(ExpressionParser.T__1);
						this.state = 52;
						this.booleanExpr(9);
						}
						break;
					}
					}
				}
				this.state = 57;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 3, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public numericExpr(): NumericExprContext;
	public numericExpr(_p: number): NumericExprContext;
	// @RuleVersion(0)
	public numericExpr(_p?: number): NumericExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: NumericExprContext = new NumericExprContext(this._ctx, _parentState);
		let _prevctx: NumericExprContext = _localctx;
		let _startState: number = 10;
		this.enterRecursionRule(_localctx, 10, ExpressionParser.RULE_numericExpr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 67;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 4, this._ctx) ) {
			case 1:
				{
				_localctx = new NumericFuncContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 59;
				this.funcCall();
				}
				break;

			case 2:
				{
				_localctx = new NumericValIntContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 60;
				this.match(ExpressionParser.INT);
				}
				break;

			case 3:
				{
				_localctx = new NumericValFloatContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 61;
				this.match(ExpressionParser.FLOAT);
				}
				break;

			case 4:
				{
				_localctx = new NumericVarContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 62;
				this.variable();
				}
				break;

			case 5:
				{
				_localctx = new ParensNumContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 63;
				this.match(ExpressionParser.T__5);
				this.state = 64;
				this.numericExpr(0);
				this.state = 65;
				this.match(ExpressionParser.T__6);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 98;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 6, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 96;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 5, this._ctx) ) {
					case 1:
						{
						_localctx = new NumericMulContext(new NumericExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_numericExpr);
						this.state = 69;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 70;
						this.match(ExpressionParser.T__7);
						this.state = 71;
						this.numericExpr(15);
						}
						break;

					case 2:
						{
						_localctx = new NumericDivContext(new NumericExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_numericExpr);
						this.state = 72;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 73;
						this.match(ExpressionParser.T__8);
						this.state = 74;
						this.numericExpr(14);
						}
						break;

					case 3:
						{
						_localctx = new NumericAddContext(new NumericExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_numericExpr);
						this.state = 75;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 76;
						this.match(ExpressionParser.T__9);
						this.state = 77;
						this.numericExpr(13);
						}
						break;

					case 4:
						{
						_localctx = new NumericSubContext(new NumericExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_numericExpr);
						this.state = 78;
						if (!(this.precpred(this._ctx, 11))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 11)");
						}
						this.state = 79;
						this.match(ExpressionParser.T__10);
						this.state = 80;
						this.numericExpr(12);
						}
						break;

					case 5:
						{
						_localctx = new NumericModContext(new NumericExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_numericExpr);
						this.state = 81;
						if (!(this.precpred(this._ctx, 10))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
						}
						this.state = 82;
						this.match(ExpressionParser.T__11);
						this.state = 83;
						this.numericExpr(11);
						}
						break;

					case 6:
						{
						_localctx = new NumericBitShiftRightContext(new NumericExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_numericExpr);
						this.state = 84;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 85;
						this.match(ExpressionParser.T__12);
						this.state = 86;
						this.numericExpr(10);
						}
						break;

					case 7:
						{
						_localctx = new NumericBitShiftLeftContext(new NumericExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_numericExpr);
						this.state = 87;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 88;
						this.match(ExpressionParser.T__13);
						this.state = 89;
						this.numericExpr(9);
						}
						break;

					case 8:
						{
						_localctx = new NumericBitAndContext(new NumericExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_numericExpr);
						this.state = 90;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 91;
						this.match(ExpressionParser.T__14);
						this.state = 92;
						this.numericExpr(8);
						}
						break;

					case 9:
						{
						_localctx = new NumericBitOrContext(new NumericExprContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_numericExpr);
						this.state = 93;
						if (!(this.precpred(this._ctx, 6))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
						}
						this.state = 94;
						this.match(ExpressionParser.T__15);
						this.state = 95;
						this.numericExpr(7);
						}
						break;
					}
					}
				}
				this.state = 100;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 6, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public stringExpr(): StringExprContext;
	public stringExpr(_p: number): StringExprContext;
	// @RuleVersion(0)
	public stringExpr(_p?: number): StringExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: StringExprContext = new StringExprContext(this._ctx, _parentState);
		let _prevctx: StringExprContext = _localctx;
		let _startState: number = 12;
		this.enterRecursionRule(_localctx, 12, ExpressionParser.RULE_stringExpr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 109;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				{
				_localctx = new StringFuncContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 102;
				this.funcCall();
				}
				break;

			case 2:
				{
				_localctx = new StringValContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 103;
				this.match(ExpressionParser.STRING);
				}
				break;

			case 3:
				{
				_localctx = new StringVarContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 104;
				this.variable();
				}
				break;

			case 4:
				{
				_localctx = new ParensStringContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 105;
				this.match(ExpressionParser.T__5);
				this.state = 106;
				this.stringExpr(0);
				this.state = 107;
				this.match(ExpressionParser.T__6);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 116;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					{
					_localctx = new StringConcatContext(new StringExprContext(_parentctx, _parentState));
					this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_stringExpr);
					this.state = 111;
					if (!(this.precpred(this._ctx, 5))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
					}
					this.state = 112;
					this.match(ExpressionParser.T__9);
					this.state = 113;
					this.stringExpr(6);
					}
					}
				}
				this.state = 118;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public comparisonExpr(): ComparisonExprContext {
		let _localctx: ComparisonExprContext = new ComparisonExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, ExpressionParser.RULE_comparisonExpr);
		try {
			this.state = 143;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 9, this._ctx) ) {
			case 1:
				_localctx = new ComparisonEqContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 119;
				this.numericExpr(0);
				this.state = 120;
				this.match(ExpressionParser.T__16);
				this.state = 121;
				this.numericExpr(0);
				}
				break;

			case 2:
				_localctx = new ComparisonNeqContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 123;
				this.numericExpr(0);
				this.state = 124;
				this.match(ExpressionParser.T__17);
				this.state = 125;
				this.numericExpr(0);
				}
				break;

			case 3:
				_localctx = new ComparisonLtContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 127;
				this.numericExpr(0);
				this.state = 128;
				this.match(ExpressionParser.T__18);
				this.state = 129;
				this.numericExpr(0);
				}
				break;

			case 4:
				_localctx = new ComparisonLeqContext(_localctx);
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 131;
				this.numericExpr(0);
				this.state = 132;
				this.match(ExpressionParser.T__19);
				this.state = 133;
				this.numericExpr(0);
				}
				break;

			case 5:
				_localctx = new ComparisonGtContext(_localctx);
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 135;
				this.numericExpr(0);
				this.state = 136;
				this.match(ExpressionParser.T__20);
				this.state = 137;
				this.numericExpr(0);
				}
				break;

			case 6:
				_localctx = new ComparisonGeqContext(_localctx);
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 139;
				this.numericExpr(0);
				this.state = 140;
				this.match(ExpressionParser.T__21);
				this.state = 141;
				this.numericExpr(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public variable(): VariableContext {
		let _localctx: VariableContext = new VariableContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, ExpressionParser.RULE_variable);
		try {
			let _alt: number;
			_localctx = new VariableExprContext(_localctx);
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 145;
			this.match(ExpressionParser.ID);
			this.state = 154;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 11, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 146;
					this.match(ExpressionParser.T__22);
					this.state = 149;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case ExpressionParser.INT:
						{
						this.state = 147;
						(_localctx as VariableExprContext)._index = this.match(ExpressionParser.INT);
						}
						break;
					case ExpressionParser.STRING:
						{
						this.state = 148;
						(_localctx as VariableExprContext)._key = this.match(ExpressionParser.STRING);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 151;
					this.match(ExpressionParser.T__23);
					}
					}
				}
				this.state = 156;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 11, this._ctx);
			}
			this.state = 161;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 157;
					this.match(ExpressionParser.T__24);
					this.state = 158;
					this.variable();
					}
					}
				}
				this.state = 163;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public args(): ArgsContext {
		let _localctx: ArgsContext = new ArgsContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, ExpressionParser.RULE_args);
		let _la: number;
		try {
			this.state = 173;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case ExpressionParser.T__2:
			case ExpressionParser.T__3:
			case ExpressionParser.T__4:
			case ExpressionParser.T__5:
			case ExpressionParser.ID:
			case ExpressionParser.INT:
			case ExpressionParser.FLOAT:
			case ExpressionParser.STRING:
				_localctx = new ArgListContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 164;
				this.expr();
				this.state = 169;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === ExpressionParser.T__25) {
					{
					{
					this.state = 165;
					this.match(ExpressionParser.T__25);
					this.state = 166;
					this.expr();
					}
					}
					this.state = 171;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case ExpressionParser.T__6:
				_localctx = new NoArgsContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public funcCall(): FuncCallContext {
		let _localctx: FuncCallContext = new FuncCallContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, ExpressionParser.RULE_funcCall);
		try {
			_localctx = new FunctionCallContext(_localctx);
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 175;
			this.match(ExpressionParser.ID);
			this.state = 176;
			this.match(ExpressionParser.T__5);
			this.state = 177;
			this.args();
			this.state = 178;
			this.match(ExpressionParser.T__6);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 4:
			return this.booleanExpr_sempred(_localctx as BooleanExprContext, predIndex);

		case 5:
			return this.numericExpr_sempred(_localctx as NumericExprContext, predIndex);

		case 6:
			return this.stringExpr_sempred(_localctx as StringExprContext, predIndex);
		}
		return true;
	}
	private booleanExpr_sempred(_localctx: BooleanExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 9);

		case 1:
			return this.precpred(this._ctx, 8);
		}
		return true;
	}
	private numericExpr_sempred(_localctx: NumericExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 2:
			return this.precpred(this._ctx, 14);

		case 3:
			return this.precpred(this._ctx, 13);

		case 4:
			return this.precpred(this._ctx, 12);

		case 5:
			return this.precpred(this._ctx, 11);

		case 6:
			return this.precpred(this._ctx, 10);

		case 7:
			return this.precpred(this._ctx, 9);

		case 8:
			return this.precpred(this._ctx, 8);

		case 9:
			return this.precpred(this._ctx, 7);

		case 10:
			return this.precpred(this._ctx, 6);
		}
		return true;
	}
	private stringExpr_sempred(_localctx: StringExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 11:
			return this.precpred(this._ctx, 5);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\"\xB7\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x03\x02\x03\x02" +
		"\x03\x03\x03\x03\x03\x04\x03\x04\x03\x05\x03\x05\x03\x05\x05\x05\"\n\x05" +
		"\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06" +
		"\x03\x06\x03\x06\x03\x06\x05\x060\n\x06\x03\x06\x03\x06\x03\x06\x03\x06" +
		"\x03\x06\x03\x06\x07\x068\n\x06\f\x06\x0E\x06;\v\x06\x03\x07\x03\x07\x03" +
		"\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x05\x07F\n\x07\x03" +
		"\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03" +
		"\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03" +
		"\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x07" +
		"\x07c\n\x07\f\x07\x0E\x07f\v\x07\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03" +
		"\b\x03\b\x05\bp\n\b\x03\b\x03\b\x03\b\x07\bu\n\b\f\b\x0E\bx\v\b\x03\t" +
		"\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03" +
		"\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x05" +
		"\t\x92\n\t\x03\n\x03\n\x03\n\x03\n\x05\n\x98\n\n\x03\n\x07\n\x9B\n\n\f" +
		"\n\x0E\n\x9E\v\n\x03\n\x03\n\x07\n\xA2\n\n\f\n\x0E\n\xA5\v\n\x03\v\x03" +
		"\v\x03\v\x07\v\xAA\n\v\f\v\x0E\v\xAD\v\v\x03\v\x05\v\xB0\n\v\x03\f\x03" +
		"\f\x03\f\x03\f\x03\f\x03\f\x02\x02\x05\n\f\x0E\r\x02\x02\x04\x02\x06\x02" +
		"\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x02\x02\x02" +
		"\xD0\x02\x18\x03\x02\x02\x02\x04\x1A\x03\x02\x02\x02\x06\x1C\x03\x02\x02" +
		"\x02\b!\x03\x02\x02\x02\n/\x03\x02\x02\x02\fE\x03\x02\x02\x02\x0Eo\x03" +
		"\x02\x02\x02\x10\x91\x03\x02\x02\x02\x12\x93\x03\x02\x02\x02\x14\xAF\x03" +
		"\x02\x02\x02\x16\xB1\x03\x02\x02\x02\x18\x19\x05\f\x07\x02\x19\x03\x03" +
		"\x02\x02\x02\x1A\x1B\x05\n\x06\x02\x1B\x05\x03\x02\x02\x02\x1C\x1D\x05" +
		"\x0E\b\x02\x1D\x07\x03\x02\x02\x02\x1E\"\x05\n\x06\x02\x1F\"\x05\f\x07" +
		"\x02 \"\x05\x0E\b\x02!\x1E\x03\x02\x02\x02!\x1F\x03\x02\x02\x02! \x03" +
		"\x02\x02\x02\"\t\x03\x02\x02\x02#$\b\x06\x01\x02$%\x07\x05\x02\x02%0\x05" +
		"\n\x06\t&0\x05\x10\t\x02\'0\x05\x16\f\x02(0\x07\x06\x02\x02)0\x07\x07" +
		"\x02\x02*0\x05\x12\n\x02+,\x07\b\x02\x02,-\x05\n\x06\x02-.\x07\t\x02\x02" +
		".0\x03\x02\x02\x02/#\x03\x02\x02\x02/&\x03\x02\x02\x02/\'\x03\x02\x02" +
		"\x02/(\x03\x02\x02\x02/)\x03\x02\x02\x02/*\x03\x02\x02\x02/+\x03\x02\x02" +
		"\x0209\x03\x02\x02\x0212\f\v\x02\x0223\x07\x03\x02\x0238\x05\n\x06\f4" +
		"5\f\n\x02\x0256\x07\x04\x02\x0268\x05\n\x06\v71\x03\x02\x02\x0274\x03" +
		"\x02\x02\x028;\x03\x02\x02\x0297\x03\x02\x02\x029:\x03\x02\x02\x02:\v" +
		"\x03\x02\x02\x02;9\x03\x02\x02\x02<=\b\x07\x01\x02=F\x05\x16\f\x02>F\x07" +
		"\x1E\x02\x02?F\x07\x1F\x02\x02@F\x05\x12\n\x02AB\x07\b\x02\x02BC\x05\f" +
		"\x07\x02CD\x07\t\x02\x02DF\x03\x02\x02\x02E<\x03\x02\x02\x02E>\x03\x02" +
		"\x02\x02E?\x03\x02\x02\x02E@\x03\x02\x02\x02EA\x03\x02\x02\x02Fd\x03\x02" +
		"\x02\x02GH\f\x10\x02\x02HI\x07\n\x02\x02Ic\x05\f\x07\x11JK\f\x0F\x02\x02" +
		"KL\x07\v\x02\x02Lc\x05\f\x07\x10MN\f\x0E\x02\x02NO\x07\f\x02\x02Oc\x05" +
		"\f\x07\x0FPQ\f\r\x02\x02QR\x07\r\x02\x02Rc\x05\f\x07\x0EST\f\f\x02\x02" +
		"TU\x07\x0E\x02\x02Uc\x05\f\x07\rVW\f\v\x02\x02WX\x07\x0F\x02\x02Xc\x05" +
		"\f\x07\fYZ\f\n\x02\x02Z[\x07\x10\x02\x02[c\x05\f\x07\v\\]\f\t\x02\x02" +
		"]^\x07\x11\x02\x02^c\x05\f\x07\n_`\f\b\x02\x02`a\x07\x12\x02\x02ac\x05" +
		"\f\x07\tbG\x03\x02\x02\x02bJ\x03\x02\x02\x02bM\x03\x02\x02\x02bP\x03\x02" +
		"\x02\x02bS\x03\x02\x02\x02bV\x03\x02\x02\x02bY\x03\x02\x02\x02b\\\x03" +
		"\x02\x02\x02b_\x03\x02\x02\x02cf\x03\x02\x02\x02db\x03\x02\x02\x02de\x03" +
		"\x02\x02\x02e\r\x03\x02\x02\x02fd\x03\x02\x02\x02gh\b\b\x01\x02hp\x05" +
		"\x16\f\x02ip\x07 \x02\x02jp\x05\x12\n\x02kl\x07\b\x02\x02lm\x05\x0E\b" +
		"\x02mn\x07\t\x02\x02np\x03\x02\x02\x02og\x03\x02\x02\x02oi\x03\x02\x02" +
		"\x02oj\x03\x02\x02\x02ok\x03\x02\x02\x02pv\x03\x02\x02\x02qr\f\x07\x02" +
		"\x02rs\x07\f\x02\x02su\x05\x0E\b\btq\x03\x02\x02\x02ux\x03\x02\x02\x02" +
		"vt\x03\x02\x02\x02vw\x03\x02\x02\x02w\x0F\x03\x02\x02\x02xv\x03\x02\x02" +
		"\x02yz\x05\f\x07\x02z{\x07\x13\x02\x02{|\x05\f\x07\x02|\x92\x03\x02\x02" +
		"\x02}~\x05\f\x07\x02~\x7F\x07\x14\x02\x02\x7F\x80\x05\f\x07\x02\x80\x92" +
		"\x03\x02\x02\x02\x81\x82\x05\f\x07\x02\x82\x83\x07\x15\x02\x02\x83\x84" +
		"\x05\f\x07\x02\x84\x92\x03\x02\x02\x02\x85\x86\x05\f\x07\x02\x86\x87\x07" +
		"\x16\x02\x02\x87\x88\x05\f\x07\x02\x88\x92\x03\x02\x02\x02\x89\x8A\x05" +
		"\f\x07\x02\x8A\x8B\x07\x17\x02\x02\x8B\x8C\x05\f\x07\x02\x8C\x92\x03\x02" +
		"\x02\x02\x8D\x8E\x05\f\x07\x02\x8E\x8F\x07\x18\x02\x02\x8F\x90\x05\f\x07" +
		"\x02\x90\x92\x03\x02\x02\x02\x91y\x03\x02\x02\x02\x91}\x03\x02\x02\x02" +
		"\x91\x81\x03\x02\x02\x02\x91\x85\x03\x02\x02\x02\x91\x89\x03\x02\x02\x02" +
		"\x91\x8D\x03\x02\x02\x02\x92\x11\x03\x02\x02\x02\x93\x9C\x07\x1D\x02\x02" +
		"\x94\x97\x07\x19\x02\x02\x95\x98\x07\x1E\x02\x02\x96\x98\x07 \x02\x02" +
		"\x97\x95\x03\x02\x02\x02\x97\x96\x03\x02\x02\x02\x98\x99\x03\x02\x02\x02" +
		"\x99\x9B\x07\x1A\x02\x02\x9A\x94\x03\x02\x02\x02\x9B\x9E\x03\x02\x02\x02" +
		"\x9C\x9A\x03\x02\x02\x02\x9C\x9D\x03\x02\x02\x02\x9D\xA3\x03\x02\x02\x02" +
		"\x9E\x9C\x03\x02\x02\x02\x9F\xA0\x07\x1B\x02\x02\xA0\xA2\x05\x12\n\x02" +
		"\xA1\x9F\x03\x02\x02\x02\xA2\xA5\x03\x02\x02\x02\xA3\xA1\x03\x02\x02\x02" +
		"\xA3\xA4\x03\x02\x02\x02\xA4\x13\x03\x02\x02\x02\xA5\xA3\x03\x02\x02\x02" +
		"\xA6\xAB\x05\b\x05\x02\xA7\xA8\x07\x1C\x02\x02\xA8\xAA\x05\b\x05\x02\xA9" +
		"\xA7\x03\x02\x02\x02\xAA\xAD\x03\x02\x02\x02\xAB\xA9\x03\x02\x02\x02\xAB" +
		"\xAC\x03\x02\x02\x02\xAC\xB0\x03\x02\x02\x02\xAD\xAB\x03\x02\x02\x02\xAE" +
		"\xB0\x03\x02\x02\x02\xAF\xA6\x03\x02\x02\x02\xAF\xAE\x03\x02\x02\x02\xB0" +
		"\x15\x03\x02\x02\x02\xB1\xB2\x07\x1D\x02\x02\xB2\xB3\x07\b\x02\x02\xB3" +
		"\xB4\x05\x14\v\x02\xB4\xB5\x07\t\x02\x02\xB5\x17\x03\x02\x02\x02\x11!" +
		"/79Ebdov\x91\x97\x9C\xA3\xAB\xAF";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!ExpressionParser.__ATN) {
			ExpressionParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(ExpressionParser._serializedATN));
		}

		return ExpressionParser.__ATN;
	}

}

export class ParseNumericExprContext extends ParserRuleContext {
	public numericExpr(): NumericExprContext {
		return this.getRuleContext(0, NumericExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_parseNumericExpr; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterParseNumericExpr) {
			listener.enterParseNumericExpr(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitParseNumericExpr) {
			listener.exitParseNumericExpr(this);
		}
	}
}


export class ParseBooleanExprContext extends ParserRuleContext {
	public booleanExpr(): BooleanExprContext {
		return this.getRuleContext(0, BooleanExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_parseBooleanExpr; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterParseBooleanExpr) {
			listener.enterParseBooleanExpr(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitParseBooleanExpr) {
			listener.exitParseBooleanExpr(this);
		}
	}
}


export class ParseStringExprContext extends ParserRuleContext {
	public stringExpr(): StringExprContext {
		return this.getRuleContext(0, StringExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_parseStringExpr; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterParseStringExpr) {
			listener.enterParseStringExpr(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitParseStringExpr) {
			listener.exitParseStringExpr(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	public booleanExpr(): BooleanExprContext | undefined {
		return this.tryGetRuleContext(0, BooleanExprContext);
	}
	public numericExpr(): NumericExprContext | undefined {
		return this.tryGetRuleContext(0, NumericExprContext);
	}
	public stringExpr(): StringExprContext | undefined {
		return this.tryGetRuleContext(0, StringExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_expr; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterExpr) {
			listener.enterExpr(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitExpr) {
			listener.exitExpr(this);
		}
	}
}


export class BooleanExprContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_booleanExpr; }
	public copyFrom(ctx: BooleanExprContext): void {
		super.copyFrom(ctx);
	}
}
export class BooleanAndContext extends BooleanExprContext {
	public booleanExpr(): BooleanExprContext[];
	public booleanExpr(i: number): BooleanExprContext;
	public booleanExpr(i?: number): BooleanExprContext | BooleanExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BooleanExprContext);
		} else {
			return this.getRuleContext(i, BooleanExprContext);
		}
	}
	constructor(ctx: BooleanExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterBooleanAnd) {
			listener.enterBooleanAnd(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitBooleanAnd) {
			listener.exitBooleanAnd(this);
		}
	}
}
export class BooleanOrContext extends BooleanExprContext {
	public booleanExpr(): BooleanExprContext[];
	public booleanExpr(i: number): BooleanExprContext;
	public booleanExpr(i?: number): BooleanExprContext | BooleanExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BooleanExprContext);
		} else {
			return this.getRuleContext(i, BooleanExprContext);
		}
	}
	constructor(ctx: BooleanExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterBooleanOr) {
			listener.enterBooleanOr(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitBooleanOr) {
			listener.exitBooleanOr(this);
		}
	}
}
export class BooleanNotContext extends BooleanExprContext {
	public booleanExpr(): BooleanExprContext {
		return this.getRuleContext(0, BooleanExprContext);
	}
	constructor(ctx: BooleanExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterBooleanNot) {
			listener.enterBooleanNot(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitBooleanNot) {
			listener.exitBooleanNot(this);
		}
	}
}
export class BooleanCompContext extends BooleanExprContext {
	public comparisonExpr(): ComparisonExprContext {
		return this.getRuleContext(0, ComparisonExprContext);
	}
	constructor(ctx: BooleanExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterBooleanComp) {
			listener.enterBooleanComp(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitBooleanComp) {
			listener.exitBooleanComp(this);
		}
	}
}
export class BooleanFuncContext extends BooleanExprContext {
	public funcCall(): FuncCallContext {
		return this.getRuleContext(0, FuncCallContext);
	}
	constructor(ctx: BooleanExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterBooleanFunc) {
			listener.enterBooleanFunc(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitBooleanFunc) {
			listener.exitBooleanFunc(this);
		}
	}
}
export class BooleanTrueValContext extends BooleanExprContext {
	constructor(ctx: BooleanExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterBooleanTrueVal) {
			listener.enterBooleanTrueVal(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitBooleanTrueVal) {
			listener.exitBooleanTrueVal(this);
		}
	}
}
export class BooleanFalseValContext extends BooleanExprContext {
	constructor(ctx: BooleanExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterBooleanFalseVal) {
			listener.enterBooleanFalseVal(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitBooleanFalseVal) {
			listener.exitBooleanFalseVal(this);
		}
	}
}
export class BooleanVarContext extends BooleanExprContext {
	public variable(): VariableContext {
		return this.getRuleContext(0, VariableContext);
	}
	constructor(ctx: BooleanExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterBooleanVar) {
			listener.enterBooleanVar(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitBooleanVar) {
			listener.exitBooleanVar(this);
		}
	}
}
export class ParensBoolContext extends BooleanExprContext {
	public booleanExpr(): BooleanExprContext {
		return this.getRuleContext(0, BooleanExprContext);
	}
	constructor(ctx: BooleanExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterParensBool) {
			listener.enterParensBool(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitParensBool) {
			listener.exitParensBool(this);
		}
	}
}


export class NumericExprContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_numericExpr; }
	public copyFrom(ctx: NumericExprContext): void {
		super.copyFrom(ctx);
	}
}
export class NumericMulContext extends NumericExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericMul) {
			listener.enterNumericMul(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericMul) {
			listener.exitNumericMul(this);
		}
	}
}
export class NumericDivContext extends NumericExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericDiv) {
			listener.enterNumericDiv(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericDiv) {
			listener.exitNumericDiv(this);
		}
	}
}
export class NumericAddContext extends NumericExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericAdd) {
			listener.enterNumericAdd(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericAdd) {
			listener.exitNumericAdd(this);
		}
	}
}
export class NumericSubContext extends NumericExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericSub) {
			listener.enterNumericSub(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericSub) {
			listener.exitNumericSub(this);
		}
	}
}
export class NumericModContext extends NumericExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericMod) {
			listener.enterNumericMod(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericMod) {
			listener.exitNumericMod(this);
		}
	}
}
export class NumericBitShiftRightContext extends NumericExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericBitShiftRight) {
			listener.enterNumericBitShiftRight(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericBitShiftRight) {
			listener.exitNumericBitShiftRight(this);
		}
	}
}
export class NumericBitShiftLeftContext extends NumericExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericBitShiftLeft) {
			listener.enterNumericBitShiftLeft(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericBitShiftLeft) {
			listener.exitNumericBitShiftLeft(this);
		}
	}
}
export class NumericBitAndContext extends NumericExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericBitAnd) {
			listener.enterNumericBitAnd(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericBitAnd) {
			listener.exitNumericBitAnd(this);
		}
	}
}
export class NumericBitOrContext extends NumericExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericBitOr) {
			listener.enterNumericBitOr(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericBitOr) {
			listener.exitNumericBitOr(this);
		}
	}
}
export class NumericFuncContext extends NumericExprContext {
	public funcCall(): FuncCallContext {
		return this.getRuleContext(0, FuncCallContext);
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericFunc) {
			listener.enterNumericFunc(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericFunc) {
			listener.exitNumericFunc(this);
		}
	}
}
export class NumericValIntContext extends NumericExprContext {
	public INT(): TerminalNode { return this.getToken(ExpressionParser.INT, 0); }
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericValInt) {
			listener.enterNumericValInt(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericValInt) {
			listener.exitNumericValInt(this);
		}
	}
}
export class NumericValFloatContext extends NumericExprContext {
	public FLOAT(): TerminalNode { return this.getToken(ExpressionParser.FLOAT, 0); }
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericValFloat) {
			listener.enterNumericValFloat(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericValFloat) {
			listener.exitNumericValFloat(this);
		}
	}
}
export class NumericVarContext extends NumericExprContext {
	public variable(): VariableContext {
		return this.getRuleContext(0, VariableContext);
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumericVar) {
			listener.enterNumericVar(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumericVar) {
			listener.exitNumericVar(this);
		}
	}
}
export class ParensNumContext extends NumericExprContext {
	public numericExpr(): NumericExprContext {
		return this.getRuleContext(0, NumericExprContext);
	}
	constructor(ctx: NumericExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterParensNum) {
			listener.enterParensNum(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitParensNum) {
			listener.exitParensNum(this);
		}
	}
}


export class StringExprContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_stringExpr; }
	public copyFrom(ctx: StringExprContext): void {
		super.copyFrom(ctx);
	}
}
export class StringConcatContext extends StringExprContext {
	public stringExpr(): StringExprContext[];
	public stringExpr(i: number): StringExprContext;
	public stringExpr(i?: number): StringExprContext | StringExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StringExprContext);
		} else {
			return this.getRuleContext(i, StringExprContext);
		}
	}
	constructor(ctx: StringExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterStringConcat) {
			listener.enterStringConcat(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitStringConcat) {
			listener.exitStringConcat(this);
		}
	}
}
export class StringFuncContext extends StringExprContext {
	public funcCall(): FuncCallContext {
		return this.getRuleContext(0, FuncCallContext);
	}
	constructor(ctx: StringExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterStringFunc) {
			listener.enterStringFunc(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitStringFunc) {
			listener.exitStringFunc(this);
		}
	}
}
export class StringValContext extends StringExprContext {
	public STRING(): TerminalNode { return this.getToken(ExpressionParser.STRING, 0); }
	constructor(ctx: StringExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterStringVal) {
			listener.enterStringVal(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitStringVal) {
			listener.exitStringVal(this);
		}
	}
}
export class StringVarContext extends StringExprContext {
	public variable(): VariableContext {
		return this.getRuleContext(0, VariableContext);
	}
	constructor(ctx: StringExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterStringVar) {
			listener.enterStringVar(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitStringVar) {
			listener.exitStringVar(this);
		}
	}
}
export class ParensStringContext extends StringExprContext {
	public stringExpr(): StringExprContext {
		return this.getRuleContext(0, StringExprContext);
	}
	constructor(ctx: StringExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterParensString) {
			listener.enterParensString(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitParensString) {
			listener.exitParensString(this);
		}
	}
}


export class ComparisonExprContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_comparisonExpr; }
	public copyFrom(ctx: ComparisonExprContext): void {
		super.copyFrom(ctx);
	}
}
export class ComparisonEqContext extends ComparisonExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: ComparisonExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterComparisonEq) {
			listener.enterComparisonEq(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitComparisonEq) {
			listener.exitComparisonEq(this);
		}
	}
}
export class ComparisonNeqContext extends ComparisonExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: ComparisonExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterComparisonNeq) {
			listener.enterComparisonNeq(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitComparisonNeq) {
			listener.exitComparisonNeq(this);
		}
	}
}
export class ComparisonLtContext extends ComparisonExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: ComparisonExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterComparisonLt) {
			listener.enterComparisonLt(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitComparisonLt) {
			listener.exitComparisonLt(this);
		}
	}
}
export class ComparisonLeqContext extends ComparisonExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: ComparisonExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterComparisonLeq) {
			listener.enterComparisonLeq(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitComparisonLeq) {
			listener.exitComparisonLeq(this);
		}
	}
}
export class ComparisonGtContext extends ComparisonExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: ComparisonExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterComparisonGt) {
			listener.enterComparisonGt(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitComparisonGt) {
			listener.exitComparisonGt(this);
		}
	}
}
export class ComparisonGeqContext extends ComparisonExprContext {
	public numericExpr(): NumericExprContext[];
	public numericExpr(i: number): NumericExprContext;
	public numericExpr(i?: number): NumericExprContext | NumericExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumericExprContext);
		} else {
			return this.getRuleContext(i, NumericExprContext);
		}
	}
	constructor(ctx: ComparisonExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterComparisonGeq) {
			listener.enterComparisonGeq(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitComparisonGeq) {
			listener.exitComparisonGeq(this);
		}
	}
}


export class VariableContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_variable; }
	public copyFrom(ctx: VariableContext): void {
		super.copyFrom(ctx);
	}
}
export class VariableExprContext extends VariableContext {
	public _index!: Token;
	public _key!: Token;
	public ID(): TerminalNode { return this.getToken(ExpressionParser.ID, 0); }
	public variable(): VariableContext[];
	public variable(i: number): VariableContext;
	public variable(i?: number): VariableContext | VariableContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableContext);
		} else {
			return this.getRuleContext(i, VariableContext);
		}
	}
	public INT(): TerminalNode[];
	public INT(i: number): TerminalNode;
	public INT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(ExpressionParser.INT);
		} else {
			return this.getToken(ExpressionParser.INT, i);
		}
	}
	public STRING(): TerminalNode[];
	public STRING(i: number): TerminalNode;
	public STRING(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(ExpressionParser.STRING);
		} else {
			return this.getToken(ExpressionParser.STRING, i);
		}
	}
	constructor(ctx: VariableContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterVariableExpr) {
			listener.enterVariableExpr(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitVariableExpr) {
			listener.exitVariableExpr(this);
		}
	}
}


export class ArgsContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_args; }
	public copyFrom(ctx: ArgsContext): void {
		super.copyFrom(ctx);
	}
}
export class ArgListContext extends ArgsContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(ctx: ArgsContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterArgList) {
			listener.enterArgList(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitArgList) {
			listener.exitArgList(this);
		}
	}
}
export class NoArgsContext extends ArgsContext {
	constructor(ctx: ArgsContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNoArgs) {
			listener.enterNoArgs(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNoArgs) {
			listener.exitNoArgs(this);
		}
	}
}


export class FuncCallContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_funcCall; }
	public copyFrom(ctx: FuncCallContext): void {
		super.copyFrom(ctx);
	}
}
export class FunctionCallContext extends FuncCallContext {
	public ID(): TerminalNode { return this.getToken(ExpressionParser.ID, 0); }
	public args(): ArgsContext {
		return this.getRuleContext(0, ArgsContext);
	}
	constructor(ctx: FuncCallContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterFunctionCall) {
			listener.enterFunctionCall(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitFunctionCall) {
			listener.exitFunctionCall(this);
		}
	}
}


