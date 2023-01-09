var operatorPrecedences = {
    LOWEST: 0,
    OR: 1,
    AND: 2,
    EQUALS: 3,
}

// Turns tokens into AST
var CajaParser = {
    init: function(lexer) {
        this.lexer = lexer;

        this.prefixParseFuncs = {}; // Table of prefix funcs
        this.infixParseFuncs = {}; // Table of infix funcs

        // Set up expression parsing funcs
        this.registerPrefixFunc("IDENT", this.parseIdentifier);
        this.registerPrefixFunc("TRUE", this.parseBoolean);
        this.registerPrefixFunc("FALSE", this.parseBoolean);

        this.registerInfixFunc("EQUALS", this.parseInfixExpression);

        // Read two tokens, so that cur and peek Token are set
        this.setInitialTokens();
    },

    setInitialTokens: function() {
        this.curToken = undefined;
        this.peekToken = undefined;
        this.nextToken();
        this.nextToken();
    },

    // Advance both cur and peek token
    nextToken: function() {
        this.curToken = this.peekToken; 
        this.peekToken = this.lexer.nextToken(); 
    },

    parseProgram: function() {
        ASTNode.statements = [];
        // Create an root ASTNode with default settings (array of statements)
        var program = Object.create(ASTNode);
        
        // While curToken type is not EOF
        while(!this.curTokenIs("EOF")) {
            
            var statement = this.parseStatement();

            if(statement !== null) {
                program.statements.push(statement);
            }
        
            this.nextToken();

            if(this.curTokenIs("SEMICOLON")) {
                this.nextToken();
            }
        }

        return program;
    },

    parseStatement: function() {
        switch(this.curToken.type) {
            case "GOTO":
                return this.parseGotoStatement();
            case "SET":
                return this.parseSetStatement();
            case "IF":
                return this.parseIfStatement();
            default:
                return this.parseExpressionStatement();
        }
    },

    parseGotoStatement: function() {
        // GOTO statement structures
        //  GOTO [1-Agree]

        var statement = Object.create(GotoStatement, {token: {value: this.curToken}});
        var isBracketedIdent = false;

        // Parse differently based on GOTO statement structure
        if(this.peekTokenIs("LBRACKET") || this.peekTokenIs("IDENT")) {
            if(this.peekTokenIs("LBRACKET")) {
                isBracketedIdent = true;
            }
        } else {
            return null; // Token must be a LBRACKET or IDENT to be correct
        }

        if(isBracketedIdent) {
            // Bracketed GOTO identifier
            if(!this.expectPeek("LBRACKET")) {
                return null;
            }
    
            if(!this.expectPeek("IDENT")) {
                return null;
            }
    
            statement.value = this.parseExpression("LOWEST");
    
            if(!this.expectPeek("RBRACKET")) {
                return null;
            }

            this.nextToken();
            
        } else {
            // GOTO identifier is not in brackets
            if(!this.expectPeek("IDENT")) {
                return null;
            }
    
            statement.value = this.parseExpression("LOWEST");
        }
        
        if(this.peekTokenIs("SEMICOLON")) {
            this.nextToken();
        }

        return statement;
    },

    parseIfStatement: function() {
        var statement = Object.create(IfStatement, {token: {value: this.curToken}});

        var consequences = []; // Statements run if expression is true

        if(!this.expectPeek("LBRACKET")) {
            return null;
        }

        // The following needs ot be made dynamic through aprsing an expression instead
        if(!this.expectPeek("IDENT")) {
            return null;
        }

        var expressionIdentifier = Object.create(Identifier, {token: {value: this.curToken}, value: {value: this.curToken.literal}});

        if(!this.expectPeek("RBRACKET")) {
            return null;
        }

        this.nextToken();

        statement.expression = this.parseInfixExpression(expressionIdentifier);

        if(!this.expectPeek("SEMICOLON")) {
            return null;
        }

        this.nextToken();

        while(!this.curTokenIs("ENDIF")) {
            consequences.push(this.parseStatement());
            this.nextToken();
        }

        statement.consequence = consequences;

        return statement;
    },

    parseSetStatement: function() {
        var statement = Object.create(SetStatement, {token: {value: this.curToken}});

        if(!this.expectPeek("LBRACKET")) {
            return null;
        }

        if(!this.expectPeek("IDENT")) {
            return null;
        }

        statement.name = Object.create(Identifier, {token: {value: this.curToken}, value: {value: this.curToken.literal}});

        if(!this.expectPeek("RBRACKET")) {
            return null;
        }

        if(!this.expectPeek("TO")) { // Maybe check for EQUALS operator here, if GAs actually use alternate set syntax
            return null;
        }

        this.nextToken();

        // Handle expression
        statement.value = this.parseExpression("LOWEST");

        if(this.peekTokenIs("SEMICOLON")) {
            this.nextToken();
        }

        return statement;
        
    },

    parseExpressionStatement: function() {
        var statement = Object.create(ExpressionStatement,
            {
                token: {value: this.curToken}, 
                expression: {value: this.parseExpression(operatorPrecedences["LOWEST"])} // Pass in operator w/ lowest precedence
            }
        );

        if(this.peekTokenIs("SEMICOLON")) {
            this.nextToken();
        }

        return statement;
    },

    // Call parsing function if associated function for token type
    parseExpression: function(precedence) {
        // Disregard first escape quote of value
        if(this.curToken.type == 'ESCAPED_QUOTE') {
            this.nextToken();
        }

        var prefix = this.prefixParseFuncs[this.curToken.type];

        if(!prefix) {
            return null;
        }

        var leftExp = prefix.call(this); // Call function for parsing specified token type in prefix pos w/ explicit this binding

        while(!this.peekTokenIs("SEMICOLON") && precedence < this.peekPrecendence()) {
            var infix = this.infixParseFuncs[this.peekToken.type];
            if(infix === null) {
                return leftExp;
            }

            this.nextToken();

            leftExp = infix(leftExp);
        }

        // Handle second escape quote in value
        if(this.peekTokenIs("ESCAPED_QUOTE")) {
            this.nextToken();
        }

        return leftExp;
    },

    parseIdentifier: function() {
        return Object.create(Identifier, {token: {value: this.curToken}, value: {value: this.curToken.literal}});
    },

    parseBoolean: function() {
        return Object.create(BooleanObj, {token: {value: this.curToken}, value: {value: (this.curToken.type === "TRUE")}});
    },

    parseInfixExpression: function(left) {
        var expression = Object.create(InfixExpression, {
            token: {value: this.curToken},
            operator: {value: this.curToken.literal},
            leftExp: {value: left}
        });
        var precedence = this.curPrecedence();
        this.nextToken();

        expression.rightExp = this.parseExpression(precedence);

        return expression;
    },

    curTokenIs: function(tokenType) {
        return this.curToken.type === tokenType;
    },

    peekTokenIs: function(tokenType) {
        return this.peekToken.type === tokenType;
    },
    
    // Checks if expected peekToken Type is true, then advance to next token
    expectPeek: function(tokenType) {
        if (this.peekTokenIs(tokenType)) {
            this.nextToken();
            return true;
        } else {
            return false;
        }
    },

    // Returns precedence associated w/ the token type of peek token
    // If none, then return LOWEST
    peekPrecendence: function() {
        return (operatorPrecedences[this.peekToken.type]) ? operatorPrecedences[this.curToken.type] : operatorPrecedences["LOWEST"];
    },

    // Returns precedence associated w/ the token type of current token
    // If none, then return LOWEST
    curPrecedence: function() {
        return (operatorPrecedences[this.curToken.type]) ? operatorPrecedences[this.curToken.type] : operatorPrecedences["LOWEST"];
    },

    // Helper methods to add entries into the tables of parsing functions
    registerPrefixFunc: function(tokenType, func) {
        this.prefixParseFuncs[tokenType] = func;
    },
    registerInfixFunc: function(tokenType, func) {
        this.infixParseFuncs[tokenType] = func;
    },
}