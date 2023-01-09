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
// STEPS: Lex -> Parse -> Interpret

// CAJA supported syntax
// SET v TO e or SET v = e
// GOTO v
// IF exp
// END IF

// Evaluates AST and mutates answers array
var CajaInterpreter = {
    // answers: undefined, // Curated experience answers needed to be modified
    experience: undefined, // Reference to experience to advance page in GOTO eval
    vars: undefined, // Curated experience vars, needed to check type
    init: function(vars) {
        this.lexer = Object.create(CajaLexer);
        this.parser = Object.create(CajaParser, {lexer: {value: this.lexer}});

        // Initialize lexer and parser
        this.lexer.init();
        this.parser.init(this.lexer);

        this.parsedAST = undefined;
    },

    setExperience: function(experience) {
        this.experience = experience;
    },

    // setAnswers: function(answers) {
    //     this.answers = answers;
    // },

    setVars: function(vars) {
        this.vars = vars;
    },

    generateAST: function() {
        this.parsedAST = this.parser.parseProgram();
    },

    // Evaluation mutates the state of the A2J GA 'vars' object
    eval: function(statements) {
        for(var i = 0; i < statements.length; i++) {
            switch(statements[i].token.type) {
                case "IF":
                    this.evaluateIf(statements[i]);
                    break;
                case "SET":
                    this.evaluateSet(statements[i]);
                    break;
                case "GOTO":
                    this.evaluateGoto(statements[i]);
                    return true;
                default:
                    break;
            }
        }
    },

    evaluateGoto: function(gotoStatementNode) {
        // Stop parsing and go to named page immediately
        var pageToGoto = gotoStatementNode.value.value;
        this.experience.advanceQuestion(pageToGoto);
    },

    evaluateSet: function(setStatementNode){
        var name = setStatementNode.name.value.toLowerCase();
        var value = setStatementNode.value.value;

        // Type associated w/ name in vars or default to Text
        if(this.vars.hasOwnProperty(name)) {
            var type = this.vars[name].hasOwnProperty('type') ? this.vars[name].type : "Text";
        } else {
            var type = "Text";
        }
        

        var answerObj = Object.create(A2JAnswer);
        answerObj.init(name, false, type);
        answerObj.addValue(value);

        this.experience.answers[name] = answerObj;
    },

    evaluateIf: function(ifStatementNode) {
        if(this.evalIfCondition(ifStatementNode.expression) === true) {
            this.evalIfConsequences(ifStatementNode.consequence);
        }
    },
    evalIfCondition: function(ifCondExpr) {
        var name = ifCondExpr.leftExp.value.toLowerCase();
        var value = ifCondExpr.rightExp.value;
        if(this.experience.answers.hasOwnProperty(name)) {
            if(this.experience.answers[name].values.includes(value)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    },
    evalIfConsequences: function(ifCondCons) {
        this.eval(ifCondCons);
    },

}
function Step() {
    this.insideHTML = "";
    this.resources = [];

    this.addResource = function(resource) { this.resources.push(resource); };
}

var PersonalPlan = {
    answers: {},
    title: "",
    steps: [],
    stepTitles: [],

    currentStepIsDuplicate: false,
    currentStep: {},

    unzippedGuidePath: jQuery("#post-data")[0].dataset.unzippedPath,

    build: function(answers) {
        var self = this;
        // Set answers
        this.setAnswers(answers);

        // Fetch interview template
        jQuery.ajax({
            url: this.unzippedGuidePath + "/template-aggregate.json",
            dataType: "json",
            method: "GET",
            timeout: 0,

            success: function(templateJSON) {
                // Set title
                self.setTitle(templateJSON.title);

                // Set steps and resources
                self.traverseStepNodeChildren(templateJSON.rootNode);

                // Filter out steps w/ same content


                // Render plan
                self.renderPlan();
            },
            error : function(errMsg) {
                return "Error building personal plan: " + errMsg;
            }
        });
    },

    // Recursively build steps and resources based on answers and template tree
    traverseStepNodeChildren: function(node) {
        // Add steps based on answers
        for(var i = 0; i < node.children.length; i++) {
            var step = node.children[i];

            if(step.hasOwnProperty('rootNode')) {
                step = step.rootNode;
            }

            switch (step.tag) {
                case "a2j-template":
                    // Set current step to a new step
                    this.currentStep = new Step();

                    if(step.children.length > 0) {
                        this.traverseStepNodeChildren(step);

                        if(!this.currentStepIsDuplicate) {
                            // Push current step to steps
                            this.addStep(this.currentStep);
                        }

                    }

                    // Reset current step to blank obj
                    this.currentStep = {};
                    this.currentStepIsDuplicate = false;

                    break;

                case "a2j-conditional":
                    if(this.stepsChildrenShouldBeInPlan(step)) {
                        this.traverseStepNodeChildren(step);
                    }
                    break;

                case "a2j-section-title":
                    // Handle possibly duplicate steps (due to template concatination)
                    if(this.stepTitles.includes(step.state.title)) {
                        this.currentStepIsDuplicate = true;
                        break;
                    } else {
                        this.stepTitles.push(step.state.title);
                        var underlineClass = (step.state.underline) ? 'underline' : '';
                        var titleID = step.state.title.replace(/ /g,'');
    
                        this.currentStep.insideHTML += '<a href="javascript:;" class="step-toggle" aria-label="toggle the step content"><' + step.state.titleTag + ' class="' + underlineClass + '">';
                        this.currentStep.insideHTML += '<span class="step-label"></span>' + step.state.title;
                        this.currentStep.insideHTML += '</' + step.state.titleTag + '></a>';
                        this.currentStep.insideHTML += '<div class="completed-check no-print"><label for="step-'+titleID+'"><input id="step-'+titleID+'" type=checkbox>Completed</label></div>';
                        break;
                    }

                case "a2j-rich-text":
                    // Turn all ln resource tags into a tags
                    // These ln resource tags are generated in A2J Author
                    var originalUserContent = step.state.userContent;

                    var regex = /<legal-nav-resource-id guid=\"(.*)\" name=\"(.*)\">.*<\/legal-nav-resource-id>/gm;
                    var subst = '<a target="_blank" href="$1">$2</a>';

                    var parsedUserContent = originalUserContent.replace(regex, subst);

                    this.currentStep.insideHTML += '<div class="step-content">' + parsedUserContent + '</div>';
                    break;

                default:
                    break;
            }
        }

        // Add resources based on answers
    },

    // Compares step's state to the answers to determine if the step should be included in the plan
    stepsChildrenShouldBeInPlan: function(step) {
        var booleanMap = {
            "is-true": "True",
            "is-false": "False"
        }
        var varName = step.state.leftOperand.toLowerCase();
        var varValue = step.state.operator;


        if(this.answers.hasOwnProperty(varName)) {
            if (this.answers[varName].values[1].toString().toLowerCase() == booleanMap[varValue].toLowerCase()) { // Compare second array val to skip null
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    setAnswers: function(answers) {this.answers = answers; },
    setTitle: function(title) { this.title = title; },
    addStep: function(step) { this.steps.push(step); },

    renderPlan: function() {
        this.renderTitle();
        this.renderSteps();

        jQuery('.curated-experience').first().addClass('hidden');
        jQuery('.personal-plan-header').first().removeClass('hidden');
        jQuery('.personal-plan').first().removeClass('hidden');
        jQuery('.plan-actions').first().removeClass('hidden');
    },

    renderTitle: function() {
        jQuery('.plan-title').first()[0].innerHTML = '<h1>' + this.title; + '<h1>';
    },

    renderSteps: function() {
        var stepsElem = jQuery('.plan-steps').first()[0];
        for(var i = 0; i < this.steps.length; i++) {
            var step = this.steps[i];
            var stepElem = document.createElement('div');

            jQuery(stepElem).addClass('step');

            stepsElem.appendChild(stepElem);

            stepElem.innerHTML += step.insideHTML;

            // Add step label based on i value
            jQuery(stepElem).find('.step-label').first()[0].innerHTML = 'Step ' + (i + 1) + ': ';
        }
        // toggle the completion of an action plan step
        jQuery('.completed-check input').click(function(event) {
            var completedCheck = jQuery(event.currentTarget);
            if(completedCheck.closest('.step').eq(0).hasClass("completed")) {
                completedCheck.closest('.step').eq(0).removeClass("completed");
            } else {
                completedCheck.closest('.step').eq(0).addClass("completed");
                completedCheck.closest('.step').find('.step-content, .completed-check, .step-toggle').removeClass('active');
            }
        });
        // toggle open/close action plan step
		jQuery('.step-toggle').click(function(event) {
            var step = jQuery(event.currentTarget);

			step.toggleClass('active');
			step.closest('.step').find('.step-content, .completed-check').toggleClass('active');
        });
        // check with user to make sure they want to leave page with action plan on it
        window.addEventListener("beforeunload", function (e) {
            var confirmationMessage = 'Leave page? '
                                    + 'Action plan will be lost';

            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
        });
        // Make all AP links open in a new tab
        jQuery('.step-content a').attr('target', '_blank');
    }
}

var A2JAnswer = {
    init: function(name, repeating, type) {
        this.name = name;
        this.repeating = repeating;
        this.type = type;
        this.comment = ""; // Not sure if needed, adding a default in case
        this.values = [null]; // Array with 0th pos null by default (legacy A2J reasons)
    },
    addValue: function(value) {
        this.values.push(value);
    },
    clearValues: function() {
        this.values = [null];
    }
}

// Object w/ shared functionality for all Curated Experiences
var CuratedExperience = {
    init: function() {
        this.data = {};
    }
}

// Object w/ functionality specific to A2J Curated Experiences
var A2JCuratedExperience = Object.create(CuratedExperience);

A2JCuratedExperience.initProperties = function() {
    this.interviewID = jQuery("#post-data")[0].dataset.curatedExperienceId;
    this.questions = this.data.pages;
    this.vars = this.data.vars;
    this.initialQuestionName = this.data.firstPage;
    this.currentQuestionName = this.initialQuestionName;
    this.questionNameHistory = []; // Array of previous question names (used to go back to prev question)
    this.answers = {}; // Object of answers w/ answer name in lowercase as key, and A2JAnswer obj as value
    this.answersHistory = []; // Array of previous answer objects (answer states for back button)
    this.interpreter = Object.create(CajaInterpreter);

    this.interpreter.init();
    //this.interpreter.setAnswers(this.answers);
    this.interpreter.setVars(this.vars);
    this.interpreter.setExperience(this);
} ;

A2JCuratedExperience.retrieveData = function() {
    var self = this; // Preserve 'this' for callback
    jQuery.ajax({
        url: jQuery("#post-data")[0].dataset.unzippedPath + "/Guide.json",
        dataType: "json",
        method: "GET",
        timeout: 0,

        success: function(data) {
            self.data = data;
            self.initProperties();

            // Add event to back button
            jQuery('.back-button').first().click(function() { self.regressQuestion(); });
            self.renderQuestion(self.initialQuestionName);
        },
        error : function(errMsg) {
            return "Error building personal plan: " + errMsg;
        }
    });
};

A2JCuratedExperience.assembleInterview = function(answers) {
    var personalPlan = Object.create(PersonalPlan);
    personalPlan.build(answers);
};

A2JCuratedExperience.updateProgressBar = function() {
    var progressBarElem = jQuery('.bar').first()[0];

    // Get current width to compare to new calc width
    var oldWidth = parseInt(progressBarElem.style.width.replace('%', ''));

    // Bar width based on how many questions answered vs questions left
    // If the bar would move backwards, then no movement is made
    var totalQuestions = Object.keys(this.questions).length;

    // Warning: Objects in JS are NOT ordered, and this calculation assumes they are. Sadly, pages is
    // not an array in the data returned from A2J so this is the best we can do.
    var questionsRemaining = totalQuestions - (Object.keys(this.questions).indexOf(this.currentQuestionName) + 1);
    var calculatedWidth = Math.round(100 * (totalQuestions - questionsRemaining) / totalQuestions);

    // Only update width if new width is larger
    if(oldWidth < calculatedWidth) {
        progressBarElem.style.width = calculatedWidth + "%";
    }    
}

A2JCuratedExperience.renderHTML = function(parentElem, html) {
    parentElem.innerHTML = html;
};

A2JCuratedExperience.buildFieldHTML = function(fieldObj) {
    var labeledInputs = [
        "radio", "number", "date", "text", "textarea"
    ];

    // Map A2J field types to html input types
    var htmlFieldTypes = {
        "radio": "radio",
        "list":"select",
        "number-pick":"select",
        "text-pick":"select",
        "numberzip":"number",
        "numberphone":"number",
        "datemdy":"date",
        "text":"text",
        "text-long": "textarea",
    }

    var htmlFieldType = htmlFieldTypes[fieldObj.type];

    fieldHTML = "";

    inputHTML = buildInputElem(fieldObj);

    // Only build label if needed
    if(labeledInputs.includes(htmlFieldType)) {
        labelHTML = buildLabelElem(fieldObj);

        // Determine if label goes before or after input field
        if(labelAfterInput(htmlFieldType)) {
            fieldHTML += inputHTML.concat(labelHTML);
        } else {
            fieldHTML += labelHTML.concat(inputHTML);
        }
    } else {
        fieldHTML += inputHTML;
    }

    fieldHTML += "<br>";

    return fieldHTML;

    function buildInputElem(fieldObj) {
        if(htmlFieldType == 'textarea') {
            var inputElem = document.createElement('textarea');
        } else {
            var inputElem = document.createElement('input');
        }

        var attributes = {
            type: htmlFieldType,
            required: fieldObj.required,
            // Needs unique id to link label and input
            id: fieldObj.name.concat(fieldObj.value).replace(/\s+/gm, ""),
            name: fieldObj.name.replace(/\s+/gm,"-"),
            value: fieldObj.value.replace(/\s+/gm, "-")
        }

        Object.keys(attributes).forEach(function(key) {
            inputElem.setAttribute(key, attributes[key]);
        });

        // Return HTML string of input elem
        return inputElem.outerHTML;
    }

    function buildLabelElem(fieldObj) {
        var forAttr = 'for=' + fieldObj.name.concat(fieldObj.value).replace(/\s+/gm, "");
        return '<label ' + forAttr + '>' + fieldObj.label.replace(/(<([^>]+)>)/gi, "") + '</label>';
    }

    function labelAfterInput(fieldType) {
        return (["radio"].includes(fieldType)) ? true : false;
    }
};

A2JCuratedExperience.saveQuestionAnswerState = function() {
    // Add current question name to questionNameHistory array
    this.questionNameHistory.push(this.currentQuestionName);

    // Add current answers state to answersHistory array
    this.answersHistory.push(JSON.parse(JSON.stringify(this.answers)));
}

A2JCuratedExperience.renderButtons = function(question, buttons, parentElem, btnType) {
    var self = this; // Save ref of this for callback
    for(var i = 0; i < buttons.length; i++) {
        var button = buttons[i];

        var buttonElem = document.createElement('button');
        buttonElem.setAttribute('type', btnType);
        buttonElem.setAttribute('data-value', button.value);
        buttonElem.setAttribute('data-name', button.name);
        buttonElem.setAttribute('data-next', button.next);
        buttonElem.textContent = button.label;

        // Add advanceQuestion event on button click
        buttonElem.addEventListener('click', function(e) {
            e.preventDefault();

            if(e.target.form !== null) {
                var submittedVals = jQuery(e.target.form).serializeArray();
            }

            // Save current question and answer state
            A2JCuratedExperience.saveQuestionAnswerState.call(self);

            // Add any submitted field values to answers
            if(submittedVals) {
                for(var i = 0; i < submittedVals.length; i++) {
                    var fieldName = submittedVals[i].name.replace(/-/g," ").toLowerCase();
                    var fieldValue = submittedVals[i].value.replace(/-/g, " ");

                    if(self.vars.hasOwnProperty(fieldName)) {
                        var type = self.vars[fieldName].type;
                    } else {
                        var type = "Text";
                    }

                    var answerObj = Object.create(A2JAnswer);
                    answerObj.init(fieldName, false, type);
                    answerObj.addValue(fieldValue);

                    self.answers[fieldName] = answerObj;

                }
            }

            // Only add to answers if button has name and value
            if(e.target.dataset.name && e.target.dataset.value) {
                var name = e.target.dataset.name.toLowerCase();
                var value = e.target.dataset.value;

                // Type associated w/ name in vars or default to Text
                if(self.vars[name].type) {
                    var type = self.vars[name].type;
                } else {
                    var type = "Text";
                }

                var answerObj = Object.create(A2JAnswer);
                answerObj.init(name, false, type);
                answerObj.addValue(value);

                self.answers[name] = answerObj;
            }

            // Keep track of question name before caja code runs to determine if a GOTO changed the current question or not
            var curQuestionBeforeCaja = self.currentQuestionName;

            // If there is afterCode to be ran, run it now
            if(question.codeAfter !== "") {
                self.runCajaCode.call(self, question.codeAfter); // Set 'this' to be the curated experience
            }

            // If question not already advanced via GOTO in cajaCode (curQuestionName before caja is = to curQuestionName)
            if(curQuestionBeforeCaja === self.currentQuestionName) {
                self.advanceQuestion(e.target.dataset.next);
            }
        });

        parentElem.appendChild(buttonElem);
    }
}

// NOTE: initProperties must be called prior to this function
A2JCuratedExperience.renderQuestion = function(questionName) {
    // Save a reference to current A2JCuratedExperience instance for use in event handler below
    var self = this;

    var questionTextContainer = document.getElementsByClassName('question-text')[0];
    var questionHelpContainer = document.getElementsByClassName('question-help')[0];
    var questionButtonsContainer = document.getElementsByClassName('question-buttons')[0];

    questionFieldsContainer = document.getElementsByClassName('question-fields')[0];

    // Clear current rendered question data
    questionTextContainer.innerHTML = "";
    questionHelpContainer.innerHTML = "";
    questionButtonsContainer.innerHTML = "";
    questionFieldsContainer.innerHTML = "";

    var question = this.questions[questionName];
    var fields = question.fields;
    var buttons = question.buttons;

    questionTextContainer.innerHTML = question.text;

    if(question.help.length > 0) {
        questionHelpContainer.innerHTML += '<div class="question-help-container"><h5>' + question.learn + '</h5>' + question.help + '</div>';
    }

    // Render fields
    if(fields.length > 0) {
        var formElem = document.createElement('form');

        for(var i = 0; i < fields.length; i++) {
            formElem.innerHTML += this.buildFieldHTML(fields[i]);
        }

        // Render buttons
        this.renderButtons(question, buttons, formElem, 'submit');

        questionFieldsContainer.appendChild(formElem);
    } else {
        this.renderButtons(question, buttons, questionButtonsContainer, 'button');
    }

    // Render back button if not first question
    if(self.questionNameHistory.length > 0) {
        jQuery('.back-button').first().removeClass('hidden');
    } else {
        jQuery('.back-button').first().addClass('hidden');
    }

    // Check if there is codeBefore to be run
    if(question.codeBefore !== "") {
        self.runCajaCode.call(self, question.codeBefore); // Set 'this' to be the curated experience
    }
};

A2JCuratedExperience.formIsValidated = function() {
    var form = jQuery('.question-fields form');
    var formInputs = form.children('input');
    
    return validateRadios(formInputs);

    function validateRadios(formElems) {
        var radioRequired = false;
        var radioSelected = false;

        formElems.each(function(i, elem) {
            if(elem.type === 'radio' && elem.required) {
                radioRequired = true;
            }
        });

        if(radioRequired) {
            formElems.each(function(i, elem) {
                if(elem.type === 'radio' && elem.checked) {
                    radioSelected = true;
                }
            });

            return radioSelected;
        }

        return true;
    }
}

A2JCuratedExperience.advanceQuestion = function(questionName) {
    // Check if next is ASSEMBLE
    // SUCCESS needs to be added here
    if(questionName === "ASSEMBLE" || questionName === "SUCCESS" || questionName === "ASSEMBLE-SUCCESS") {
        this.assembleInterview(this.answers);
    } else {
        // Validate form inputs
        if(A2JCuratedExperience.formIsValidated()) {
            // Set currentQuestionName to new name
            this.currentQuestionName = questionName;
            this.renderQuestion(questionName);
            this.updateProgressBar();

            // Scroll to top
            jQuery('html, body').animate({
                scrollTop: jQuery('.container').position().top
            }, 700);
        } else {
            alert("Required fields not supplied.");
        }
    }
};

A2JCuratedExperience.regressQuestion = function() {
    // Set current answers to element popped from answersHistory array
    this.answers = this.answersHistory.pop();

    // Set currentQuestionName to name of last question
    this.currentQuestionName = this.questionNameHistory.pop();

    // Render currentQuestion
    this.renderQuestion(this.currentQuestionName);
    this.updateProgressBar();

    // Scroll to top
    jQuery('html, body').animate({
        scrollTop: jQuery('.container').position().top
    }, 700);
}

A2JCuratedExperience.normalizeCajaSource = function(cajaSource) {
    // Remove BR Tags to ; and trim white space at end
    var brRegex = /(<BR\/>)+/gm;
    cajaSource = cajaSource.replace(brRegex, ';').trim();

    // Turn escape quotes in GOTO statements into brackets
    cajaSource = cajaSource.replace(/GOTO \"([a-zA-z0-9\.\-\? ]+)\"/gm, 'GOTO [$1]');

    // Combine END IF to ENDIF to parse easier
    cajaSource = cajaSource.replace(/(END IF)+/gm, 'ENDIF');

    return cajaSource
};
A2JCuratedExperience.runCajaCode = function(cajaSource) {
    // Normalize caja source
    var normalizedCajaSource = this.normalizeCajaSource(cajaSource);

    // Set lexer source code
    this.interpreter.lexer.setSourceCode(normalizedCajaSource);

    // Reinitialize lexer and parser (after source is set)
    this.interpreter.lexer.init();
    this.interpreter.parser.init(this.interpreter.lexer);

    // Create AST from source
    this.interpreter.generateAST();

    // Interpret Caja Source and Mutate Vars
    this.interpreter.eval(this.interpreter.parsedAST.statements);
};
// ---------- MAIN ---------- //
var curatedExperience = Object.create(A2JCuratedExperience);
curatedExperience.retrieveData();
