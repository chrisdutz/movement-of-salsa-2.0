grammar Expression;

// Entry points
parseNumericExpr: numericExpr;
parseBooleanExpr: booleanExpr;
parseStringExpr: stringExpr;

expr:   booleanExpr
    |   numericExpr
    |   stringExpr
    ;

booleanExpr
    :   booleanExpr '&&' booleanExpr                # BooleanAnd
    |   booleanExpr '||' booleanExpr                # BooleanOr
    |   '!' booleanExpr                             # BooleanNot
    |   comparisonExpr                              # BooleanComp
    |   funcCall                                    # BooleanFunc
    |   'true'                                      # BooleanTrueVal
    |   'false'                                     # BooleanFalseVal
    |   variable                                    # BooleanVar
    |   '(' booleanExpr ')'                         # ParensBool
    ;

numericExpr
    :   numericExpr '*' numericExpr                 # NumericMul
    |   numericExpr '/' numericExpr                 # NumericDiv
    |   numericExpr '+' numericExpr                 # NumericAdd
    |   numericExpr '-' numericExpr                 # NumericSub
    |   numericExpr '%' numericExpr                 # NumericMod
    |   numericExpr '>>' numericExpr                # NumericBitShiftRight
    |   numericExpr '<<' numericExpr                # NumericBitShiftLeft
    |   numericExpr '&' numericExpr                 # NumericBitAnd
    |   numericExpr '|' numericExpr                 # NumericBitOr
    |   funcCall                                    # NumericFunc
    |   INT                                         # NumericValInt
    |   FLOAT                                       # NumericValFloat
    |   variable                                    # NumericVar
    |   '(' numericExpr ')'                         # ParensNum
    ;

stringExpr
    :   stringExpr '+' stringExpr                   # StringConcat
    |   funcCall                                    # StringFunc
    |   STRING                                      # StringVal
    |   variable                                    # StringVar
    |   '(' stringExpr ')'                          # ParensString
    ;

comparisonExpr
    :   numericExpr '==' numericExpr                # ComparisonEq
    |   numericExpr '!=' numericExpr                # ComparisonNeq
    |   numericExpr '<' numericExpr                 # ComparisonLt
    |   numericExpr '<=' numericExpr                # ComparisonLeq
    |   numericExpr '>' numericExpr                 # ComparisonGt
    |   numericExpr '>=' numericExpr                # ComparisonGeq
    ;

variable
    :   ID ('[' (index=INT | key=STRING) ']' )* ('.' variable)*  # VariableExpr
    ;

args
    :   expr (',' expr)*                            # ArgList
    |                                               # NoArgs
    ;

funcCall
    :   ID '(' args ')'                             # FunctionCall
    ;

// Lexer rules

ID      :   [a-zA-Z_][a-zA-Z_0-9]* ;
INT     :   [0-9]+ ;
FLOAT   :   [0-9]+'.'[0-9]* ;
STRING  :   '"' (ESC | ~["\\])* '"' ;

fragment ESC
    :   '\\' [btnfr"'\\]
    ;

NEWLINE :   '\r'? '\n' ;
WS      :   [ \t\r\n]+ -> skip ;