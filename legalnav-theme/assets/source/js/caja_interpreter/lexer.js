// Turns CAJA source into tokens
var CajaLexer = {
    sourceCode: '', // Input source code
    position: 0, // Current position in input
    readPosition: 0, // Current reading position in input (after current char)
    char: null, // Current character to examine
    inBrackets: false,

    init: function() {
        this.resetPositionState();
        this.readChar();
    },

    resetPositionState: function() {
        this.position = 0;
        this.readPosition = 0;
        this.char = null;
        this.inBrackets = false;
        this.inQuotes = false;
    },

    // Set lexer source code
    setSourceCode: function(sourceCode) {
        this.sourceCode = sourceCode;
    },

    // Update current char to be next char and advance position in input
    readChar: function() {
        if(this.readPosition >= this.sourceCode.length) {
            this.char = null; // Set char to null if EOF or file has 0 length
        } else {
            this.char = this.sourceCode.charAt(this.readPosition);
        }

        // If current char is a bracket, mark inBrackets Flag (in order to not skip whitespace in
        // identifier names that are in brackets or pound signs)
        if(this.char === "[") {
            this.inBrackets = true;
        } else if(this.char === "]") {
            this.inBrackets = false;
        }

        if(this.char === '\"' && this.inQuotes) {
            this.inQuotes = false;
        } else if(this.char === '\"') {
            this.inQuotes = true;
        }

        this.position = this.readPosition;
        this.readPosition += 1;
    },

    // Outputs next token in sourceCode
    nextToken: function() {
        var token;

        if(!this.inBrackets && !this.inQuotes) {
            this.skipWhitespace();
        }
        
        switch(this.char) {
            case ';':
                token = new Token("SEMICOLON", this.char);
                break;
            case '=':
                token = new Token("EQUALS", this.char);
                break;
            case '[':
                token = new Token("LBRACKET", this.char);
                break;
            case ']':
                token = new Token("RBRACKET", this.char);
                break;
            case '\"':
                token = new Token("ESCAPED_QUOTE", this.char);
                break;
            case null:
                return token = new Token("EOF", this.char);
            default:
                if(this.isLetterOrNumber(this.char)) {
                    var literal = this.readIdentifier();
                    var type = this.lookupIdentifier(literal);
                    return token = new Token(type, literal);
                } else {
                    token = new Token("ILLEGAL", this.char);
                }
        }
        this.readChar();
        return token;
    },

    // Checks if an ident is a keyword or not
    // If ident is not a keyword, it is an identifier
    lookupIdentifier: function(ident) {
        if(Keywords[ident]) {
            return TokenTypes[Keywords[ident]];
        }
        return "IDENT";
    },

    readIdentifier: function() {
        var pos = this.position;
        if(this.inBrackets || this.inQuotes) {
            while(this.isLetterOrSpace(this.char)) {
                this.readChar();
            }
        } else {
            while(this.char !== null && this.isLetterOrNumber(this.char)) {
                this.readChar();
            }
        }

        // Return the string slice of initial position and position afer ident was read (aka the identifier)
        return this.sourceCode.slice(pos, this.position);
    },

    isLetter: function(letter) {
        return letter.match(/[a-zA-Z]/);
    },

    // Needed due to page names having numbers and dashes, ? marks, spaces, and periods
    isLetterOrNumber: function(letter) {
        return letter.match(/[a-zA-Z0-9\?\.\-]/);
    },

    isLetterOrSpace: function(letter) {
        return letter.match(/[a-zA-Z0-9\?\.\- ]/);
    },

    skipWhitespace: function() {
        if(this.char === ' ') {
            this.readChar();
        }
    }
}