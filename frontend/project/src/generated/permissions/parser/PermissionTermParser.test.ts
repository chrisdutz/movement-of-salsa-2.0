import {PermissionTermParser} from "./PermissionTermParser";
import {TermFunctionBoolean} from "../function/TermFunctionBoolean";
import {TermFunction} from "../function/TermFunction";
import {TermType} from "../term/TermType";
import {BooleanTerm, isBooleanTerm} from "../term/BooleanTerm";
import {BooleanTermValue} from "../term/BooleanTermValue";
import {UserHasRoleFunction} from "../function/UserHasRoleFunction";
import {Role, User} from "../../plc4j-tools-ui-frontend";
import {TermFunctionNumeric} from "../function/TermFunctionNumeric";
import {NumericTermValue} from "../term/NumericTermValue";
import {isNumericTerm, NumericTerm} from "../term/NumericTerm";
import {StringTermValue} from "../term/StringTermValue";
import {isStringTerm, StringTerm} from "../term/StringTerm";
import {TermFunctionString} from "../function/TermFunctionString";


const user = {
    accountNonExpired: false,
    accountNonLocked: false,
    authorities: [],
    createdAt: new Date(),
    credentialsNonExpired: false,
    email: "",
    enabled: false,
    fullName: "",
    id: 0,
    password: "",
    roles: [{
        id: 0,
        name: "User"
    } as Role],
    updatedAt: new Date(),
    username: "user"
} as User

