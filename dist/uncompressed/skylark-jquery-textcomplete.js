/**
 * skylark-jquery-textcomplete - A version of jquery-textcomplete.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jquery-textcomplete/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

defin([
  "skylark-jquery"
],function ($) {
  'use strict';

  var warn = function (message) {
    if (console.warn) { console.warn(message); }
  };

  var id = 1;

  $.fn.textcomplete = function (strategies, option) {
    var args = Array.prototype.slice.call(arguments);
    return this.each(function () {
      var self = this;
      var $this = $(this);
      var completer = $this.data('textComplete');
      if (!completer) {
        option || (option = {});
        option._oid = id++;  // unique object id
        completer = new $.fn.textcomplete.Completer(this, option);
        $this.data('textComplete', completer);
      }
      if (typeof strategies === 'string') {
        if (!completer) return;
        args.shift()
        completer[strategies].apply(completer, args);
        if (strategies === 'destroy') {
          $this.removeData('textComplete');
        }
      } else {
        // For backward compatibility.
        // TODO: Remove at v0.4
        $.each(strategies, function (obj) {
          $.each(['header', 'footer', 'placement', 'maxCount'], function (name) {
            if (obj[name]) {
              completer.option[name] = obj[name];
              warn(name + 'as a strategy param is deprecated. Use option.');
              delete obj[name];
            }
          });
        });
        completer.register($.fn.textcomplete.Strategy.parse(strategies, {
          el: self,
          $el: $this
        }));
      }
    });
  };

});

define("skylark-jquery-textcomplete/textcomplete", function(){});

defin([
  "skylark-jquery",
  "./textcomplete"
],function ($) {
  'use strict';

  // Memoize a search function.
  var memoize = function (func) {
    var memo = {};
    return function (term, callback) {
      if (memo[term]) {
        callback(memo[term]);
      } else {
        func.call(this, term, function (data) {
          memo[term] = (memo[term] || []).concat(data);
          callback.apply(null, arguments);
        });
      }
    };
  };

  function Strategy(options) {
    $.extend(this, options);
    if (this.cache) { this.search = memoize(this.search); }
  }

  Strategy.parse = function (strategiesArray, params) {
    return $.map(strategiesArray, function (strategy) {
      var strategyObj = new Strategy(strategy);
      strategyObj.el = params.el;
      strategyObj.$el = params.$el;
      return strategyObj;
    });
  };

  $.extend(Strategy.prototype, {
    // Public properties
    // -----------------

    // Required
    match:      null,
    replace:    null,
    search:     null,

    // Optional
    id:         null,
    cache:      false,
    context:    function () { return true; },
    index:      2,
    template:   function (obj) { return obj; },
    idProperty: null
  });

  $.fn.textcomplete.Strategy = Strategy;

});

define("skylark-jquery-textcomplete/strategy", function(){});

defin([
  "skylark-jquery",
  "./textcomplete",
  "./dropdown"
],function ($) {
  'use strict';

  // Exclusive execution control utility.
  //
  // func - The function to be locked. It is executed with a function named
  //        `free` as the first argument. Once it is called, additional
  //        execution are ignored until the free is invoked. Then the last
  //        ignored execution will be replayed immediately.
  //
  // Examples
  //
  //   var lockedFunc = lock(function (free) {
  //     setTimeout(function { free(); }, 1000); // It will be free in 1 sec.
  //     console.log('Hello, world');
  //   });
  //   lockedFunc();  // => 'Hello, world'
  //   lockedFunc();  // none
  //   lockedFunc();  // none
  //   // 1 sec past then
  //   // => 'Hello, world'
  //   lockedFunc();  // => 'Hello, world'
  //   lockedFunc();  // none
  //
  // Returns a wrapped function.
  var lock = function (func) {
    var locked, queuedArgsToReplay;

    return function () {
      // Convert arguments into a real array.
      var args = Array.prototype.slice.call(arguments);
      if (locked) {
        // Keep a copy of this argument list to replay later.
        // OK to overwrite a previous value because we only replay
        // the last one.
        queuedArgsToReplay = args;
        return;
      }
      locked = true;
      var self = this;
      args.unshift(function replayOrFree() {
        if (queuedArgsToReplay) {
          // Other request(s) arrived while we were locked.
          // Now that the lock is becoming available, replay
          // the latest such request, then call back here to
          // unlock (or replay another request that arrived
          // while this one was in flight).
          var replayArgs = queuedArgsToReplay;
          queuedArgsToReplay = undefined;
          replayArgs.unshift(replayOrFree);
          func.apply(self, replayArgs);
        } else {
          locked = false;
        }
      });
      func.apply(this, args);
    };
  };

  var isString = function (obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  };

  var uniqueId = 0;
  var initializedEditors = [];

  function Completer(element, option) {
    this.$el        = $(element);
    this.id         = 'textcomplete' + uniqueId++;
    this.strategies = [];
    this.views      = [];
    this.option     = $.extend({}, Completer.defaults, option);

    if (!this.$el.is('input[type=text]') && !this.$el.is('input[type=search]') && !this.$el.is('textarea') && !element.isContentEditable && element.contentEditable != 'true') {
      throw new Error('textcomplete must be called on a Textarea or a ContentEditable.');
    }

    // use ownerDocument to fix iframe / IE issues
    if (element === element.ownerDocument.activeElement) {
      // element has already been focused. Initialize view objects immediately.
      this.initialize()
    } else {
      // Initialize view objects lazily.
      var self = this;
      this.$el.one('focus.' + this.id, function () { self.initialize(); });

      // Special handling for CKEditor: lazy init on instance load
      if ((!this.option.adapter || this.option.adapter == 'CKEditor') && typeof CKEDITOR != 'undefined' && (this.$el.is('textarea'))) {
        CKEDITOR.on("instanceReady", function(event) { //For multiple ckeditors on one page: this needs to be executed each time a ckeditor-instance is ready.

          if($.inArray(event.editor.id, initializedEditors) == -1) { //For multiple ckeditors on one page: focus-eventhandler should only be added once for every editor.
            initializedEditors.push(event.editor.id);
			
            event.editor.on("focus", function(event2) {
				//replace the element with the Iframe element and flag it as CKEditor
				self.$el = $(event.editor.editable().$);
				if (!self.option.adapter) {
					self.option.adapter = $.fn.textcomplete['CKEditor'];
				}
				self.option.ckeditor_instance = event.editor; //For multiple ckeditors on one page: in the old code this was not executed when adapter was alread set. So we were ALWAYS working with the FIRST instance.
              	self.initialize();
            });
          }
        });
      }
    }
  }

  Completer.defaults = {
    appendTo: 'body',
    className: '',  // deprecated option
    dropdownClassName: 'dropdown-menu textcomplete-dropdown',
    maxCount: 10,
    zIndex: '100',
    rightEdgeOffset: 30
  };

  $.extend(Completer.prototype, {
    // Public properties
    // -----------------

    id:         null,
    option:     null,
    strategies: null,
    adapter:    null,
    dropdown:   null,
    $el:        null,
    $iframe:    null,

    // Public methods
    // --------------

    initialize: function () {
      var element = this.$el.get(0);
      
      // check if we are in an iframe
      // we need to alter positioning logic if using an iframe
      if (this.$el.prop('ownerDocument') !== document && window.frames.length) {
        for (var iframeIndex = 0; iframeIndex < window.frames.length; iframeIndex++) {
          if (this.$el.prop('ownerDocument') === window.frames[iframeIndex].document) {
            this.$iframe = $(window.frames[iframeIndex].frameElement);
            break;
          }
        }
      }
      
      
      // Initialize view objects.
      this.dropdown = new $.fn.textcomplete.Dropdown(element, this, this.option);
      var Adapter, viewName;
      if (this.option.adapter) {
        Adapter = this.option.adapter;
      } else {
        if (this.$el.is('textarea') || this.$el.is('input[type=text]') || this.$el.is('input[type=search]')) {
          viewName = typeof element.selectionEnd === 'number' ? 'Textarea' : 'IETextarea';
        } else {
          viewName = 'ContentEditable';
        }
        Adapter = $.fn.textcomplete[viewName];
      }
      this.adapter = new Adapter(element, this, this.option);
    },

    destroy: function () {
      this.$el.off('.' + this.id);
      if (this.adapter) {
        this.adapter.destroy();
      }
      if (this.dropdown) {
        this.dropdown.destroy();
      }
      this.$el = this.adapter = this.dropdown = null;
    },

    deactivate: function () {
      if (this.dropdown) {
        this.dropdown.deactivate();
      }
    },

    // Invoke textcomplete.
    trigger: function (text, skipUnchangedTerm) {
      if (!this.dropdown) { this.initialize(); }
      text != null || (text = this.adapter.getTextFromHeadToCaret());
      var searchQuery = this._extractSearchQuery(text);
      if (searchQuery.length) {
        var term = searchQuery[1];
        // Ignore shift-key, ctrl-key and so on.
        if (skipUnchangedTerm && this._term === term && term !== "") { return; }
        this._term = term;
        this._search.apply(this, searchQuery);
      } else {
        this._term = null;
        this.dropdown.deactivate();
      }
    },

    fire: function (eventName) {
      var args = Array.prototype.slice.call(arguments, 1);
      this.$el.trigger(eventName, args);
      return this;
    },

    register: function (strategies) {
      Array.prototype.push.apply(this.strategies, strategies);
    },

    // Insert the value into adapter view. It is called when the dropdown is clicked
    // or selected.
    //
    // value    - The selected element of the array callbacked from search func.
    // strategy - The Strategy object.
    // e        - Click or keydown event object.
    select: function (value, strategy, e) {
      this._term = null;
      this.adapter.select(value, strategy, e);
      this.fire('change').fire('textComplete:select', value, strategy);
      this.adapter.focus();
    },

    // Private properties
    // ------------------

    _clearAtNext: true,
    _term:        null,

    // Private methods
    // ---------------

    // Parse the given text and extract the first matching strategy.
    //
    // Returns an array including the strategy, the query term and the match
    // object if the text matches an strategy; otherwise returns an empty array.
    _extractSearchQuery: function (text) {
      for (var i = 0; i < this.strategies.length; i++) {
        var strategy = this.strategies[i];
        var context = strategy.context(text);
        if (context || context === '') {
          var matchRegexp = $.isFunction(strategy.match) ? strategy.match(text) : strategy.match;
          if (isString(context)) { text = context; }
          var match = text.match(matchRegexp);
          if (match) { return [strategy, match[strategy.index], match]; }
        }
      }
      return []
    },

    // Call the search method of selected strategy..
    _search: lock(function (free, strategy, term, match) {
      var self = this;
      strategy.search(term, function (data, stillSearching) {
        if (!self.dropdown.shown) {
          self.dropdown.activate();
        }
        if (self._clearAtNext) {
          // The first callback in the current lock.
          self.dropdown.clear();
          self._clearAtNext = false;
        }
        self.dropdown.setPosition(self.adapter.getCaretPosition());
        self.dropdown.render(self._zip(data, strategy, term));
        if (!stillSearching) {
          // The last callback in the current lock.
          free();
          self._clearAtNext = true; // Call dropdown.clear at the next time.
        }
      }, match);
    }),

    // Build a parameter for Dropdown#render.
    //
    // Examples
    //
    //  this._zip(['a', 'b'], 's');
    //  //=> [{ value: 'a', strategy: 's' }, { value: 'b', strategy: 's' }]
    _zip: function (data, strategy, term) {
      return $.map(data, function (value) {
        return { value: value, strategy: strategy, term: term };
      });
    }
  });

  $.fn.textcomplete.Completer = Completer;
});

define("skylark-jquery-textcomplete/completer", function(){});

defin([
  "skylark-jquery",
  "./textcomplete"
],function ($) {
  'use strict';

  // ContentEditable adapter
  // =======================
  //
  // Adapter for contenteditable elements.
  function ContentEditable (element, completer, option) {
    this.initialize(element, completer, option);
  }

  $.extend(ContentEditable.prototype, $.fn.textcomplete.Adapter.prototype, {
    // Public methods
    // --------------

    // Update the content with the given value and strategy.
    // When an dropdown item is selected, it is executed.
    select: function (value, strategy, e) {
      var pre = this.getTextFromHeadToCaret();
      // use ownerDocument instead of window to support iframes
      var sel = this.el.ownerDocument.getSelection();
      
      var range = sel.getRangeAt(0);
      var selection = range.cloneRange();
      selection.selectNodeContents(range.startContainer);
      var content = selection.toString();
      var post = content.substring(range.startOffset);
      var newSubstr = strategy.replace(value, e);
      var regExp;
      if (typeof newSubstr !== 'undefined') {
        if ($.isArray(newSubstr)) {
          post = newSubstr[1] + post;
          newSubstr = newSubstr[0];
        }
        regExp = $.isFunction(strategy.match) ? strategy.match(pre) : strategy.match;
        pre = pre.replace(regExp, newSubstr)
            .replace(/ $/, "&nbsp"); // &nbsp necessary at least for CKeditor to not eat spaces
        range.selectNodeContents(range.startContainer);
        range.deleteContents();
        
        // create temporary elements
        var preWrapper = this.el.ownerDocument.createElement("div");
        preWrapper.innerHTML = pre;
        var postWrapper = this.el.ownerDocument.createElement("div");
        postWrapper.innerHTML = post;
        
        // create the fragment thats inserted
        var fragment = this.el.ownerDocument.createDocumentFragment();
        var childNode;
        var lastOfPre;
        while (childNode = preWrapper.firstChild) {
        	lastOfPre = fragment.appendChild(childNode);
        }
        while (childNode = postWrapper.firstChild) {
        	fragment.appendChild(childNode);
        }
        
        // insert the fragment & jump behind the last node in "pre"
        range.insertNode(fragment);
        range.setStartAfter(lastOfPre);
        
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    },

    // Private methods
    // ---------------

    // Returns the caret's relative position from the contenteditable's
    // left top corner.
    //
    // Examples
    //
    //   this._getCaretRelativePosition()
    //   //=> { top: 18, left: 200, lineHeight: 16 }
    //
    // Dropdown's position will be decided using the result.
    _getCaretRelativePosition: function () {
      var range = this.el.ownerDocument.getSelection().getRangeAt(0).cloneRange();
      var wrapperNode = range.endContainer.parentNode;
      var node = this.el.ownerDocument.createElement('span');
      range.insertNode(node);
      range.selectNodeContents(node);
      range.deleteContents();
      setTimeout(function() { wrapperNode.normalize(); }, 0);
      var $node = $(node);
      var position = $node.offset();
      position.left -= this.$el.offset().left;
      position.top += $node.height() - this.$el.offset().top;
      position.lineHeight = $node.height();
      
      // special positioning logic for iframes
      // this is typically used for contenteditables such as tinymce or ckeditor
      if (this.completer.$iframe) {
        var iframePosition = this.completer.$iframe.offset();
        position.top += iframePosition.top;
        position.left += iframePosition.left;
        // We need to get the scrollTop of the html-element inside the iframe and not of the body-element,
        // because on IE the scrollTop of the body-element (this.$el) is always zero.
        position.top -= $(this.completer.$iframe[0].contentWindow.document).scrollTop();
      }
      
      $node.remove();
      return position;
    },

    // Returns the string between the first character and the caret.
    // Completer will be triggered with the result for start autocompleting.
    //
    // Example
    //
    //   // Suppose the html is '<b>hello</b> wor|ld' and | is the caret.
    //   this.getTextFromHeadToCaret()
    //   // => ' wor'  // not '<b>hello</b> wor'
    getTextFromHeadToCaret: function () {
      var range = this.el.ownerDocument.getSelection().getRangeAt(0);
      var selection = range.cloneRange();
      selection.selectNodeContents(range.startContainer);
      return selection.toString().substring(0, range.startOffset);
    }
  });

  $.fn.textcomplete.ContentEditable = ContentEditable;

});

define("skylark-jquery-textcomplete/content_editable", function(){});

defin([
  "skylark-jquery",
  "./textcomplete",
  "./adapter",
  "./vendor/textarea_caret"
],function ($) {
  'use strict';

  // Textarea adapter
  // ================
  //
  // Managing a textarea. It doesn't know a Dropdown.
  function Textarea(element, completer, option) {
    this.initialize(element, completer, option);
  }

  $.extend(Textarea.prototype, $.fn.textcomplete.Adapter.prototype, {
    // Public methods
    // --------------

    // Update the textarea with the given value and strategy.
    select: function (value, strategy, e) {
      var pre = this.getTextFromHeadToCaret();
      var post = this.el.value.substring(this.el.selectionEnd);
      var newSubstr = strategy.replace(value, e);
      var regExp;
      if (typeof newSubstr !== 'undefined') {
        if ($.isArray(newSubstr)) {
          post = newSubstr[1] + post;
          newSubstr = newSubstr[0];
        }
        regExp = $.isFunction(strategy.match) ? strategy.match(pre) : strategy.match;
        pre = pre.replace(regExp, newSubstr);
        this.$el.val(pre + post);
        this.el.selectionStart = this.el.selectionEnd = pre.length;
      }
    },

    getTextFromHeadToCaret: function () {
      return this.el.value.substring(0, this.el.selectionEnd);
    },

    // Private methods
    // ---------------

    _getCaretRelativePosition: function () {
      var p = $.fn.textcomplete.getCaretCoordinates(this.el, this.el.selectionStart);
      return {
        top: p.top + this._calculateLineHeight() - this.$el.scrollTop(),
        left: p.left - this.$el.scrollLeft(),
        lineHeight: this._calculateLineHeight()
      };
    },

    _calculateLineHeight: function () {
      var lineHeight = parseInt(this.$el.css('line-height'), 10);
      if (isNaN(lineHeight)) {
        // http://stackoverflow.com/a/4515470/1297336
        var parentNode = this.el.parentNode;
        var temp = document.createElement(this.el.nodeName);
        var style = this.el.style;
        temp.setAttribute(
          'style',
          'margin:0px;padding:0px;font-family:' + style.fontFamily + ';font-size:' + style.fontSize
        );
        temp.innerHTML = 'test';
        parentNode.appendChild(temp);
        lineHeight = temp.clientHeight;
        parentNode.removeChild(temp);
      }
      return lineHeight;
    }
  });

  $.fn.textcomplete.Textarea = Textarea;
});

define("skylark-jquery-textcomplete/textarea", function(){});

define('skylark-jquery-textcomplete/main',[
	"./textcomplete",
	"./strategy",
	"./completer",
	"./content_editable",
	"./textarea"
],function(){
	
});
define('skylark-jquery-textcomplete', ['skylark-jquery-textcomplete/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-jquery-textcomplete.js.map
