package com.toddysoft.ui.permissions.parser;

import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.api.Term;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.tree.ParseTreeWalker;

import java.util.Map;

public class PermissionTermParser {

    private final Map<String, TermFunction<?>> functions;

    public PermissionTermParser(Map<String, TermFunction<?>> functions) {
        this.functions = functions;
    }

    private ExpressionParser createParser(String input) {
        // Create an input stream from the input string
        CharStream inputStream = CharStreams.fromString(input);
        // Create a lexer using the input stream
        ExpressionLexer lexer = new ExpressionLexer(inputStream);
        // Create a token stream from the lexer
        TokenStream tokenStream = new CommonTokenStream(lexer);
        // Create a parser using the token stream
        return new ExpressionParser(tokenStream);
    }

    public Term<Boolean> parseBooleanExpression(String term) {
        ExpressionParser parser = createParser(term);
        ExpressionParser.ParseBooleanExprContext booleanContext = parser.parseBooleanExpr();
        /*Term<?> result = new PermissionTermVisitor(functions).visit(booleanContext);
        return (Term<Boolean>) result;*/
        PermissionTermListener<Boolean> listener = new PermissionTermListener<>(functions);
        new ParseTreeWalker().walk(listener, booleanContext);
        return listener.getRootTerm();
    }

    public Term<Number> parseNumericExpression(String term) {
        ExpressionParser parser = createParser(term);
        ExpressionParser.ParseNumericExprContext numericContext = parser.parseNumericExpr();
        /*Term<?> result = new PermissionTermVisitor(functions).visit(numericContext);
        return (Term<Number>) result;*/
        PermissionTermListener<Number> listener = new PermissionTermListener<>(functions);
        new ParseTreeWalker().walk(listener, numericContext);
        return listener.getRootTerm();
    }

    public Term<String> parseStringExpression(String term) {
        ExpressionParser parser = createParser(term);
        ExpressionParser.ParseStringExprContext stringContext = parser.parseStringExpr();
        /*Term<?> result = new PermissionTermVisitor(functions).visit(stringContext);
        return (Term<String>) result;*/
        PermissionTermListener<String> listener = new PermissionTermListener<>(functions);
        new ParseTreeWalker().walk(listener, stringContext);
        return listener.getRootTerm();
    }

}
