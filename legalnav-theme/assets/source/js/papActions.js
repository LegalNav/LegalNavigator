LEGALNAV.papActions = (function() {
    return {
        init
    }

    function init() {
        var gaType = jQuery('.ga-type').first().data('ga-type');

        if(!gaType) {
            return; // Early return if not on GA page
        }

        var downloadActionButtons = jQuery('.action-download');
        var printActionButtons = jQuery('.action-print');

        downloadActionButtons.click(function(e) {
            e.preventDefault();

            downloadAP(gaType);
        });

        printActionButtons.click(function() {
            printAP(gaType);
        });
    }

    function downloadAP(gaType) {
        var content = getActionPlanContent(gaType);

        if(!content) {
            return;
        }

        var pdfHTML = "<!DOCTYPE html><html>" + content + "</html>";

        html2pdf(pdfHTML, {
            margin: 16,
            pagebreak: { mode: 'avoid-all' }
        });
    }

    function printAP(gaType) {
        switch(gaType) {
            case 'a2j':
                break;
            case 'legal_server':
                // Open PAP steps
                jQuery('guided-nav details').attr("open", "");
                break;
        }

        window.print();
    }

    function getActionPlanContent(gaType) {
        switch(gaType) {
            case 'a2j':
                return getA2JPlanContent();
            case 'legal_server':
                return getLSPlanContent();
        }
    }

    function getA2JPlanContent() {
        var content = jQuery('.personal-plan').first()[0].innerHTML;

        // Exclude 'no-print' elements
        content = excludeNoPrintElems(content);

        // Remove step 'toggle' links
        content = content.replace(
            /<a href=\"javascript:;\"[^<]*(.*)<\/a>/gm,
            "$1"
        );

        return content;
    }

    function getLSPlanContent() {
        // Get initial AP content
        var content = jQuery('.gn-for-element-wrapper').first()[0].innerHTML;

        // Add 'open' attribute to details elements
        content = openDetails(content);

        // Remove button elements
        content = content.replace(
            /<button.*<\/button>/gm,
            ""
        );

        return content;
    }

    function excludeNoPrintElems(html) {
        var htmlObj = jQuery(html);
        htmlObj.find('.no-print').remove();

        // Hack to turn FULL jquery object into HTML, not just first elem
        return jQuery('<div>').append(htmlObj.clone()).remove().html();
    }

    function openDetails(html) {
        var htmlObj = jQuery(html);
        htmlObj.find('details').attr("open", "");

        // Hack to turn FULL jquery object into HTML, not just first elem
        return jQuery('<div>').append(htmlObj.clone()).remove().html();
    }
})();
