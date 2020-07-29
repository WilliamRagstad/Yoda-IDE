var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Token = /** @class */ (function () {
    function Token(type, value) {
        this.Type = type;
        this.Value = value;
    }
    return Token;
}());
var TokenType;
(function (TokenType) {
    TokenType["LBracket"] = "LBracket";
    TokenType["RBracket"] = "RBracket";
    TokenType["LCurlyBracket"] = "LCurlyBracket";
    TokenType["RCurlyBracket"] = "RCurlyBracket";
    TokenType["LParenthasis"] = "LParenthasis";
    TokenType["RParenthasis"] = "RParenthasis";
    TokenType["Comma"] = "Comma";
    TokenType["Dot"] = "Dot";
    TokenType["SemiColon"] = "SemiColon";
    TokenType["Function"] = "Function";
    TokenType["Return"] = "Return";
    TokenType["If"] = "If";
    TokenType["Else"] = "Else";
    TokenType["Addition"] = "Addition";
    TokenType["Subtraction"] = "Subtraction";
    TokenType["Multiplication"] = "Multiplication";
    TokenType["Division"] = "Division";
    TokenType["Modulus"] = "Modulus";
    TokenType["Assignment"] = "Assignment";
    TokenType["Whitespace"] = "Whitespace";
    TokenType["Comment"] = "Comment";
    TokenType["Literal"] = "Literal";
    TokenType["String"] = "String";
    TokenType["Number"] = "Number";
})(TokenType || (TokenType = {}));
var ASTNode = /** @class */ (function () {
    function ASTNode(type, value, children) {
        if (value === void 0) { value = null; }
        if (children === void 0) { children = []; }
        this.Type = type;
        this.Value = value;
        this.Children = children;
    }
    ASTNode.prototype.GetType = function (type) {
        for (var i = 0; i < this.Children.length; i++) {
            var child = this.Children[i];
            if (child.Type == type)
                return child;
        }
        return null;
    };
    ASTNode.prototype.GetNode = function (index) {
        return this.Children[index];
    };
    ASTNode.prototype.GetPreviousNode = function () {
        return this.GetNode(this.Children.length - 1);
    };
    ASTNode.prototype.RemoveNode = function (index) {
        this.Children.splice(index);
    };
    ASTNode.prototype.RemovePreviousNode = function () {
        this.RemoveNode(this.Children.length - 1);
    };
    ASTNode.prototype.AddNode = function (node) {
        this.Children.push(node);
    };
    ASTNode.prototype.AddNodes = function (nodes) {
        var _this = this;
        nodes.forEach(function (n) {
            _this.AddNode(n);
        });
    };
    return ASTNode;
}());
var AST = /** @class */ (function (_super) {
    __extends(AST, _super);
    function AST() {
        return _super.call(this, NodeType.Root) || this;
    }
    return AST;
}(ASTNode));
var NodeType;
(function (NodeType) {
    NodeType["Root"] = "Root";
    NodeType["Block"] = "Block";
    NodeType["Expression"] = "Expression";
    NodeType["Assignment"] = "Assignment";
    NodeType["Assignee"] = "Assignee";
    NodeType["Function"] = "Function";
    NodeType["FunctionName"] = "FunctionName";
    NodeType["FunctionParameters"] = "FunctionParameters";
    NodeType["FunctionCodeBlock"] = "FunctionCodeBlock";
    NodeType["Instruction"] = "Instruction";
    NodeType["InstructionName"] = "InstructionName";
    NodeType["InstructionArguments"] = "InstructionArguments";
    NodeType["If"] = "If";
    NodeType["IfCondition"] = "IfCondition";
    NodeType["IfCodeBlock"] = "IfCodeBlock";
    NodeType["ElIf"] = "ElIf";
    NodeType["ElIfCondition"] = "ElIfCondition";
    NodeType["ElIfCodeBlock"] = "ElIfCodeBlock";
    NodeType["Else"] = "Else";
    NodeType["ElseCodeBlock"] = "ElseCodeBlock";
    NodeType["Return"] = "Return";
})(NodeType || (NodeType = {}));
var Yoda = {
    LoadScripts: function (debugMode) {
        var _this = this;
        if (debugMode === void 0) { debugMode = false; }
        if (debugMode)
            console.log("Loading Yoda scripts...");
        var scripts = document.querySelectorAll("script[src$='.yoda']"); // *= works aswell...
        var _loop_1 = function (i) {
            fetch(scripts[i].getAttribute("src"))
                .then(function (r) { return r.text(); })
                .then(function (t) {
                var code = _this.Transpile(t, debugMode);
                _this.Inject(code, scripts[i]);
                scripts[i].remove();
            });
        };
        for (var i = 0; i < scripts.length; i++) {
            _loop_1(i);
        }
    },
    Inject: function (jsCode, element) {
        var e = document.createElement("script");
        e.innerHTML = jsCode;
        element.parentElement.appendChild(e);
    },
    Transpile: function (sourceCode, debugMode) {
        if (debugMode === void 0) { debugMode = false; }
        var tokens = this.Tokenize(sourceCode);
        var ast = this.Parse(tokens);
        var result = this.Generators.toJS(ast);
        if (debugMode)
            console.log(sourceCode + '\n\n\n', tokens, ast, '\n\n\n' + result);
        return result;
    },
    Tokenize: function (inputStream) {
        var tokens = [];
        var ct = "";
        function addToken(type, overrideValue) {
            if (overrideValue === void 0) { overrideValue = null; }
            if (overrideValue != null && ct.length > 0) {
                switch (ct) {
                    case "return":
                        addToken(TokenType.Return);
                        break;
                    case "function":
                        addToken(TokenType.Function);
                        break;
                    case "if":
                        addToken(TokenType.If);
                        break;
                    case "else":
                        addToken(TokenType.Else);
                        break;
                    default:
                        addToken(TokenType.Literal);
                        break;
                }
            }
            if (type != TokenType.Whitespace) // Ignore whitespace
                tokens.push(new Token(type, overrideValue != null ? overrideValue : ct));
            ct = "";
        }
        function isNum(char) {
            var n = Number.parseInt(char);
            if (char == '.' || !isNaN(n))
                return true;
            return false;
        }
        var i;
        function getChar(index) {
            var _a;
            if (index === void 0) { index = i; }
            return (_a = inputStream[index]) !== null && _a !== void 0 ? _a : '\0';
        }
        var _loop_2 = function () {
            var cc = getChar();
            var nc = getChar(i + 1);
            function readWhile(condition) {
                while (condition(cc)) {
                    ct += cc;
                    cc = getChar(++i);
                }
                i--;
            }
            function readNumber() {
                // Read number
                readWhile(function (c) { return isNum(c); });
                addToken(TokenType.Number);
            }
            switch (cc) {
                case '\0':
                case '\n':
                case '\r':
                case ' ':
                    if (ct.length > 0)
                        addToken(TokenType.Whitespace, cc);
                    break;
                case '{':
                    addToken(TokenType.LCurlyBracket, cc);
                    break;
                case '}':
                    addToken(TokenType.RCurlyBracket, cc);
                    break;
                case '[':
                    addToken(TokenType.LBracket, cc);
                    break;
                case ']':
                    addToken(TokenType.RBracket, cc);
                    break;
                case '(':
                    addToken(TokenType.LParenthasis, cc);
                    break;
                case ')':
                    addToken(TokenType.RParenthasis, cc);
                    break;
                case ',':
                    addToken(TokenType.Comma, cc);
                    break;
                case '.':
                    if (isNum(nc))
                        readNumber();
                    else
                        addToken(TokenType.Dot, cc);
                    break;
                case '+':
                    addToken(TokenType.Addition, cc);
                    break;
                case '-':
                    addToken(TokenType.Subtraction, cc);
                    break;
                case '*':
                    addToken(TokenType.Multiplication, cc);
                    break;
                case '/':
                    if (nc == '/') {
                        // Comment
                        readWhile(function (c) { return c != '\n'; });
                        addToken(TokenType.Comment);
                    }
                    else
                        addToken(TokenType.Division, cc);
                    break;
                case '%':
                    addToken(TokenType.Modulus, cc);
                    break;
                case '=':
                    addToken(TokenType.Assignment, cc);
                    break;
                case ';':
                    addToken(TokenType.SemiColon, cc);
                    break;
                case '"':
                    ct += cc;
                    cc = getChar(++i); // Eat the current character
                    readWhile(function (c) { return c != '"'; });
                    ct += cc;
                    i++;
                    addToken(TokenType.String);
                    break;
                default:
                    if (isNum(cc))
                        readNumber();
                    else
                        ct += cc;
                    break;
            }
        };
        for (i = 0; i < inputStream.length; i++) {
            _loop_2();
        }
        return tokens;
    },
    Parse: function (tokenStream) {
        var root = new AST();
        var cst = [];
        function addNode(node) {
            root.AddNode(node);
            cst = [];
            var nxt = getToken(i + 1);
            if (nxt != null && nxt.Type == TokenType.SemiColon)
                nextToken(); // Eat ';'
        }
        var i = 0;
        function getToken(index) {
            var _a;
            if (index === void 0) { index = i; }
            return (_a = tokenStream[index]) !== null && _a !== void 0 ? _a : null;
        }
        function nextToken() {
            var t = getToken(i++);
            while (t != null && t.Type == TokenType.Comment)
                t = getToken(i++);
            // if (t == null) debugger
            return t;
        }
        function readWhile(endTokenType, skip) {
            if (skip === void 0) { skip = null; }
            var ct = nextToken();
            var cst = [];
            while (ct.Type != endTokenType) {
                if (skip == null || !skip.find(function (t) { return t == ct.Type; }))
                    cst.push(ct);
                ct = nextToken();
            }
            return cst;
        }
        var ct = nextToken();
        while (ct != null) {
            switch (ct.Type) {
                case TokenType.LCurlyBracket: // Read block
                    var blockNode = new ASTNode(NodeType.Block);
                    var depth = 1;
                    var elements = [];
                    var e = nextToken();
                    while (e != null) {
                        if (e.Type == TokenType.LCurlyBracket)
                            depth++;
                        else if (e.Type == TokenType.RCurlyBracket) {
                            depth--;
                            if (depth == 0)
                                break; // Don't include the ending curly bracket.
                        }
                        elements.push(e);
                        e = nextToken();
                    }
                    blockNode.AddNodes(this.Parse(elements).Children);
                    addNode(blockNode);
                    break;
                case TokenType.Return:
                    var returnNode = new ASTNode(NodeType.Return);
                    var expression = readWhile(TokenType.SemiColon);
                    returnNode.AddNode(new ASTNode(NodeType.Expression, expression));
                    addNode(returnNode);
                    break;
                case TokenType.Function:
                    var name = nextToken().Value; // get function name
                    nextToken(); // Eat the first '('
                    var parameters = readWhile(TokenType.RParenthasis, [TokenType.Comma]);
                    var codeBlock = root.GetPreviousNode();
                    if (codeBlock.Type != NodeType.Block) {
                        this.Errors.Expected("code block before function declaration.");
                        break;
                    }
                    root.RemovePreviousNode();
                    var functionNode = new ASTNode(NodeType.Function);
                    functionNode.AddNode(new ASTNode(NodeType.FunctionName, name));
                    functionNode.AddNode(new ASTNode(NodeType.FunctionParameters, parameters));
                    functionNode.AddNode(new ASTNode(NodeType.FunctionCodeBlock, null, codeBlock.Children));
                    addNode(functionNode);
                    break;
                case TokenType.If:
                    nextToken(); // Eat the first '('
                    var condition = readWhile(TokenType.RParenthasis);
                    var ifCodeBlock = root.GetPreviousNode();
                    if (ifCodeBlock.Type != NodeType.Block) {
                        this.Errors.Expected("code block before if statement.");
                        break;
                    }
                    root.RemovePreviousNode();
                    var ifNode = new ASTNode(NodeType.If);
                    ifNode.AddNode(new ASTNode(NodeType.IfCondition, condition));
                    ifNode.AddNode(new ASTNode(NodeType.IfCodeBlock, null, ifCodeBlock.Children));
                    addNode(ifNode);
                    break;
                case TokenType.Assignment:
                    var assignee = nextToken();
                    var assignmentNode = new ASTNode(NodeType.Assignment);
                    assignmentNode.AddNode(new ASTNode(NodeType.Assignee, assignee.Value));
                    assignmentNode.AddNode(new ASTNode(NodeType.Expression, cst));
                    addNode(assignmentNode);
                    break;
                default:
                    if (ct.Type == TokenType.SemiColon && cst.length > 0) {
                        // Parse Instruction
                        var instruction = new ASTNode(NodeType.Instruction);
                        var path = [];
                        var args = [];
                        var depth_1 = 0;
                        for (var j = cst.length - 1; j > 0; j--) {
                            var t = cst[j];
                            if (t.Type == TokenType.RParenthasis) {
                                if (depth_1 > 0)
                                    args.push(new Token(TokenType.LParenthasis, "("));
                                depth_1++;
                            }
                            else if (t.Type == TokenType.LParenthasis) {
                                depth_1--;
                                if (depth_1 == 0)
                                    break;
                                else
                                    args.push(new Token(TokenType.RParenthasis, ")"));
                            }
                            else if (depth_1 == 0)
                                path.push(t);
                            else
                                args.push(t);
                        }
                        instruction.AddNode(new ASTNode(NodeType.InstructionName, path));
                        instruction.AddNode(new ASTNode(NodeType.InstructionArguments, args));
                        addNode(instruction);
                    }
                    else
                        cst.push(ct);
                    break;
            }
            ct = nextToken();
        }
        return root;
    },
    Generators: {
        _indent: "  ",
        _tokensToString: function (expr, space) {
            if (space === void 0) { space = true; }
            var result = "";
            for (var i = 0; i < expr.length; i++) {
                result += expr[i].Value;
                if (space && i < expr.length - 1)
                    result += " ";
            }
            return result;
        },
        toJS: function (ast, indentPrefix) {
            if (indentPrefix === void 0) { indentPrefix = ""; }
            if (ast == null)
                return "NULL";
            var indented = indentPrefix + this._indent;
            var result = "";
            function add(code, newline, semiColon, indent) {
                if (newline === void 0) { newline = false; }
                if (semiColon === void 0) { semiColon = false; }
                if (indent === void 0) { indent = true; }
                result += (indent ? indentPrefix : '') + code + (semiColon ? ';' : '') + (newline ? '\n' : '');
            }
            for (var i = ast.Children.length - 1; i >= 0; i--) {
                var b = ast.Children[i];
                switch (b.Type) {
                    case NodeType.Function:
                        var name = b.GetType(NodeType.FunctionName);
                        add("function " + name.Value + "(");
                        var params = b.GetType(NodeType.FunctionParameters).Value;
                        for (var j = 0; j < params.length; j++) {
                            add(params[j].Value);
                            if (j < params.length - 1)
                                add(", ");
                        }
                        add(") {", true);
                        add(this.toJS(b.GetType(NodeType.FunctionCodeBlock), indented));
                        add("}", true);
                        break;
                    case NodeType.Assignment:
                        var assignee = b.GetType(NodeType.Assignee).Value;
                        var assignmentExpr = b.GetType(NodeType.Expression);
                        if (!result.includes("let " + assignee))
                            add("let " + assignee + " = " + this._tokensToString(assignmentExpr.Value), true, true);
                        else
                            add(assignee + " = " + this._tokensToString(assignmentExpr.Value), true, true);
                        break;
                    case NodeType.Return:
                        var returnExpr = b.GetType(NodeType.Expression);
                        add("return " + this._tokensToString(returnExpr.Value), true, true);
                        break;
                    case NodeType.Instruction:
                        var instName = b.GetType(NodeType.InstructionName);
                        var instArgs = b.GetType(NodeType.InstructionArguments);
                        add(this._tokensToString(instName.Value, false) + "(" + this._tokensToString(instArgs.Value, false) + ")", true, true);
                        break;
                    case NodeType.If:
                        var IfCondition = b.GetType(NodeType.IfCondition);
                        add("if (" + this._tokensToString(IfCondition.Value) + ") {", true);
                        add(this.toJS(b.GetType(NodeType.IfCodeBlock), indented));
                        add("}", true);
                        break;
                }
            }
            return result;
        }
    },
    Errors: {
        _prefix: "Yoda, and error throws: ",
        Expected: function (message) {
            console.error(this._prefix + "Expected " + message);
        }
    }
};
