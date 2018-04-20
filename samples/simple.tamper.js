// ==UserScript==
// @name         Simple fill
// @namespace    https://tunnelshade.in/lazyfill/
// @version      0.1
// @description  try to take over the world!
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js#sha256=FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.0/underscore-min.js#sha256=tr4FvXVZp8nkW7TvW4OYA5KWOs7fc2m5B6LN+AOn1VI=
// @require https://cdn.rawgit.com/tunnelshade/lazyfill/abc4e0394ab61fbee144319a550240951be92e38/lazyfill.api.js#sha256=1+nyD/XGp5asReyimMZFGo3pqXzBFtfiFMK2ZsQeuWc=
// @match        https://jira.internal.site/
// @grant        GM_registerMenuCommand
// ==/UserScript==


// This example walks you though typical lazyFill flow for simple flow with one custom fill function incase you are planning to select

// Instantiate LazyFill object which will be used to store templates and do certain actions
var lFill = new LazyFill();

// 1. Create helper
function setLabels(selector, labels, context) {
  // Imagine selector is a multiselect element
  $(selector).val(labels.split(','));
}

// 2. Specify template fields and parameters, and write a custom fill function for necessary fields
lFill.templates["Clickjacking"] = {
    "url": /jira\.internal\.site/g,
    "variables": {
        "endpoints": "<TBF>"
    },
    "fields": [
      {
        "selector": "#project",
        "content": "SECURITY",
      },
      {
        "selector": "#labels",
        "content": "BUG,CLICKJACKING",
        "fill": setLabels
      },
      {
        "selector": "#title",
        "content": "Missing X-Frame-Options or frame-ancestors on {endpoints}",
      },
      {
        "selector": "#description",
        "content": `
h4. Issue

Lack of X-Frame-Options header or CSP frame-ancestors headers on {endpoints} lead to clickjacking attacks. More help: https://www.owasp.org/index.php/Clickjacking

h4. Fix

Help: https://www.owasp.org/index.php/Clickjacking_Defense_Cheat_Sheet
`
      }
    ]
};

// 3. Start the lazyfill handlers
lFill.start();
