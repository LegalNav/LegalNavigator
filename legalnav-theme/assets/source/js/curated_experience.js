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