const admin = {
    accountNonExpired: false,
    accountNonLocked: false,
    authorities: [],
    createdAt: new Date(),
    credentialsNonExpired: false,
    email: "",
    enabled: false,
    fullName: "",
    id: 0,
    password: "",
    roles: [{
        id: 0,
        name: "Admin"
    } as Role],
    updatedAt: new Date(),
    username: "admin"
} as User

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Boolean Tests
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe("Testing boolean expressions", () => {

    test('true == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("true").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })
    test('false == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("false").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })

    test('true && false == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("true && false").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })
    test('true && true == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("true && true").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

    test('true || false == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("true || false").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })
    test('true || true == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("true || true").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })
    test('false || false == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("false || false").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })

    test('!true == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("!true").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })
    test('!false == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("!false").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

    test('MyFunc() == true', () => {
        const myFunc: TermFunctionBoolean = {
            getName(): string {
                return "MyFunc"
            },
            getDescription(): string {
                return "My test func";
            },
            getArgTypes(): TermType[] {
                return [];
            },
            createBooleanTerm(): BooleanTerm {
                return new BooleanTermValue(true);
            }
        }
        expect(new PermissionTermParser(new Map<string, TermFunction>().set("MyFunc", myFunc)).parseBooleanExpression("MyFunc()")
            .evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

    test('MyFunc(5, true, \"hurz\") == true', () => {
        const myFunc: TermFunctionBoolean = {
            getName(): string {
                return "MyFunc"
            },
            getDescription(): string {
                return "My test func";
            },
            getArgTypes(): TermType[] {
                return [
                    TermType.NUMERIC,
                    TermType.BOOLEAN,
                    TermType.STRING
                ]
            },
            createBooleanTerm: function (args: any[]): BooleanTerm {
                return new class implements BooleanTerm {
                    args: any[]

                    constructor(args: any[]) {
                        this.args = args
                    }

                    evaluateBooleanTerm(context: Map<string, any>): boolean {
                        if (this.args.length != 3) {
                            throw new Error("Wrong number of arguments");
                        }
                        if (!isNumericTerm(this.args[0])) {
                            throw new Error("Wrong argument type");
                        }
                        if (!isBooleanTerm(this.args[1])) {
                            throw new Error("Wrong argument type");
                        }
                        if (!isStringTerm(this.args[2])) {
                            throw new Error("Wrong argument type");
                        }
                        return true;
                    }
                }(args)
            }
        }
        expect(new PermissionTermParser(new Map<string, TermFunction>().set("MyFunc", myFunc)).parseBooleanExpression("MyFunc(5, true, \"hurz\")")
            .evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

    // TODO: Move this into a separate test
    test('UserHasRole() == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>().set("UserHasRole", new UserHasRoleFunction())).parseBooleanExpression("UserHasRole(\"Admin\")")
            .evaluateBooleanTerm(new Map<string, any>().set("user", admin)))
            .toBe(true)
    })

    // TODO: Move this into a separate test
    test('UserHasRole() == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>().set("UserHasRole", new UserHasRoleFunction())).parseBooleanExpression("UserHasRole(\"Admin\")")
            .evaluateBooleanTerm(new Map<string, any>().set("user", user)))
            .toBe(false)
    })

    test('myVariable[2].coolProp[\"lalala\"] == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("myVariable[2].coolProp[\"lalala\"]")
            .evaluateBooleanTerm(new Map<string, any>().set("myVariable", [new MyType(new Map<string, any>().set("lalala", false)), new MyType(new Map<string, any>().set("lalala", false)), new MyType(new Map<string, any>().set("lalala", true)), new MyType(new Map<string, any>().set("lalala", false))])))
            .toBe(true)
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Numeric Tests
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe("Testing numeric expressions", () => {
    test('42 == 42', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("42").evaluateNumericTerm(new Map<string, any>()))
            .toBe(42)
    })

    test('3.14159265358979323846 == 3.14159265358979323846', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("3.14159265358979323846").evaluateNumericTerm(new Map<string, any>()))
            .toBe(3.14159265358979323846)
    })

    test('42 + 23 == 65', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("42 + 23").evaluateNumericTerm(new Map<string, any>()))
            .toBe(65)
    })

    test('23 + 42.2 == 65.2', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("23 + 42.2").evaluateNumericTerm(new Map<string, any>()))
            .toBe(65.2)
    })

    test('23.3 + 42 == 65.3', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("23.3 + 42").evaluateNumericTerm(new Map<string, any>()))
            .toBe(65.3)
    })

    test('23 - 42 == -19', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("23 - 42").evaluateNumericTerm(new Map<string, any>()))
            .toBe(-19)
    })

    test('23 * 42 == 966', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("23 * 42").evaluateNumericTerm(new Map<string, any>()))
            .toBe(966)
    })

    test('23 / 42 == 0.5476190476190477', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("23 / 42").evaluateNumericTerm(new Map<string, any>()))
            .toBe(0.5476190476190477)
    })

    test('23 % 2 == 1', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("23 % 2").evaluateNumericTerm(new Map<string, any>()))
            .toBe(1)
    })

    test('23 >> 2 == 5', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("23 >> 2").evaluateNumericTerm(new Map<string, any>()))
            .toBe(5)
    })

    test('23 << 2 == 92', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("23 << 2").evaluateNumericTerm(new Map<string, any>()))
            .toBe(92)
    })

    test('23 & 42 == 2', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("23 & 42").evaluateNumericTerm(new Map<string, any>()))
            .toBe(2)
    })

    test('23 | 42 == -19', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseNumericExpression("23 | 42").evaluateNumericTerm(new Map<string, any>()))
            .toBe(63)
    })

    test('MyFunc() == 42', () => {
        const myFunc:TermFunctionNumeric = {
            getName(): string {
                return "MyFunc"
            },
            getDescription(): string {
                return "My test func";
            },
            getArgTypes(): TermType[] {
                return [];
            },
            createNumericTerm(): NumericTerm {
                return new NumericTermValue(42);
            }
        }
        expect(new PermissionTermParser(new Map<string, TermFunction>().set("MyFunc", myFunc)).parseNumericExpression("MyFunc()")
            .evaluateNumericTerm(new Map<string, any>()))
            .toBe(42)
    })

    test('MyFunc(5, true, \"hurz\") == 42', () => {
        const myFunc: TermFunctionNumeric = {
            getName(): string {
                return "MyFunc"
            },
            getDescription(): string {
                return "My test func";
            },
            getArgTypes(): TermType[] {
                return [
                    TermType.NUMERIC,
                    TermType.BOOLEAN,
                    TermType.STRING
                ]
            },
            createNumericTerm: function (args: any[]): NumericTerm {
                return new class implements NumericTerm {
                    args: any[]

                    constructor(args: any[]) {
                        this.args = args
                    }

                    evaluateNumericTerm(context: Map<string, any>): number {
                        if (this.args.length != 3) {
                            throw new Error("Wrong number of arguments");
                        }
                        if (!isNumericTerm(this.args[0])) {
                            throw new Error("Wrong argument type");
                        }
                        if (!isBooleanTerm(this.args[1])) {
                            throw new Error("Wrong argument type");
                        }
                        if (!isStringTerm(this.args[2])) {
                            throw new Error("Wrong argument type");
                        }
                        return 42;
                    }
                }(args)
            }
        }
        expect(new PermissionTermParser(new Map<string, TermFunction>().set("MyFunc", myFunc)).parseNumericExpression("MyFunc(5, true, \"hurz\")")
            .evaluateNumericTerm(new Map<string, any>()))
            .toBe(42)
    })

    test('myVariable[2].coolProp[\"lalala\"] == 3', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("myVariable[2].coolProp[\"lalala\"]")
            .evaluateBooleanTerm(new Map<string, any>().set("myVariable", [new MyType(new Map<string, any>().set("lalala", 1)), new MyType(new Map<string, any>().set("lalala", 2)), new MyType(new Map<string, any>().set("lalala", 3)), new MyType(new Map<string, any>().set("lalala", 4))])))
            .toBe(3)
    })

})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// String Tests
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe("Testing string expressions", () => {

    test('"Hurz" == "Hurz"', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseStringExpression("\"Hurz\"").evaluateStringTerm(new Map<string, any>()))
            .toBe("Hurz")
    })

    test('"Wolf" + "Lamm" == "WolfLamm"', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseStringExpression("\"Wolf\"+ \"Lamm\"").evaluateStringTerm(new Map<string, any>()))
            .toBe("WolfLamm")
    })

    test('MyFunc() == "Hurz"', () => {
        const myFunc:TermFunctionString = {
            getName(): string {
                return "MyFunc"
            },
            getDescription(): string {
                return "My test func";
            },
            getArgTypes(): TermType[] {
                return [];
            },
            createStringTerm(): StringTerm {
                return new StringTermValue("Hurz");
            }
        }
        expect(new PermissionTermParser(new Map<string, TermFunction>().set("MyFunc", myFunc)).parseStringExpression("MyFunc()")
            .evaluateStringTerm(new Map<string, any>()))
            .toBe("Hurz")
    })


    test('MyFunc(5, true, \"hurz\") == \"hurz\"', () => {
        const myFunc: TermFunctionString = {
            getName(): string {
                return "MyFunc"
            },
            getDescription(): string {
                return "My test func";
            },
            getArgTypes(): TermType[] {
                return [
                    TermType.NUMERIC,
                    TermType.BOOLEAN,
                    TermType.STRING
                ]
            },
            createStringTerm: function (args: any[]): StringTerm {
                return new class implements StringTerm {
                    args: any[]

                    constructor(args: any[]) {
                        this.args = args
                    }

                    evaluateStringTerm(context: Map<string, any>): string {
                        if (this.args.length != 3) {
                            throw new Error("Wrong number of arguments");
                        }
                        if (!isNumericTerm(this.args[0])) {
                            throw new Error("Wrong argument type");
                        }
                        if (!isBooleanTerm(this.args[1])) {
                            throw new Error("Wrong argument type");
                        }
                        if (!isStringTerm(this.args[2])) {
                            throw new Error("Wrong argument type");
                        }
                        return "hurz";
                    }
                }(args)
            }
        }
        expect(new PermissionTermParser(new Map<string, TermFunction>().set("MyFunc", myFunc)).parseStringExpression("MyFunc(5, true, \"hurz\")")
            .evaluateStringTerm(new Map<string, any>()))
            .toBe("hurz")
    })

    test('myVariable[2].coolProp[\"lalala\"] == \"wiese\"', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("myVariable[2].coolProp[\"lalala\"]")
            .evaluateBooleanTerm(new Map<string, any>().set("myVariable", [new MyType(new Map<string, any>().set("lalala", "lamm")), new MyType(new Map<string, any>().set("lalala", "wolf")), new MyType(new Map<string, any>().set("lalala", "wiese")), new MyType(new Map<string, any>().set("lalala", "hurz"))])))
            .toBe("wiese")
    })

})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Comparison Tests
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe("Testing comparison expressions", () => {

    test('(23 == 23) == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 == 23").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

    test('(23 == 42) == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 == 42").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })

    test('(23 != 23) == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 != 23").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })

    test('(23 != 42) == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 != 42").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

    test('(23 < 42) == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 < 42").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

    test('(42 < 23) == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("42 < 23").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })

    test('(23 < 23) == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 < 23").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })

    test('(23 <= 42) == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 <= 42").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

    test('(42 <= 23) == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("42 <= 23").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })

    test('(23 <= 23) == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 <= 23").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

    test('(23 > 42) == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 > 42").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })

    test('(42 > 23) == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("42 > 23").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

    test('(23 > 23) == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 > 23").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })

    test('(23 >= 42) == false', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 >= 42").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(false)
    })

    test('(42 >= 23) == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("42 >= 23").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

    test('(23 >= 23) == true', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>()).parseBooleanExpression("23 >= 23").evaluateBooleanTerm(new Map<string, any>()))
            .toBe(true)
    })

})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mixed Tests
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe("Testing mixed expressions", () => {
    const myFunc:TermFunctionNumeric = {
        getName(): string {
            return "MyFunc"
        },
        getDescription(): string {
            return "My test func";
        },
        getArgTypes(): TermType[] {
            return [
                TermType.NUMERIC,
                TermType.BOOLEAN,
                TermType.STRING
            ];
        },
        createNumericTerm(args: any[]): NumericTerm {
            return new class implements NumericTerm {
                evaluateNumericTerm(context: Map<string, any>): number {
                    if(args.length != 3) {
                        throw new Error("Expected 3 args")
                    }
                    if(!isNumericTerm(args[0])) {
                        throw new Error("Expected numeric term as first argument")
                    }
                    const numArg = args[0].evaluateNumericTerm(context)
                    if(numArg != 42) {
                        throw new Error("Expected 42 as first argument")
                    }
                    if(!isBooleanTerm(args[1])) {
                        throw new Error("Expected boolean term as second argument")
                    }
                    const bpplArg = args[1].evaluateBooleanTerm(context)
                    if(bpplArg != true) {
                        throw new Error("Expected true as second argument")
                    }
                    if(!isStringTerm(args[2])) {
                        throw new Error("Expected string term as third argument")
                    }
                    const stringArg = args[2].evaluateStringTerm(context)
                    if(stringArg != "hurz") {
                        throw new Error("Expected 'hurz' as third argument")
                    }
                    return 42;
                }
            }
        }
    }

    test('MyFloatFunc(42, true, \"hurz\") == 42', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>().set("MyFloatFunc", myFunc))
            .parseNumericExpression("MyFloatFunc(42, true, \"hurz\")")
            .evaluateNumericTerm(new Map<string, any>()))
            .toBe(42)
    })

    test('MyFloatFunc(numVar, boolVar, stringVar) == 42', () => {
        expect(new PermissionTermParser(new Map<string, TermFunction>().set("MyFloatFunc", myFunc))
            .parseNumericExpression("MyFloatFunc(numVar, boolVar, stringVar)")
            .evaluateNumericTerm(new Map<string, any>().set("numVar", 42).set("boolVar", true).set("stringVar", "hurz")))
            .toBe(42)
    })

})

class MyType {
    coolProp:Map<string, any>

    constructor(coolProp:Map<string, any>) {
        this.coolProp = coolProp
    }

}