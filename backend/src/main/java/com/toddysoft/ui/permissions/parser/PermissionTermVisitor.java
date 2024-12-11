package com.toddysoft.ui.permissions.parser;

import com.toddysoft.ui.permissions.api.Term;
import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.api.TermType;
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
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.util.Collections;
import java.util.Map;

public class PermissionTermVisitor extends ExpressionBaseVisitor<Term<?>> {

    private final Map<String, TermFunction> functions;

    public PermissionTermVisitor(Map<String, TermFunction> functions) {
        this.functions = functions;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Boolean Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    @SuppressWarnings("unchecked")
    public BooleanTermAnd visitBooleanAnd(ExpressionParser.BooleanAndContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new BooleanTermAnd((Term<Boolean>) termA, (Term<Boolean>) termB);
    }

    @Override
    @SuppressWarnings("unchecked")
    public BooleanTermOr visitBooleanOr(ExpressionParser.BooleanOrContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new BooleanTermOr((Term<Boolean>) termA, (Term<Boolean>) termB);
    }

    @Override
    @SuppressWarnings("unchecked")
    public BooleanTermNot visitBooleanNot(ExpressionParser.BooleanNotContext ctx) {
        if(ctx.getChildCount() != 2) {
            throw new RuntimeException("Expected 2 arguments");
        }
        Term<?> termA = ctx.getChild(1).accept(this);
        return new BooleanTermNot((Term<Boolean>) termA);
    }

    @Override
    public BooleanTerm visitBooleanFunc(ExpressionParser.BooleanFuncContext ctx) {
        if(ctx.getChildCount() != 1) {
            throw new RuntimeException("Expected 1 argument");
        }
        Term<?> term = ctx.getChild(0).accept(this);
        if(!(term instanceof BooleanTerm)) {
            throw new RuntimeException("Expected a boolean term");
        }
        return (BooleanTerm) term;
    }

    @Override
    public BooleanTermValue visitBooleanTrueVal(ExpressionParser.BooleanTrueValContext ctx) {
        return new BooleanTermValue(true);
    }

    @Override
    public BooleanTermValue visitBooleanFalseVal(ExpressionParser.BooleanFalseValContext ctx) {
        return new BooleanTermValue(false);
    }

    @Override
    public BooleanTermVar visitBooleanVar(ExpressionParser.BooleanVarContext ctx) {
        VariableTerm.VariableTermHolder variableTermHolder = (VariableTerm.VariableTermHolder) ctx.variable().accept(this);
        return new BooleanTermVar(variableTermHolder.getTerm());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Numeric Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public NumericTermMul visitNumericMul(ExpressionParser.NumericMulContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new NumericTermMul((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public NumericTermDiv visitNumericDiv(ExpressionParser.NumericDivContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new NumericTermDiv((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public NumericTermAdd visitNumericAdd(ExpressionParser.NumericAddContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new NumericTermAdd((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public NumericTermSub visitNumericSub(ExpressionParser.NumericSubContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new NumericTermSub((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public NumericTermMod visitNumericMod(ExpressionParser.NumericModContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new NumericTermMod((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public NumericTermBitShiftRight visitNumericBitShiftRight(ExpressionParser.NumericBitShiftRightContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new NumericTermBitShiftRight((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public NumericTermBitShiftLeft visitNumericBitShiftLeft(ExpressionParser.NumericBitShiftLeftContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new NumericTermBitShiftLeft((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public NumericTermBitAnd visitNumericBitAnd(ExpressionParser.NumericBitAndContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new NumericTermBitAnd((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public NumericTermBitOr visitNumericBitOr(ExpressionParser.NumericBitOrContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new NumericTermBitOr((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public NumericTerm visitNumericFunc(ExpressionParser.NumericFuncContext ctx) {
        if(ctx.getChildCount() != 1) {
            throw new RuntimeException("Expected 1 argument");
        }
        Term<?> term = ctx.getChild(0).accept(this);
        if(!(term instanceof NumericTerm)) {
            throw new RuntimeException("Expected a numeric term");
        }
        return (NumericTerm) term;
    }

    @Override
    public NumericTermValue visitNumericValInt(ExpressionParser.NumericValIntContext ctx) {
        return new NumericTermValue(Integer.parseInt(ctx.getText()));
    }

    @Override
    public NumericTermValue visitNumericValFloat(ExpressionParser.NumericValFloatContext ctx) {
        return new NumericTermValue(Float.parseFloat(ctx.getText()));
    }

    @Override
    public NumericTermVar visitNumericVar(ExpressionParser.NumericVarContext ctx) {
        VariableTerm.VariableTermHolder variableTermHolder = (VariableTerm.VariableTermHolder) ctx.variable().accept(this);
        return new NumericTermVar(variableTermHolder.getTerm());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // String Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public StringTermConcat visitStringConcat(ExpressionParser.StringConcatContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new StringTermConcat((Term<String>) termA, (Term<String>) termB);
    }

    @Override
    public StringTerm visitStringFunc(ExpressionParser.StringFuncContext ctx) {
        if(ctx.getChildCount() != 1) {
            throw new RuntimeException("Expected 1 argument");
        }
        Term<?> term = ctx.getChild(0).accept(this);
        if(!(term instanceof StringTerm)) {
            throw new RuntimeException("Expected a string term");
        }
        return (StringTerm) term;
    }

    @Override
    public StringTermValue visitStringVal(ExpressionParser.StringValContext ctx) {
        return new StringTermValue(ctx.getText().substring(1, ctx.getText().length() - 1));
    }

    @Override
    public StringTermVar visitStringVar(ExpressionParser.StringVarContext ctx) {
        VariableTerm.VariableTermHolder variableTermHolder = (VariableTerm.VariableTermHolder) ctx.variable().accept(this);
        return new StringTermVar(variableTermHolder.getTerm());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Comparison Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public ComparisonTermEq visitComparisonEq(ExpressionParser.ComparisonEqContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new ComparisonTermEq((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public ComparisonTermNeq visitComparisonNeq(ExpressionParser.ComparisonNeqContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new ComparisonTermNeq((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public ComparisonTermLt visitComparisonLt(ExpressionParser.ComparisonLtContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new ComparisonTermLt((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public ComparisonTermLeq visitComparisonLeq(ExpressionParser.ComparisonLeqContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new ComparisonTermLeq((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public ComparisonTermGt visitComparisonGt(ExpressionParser.ComparisonGtContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new ComparisonTermGt((Term<Number>) termA, (Term<Number>) termB);
    }

    @Override
    public ComparisonTermGeq visitComparisonGeq(ExpressionParser.ComparisonGeqContext ctx) {
        if(ctx.getChildCount() != 3) {
            throw new RuntimeException("Expected 3 arguments");
        }
        Term<?> termA = ctx.getChild(0).accept(this);
        Term<?> termB = ctx.getChild(2).accept(this);
        return new ComparisonTermGeq((Term<Number>) termA, (Term<Number>) termB);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Utility Expressions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public VariableTerm.VariableTermHolder visitVariableExpr(ExpressionParser.VariableExprContext ctx) {
        VariableTerm child = null;
        if(!ctx.variable().isEmpty()) {
              child = ((VariableTerm.VariableTermHolder) ctx.variable().getFirst().accept(this)).getTerm();
        }
        String variableName = ctx.ID().getText();
        VariableTerm variableTerm = null;
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
        return new VariableTerm.VariableTermHolder(variableTerm);
    }

    @Override
    public Term<?> visitTerminal(TerminalNode node) {
        return new StringTermValue(node.getText());
    }

    @Override
    public Term<?> visitFunctionCall(ExpressionParser.FunctionCallContext ctx) {
        if(ctx.getChildCount() == 1) {
            throw new RuntimeException("Expected at least 1 argument");
        }
        Term<?> functionNameTerm = ctx.getChild(0).accept(this);
        String functionName = (String) functionNameTerm.evaluate(Collections.emptyMap());
        if(!functions.containsKey(functionName)) {
            throw new RuntimeException("No function named " + functionName + " found");
        }
        TermFunction<?> termFunction = functions.get(functionName);
        TermType[] argTypes = termFunction.getArgTypes();
        ParseTree argsCtx = ctx.getChild(2);
        int numArgs = (argsCtx.getChildCount() + 1) / 2;
        if(numArgs != argTypes.length) {
            throw new RuntimeException("Expected " + numArgs + " arguments, but got " + argTypes.length);
        }
        Term<?>[] argTerms = new Term[numArgs];
        for (int i = 0; i < numArgs; i++) {
            Term<?> term = argsCtx.getChild(2 * i).accept(this);
            // All variable terms are parsed as boolean terms in this case.
            // If we're not expecting a boolean argument, we need to re-package the term inside.
            if(term instanceof BooleanTermVar) {
                BooleanTermVar booleanTermVar = (BooleanTermVar) term;
                switch (argTypes[i]) {
                    case BOOLEAN:
                        argTerms[i] = booleanTermVar;
                        break;
                    case NUMERIC:
                        argTerms[i] = new NumericTermVar(booleanTermVar.getVariableTerm());
                        break;
                    case STRING:
                        argTerms[i] = new StringTermVar(booleanTermVar.getVariableTerm());
                        break;
                }
            } else {
                argTerms[i] = term;
            }
        }
        return termFunction.createTerm(argTerms);
    }

}
