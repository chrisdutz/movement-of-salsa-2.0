package com.toddysoft.ui.permissions.parser;

import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.api.Term;
import com.toddysoft.ui.permissions.parser.exceptions.ParserException;
import com.toddysoft.ui.permissions.parser.terms.BooleanTerm;
import com.toddysoft.ui.permissions.parser.terms.BooleanTermAnd;
import com.toddysoft.ui.permissions.parser.terms.BooleanTermNot;
import com.toddysoft.ui.permissions.parser.terms.BooleanTermOr;
import com.toddysoft.ui.permissions.parser.terms.BooleanTermValue;
import com.toddysoft.ui.permissions.parser.terms.BooleanTermVar;
import com.toddysoft.ui.permissions.parser.terms.ComparisonTermEq;
import com.toddysoft.ui.permissions.parser.terms.ComparisonTermGeq;
import com.toddysoft.ui.permissions.parser.terms.ComparisonTermGt;
import com.toddysoft.ui.permissions.parser.terms.ComparisonTermLeq;
import com.toddysoft.ui.permissions.parser.terms.ComparisonTermLt;
import com.toddysoft.ui.permissions.parser.terms.ComparisonTermNeq;
import com.toddysoft.ui.permissions.parser.terms.NumericTerm;
import com.toddysoft.ui.permissions.parser.terms.NumericTermAdd;
import com.toddysoft.ui.permissions.parser.terms.NumericTermBitAnd;
import com.toddysoft.ui.permissions.parser.terms.NumericTermBitOr;
import com.toddysoft.ui.permissions.parser.terms.NumericTermBitShiftLeft;
import com.toddysoft.ui.permissions.parser.terms.NumericTermBitShiftRight;
import com.toddysoft.ui.permissions.parser.terms.NumericTermDiv;
import com.toddysoft.ui.permissions.parser.terms.NumericTermMod;
import com.toddysoft.ui.permissions.parser.terms.NumericTermMul;
import com.toddysoft.ui.permissions.parser.terms.NumericTermSub;
import com.toddysoft.ui.permissions.parser.terms.NumericTermValue;
import com.toddysoft.ui.permissions.parser.terms.NumericTermVar;
import com.toddysoft.ui.permissions.parser.terms.StringTerm;
import com.toddysoft.ui.permissions.parser.terms.StringTermConcat;
import com.toddysoft.ui.permissions.parser.terms.StringTermValue;
import com.toddysoft.ui.permissions.parser.terms.StringTermVar;
import com.toddysoft.ui.permissions.parser.terms.VariableTerm;
import com.toddysoft.ui.permissions.parser.terms.VariableTermArray;
import com.toddysoft.ui.permissions.parser.terms.VariableTermMap;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Stack;

public class PermissionTermListener<T> extends ExpressionBaseListener {

    private final Map<String, TermFunction<?>> functions;
    private final Stack<List<Term<?>>> parserContexts;

    public PermissionTermListener(Map<String, TermFunction<?>> functions) {
        this.functions = functions;
        this.parserContexts = new Stack<>();
        this.parserContexts.push(new ArrayList<>());
    }

