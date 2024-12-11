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
import {CharStreams, CommonTokenStream} from "antlr4ts";
import {ExpressionLexer} from "./ExpressionLexer";
import {ExpressionParser} from "./ExpressionParser";
import {BooleanTerm} from "../term/BooleanTerm";
import {PermissionTermListener} from "./PermissionTermListener";
import {ParseTreeWalker} from "antlr4ts/tree";
import {StringTerm} from "../term/StringTerm";
import {NumericTerm} from "../term/NumericTerm";
import {TermFunction} from "../function/TermFunction";

export class PermissionTermParser {

    functions:Map<string, TermFunction>

    constructor(functions: Map<string, TermFunction>) {
        this.functions = functions;
    }

    public parseBooleanExpression(term:string):BooleanTerm {
        const chars = CharStreams.fromString(term); // replace this with a FileStream as required
        const lexer = new ExpressionLexer(chars)
        const tokens = new CommonTokenStream(lexer)
        const parser = new ExpressionParser(tokens)
        const expression = parser.parseBooleanExpr();
        const listener = new PermissionTermListener(this.functions)
        ParseTreeWalker.DEFAULT.walk(listener, expression)
        return listener.getRootTerm() as BooleanTerm
    }

    public parseNumericExpression(term:string):NumericTerm {
        const chars = CharStreams.fromString(term); // replace this with a FileStream as required
        const lexer = new ExpressionLexer(chars)
        const tokens = new CommonTokenStream(lexer)
        const parser = new ExpressionParser(tokens)
        const expression = parser.parseNumericExpr();
        const listener = new PermissionTermListener(this.functions)
        ParseTreeWalker.DEFAULT.walk(listener, expression)
        return listener.getRootTerm() as NumericTerm
    }

    public parseStringExpression(term:string):StringTerm {
        const chars = CharStreams.fromString(term); // replace this with a FileStream as required
        const lexer = new ExpressionLexer(chars)
        const tokens = new CommonTokenStream(lexer)
        const parser = new ExpressionParser(tokens)
        const expression = parser.parseStringExpr();
        const listener = new PermissionTermListener(this.functions)
        ParseTreeWalker.DEFAULT.walk(listener, expression)
        return listener.getRootTerm() as StringTerm
    }

}
