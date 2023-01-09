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
