/*
// Lazyfill provides tiny interface to make templatable data entry into web
// entities easier.
//
// Copyright © 2018 Bharadwaj Machiraju <https://tunnelshade.in>
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function LazyFill() {

  // ---------------------------- Internal functions ---------------------------------------
  function isFunction(v) { return typeof v === "function"; }

  function isString(v) { return typeof v === "string"; }

  function getInput(text) { return window.prompt(text); }

  function lazyFill(t) {
    // Get all variable values to later fill in
    _.each(t.variables, function(value, v) {
      t.variables[v] = getInput(`Value for ${v}`);
    });

    // Start filling
    var content;
    _.each(t.fields, function(f, i) {
      if (isFunction(f.beforeFill)) f.beforeFill(t.selector, t.context);

      content = isString(content) ? _.template(f.content, t.variables) : null;
      isFunction(f.fill) ? f.fill(t.selector, content, t.context) : $(t.selector).val(content);

      if (isFunction(f.afterFill)) f.afterFill(t.selector, t.context);
    }, this);

    // Call the submit function finally if it exists
    if (isFunction(t.submit)) t.submit(t.variables, t.context);
  }
  // ---------------------------- End Internal Functions -----------------------------------

  // ---------------------------- Exported functions ---------------------------------------

  // Templates object holds all templates with name as key and following object as value.
  // {
  //   "fields": [
  //      {
  //        "selector": "<id selector>",               // CSS selector to select the element.
  //        "fill": func(selector, content, context),  // Function that is called to fill a certain field. Useful for custom filling logic. If not specified, then content is set to select by jquery val()
  //        "content": "<a js template string>",       // A javascript template string that will be called with variables object.
  //        "afterFill": func(selector, context),      // Function called after filling
  //        "beforeFill": func(selector, context)      // Function called before fillling
  //      }
  //    ],
  //.  "variables": {},                                // A hashmap of variables whose values will be asked from user via prompt()
  //   "context": {},                                  // A hashmap solely for implementing custom storage for template and its functions.
  //   "url": js_regex,                                // To decide whether to show a fill or not
  //   "submit": func(variables, context)              // A function that will be called at the end of filling if any fields are specified
  // }
  this.templates = {}; // templates object where templates are added with names as key

  // A mandatory function to be called at the end of script that registers menu commands and sets some important settings
  this.start = function() {
    'use strict';

    _.templateSettings = {
      interpolate: /\{(.+?)\}/g,
      evaluate: /\{%(.+?)\%}/g
    };

    // Register all menu commands that match
    _.each(this.templates, function(t, name, templates) {
      if ((typeof t.url != "undefined") && (t.url.test(location.href) === true)) {
        console.debug(`Registering ${name}`);
        GM_registerMenuCommand(`${name}`, function() { lazyFill(templates[name]); }, "i");
      }
    }, this);
  };

  // Helper commands that are useful
  this.helpers = {
    "isString": isString,
    "isFunction": isFunction
  };

  // Metadata
  this.VERSION = 0.1;
  // ---------------------------- End exported Functions -----------------------------------
}
