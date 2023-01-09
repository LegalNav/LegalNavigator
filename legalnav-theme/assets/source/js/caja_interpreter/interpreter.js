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