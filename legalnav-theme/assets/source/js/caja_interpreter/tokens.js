var TokenTypes = {
    // Utility tokens not in CAJA language but useful for parsing
    ILLEGAL: "ILLEGAL", // Specifies a token we dont know
    EOF: "EOF", // Specifies end of file/end of string

    // Indentifiers + literals
    IDENT: "IDENT",

    // Operators
    EQUALS: "=",

    // Delimiters
    LBRACKET: "[",
    RBRACKET: "]",
    SEMICOLON: ";",

    // Keywords
    SET: "SET",
    TO: "TO",
    TRUE: "TRUE",
    FALSE: "FALSE",
    GOTO: "GOTO",
    IF: "IF",
    ENDIF: "ENDIF" 
}

var Keywords = {
    SET: "SET",
    TO: "TO",
    TRUE: "TRUE",
    FALSE: "FALSE",
    GOTO: "GOTO",
    IF: "IF",
    ENDIF: "ENDIF"
}

function Token(type, literal) {
    this.type = type;
    this.literal = literal;
}