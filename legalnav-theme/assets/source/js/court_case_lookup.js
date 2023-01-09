LEGALNAV.courtCaseLookUp = {

    //Containers
    detailContainer: jQuery('.court-case-details'),
    informationContainer: jQuery('.case-information'),
    lookupButton: jQuery('#case_lookup_submit'),
    loadingIndicator: jQuery('#case_loading_indicator'),
    caseFields: jQuery('.case-field'),

    //Arrays
    //resultArray: [],
    //Properties
    //LEGALNAV.courtCaseLookUp.detailContainer.attr('data-state')

    init: function() {

        if (LEGALNAV.courtCaseLookUp.detailContainer.length > 0) {
       
            //Check on keyup if any fields have values
            LEGALNAV.courtCaseLookUp.caseFields.on('input', function() {
                //Run a check to see if any case-fields come back with a length
                var empty = true;
                LEGALNAV.courtCaseLookUp.caseFields.each(function(index, element) {
                    if (jQuery(element).val().length > 0) empty = false;
                });

                if (empty) {
                    //Disable submit button
                    LEGALNAV.courtCaseLookUp.lookupButton.attr('disabled', true);
                } else {
                    //Enable submit button
                    LEGALNAV.courtCaseLookUp.lookupButton.attr('disabled', false);
                }
                return false;
            });

            //Check if enter button is pressed on any case-fields
            LEGALNAV.courtCaseLookUp.caseFields.each(function(index, element) {
                jQuery(element).keydown(function(e) {
                    if (e.keyCode == 13) {
                        //If enter is pressed, prevent default submit
                        e.preventDefault();
                        return false;
                    }
                });
            });

            //Check if submit button is clicked
            LEGALNAV.courtCaseLookUp.lookupButton.on('click', function(e) {
                //Pull in case-field values.
                var caseFirstName = jQuery.trim(jQuery("#case_first_name").val()),
                caseLastName = jQuery.trim(jQuery("#case_last_name").val()),
                caseId = jQuery.trim(jQuery("#case_id").val());

                //Set loading indicator
                LEGALNAV.courtCaseLookUp.loadingIndicator.html('Loading...');
                //Run lookupCase function passing in case-field values.
                LEGALNAV.courtCaseLookUp.lookupCase(caseFirstName, caseLastName, caseId);

                //Prevent default submit
                e.preventDefault();
                return false;
            });

        }

    },
    
    
    lookupCase: function(caseFirstName, caseLastName, caseId) {

        //Setup Search Object
        var courtObj = {
            "CaseSearchInputMessage": {
                "CaseData": {
                    "CaseName": "", //Ex. In the Matter of: Curtiss, Aaron and Curtiss, Ashley
                    "CaseNumber": caseId ? caseId : "", //Ex. 3KN-19-00179CI
                    "CaseType": "", //Ex. CIADA
                    "Status": "", //Ex. Open
                    "FiledDate": {
                        "gte": "", //Ex. 2019-01-01
                        "lte": "" //Ex. 2020-01-01
                    },
                    "CourtLocation": "", //Ex. 3AN
                    "CaseParticipant": {
                        "FirstName": caseFirstName ? caseFirstName : "", //Ex. Aaron
                        "LastName": caseLastName ? caseLastName : "", //Ex. Curtiss
                        "MiddleName": "",
                        "CompanyName": "", //Ex. ABC Inc.
                        "Role": "", //Ex. DFNDT
                        "ParticipantAddress": {}, //not implemented
                        "ParticipantAutoRegistration": {}, //not implemented
                        "ParticipantDriversLicense": {} //not implemented
                    }
                }
            }
        }

        //Run search ajax
        jQuery.ajax({
            url: LEGALNAV.courtCaseLookUp.detailContainer.attr('data-url'),
            type: LEGALNAV.courtCaseLookUp.detailContainer.attr('data-post'),
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(courtObj),
            beforeSend: setHeader,
            success: function(data) {
                LEGALNAV.courtCaseLookUp.processResult(data);

            },
            error: function() {
                //Activate error element
                LEGALNAV.courtCaseLookUp.informationContainer.addClass('active error');
            }
        });
        //Set headers for ajax call
        function setHeader(xhr) {
            xhr.setRequestHeader('X-Api-Key', LEGALNAV.courtCaseLookUp.detailContainer.attr('data-key'));
        };

    },

    // ! LEGALNAV.courtCaseLookUp.processResult
    processResult: function(data) {

        //if CaseData was returned
        if (data && data.CaseSearchOutputMessage && data.CaseSearchOutputMessage.CaseData && data.CaseSearchOutputMessage.CaseData.length > 0) {
            LEGALNAV.courtCaseLookUp.displayResult(data.CaseSearchOutputMessage.CaseData[0]);

        //Otherwise errror.
        } else {
            //Activate error element
            LEGALNAV.courtCaseLookUp.informationContainer.addClass('active error');
            LEGALNAV.courtCaseLookUp.loadingIndicator.html('');
            LEGALNAV.courtCaseLookUp.scrollToResult();
        }

    },

    // ! LEGALNAV.courtCaseLookUp.displayResult
    displayResult: function(resultArray) {
        //Activate case-information
        LEGALNAV.courtCaseLookUp.informationContainer.addClass('active');
        //Remove error element if one exists (consequtive searches)
        LEGALNAV.courtCaseLookUp.informationContainer.removeClass('error');
        //Fill case-information's elements
        jQuery(".case-title").html("<div class='case-box'><span>Case Name: </span><p>" + resultArray.CaseName + "</p></div>");

        var isCaseNumber = false,
        isCasePeople = false,
        isCaseStartInfo = false,
        isCaseNextHearing = false,
        isCaseLastCase = false,
        isCaseStatus = false,
        isCaseWebUrl = false;
        
        var casePeople = "",
        nextHearing = "",
        lastCase = "";
        
        if (LEGALNAV.courtCaseLookUp.detailContainer.attr('data-state') == "alaska") {               
            //Get Case Participants
            if (resultArray.CaseParticipant && resultArray.CaseParticipant.length > 0) {
                for (var person in resultArray.CaseParticipant) {
                    casePeople += resultArray.CaseParticipant[person].FirstName + " ";
                    casePeople += resultArray.CaseParticipant[person].LastName + " ";
                    casePeople += "(" + resultArray.CaseParticipant[person].Role + ")";
                    casePeople += (resultArray.CaseParticipant.length-1 == person) ? "" : ", ";
                }
                isCasePeople = true;
            }
            if (resultArray.Hearings && resultArray.Hearings.length > 0) {
                //Get Next Hearing
                nextHearing += resultArray.Hearings[resultArray.Hearings.length-1].HearingType + " on ";
                nextHearing += LEGALNAV.courtCaseLookUp.parseDate(resultArray.Hearings[resultArray.Hearings.length-1].HearingDate);
                isCaseNextHearing = true;
            }
            if (resultArray.CaseFilings && resultArray.CaseFilings.length > 0) {
                //Get Last Case
                lastCase += resultArray.CaseFilings[resultArray.CaseFilings.length-1].DocumentTitle + " on ";
                lastCase += LEGALNAV.courtCaseLookUp.parseDate(resultArray.CaseFilings[resultArray.CaseFilings.length-1].FiledDate);
                isCaseLastCase = true;
            }
            //Set bools.
            isCaseStartInfo = true;
            isCaseWebUrl = true;
        } else if (LEGALNAV.courtCaseLookUp.detailContainer.attr('data-state') == "hawaii") {   
            //Set bools
            isCaseNumber = true;
            isCaseStatus = true;
            isCaseWebUrl = true;
        }

        var caseDetails = "";
        caseDetails += (isCaseNumber) ? "<div class='case-box'><span>Case ID: </span><p>" + resultArray.CaseNumber + "</p></div>" : "";

        caseDetails += (isCasePeople) ? "<div class='case-box'><span>People in this case: </span><p>" + casePeople + "</p></div>" : "";
        caseDetails += (isCaseStartInfo) ? "<div class='case-box'><span>The case was started on: </span><p>" + LEGALNAV.courtCaseLookUp.parseDate(resultArray.FiledDate) + " in " + resultArray.CourtLocation + "</p></div>" : "";
        caseDetails += (isCaseNextHearing) ? "<div class='case-box'><span>The next hearing is: </span><p>" + nextHearing + "</p></div>" : "";
        caseDetails += (isCaseLastCase) ? "<div class='case-box'><span>The last case entry was: </span><p>" + lastCase + "</p></div>" : "";

        caseDetails += (isCaseStatus) ? "<div class='case-box'><span>Status: </span><p>" + resultArray.Status + "</p></div>" : "";
        caseDetails += (isCaseWebUrl) ? "<div class='case-box'><span>For More Information: </span><p><button class='btn btn-primary' onclick='window.open(\"" + LEGALNAV.courtCaseLookUp.detailContainer.attr('data-weburl') + "\" ,\"_blank\")'>Visit the Court's Website</button></p></div>" : "";
            
        jQuery(".case-details").html(caseDetails);
        
        //Set loading indicator
        LEGALNAV.courtCaseLookUp.loadingIndicator.html('');
        LEGALNAV.courtCaseLookUp.scrollToResult();
    },

    // ! LEGALNAV.courtCaseLookUp.parseDate
    parseDate: function(dateString) {
        var Date = dateString.replace('T',' ').replace('Z','');
        return Date;
    },

    // ! LEGALNAV.courtCaseLookUp.scrollToResult
    scrollToResult: function() {
        //Scroll down to case-information-results
        var scrollElement = document.getElementById("case-information-results");
        if (scrollElement) {
            scrollElement.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
    }
    
}

