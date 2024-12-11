import {TermFunctionBoolean} from "./TermFunctionBoolean.ts";
import {TermType} from "../term/TermType.ts";
import {BooleanTerm} from "../term/BooleanTerm.ts";
import {isStringTerm, StringTerm} from "../term/StringTerm.ts";
import {User} from "../../plc4j-tools-ui-frontend.ts";

export class UserHasRoleFunction implements TermFunctionBoolean {

    getName(): string {
        return "UserHasRole";
    }

    getDescription(): string {
        return "UserHasRole({role-name})";
    }

    getMinArgs(): number {
        return 1;
    }

    getMaxArgs(): number {
        return 1;
    }

    getArgTypes(): TermType[] {
        return [TermType.STRING];
    }

    createBooleanTerm(args: any[]): BooleanTerm {
        if(args && args.length != 1) {
            throw new Error("Expecting one argument")
        }
        if(!isStringTerm(args[0])) {
            throw new Error("Expecting a string argument")
        }
        const roleTerm = args[0] as StringTerm
        return new class implements BooleanTerm {
            evaluateBooleanTerm(context: Map<string, any>): boolean {
                const roleName = roleTerm.evaluateStringTerm(context)
                if(!context.has("user")) {
                    return false
                }
                const user = context.get("user") as User;
                const foundRole = user.roles.find(role => role.name === roleName)
                return foundRole != undefined;
            }
        }
    }

}