var doc = document.getElementById("response");

$(document).ready( function() {
    var createChromeTab = function(url) {
        return chrome.tabs.create({
            url: url
        })
    };

    var JENKINS_API_URL = "http://ecom106.abercrombie.com:8100/job/WCS-StaticBuildDeploy-v3.0/lastBuild/consoleText";
    var BTOA = "jlee:46464d0fc4eeb4877e8595628ac14823";

    function getBeforeSend (xhr) {
        return xhr.setRequestHeader("Authorization", "Basic " + btoa(BTOA));
    }

    function getRegex () {
        return /(hotfix|bugfix|feature).*?\s*:\s*(success|fail|not)/ig;
    }

    function getMergeStrings (text) {
        var doc2 = document.getElementById("response");
        var regex = getRegex();
        var branchesAsText = text.match(regex);
        var branchesObj = {
            "branches": {}
        };

        return branchesAsText;
    }

    function processTemplate (branchesArrOrig) {
        var branchInfo,
            branchName,
            branchStatus;

        var branchesArr = branchesArrOrig.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        var results = { "branches": [] };
        var template =
            `<ul class="list-group">` +
                `{{#branches}}` +
                    `<li class="list-group-item list-group-item-{{branchMergeBootstrapText}}">{{{branchName}}}: {{branchMergeStatus}}<a class="go-to-jira" href="http://jira/browse/{{{branchName}}}"> (see JIRA)</a></li>` +
                `{{/branches}}` +
            `</ul>`;

        for (i = 0, len = branchesArr.length; i < len; i++) {
            branchInfo = branchesArr[i].split(":");
            branchName = branchInfo[0].trim();
            branchMergeStatus = branchInfo[1].trim().toLowerCase();

            results.branches[i] = {
                branchName: branchName,
                branchMergeBootstrapText: branchMergeStatus === 'success' ? 'success' : 'danger',
                branchMergeStatus: branchMergeStatus
            }
        }

        var processedTemplate = Mustache.to_html(template, results);

        document.getElementById("response").innerHTML = processedTemplate;
    }

    function getJenkinsBuildConsole () {
        var $doc = $("#response");
        var xhr = new XMLHttpRequest();
        var mergeStrings;

        xhr.open("GET", JENKINS_API_URL, true);
        xhr.setRequestHeader("Authorization", "Basic " + btoa("jlee:46464d0fc4eeb4877e8595628ac14823"));

        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            mergeStrings = getMergeStrings(xhr.responseText);

            processTemplate(mergeStrings);
          }
        }

        xhr.send();

    };

    $(".btn-jenkins").on("click", getJenkinsBuildConsole);

    $("#jira").on("click", function () {
        createChromeTab($(this).attr("href"));
    });

});