    public Term<T> getRootTerm() {
        return (Term<T>) parserContexts.firstElement().getFirst();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Boolean Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public void enterBooleanAnd(ExpressionParser.BooleanAndContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitBooleanAnd(ExpressionParser.BooleanAndContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoBooleanArguments(args);
        parserContexts.peek().add(new BooleanTermAnd((BooleanTerm) args.get(0), (BooleanTerm) args.get(1)));
    }

    @Override
    public void enterBooleanOr(ExpressionParser.BooleanOrContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitBooleanOr(ExpressionParser.BooleanOrContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoBooleanArguments(args);
        parserContexts.peek().add(new BooleanTermOr((BooleanTerm) args.get(0), (BooleanTerm) args.get(1)));
    }

    @Override
    public void enterBooleanNot(ExpressionParser.BooleanNotContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitBooleanNot(ExpressionParser.BooleanNotContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        if(args.size() != 1) {
            throw new ParserException("One arguments expected");
        }
        if(!(args.get(0) instanceof BooleanTerm)) {
            throw new ParserException("Argument 1 must be a BooleanTerm");
        }
        parserContexts.peek().add(new BooleanTermNot((BooleanTerm) args.get(0)));
    }

    @Override
    public void enterBooleanFunc(ExpressionParser.BooleanFuncContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitBooleanFunc(ExpressionParser.BooleanFuncContext ctx) {
        List<Term<?>> argTerms = parserContexts.pop();
        String functionName = ctx.getChild(0).getChild(0).getText();
        Term<?> functionTerm = createFunctionTerm(functionName, argTerms);
        parserContexts.peek().add(functionTerm);
    }

    @Override
    public void exitBooleanTrueVal(ExpressionParser.BooleanTrueValContext ctx) {
        parserContexts.peek().add(new BooleanTermValue(true));
    }

    @Override
    public void exitBooleanFalseVal(ExpressionParser.BooleanFalseValContext ctx) {
        parserContexts.peek().add(new BooleanTermValue(false));
    }

    @Override
    public void enterBooleanVar(ExpressionParser.BooleanVarContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitBooleanVar(ExpressionParser.BooleanVarContext ctx) {
        List<Term<?>> variableTerms = parserContexts.pop();
        confirmOneVariableArguments(variableTerms);
        VariableTerm variableTerm = ((VariableTerm.VariableTermHolder) variableTerms.get(0)).getTerm();
        parserContexts.peek().add(new BooleanTermVar(variableTerm));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Numeric Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public void enterNumericMul(ExpressionParser.NumericMulContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitNumericMul(ExpressionParser.NumericMulContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new NumericTermMul((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterNumericDiv(ExpressionParser.NumericDivContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitNumericDiv(ExpressionParser.NumericDivContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new NumericTermDiv((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterNumericAdd(ExpressionParser.NumericAddContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitNumericAdd(ExpressionParser.NumericAddContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new NumericTermAdd((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterNumericSub(ExpressionParser.NumericSubContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitNumericSub(ExpressionParser.NumericSubContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new NumericTermSub((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterNumericMod(ExpressionParser.NumericModContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitNumericMod(ExpressionParser.NumericModContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new NumericTermMod((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterNumericBitShiftRight(ExpressionParser.NumericBitShiftRightContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitNumericBitShiftRight(ExpressionParser.NumericBitShiftRightContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new NumericTermBitShiftRight((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterNumericBitShiftLeft(ExpressionParser.NumericBitShiftLeftContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitNumericBitShiftLeft(ExpressionParser.NumericBitShiftLeftContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new NumericTermBitShiftLeft((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterNumericBitAnd(ExpressionParser.NumericBitAndContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitNumericBitAnd(ExpressionParser.NumericBitAndContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new NumericTermBitAnd((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterNumericBitOr(ExpressionParser.NumericBitOrContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitNumericBitOr(ExpressionParser.NumericBitOrContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new NumericTermBitOr((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterNumericFunc(ExpressionParser.NumericFuncContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitNumericFunc(ExpressionParser.NumericFuncContext ctx) {
        List<Term<?>> argTerms = parserContexts.pop();
        String functionName = ctx.getChild(0).getChild(0).getText();
        Term<?> functionTerm = createFunctionTerm(functionName, argTerms);
        parserContexts.peek().add(functionTerm);
    }

    @Override
    public void exitNumericValInt(ExpressionParser.NumericValIntContext ctx) {
        parserContexts.peek().add(new NumericTermValue(Long.parseLong(ctx.INT().getText())));
    }

    @Override
    public void exitNumericValFloat(ExpressionParser.NumericValFloatContext ctx) {
        parserContexts.peek().add(new NumericTermValue(Double.parseDouble(ctx.FLOAT().getText())));
    }

    @Override
    public void enterNumericVar(ExpressionParser.NumericVarContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitNumericVar(ExpressionParser.NumericVarContext ctx) {
        List<Term<?>> variableTerms = parserContexts.pop();
        confirmOneVariableArguments(variableTerms);
        VariableTerm variableTerm = ((VariableTerm.VariableTermHolder) variableTerms.get(0)).getTerm();
        parserContexts.peek().add(new NumericTermVar(variableTerm));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // String Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public void enterStringConcat(ExpressionParser.StringConcatContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitStringConcat(ExpressionParser.StringConcatContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoStringArguments(args);
        parserContexts.peek().add(new StringTermConcat((StringTerm) args.get(0), (StringTerm) args.get(1)));
    }

    @Override
    public void enterStringFunc(ExpressionParser.StringFuncContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitStringFunc(ExpressionParser.StringFuncContext ctx) {
        List<Term<?>> argTerms = parserContexts.pop();
        String functionName = ctx.getChild(0).getChild(0).getText();
        Term<?> functionTerm = createFunctionTerm(functionName, argTerms);
        parserContexts.peek().add(functionTerm);
    }

    @Override
    public void enterStringVal(ExpressionParser.StringValContext ctx) {
        super.enterStringVal(ctx);
    }

    @Override
    public void exitStringVal(ExpressionParser.StringValContext ctx) {
        String text = ctx.STRING().getText();
        text = text.substring(1, text.length() - 1);
        parserContexts.peek().add(new StringTermValue(text));
    }

    @Override
    public void enterStringVar(ExpressionParser.StringVarContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitStringVar(ExpressionParser.StringVarContext ctx) {
        List<Term<?>> variableTerms = parserContexts.pop();
        confirmOneVariableArguments(variableTerms);
        VariableTerm variableTerm = ((VariableTerm.VariableTermHolder) variableTerms.get(0)).getTerm();
        parserContexts.peek().add(new StringTermVar(variableTerm));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Comparison Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public void enterComparisonEq(ExpressionParser.ComparisonEqContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitComparisonEq(ExpressionParser.ComparisonEqContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new ComparisonTermEq((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterComparisonNeq(ExpressionParser.ComparisonNeqContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitComparisonNeq(ExpressionParser.ComparisonNeqContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new ComparisonTermNeq((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterComparisonLt(ExpressionParser.ComparisonLtContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitComparisonLt(ExpressionParser.ComparisonLtContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new ComparisonTermLt((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterComparisonLeq(ExpressionParser.ComparisonLeqContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitComparisonLeq(ExpressionParser.ComparisonLeqContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new ComparisonTermLeq((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterComparisonGt(ExpressionParser.ComparisonGtContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitComparisonGt(ExpressionParser.ComparisonGtContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new ComparisonTermGt((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    @Override
    public void enterComparisonGeq(ExpressionParser.ComparisonGeqContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitComparisonGeq(ExpressionParser.ComparisonGeqContext ctx) {
        List<Term<?>> args = parserContexts.pop();
        confirmTwoNumericArguments(args);
        parserContexts.peek().add(new ComparisonTermGeq((NumericTerm) args.get(0), (NumericTerm) args.get(1)));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Utility Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected void confirmTwoBooleanArguments(List<Term<?>> args) {
        if(args.size() != 2) {
            throw new ParserException("Two arguments expected");
        }
        if(!(args.get(0) instanceof BooleanTerm)) {
            throw new ParserException("Argument 1 must be a BooleanTerm");
        }
        if(!(args.get(1) instanceof BooleanTerm)) {
            throw new ParserException("Argument 2 must be a BooleanTerm");
        }
    }

    protected void confirmTwoNumericArguments(List<Term<?>> args) {
        if(args.size() != 2) {
            throw new ParserException("Two arguments expected");
        }
        if(!(args.get(0) instanceof NumericTerm)) {
            throw new ParserException("Argument 1 must be a NumericTerm");
        }
        if(!(args.get(1) instanceof NumericTerm)) {
            throw new ParserException("Argument 2 must be a NumericTerm");
        }
    }

    protected void confirmTwoStringArguments(List<Term<?>> args) {
        if(args.size() != 2) {
            throw new ParserException("Two arguments expected");
        }
        if(!(args.get(0) instanceof StringTerm)) {
            throw new ParserException("Argument 1 must be a StringTerm");
        }
        if(!(args.get(1) instanceof StringTerm)) {
            throw new ParserException("Argument 2 must be a StringTerm");
        }
    }

    protected void confirmOneVariableArguments(List<Term<?>> args) {
        if(args.size() != 1) {
            throw new ParserException("Expected one term, but got " + args.size());
        }
        if(!(args.get(0) instanceof VariableTerm.VariableTermHolder)) {
            throw new ParserException("Expected one term of type variable term, but got one of " + args.get(0).getClass().getName());
        }
    }

    @Override
    public void enterVariableExpr(ExpressionParser.VariableExprContext ctx) {
        parserContexts.push(new ArrayList<>());
    }

    @Override
    public void exitVariableExpr(ExpressionParser.VariableExprContext ctx) {
        List<Term<?>> childVariableTerm = parserContexts.pop();
        VariableTerm child = null;
        if(childVariableTerm.size() == 1) {
            child = ((VariableTerm.VariableTermHolder) childVariableTerm.get(0)).getTerm();
        }
        String variableName = ctx.ID().getText();
        VariableTerm variableTerm;
        // This is an array, access index
        if(ctx.index != null) {
            variableTerm = new VariableTermArray(variableName, child, Integer.parseInt(ctx.index.getText()));
        }
        // This is a map, access by key
        else if(ctx.key != null) {
            variableTerm = new VariableTermMap(variableName, child, ctx.key.getText().substring(1, ctx.key.getText().length() - 1));
        }
        // This is an ordinary property
        else {
            variableTerm = new VariableTerm(variableName, child);
        }
        parserContexts.peek().add(new VariableTerm.VariableTermHolder(variableTerm));
    }

    protected Term<?> createFunctionTerm(String functionName, List<Term<?>> argTerms) {
        TermFunction<?> termFunction = functions.get(functionName);
        if(termFunction == null) {
            throw new ParserException("Unknown function: " + functionName);
        }
        // Check the number of arguments
        if(argTerms.size() < termFunction.getArgTypes().length) {
            throw new ParserException("Expected " + termFunction.getArgTypes().length + " arguments, but got " + argTerms.size());
        }
        Term<?>[] argTermArray = new Term[argTerms.size()];
        for(int i = 0; i < termFunction.getArgTypes().length; i++) {
            // All variable terms are parsed as boolean terms in this case.
            // If we're not expecting a boolean argument, we need to re-package the term inside.
            if(argTerms.get(i) instanceof BooleanTermVar) {
                BooleanTermVar booleanTermVar = (BooleanTermVar) argTerms.get(i);
                switch (termFunction.getArgTypes()[i]) {
                    case BOOLEAN:
                        argTermArray[i] = argTerms.get(i);
                        break;
                    case NUMERIC:
                        argTermArray[i] = new NumericTermVar(booleanTermVar.getVariableTerm());
                        break;
                    case STRING:
                        argTermArray[i] = new StringTermVar(booleanTermVar.getVariableTerm());
                        break;
                }
            } else {
                argTermArray[i] = argTerms.get(i);
            }
        }
        return termFunction.createTerm(argTermArray);
    }

}
