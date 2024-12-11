package com.toddysoft.ui.permissions.parser;

import com.toddysoft.ui.permissions.api.TermFunction;
import com.toddysoft.ui.permissions.api.Term;
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
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class PermissionTermParserTest {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Boolean Terms
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Test
    void testSimpleBooleanTermTrue() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("true");
        assertNotNull(term);
        assertInstanceOf(BooleanTermValue.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testSimpleBooleanTermFalse() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("false");
        assertNotNull(term);
        assertInstanceOf(BooleanTermValue.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testBooleanAndTermMixed() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("true && false");
        assertNotNull(term);
        assertInstanceOf(BooleanTermAnd.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testBooleanAndTermBothTrue() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("true && true");
        assertNotNull(term);
        assertInstanceOf(BooleanTermAnd.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testBooleanOrTermOneTrue() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("true || false");
        assertNotNull(term);
        assertInstanceOf(BooleanTermOr.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testBooleanOrTermBothTrue() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("true || true");
        assertNotNull(term);
        assertInstanceOf(BooleanTermOr.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testBooleanOrTermBothFalse() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("false || false");
        assertNotNull(term);
        assertInstanceOf(BooleanTermOr.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testBooleanNotTrueTerm() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("!true");
        assertNotNull(term);
        assertInstanceOf(BooleanTermNot.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testBooleanNotFalseTerm() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("!false");
        assertNotNull(term);
        assertInstanceOf(BooleanTermNot.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testBooleanNoargsFuncTerm() {
        Map<String, TermFunction<?>> functions = new HashMap<>();
        functions.put("MyFunc", new BooleanNoargsTestFunction());
        PermissionTermParser sut = new PermissionTermParser(functions);
        Term<?> term = sut.parseBooleanExpression("MyFunc()");
        assertNotNull(term);
        assertInstanceOf(BooleanTerm.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testBooleanFuncTerm() {
        Map<String, TermFunction<?>> functions = new HashMap<>();
        functions.put("MyFunc", new BooleanTestFunction());
        PermissionTermParser sut = new PermissionTermParser(functions);
        Term<?> term = sut.parseBooleanExpression("MyFunc(5, true, \"hurz\")");
        assertNotNull(term);
        assertInstanceOf(BooleanTerm.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testBooleanVariable() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("myVariable[2].coolProp[\"lalala\"]");
        assertNotNull(term);
        assertInstanceOf(BooleanTermVar.class, term);
        BooleanTermVar booleanTermVar = (BooleanTermVar) term;
        VariableTerm variableTerm = booleanTermVar.getVariableTerm();
        assertEquals("myVariable", variableTerm.getName());
        assertInstanceOf(VariableTermArray.class, variableTerm);
        VariableTermArray variableTermArray = (VariableTermArray) variableTerm;
        assertEquals(2, variableTermArray.getIndex());
        VariableTerm variableTermChild = variableTerm.getChild();
        assertNotNull(variableTermChild);
        assertEquals("coolProp", variableTermChild.getName());
        assertInstanceOf(VariableTermMap.class, variableTermChild);
        VariableTermMap childTermMapChild = (VariableTermMap) variableTermChild;
        assertEquals("lalala", childTermMapChild.getKey());

        Object result = term.evaluate(Collections.singletonMap("myVariable", new MyType[] {new MyType(Collections.singletonMap("lalala", true)), new MyType(Collections.singletonMap("lalala", false)), new MyType(Collections.singletonMap("lalala", true)), new MyType(Collections.singletonMap("lalala", false))}));
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Numeric Terms
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Test
    void testSimpleNumericTermInteger() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("42");
        assertNotNull(term);
        assertInstanceOf(NumericTermValue.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(42, ((Number) result).longValue());
    }

    @Test
    void testSimpleNumericTermFloat() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("3.14159265358979323846");
        assertNotNull(term);
        assertInstanceOf(NumericTermValue.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(3.14159265358979323846, ((Number) result).doubleValue(), 0.0001);
    }

    @Test
    void testNumericAdditionTermInteger() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("23 +42");
        assertNotNull(term);
        assertInstanceOf(NumericTermAdd.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(65, ((Number) result).longValue());
    }

    @Test
    void testNumericAdditionTermIntegerAndFloat() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("23 + 42.2");
        assertNotNull(term);
        assertInstanceOf(NumericTermAdd.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(65.2, ((Number) result).doubleValue(), 0.0001);
    }

    @Test
    void testNumericAdditionTermFloatAndInteger() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("23.3 + 42");
        assertNotNull(term);
        assertInstanceOf(NumericTermAdd.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(65.3, ((Number) result).doubleValue(), 0.0001);
    }

    @Test
    void testNumericSubtractionTermInteger() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("23 - 42");
        assertNotNull(term);
        assertInstanceOf(NumericTermSub.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(-19, ((Number) result).longValue());
    }

    @Test
    void testNumericMultiplicationTermInteger() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("23 * 42");
        assertNotNull(term);
        assertInstanceOf(NumericTermMul.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(966, ((Number) result).longValue());
    }

    @Test
    void testNumericDivisionTermInteger() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("23 / 42");
        assertNotNull(term);
        assertInstanceOf(NumericTermDiv.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(0.5476190476190477, ((Number) result).doubleValue());
    }

    @Test
    void testNumericModuloTermInteger() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("23 % 2");
        assertNotNull(term);
        assertInstanceOf(NumericTermMod.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(1, ((Number) result).longValue());
    }

    @Test
    void testNumericBitShiftRightTermInteger() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("23 >> 2");
        assertNotNull(term);
        assertInstanceOf(NumericTermBitShiftRight.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(5, ((Number) result).longValue());
    }

    @Test
    void testNumericBitShiftLeftTermInteger() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("23 << 2");
        assertNotNull(term);
        assertInstanceOf(NumericTermBitShiftLeft.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(92, ((Number) result).longValue());
    }

    @Test
    void testNumericBitAndTermInteger() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("23 & 42");
        assertNotNull(term);
        assertInstanceOf(NumericTermBitAnd.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(2, ((Number) result).longValue());
    }

    @Test
    void testNumericBitOrTermInteger() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("23 | 42");
        assertNotNull(term);
        assertInstanceOf(NumericTermBitOr.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(63, ((Number) result).longValue());
    }

    @Test
    void testNumericNoargsFuncTerm() {
        Map<String, TermFunction<?>> functions = new HashMap<>();
        functions.put("NoargsFunc", new NumericNoargsTestFunction());
        PermissionTermParser sut = new PermissionTermParser(functions);
        Term<?> term = sut.parseNumericExpression("NoargsFunc()");
        assertNotNull(term);
        assertInstanceOf(NumericTerm.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(42, result);
    }

    @Test
    void testNumericFuncTerm() {
        Map<String, TermFunction<?>> functions = new HashMap<>();
        functions.put("MyFloatFunc", new NumericTestFunction());
        PermissionTermParser sut = new PermissionTermParser(functions);
        Term<?> term = sut.parseNumericExpression("MyFloatFunc(5, true, \"hurz\")");
        assertNotNull(term);
        assertInstanceOf(NumericTerm.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Number.class, result);
        assertEquals(42, result);
    }

    @Test
    void testNumericVariable() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseNumericExpression("myVariable[2].coolProp[\"lalala\"]");
        assertNotNull(term);
        assertInstanceOf(NumericTermVar.class, term);
        NumericTermVar numericTermVar = (NumericTermVar) term;
        VariableTerm variableTerm = numericTermVar.getVariableTerm();
        assertEquals("myVariable", variableTerm.getName());
        assertInstanceOf(VariableTermArray.class, variableTerm);
        VariableTermArray variableTermArray = (VariableTermArray) variableTerm;
        assertEquals(2, variableTermArray.getIndex());
        VariableTerm variableTermChild = variableTerm.getChild();
        assertNotNull(variableTermChild);
        assertEquals("coolProp", variableTermChild.getName());
        assertInstanceOf(VariableTermMap.class, variableTermChild);
        VariableTermMap childTermMapChild = (VariableTermMap) variableTermChild;
        assertEquals("lalala", childTermMapChild.getKey());

        Object result = term.evaluate(Collections.singletonMap("myVariable", new MyType[] {new MyType(Collections.singletonMap("lalala", 1)), new MyType(Collections.singletonMap("lalala", 2)), new MyType(Collections.singletonMap("lalala", 3)), new MyType(Collections.singletonMap("lalala", 4))}));
        assertInstanceOf(Number.class, result);
        assertEquals(3, ((Number) result).longValue());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // String Terms
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Test
    void testSimpleStringTerm() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseStringExpression("\"Hurz\"");
        assertNotNull(term);
        assertInstanceOf(StringTermValue.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(String.class, result);
        assertEquals("Hurz", result);
    }

    @Test
    void testStringConcatTerm() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseStringExpression("\"Wolf\" + \"Lamm\"");
        assertNotNull(term);
        assertInstanceOf(StringTermConcat.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(String.class, result);
        assertEquals("WolfLamm", result);
    }

    @Test
    void testStringNoargsFuncTerm() {
        Map<String, TermFunction<?>> functions = new HashMap<>();
        functions.put("NoargsFunc", new StringNoargsTestFunction());
        PermissionTermParser sut = new PermissionTermParser(functions);
        Term<?> term = sut.parseStringExpression("NoargsFunc()");
        assertNotNull(term);
        assertInstanceOf(StringTerm.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(String.class, result);
        assertEquals("hurz", result);
    }

    @Test
    void testStringFuncTerm() {
        Map<String, TermFunction<?>> functions = new HashMap<>();
        functions.put("MyFuncString", new StringTestFunction());
        PermissionTermParser sut = new PermissionTermParser(functions);
        Term<?> term = sut.parseStringExpression("MyFuncString(5, true, \"hurz\")");
        assertNotNull(term);
        assertInstanceOf(StringTerm.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(String.class, result);
        assertEquals("hurz", result);
    }

    @Test
    void testStringVariable() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseStringExpression("myVariable[2].coolProp[\"lalala\"]");
        assertNotNull(term);
        assertInstanceOf(StringTermVar.class, term);
        StringTermVar stringTermVar = (StringTermVar) term;
        VariableTerm variableTerm = stringTermVar.getVariableTerm();
        assertEquals("myVariable", variableTerm.getName());
        assertInstanceOf(VariableTermArray.class, variableTerm);
        VariableTermArray variableTermArray = (VariableTermArray) variableTerm;
        assertEquals(2, variableTermArray.getIndex());
        VariableTerm variableTermChild = variableTerm.getChild();
        assertNotNull(variableTermChild);
        assertEquals("coolProp", variableTermChild.getName());
        assertInstanceOf(VariableTermMap.class, variableTermChild);
        VariableTermMap childTermMapChild = (VariableTermMap) variableTermChild;
        assertEquals("lalala", childTermMapChild.getKey());

        Object result = term.evaluate(Collections.singletonMap("myVariable", new MyType[] {new MyType(Collections.singletonMap("lalala", "lamm")), new MyType(Collections.singletonMap("lalala", "wolf")), new MyType(Collections.singletonMap("lalala", "wiese")), new MyType(Collections.singletonMap("lalala", "hurz"))}));
        assertInstanceOf(String.class, result);
        assertEquals("wiese", result);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Comparison Terms
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Test
    void testComparisonEqualsTermTrue() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 == 23");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermEq.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testComparisonEqualsTermFalse() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 == 42");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermEq.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testComparisonNotEqualsTermTrue() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 != 42");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermNeq.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testComparisonNotEqualsTermFalse() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 != 23");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermNeq.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testComparisonLessThanTermTrue() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 < 42");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermLt.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testComparisonLessThanTermFalse() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("42 < 23");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermLt.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testComparisonLessThanTermEqualsFalse() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 < 23");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermLt.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testComparisonLessThanEqualsTermTrue() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 <= 42");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermLeq.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testComparisonLessThanEqualsTermFalse() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("42 <= 23");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermLeq.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testComparisonLessThanEqualsTermTrueEquals() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 <= 23");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermLeq.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testComparisonGreaterThanTermFalse() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 > 42");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermGt.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testComparisonGreaterThanTermTrue() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("42 > 23");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermGt.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testComparisonGreaterThanTermFalseEquals() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 > 23");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermGt.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testComparisonGreaterThanEqualsTermFalse() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 >= 42");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermGeq.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(false, result);
    }

    @Test
    void testComparisonGreaterThanEqualsTermTrue() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("42 >= 23");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermGeq.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    @Test
    void testComparisonGreaterThanEqualsTermTrueEquals() {
        PermissionTermParser sut = new PermissionTermParser(new HashMap<>());
        Term<?> term = sut.parseBooleanExpression("23 >= 23");
        assertNotNull(term);
        assertInstanceOf(ComparisonTermGeq.class, term);
        Object result = term.evaluate(new HashMap<>());
        assertInstanceOf(Boolean.class, result);
        assertEquals(true, result);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Mixed Terms
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Test
    void testNumericFuncTermWithVariableInput() {
        Map<String, TermFunction<?>> functions = new HashMap<>();
        functions.put("MyFloatFunc", new NumericTestFunction());
        PermissionTermParser sut = new PermissionTermParser(functions);
        Term<?> term = sut.parseNumericExpression("MyFloatFunc(numVar, boolVar, stringVar)");
        assertNotNull(term);
        assertInstanceOf(NumericTerm.class, term);
        Map<String, Object> context = new HashMap<>();
        context.put("numVar", 42);
        context.put("boolVar", true);
        context.put("stringVar", "hurz");
        Object result = term.evaluate(context );
        assertInstanceOf(Number.class, result);
        assertEquals(42, result);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Utility types
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public static class MyType {

        private final Map<String, Object> coolProp;

        public MyType(Map<String, Object> coolProp) {
            this.coolProp = coolProp;
        }

        public Map<String, Object> getCoolProp() {
            return coolProp;
        }

    }

    public static class BooleanNoargsTestFunction implements TermFunction<Boolean> {

        @Override
        public String getName() {
            return "NoargsFunc";
        }

        @Override
        public String getDescription() {
            return "NoargsFunc()";
        }

        @Override
        public TermType[] getArgTypes() {
            return new TermType[] {
            };
        }

        @Override
        public Term<Boolean> createTerm(Term<?>[] args) {
            return (BooleanTerm) context -> {
                if(args.length != 0) {
                    throw new IllegalArgumentException("Wrong number of arguments");
                }
                return true;
            };
        }
    }

    public static class BooleanTestFunction implements TermFunction<Boolean> {

        @Override
        public String getName() {
            return "MyFunc";
        }

        @Override
        public String getDescription() {
            return "MyFunc({numeric}, {boolean}, {string})";
        }

        @Override
        public TermType[] getArgTypes() {
            return new TermType[] {
                    TermType.NUMERIC,
                    TermType.BOOLEAN,
                    TermType.STRING
            };
        }

        @Override
        public Term<Boolean> createTerm(Term<?>[] args) {
            return (BooleanTerm) context -> {
                if(args.length != 3) {
                    throw new IllegalArgumentException("Wrong number of arguments");
                }
                if(!(args[0] instanceof NumericTerm)) {
                    throw new IllegalArgumentException("Wrong argument type");
                }
                if(!(args[1] instanceof BooleanTerm)) {
                    throw new IllegalArgumentException("Wrong argument type");
                }
                if(!(args[2] instanceof StringTerm)) {
                    throw new IllegalArgumentException("Wrong argument type");
                }
                return true;
            };
        }
    }

    public static class NumericNoargsTestFunction implements TermFunction<Number> {

        @Override
        public String getName() {
            return "NoargsFunc";
        }

        @Override
        public String getDescription() {
            return "NoargsFunc()";
        }

        @Override
        public TermType[] getArgTypes() {
            return new TermType[] {
            };
        }

        @Override
        public Term<Number> createTerm(Term<?>[] args) {
            return (NumericTerm) context -> {
                if(args.length != 0) {
                    throw new IllegalArgumentException("Wrong number of arguments");
                }
                return 42;
            };
        }
    }

    public static class NumericTestFunction implements TermFunction<Number> {

        @Override
        public String getName() {
            return "MyFuncFloat";
        }

        @Override
        public String getDescription() {
            return "MyFuncFloat({numeric}, {boolean}, {string}):number";
        }

        @Override
        public TermType[] getArgTypes() {
            return new TermType[] {
                    TermType.NUMERIC,
                    TermType.BOOLEAN,
                    TermType.STRING
            };
        }

        @Override
        public Term<Number> createTerm(Term<?>[] args) {
            return (NumericTerm) context -> {
                if(args.length != 3) {
                    throw new IllegalArgumentException("Wrong number of arguments");
                }
                if(!(args[0] instanceof NumericTerm)) {
                    throw new IllegalArgumentException("Wrong argument type");
                }
                if(!(args[1] instanceof BooleanTerm)) {
                    throw new IllegalArgumentException("Wrong argument type");
                }
                if(!(args[2] instanceof StringTerm)) {
                    throw new IllegalArgumentException("Wrong argument type");
                }
                return 42;
            };
        }
    }

    public static class StringNoargsTestFunction implements TermFunction<String> {

        @Override
        public String getName() {
            return "NoargsFunc";
        }

        @Override
        public String getDescription() {
            return "NoargsFunc()";
        }

        @Override
        public TermType[] getArgTypes() {
            return new TermType[] {
            };
        }

        @Override
        public Term<String> createTerm(Term<?>[] args) {
            return (StringTerm) context -> {
                if(args.length != 0) {
                    throw new IllegalArgumentException("Wrong number of arguments");
                }
                return "hurz";
            };
        }
    }

    public static class StringTestFunction implements TermFunction<String> {

        @Override
        public String getName() {
            return "MyFuncString";
        }

        @Override
        public String getDescription() {
            return "MyFuncString({numeric}, {boolean}, {string}):string";
        }

        @Override
        public TermType[] getArgTypes() {
            return new TermType[] {
                    TermType.NUMERIC,
                    TermType.BOOLEAN,
                    TermType.STRING
            };
        }

        @Override
        public Term<String> createTerm(Term<?>[] args) {
            return (StringTerm) context -> {
                if(args.length != 3) {
                    throw new IllegalArgumentException("Wrong number of arguments");
                }
                if(!(args[0] instanceof NumericTerm)) {
                    throw new IllegalArgumentException("Wrong argument type");
                }
                if(!(args[1] instanceof BooleanTerm)) {
                    throw new IllegalArgumentException("Wrong argument type");
                }
                if(!(args[2] instanceof StringTerm)) {
                    throw new IllegalArgumentException("Wrong argument type");
                }
                return "hurz";
            };
        }
    }
}