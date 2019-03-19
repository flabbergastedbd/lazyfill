// ==UserScript==
// @name         Lazyfill
// @namespace    https://tunnelshade.in/lazyfill/
// @version      0.1
// @description  try to take over the world!
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js#sha256=FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.0/underscore-min.js#sha256=tr4FvXVZp8nkW7TvW4OYA5KWOs7fc2m5B6LN+AOn1VI=
// @require https://cdn.rawgit.com/tunnelshade/lazyfill/0daf611f3064a0edfec79f3bb7e7d66cd8ebc98a/lazyfill.api.js#sha256=LXjaBo2C5J2LagAgu9wB23rFhyMYvPmYmz9JwBS4/b0=
// @match        https://jira.internal.site/
// @grant        GM_registerMenuCommand
// ==/UserScript==


// This example walks you though typical lazyFill flow for JIRA bug creation

// Instantiate LazyFill object which will be used to store templates and do certain actions
var lFill = new LazyFill();

// JIRA provides url endpoints to prepopulate issue fields. Help: https://confluence.atlassian.com/jirakb/creating-issues-via-direct-html-links-159474.html

// 1. Since we will be using url redirection, instead of normal field filling, let us define a common function and assign it to template object "submit".
function jira_fill(variables, context) {
  var url = "https://jira.internal.site/CreateIssueDetails!init.jspa?";
  var params = _.map(context, function(v, k) {
    params[k] = lFill.helpers.isString(v) ? _.template(v)(variables) : v;
  }, this);
  location.href = url + $.param(params, true);
}

// 2. Create template object based on requirements. See lazyfill.api.js for detailed description of each field
lFill.templates["Clickjacking"] = {
    "url": /jira\.internal\.site/g,
    "submit": jira_fill,
    "variables": {
        "endpoints": "<TBF>"
    },
    "context": {
        "pid": "12480",
        "issuetype": "1",
        "customfield_10000": "20000",
        "customfield_20000": "30000",
        "labels": ["clickjacking", "prod"],
        "summary": "Missing X-Frame-Options or frame-ancestors on {{endpoints}}",
        "description": `
h4. Issue

Lack of X-Frame-Options header or CSP frame-ancestors headers on {{endpoints}} lead to clickjacking attacks. More help: https://www.owasp.org/index.php/Clickjacking

h4. Fix

Help: https://www.owasp.org/index.php/Clickjacking_Defense_Cheat_Sheet`
    }
};

// 3. Start the lazyfill handlers
lFill.start();
