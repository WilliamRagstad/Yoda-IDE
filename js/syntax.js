hljs.registerLanguage("yoda", function() {
    "use strict";
    const e = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"]
      , n = ["true", "false", "null", "undefined", "NaN", "Infinity"]
      , a = [].concat(["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"], ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"], ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer"], ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"]);
    function s(e) {
        return r("(?=", e, ")")
    }
    function r(...e) {
        return e.map(e=>(function(e) {
            return e ? "string" == typeof e ? e : e.source : null
        }
        )(e)).join("")
    }
    return function(t) {
        var i = "[A-Za-z$_][0-9A-Za-z$_]*"
          , c = {
            begin: /<[A-Za-z0-9\\._:-]+/,
            end: /\/[A-Za-z0-9\\._:-]+>|\/>/
        }
          , o = {
            $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
            keyword: e.join(" "),
            literal: n.join(" "),
            built_in: a.join(" ")
        }
          , l = {
            className: "number",
            variants: [{
                begin: "\\b(0[bB][01]+)n?"
            }, {
                begin: "\\b(0[oO][0-7]+)n?"
            }, {
                begin: t.C_NUMBER_RE + "n?"
            }],
            relevance: 0
        }
          , E = {
            className: "subst",
            begin: "\\$\\{",
            end: "\\}",
            keywords: o,
            contains: []
        }
          , d = {
            begin: "html`",
            end: "",
            starts: {
                end: "`",
                returnEnd: !1,
                contains: [t.BACKSLASH_ESCAPE, E],
                subLanguage: "xml"
            }
        }
          , g = {
            begin: "css`",
            end: "",
            starts: {
                end: "`",
                returnEnd: !1,
                contains: [t.BACKSLASH_ESCAPE, E],
                subLanguage: "css"
            }
        }
          , u = {
            className: "string",
            begin: "`",
            end: "`",
            contains: [t.BACKSLASH_ESCAPE, E]
        };
        E.contains = [t.APOS_STRING_MODE, t.QUOTE_STRING_MODE, d, g, u, l, t.REGEXP_MODE];
        var b = E.contains.concat([{
            begin: /\(/,
            end: /\)/,
            contains: ["self"].concat(E.contains, [t.C_BLOCK_COMMENT_MODE, t.C_LINE_COMMENT_MODE])
        }, t.C_BLOCK_COMMENT_MODE, t.C_LINE_COMMENT_MODE])
          , _ = {
            className: "params",
            begin: /\(/,
            end: /\)/,
            excludeBegin: !0,
            excludeEnd: !0,
            contains: b
        };
        return {
            name: "Yoda",
            aliases: ["yoda", "yd"],
            keywords: o,
            contains: [t.SHEBANG({
                binary: "node",
                relevance: 5
            }), {
                className: "meta",
                relevance: 10,
                begin: /^\s*['"]use (strict|asm)['"]/
            }, t.APOS_STRING_MODE, t.QUOTE_STRING_MODE, d, g, u, t.C_LINE_COMMENT_MODE, t.COMMENT("/\\*\\*", "\\*/", {
                relevance: 0,
                contains: [{
                    className: "doctag",
                    begin: "@[A-Za-z]+",
                    contains: [{
                        className: "type",
                        begin: "\\{",
                        end: "\\}",
                        relevance: 0
                    }, {
                        className: "variable",
                        begin: i + "(?=\\s*(-)|$)",
                        endsParent: !0,
                        relevance: 0
                    }, {
                        begin: /(?=[^\n])\s/,
                        relevance: 0
                    }]
                }]
            }), t.C_BLOCK_COMMENT_MODE, l, {
                begin: r(/[{,\n]\s*/, s(r(/(((\/\/.*)|(\/\*(.|\n)*\*\/))\s*)*/, i + "\\s*:"))),
                relevance: 0,
                contains: [{
                    className: "attr",
                    begin: i + s("\\s*:"),
                    relevance: 0
                }]
            }, {
                begin: "(" + t.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
                keywords: "return throw case",
                contains: [t.C_LINE_COMMENT_MODE, t.C_BLOCK_COMMENT_MODE, t.REGEXP_MODE, {
                    className: "function",
                    begin: "(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|" + t.UNDERSCORE_IDENT_RE + ")\\s*=>",
                    returnBegin: !0,
                    end: "\\s*=>",
                    contains: [{
                        className: "params",
                        variants: [{
                            begin: t.UNDERSCORE_IDENT_RE
                        }, {
                            className: null,
                            begin: /\(\s*\)/,
                            skip: !0
                        }, {
                            begin: /\(/,
                            end: /\)/,
                            excludeBegin: !0,
                            excludeEnd: !0,
                            keywords: o,
                            contains: b
                        }]
                    }]
                }, {
                    begin: /,/,
                    relevance: 0
                }, {
                    className: "",
                    begin: /\s/,
                    end: /\s*/,
                    skip: !0
                }, {
                    variants: [{
                        begin: "<>",
                        end: "</>"
                    }, {
                        begin: c.begin,
                        end: c.end
                    }],
                    subLanguage: "xml",
                    contains: [{
                        begin: c.begin,
                        end: c.end,
                        skip: !0,
                        contains: ["self"]
                    }]
                }],
                relevance: 0
            }, {
                className: "function",
                beginKeywords: "function",
                end: /\{/,
                excludeEnd: !0,
                contains: [t.inherit(t.TITLE_MODE, {
                    begin: i
                }), _],
                illegal: /\[|%/
            }, {
                begin: /\$[(.]/
            }, t.METHOD_GUARD, {
                className: "class",
                beginKeywords: "class",
                end: /[{;=]/,
                excludeEnd: !0,
                illegal: /[:"\[\]]/,
                contains: [{
                    beginKeywords: "extends"
                }, t.UNDERSCORE_TITLE_MODE]
            }, {
                beginKeywords: "constructor",
                end: /\{/,
                excludeEnd: !0
            }, {
                begin: "(get|set)\\s+(?=" + i + "\\()",
                end: /{/,
                keywords: "get set",
                contains: [t.inherit(t.TITLE_MODE, {
                    begin: i
                }), {
                    begin: /\(\)/
                }, _]
            }],
            illegal: /#(?!!)/
        }
    }
}());
