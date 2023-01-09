// Node Object for Parser AST
// There will be a root node for every AST the parser produces
// Every CAJA statement will be an element of statements
var ASTNode = {
    statements: [],
}

// Obj representing a GOTO Statement
var GotoStatement = {
    init: function(token, name) {
        this.token = token;
        this.name = name;
    },
}

// Obj representing a SET Statement
var SetStatement = {
    init: function(token, name, value) {
        this.token = token;
        this.name = name; // Name of the statements identifier
        this.value = value; // Value of the statments expression
    },
}

// Obj representing an If Statement
var IfStatement = {
    init: function(token, condition, consequence) {
        this.token = token;
        this.condition = condition; // Expression for if predicate
        this.consequence = consequence; // Statements to run if true
    },
}

// Obj representing an Identifier
var Identifier = {
    init: function(token, value) {
        this.token = token;
        this.value = value;
    },
}

// Obj representing a Boolean
var BooleanObj = {
    init: function(token, value) {
        this.token = token;
        this.value = value;
    },
}

// Obj representing an Expression
var ExpressionStatement = {
    init: function(token, expression) {
        this.token = token;
        this.expression = expression; // Field that holds the expression
    },
}

// Obj representing an Infix Expression
var InfixExpression = {
    init: function(token, leftExp, operator, rightExp) {
        this.token = token;
        this.leftExp = leftExp;
        this.operator = operator;
        this.rightExp = rightExp;
    },
}