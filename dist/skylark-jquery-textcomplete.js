/**
 * skylark-jquery-textcomplete - A version of jquery-textcomplete.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jquery-textcomplete/
 * @license MIT
 */
!function(t,e){var i=e.define,require=e.require,n="function"==typeof i&&i.amd,o=!n&&"undefined"!=typeof exports;if(!n&&!i){var s={};i=e.define=function(t,e,i){"function"==typeof i?(s[t]={factory:i,deps:e.map(function(e){return function(t,e){if("."!==t[0])return t;var i=e.split("/"),n=t.split("/");i.pop();for(var o=0;o<n.length;o++)"."!=n[o]&&(".."==n[o]?i.pop():i.push(n[o]));return i.join("/")}(e,t)}),resolved:!1,exports:null},require(t)):s[t]={factory:null,resolved:!0,exports:i}},require=e.require=function(t){if(!s.hasOwnProperty(t))throw new Error("Module "+t+" has not been defined");var module=s[t];if(!module.resolved){var i=[];module.deps.forEach(function(t){i.push(require(t))}),module.exports=module.factory.apply(e,i)||null,module.resolved=!0}return module.exports}}if(!i)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(t,require){t("skylark-jquery-textcomplete/textcomplete",["skylark-jquery"],function(t){"use strict";var e=1;t.fn.textcomplete=function(i,n){var o=Array.prototype.slice.call(arguments);return this.each(function(){var s=t(this),r=s.data("textComplete");if(r||(n||(n={}),n._oid=e++,r=new t.fn.textcomplete.Completer(this,n),s.data("textComplete",r)),"string"==typeof i){if(!r)return;o.shift(),r[i].apply(r,o),"destroy"===i&&s.removeData("textComplete")}else t.each(i,function(e){t.each(["header","footer","placement","maxCount"],function(t){var i;e[t]&&(r.option[t]=e[t],i=t+"as a strategy param is deprecated. Use option.",console.warn&&console.warn(i),delete e[t])})}),r.register(t.fn.textcomplete.Strategy.parse(i,{el:this,$el:s}))})}}),t("skylark-jquery-textcomplete/strategy",["skylark-jquery","./textcomplete"],function(t){"use strict";var e=function(t){var e={};return function(i,n){e[i]?n(e[i]):t.call(this,i,function(t){e[i]=(e[i]||[]).concat(t),n.apply(null,arguments)})}};function i(i){t.extend(this,i),this.cache&&(this.search=e(this.search))}i.parse=function(e,n){return t.map(e,function(t){var e=new i(t);return e.el=n.el,e.$el=n.$el,e})},t.extend(i.prototype,{match:null,replace:null,search:null,id:null,cache:!1,context:function(){return!0},index:2,template:function(t){return t},idProperty:null}),t.fn.textcomplete.Strategy=i}),t("skylark-jquery-textcomplete/dropdown",["skylark-jquery","./textcomplete"],function(t){"use strict";var e=t(window),i=function(t,e){var i,n,o=e.strategy.idProperty;for(i=0;i<t.length;i++)if((n=t[i]).strategy===e.strategy)if(o){if(n.value[o]===e.value[o])return!0}else if(n.value===e.value)return!0;return!1},n={};t(document).on("click",function(e){var i=e.originalEvent&&e.originalEvent.keepTextCompleteDropdown;t.each(n,function(t,e){t!==i&&e.deactivate()})});var o={SKIP_DEFAULT:0,KEY_UP:1,KEY_DOWN:2,KEY_ENTER:3,KEY_PAGEUP:4,KEY_PAGEDOWN:5,KEY_ESCAPE:6};function s(e,i,o){this.$el=s.createElement(o),this.completer=i,this.id=i.id+"dropdown",this._data=[],this.$inputEl=t(e),this.option=o,o.listPosition&&(this.setPosition=o.listPosition),o.height&&this.$el.height(o.height);var r=this;t.each(["maxCount","placement","footer","header","noResultsMessage","className"],function(t,e){null!=o[e]&&(r[e]=o[e])}),this._bindEvents(e),n[this.id]=this}t.extend(s,{createElement:function(e){var i=e.appendTo;i instanceof t||(i=t(i));var n=t("<ul></ul>").addClass(e.dropdownClassName).attr("id","textcomplete-dropdown-"+e._oid).css({display:"none",left:0,position:"absolute",zIndex:e.zIndex}).appendTo(i);return n}}),t.extend(s.prototype,{$el:null,$inputEl:null,completer:null,footer:null,header:null,id:null,maxCount:null,placement:"",shown:!1,data:[],className:"",destroy:function(){this.deactivate(),this.$el.off("."+this.id),this.$inputEl.off("."+this.id),this.clear(),this.$el.remove(),this.$el=this.$inputEl=this.completer=null,delete n[this.id]},render:function(e){var i=this._buildContents(e),n=t.map(e,function(t){return t.value});if(e.length){var o=e[0].strategy;o.id?this.$el.attr("data-strategy",o.id):this.$el.removeAttr("data-strategy"),this._renderHeader(n),this._renderFooter(n),i&&(this._renderContents(i),this._fitToBottom(),this._fitToRight(),this._activateIndexedItem()),this._setScroll()}else this.noResultsMessage?this._renderNoResultsMessage(n):this.shown&&this.deactivate()},setPosition:function(i){var n="absolute";return this.$inputEl.add(this.$inputEl.parents()).each(function(){return"absolute"!==t(this).css("position")&&("fixed"===t(this).css("position")?(i.top-=e.scrollTop(),i.left-=e.scrollLeft(),n="fixed",!1):void 0)}),this.$el.css(this._applyPlacement(i)),this.$el.css({position:n}),this},clear:function(){this.$el.html(""),this.data=[],this._index=0,this._$header=this._$footer=this._$noResultsMessage=null},activate:function(){return this.shown||(this.clear(),this.$el.show(),this.className&&this.$el.addClass(this.className),this.completer.fire("textComplete:show"),this.shown=!0),this},deactivate:function(){return this.shown&&(this.$el.hide(),this.className&&this.$el.removeClass(this.className),this.completer.fire("textComplete:hide"),this.shown=!1),this},isUp:function(t){return 38===t.keyCode||t.ctrlKey&&80===t.keyCode},isDown:function(t){return 40===t.keyCode||t.ctrlKey&&78===t.keyCode},isEnter:function(t){var e=t.ctrlKey||t.altKey||t.metaKey||t.shiftKey;return!e&&(13===t.keyCode||9===t.keyCode||!0===this.option.completeOnSpace&&32===t.keyCode)},isPageup:function(t){return 33===t.keyCode},isPagedown:function(t){return 34===t.keyCode},isEscape:function(t){return 27===t.keyCode},_data:null,_index:null,_$header:null,_$noResultsMessage:null,_$footer:null,_bindEvents:function(){this.$el.on("mousedown."+this.id,".textcomplete-item",t.proxy(this._onClick,this)),this.$el.on("touchstart."+this.id,".textcomplete-item",t.proxy(this._onClick,this)),this.$el.on("mouseover."+this.id,".textcomplete-item",t.proxy(this._onMouseover,this)),this.$inputEl.on("keydown."+this.id,t.proxy(this._onKeydown,this))},_onClick:function(e){var i=t(e.target);e.preventDefault(),e.originalEvent.keepTextCompleteDropdown=this.id,i.hasClass("textcomplete-item")||(i=i.closest(".textcomplete-item"));var n=this.data[parseInt(i.data("index"),10)];this.completer.select(n.value,n.strategy,e);var o=this;setTimeout(function(){o.deactivate(),"touchstart"===e.type&&o.$inputEl.focus()},0)},_onMouseover:function(e){var i=t(e.target);e.preventDefault(),i.hasClass("textcomplete-item")||(i=i.closest(".textcomplete-item")),this._index=parseInt(i.data("index"),10),this._activateIndexedItem()},_onKeydown:function(e){var i;if(this.shown)switch(t.isFunction(this.option.onKeydown)&&(i=this.option.onKeydown(e,o)),null==i&&(i=this._defaultKeydown(e)),i){case o.KEY_UP:e.preventDefault(),this._up();break;case o.KEY_DOWN:e.preventDefault(),this._down();break;case o.KEY_ENTER:e.preventDefault(),this._enter(e);break;case o.KEY_PAGEUP:e.preventDefault(),this._pageup();break;case o.KEY_PAGEDOWN:e.preventDefault(),this._pagedown();break;case o.KEY_ESCAPE:e.preventDefault(),this.deactivate()}},_defaultKeydown:function(t){return this.isUp(t)?o.KEY_UP:this.isDown(t)?o.KEY_DOWN:this.isEnter(t)?o.KEY_ENTER:this.isPageup(t)?o.KEY_PAGEUP:this.isPagedown(t)?o.KEY_PAGEDOWN:this.isEscape(t)?o.KEY_ESCAPE:void 0},_up:function(){0===this._index?this._index=this.data.length-1:this._index-=1,this._activateIndexedItem(),this._setScroll()},_down:function(){this._index===this.data.length-1?this._index=0:this._index+=1,this._activateIndexedItem(),this._setScroll()},_enter:function(t){var e=this.data[parseInt(this._getActiveElement().data("index"),10)];this.completer.select(e.value,e.strategy,t),this.deactivate()},_pageup:function(){var e=0,i=this._getActiveElement().position().top-this.$el.innerHeight();this.$el.children().each(function(n){if(t(this).position().top+t(this).outerHeight()>i)return e=n,!1}),this._index=e,this._activateIndexedItem(),this._setScroll()},_pagedown:function(){var e=this.data.length-1,i=this._getActiveElement().position().top+this.$el.innerHeight();this.$el.children().each(function(n){if(t(this).position().top>i)return e=n,!1}),this._index=e,this._activateIndexedItem(),this._setScroll()},_activateIndexedItem:function(){this.$el.find(".textcomplete-item.active").removeClass("active"),this._getActiveElement().addClass("active")},_getActiveElement:function(){return this.$el.children(".textcomplete-item:nth("+this._index+")")},_setScroll:function(){var t=this._getActiveElement(),e=t.position().top,i=t.outerHeight(),n=this.$el.innerHeight(),o=this.$el.scrollTop();0===this._index||this._index==this.data.length-1||e<0?this.$el.scrollTop(e+o):e+i>n&&this.$el.scrollTop(e+i+o-n)},_buildContents:function(t){var e,n,o,s="";for(n=0;n<t.length&&this.data.length!==this.maxCount;n++)e=t[n],i(this.data,e)||(o=this.data.length,this.data.push(e),s+='<li class="textcomplete-item" data-index="'+o+'"><a>',s+=e.strategy.template(e.value,e.term),s+="</a></li>");return s},_renderHeader:function(e){if(this.header){this._$header||(this._$header=t('<li class="textcomplete-header"></li>').prependTo(this.$el));var i=t.isFunction(this.header)?this.header(e):this.header;this._$header.html(i)}},_renderFooter:function(e){if(this.footer){this._$footer||(this._$footer=t('<li class="textcomplete-footer"></li>').appendTo(this.$el));var i=t.isFunction(this.footer)?this.footer(e):this.footer;this._$footer.html(i)}},_renderNoResultsMessage:function(e){if(this.noResultsMessage){this._$noResultsMessage||(this._$noResultsMessage=t('<li class="textcomplete-no-results-message"></li>').appendTo(this.$el));var i=t.isFunction(this.noResultsMessage)?this.noResultsMessage(e):this.noResultsMessage;this._$noResultsMessage.html(i)}},_renderContents:function(t){this._$footer?this._$footer.before(t):this.$el.append(t)},_fitToBottom:function(){var t=e.scrollTop()+e.height(),i=this.$el.height();this.$el.position().top+i>t&&(this.completer.$iframe||this.$el.offset({top:t-i}))},_fitToRight:function(){for(var t,i=this.option.rightEdgeOffset,n=this.$el.offset().left,o=this.$el.width(),s=e.width()-i;n+o>s&&(this.$el.offset({left:n-i}),!((t=this.$el.offset().left)>=n));)n=t},_applyPlacement:function(t){return-1!==this.placement.indexOf("top")?t={top:"auto",bottom:this.$el.parent().height()-t.top+t.lineHeight,left:t.left}:(t.bottom="auto",delete t.lineHeight),-1!==this.placement.indexOf("absleft")?t.left=0:-1!==this.placement.indexOf("absright")&&(t.right=0,t.left="auto"),t}}),t.fn.textcomplete.Dropdown=s,t.extend(t.fn.textcomplete,o)}),t("skylark-jquery-textcomplete/completer",["skylark-jquery","./textcomplete","./dropdown"],function(t){"use strict";var e,i,n,o=0,s=[];function r(e,i){if(this.$el=t(e),this.id="textcomplete"+o++,this.strategies=[],this.views=[],this.option=t.extend({},r.defaults,i),!(this.$el.is("input[type=text]")||this.$el.is("input[type=search]")||this.$el.is("textarea")||e.isContentEditable||"true"==e.contentEditable))throw new Error("textcomplete must be called on a Textarea or a ContentEditable.");if(e===e.ownerDocument.activeElement)this.initialize();else{var n=this;this.$el.one("focus."+this.id,function(){n.initialize()}),this.option.adapter&&"CKEditor"!=this.option.adapter||"undefined"==typeof CKEDITOR||!this.$el.is("textarea")||CKEDITOR.on("instanceReady",function(e){-1==t.inArray(e.editor.id,s)&&(s.push(e.editor.id),e.editor.on("focus",function(i){n.$el=t(e.editor.editable().$),n.option.adapter||(n.option.adapter=t.fn.textcomplete.CKEditor),n.option.ckeditor_instance=e.editor,n.initialize()}))})}}r.defaults={appendTo:"body",className:"",dropdownClassName:"dropdown-menu textcomplete-dropdown",maxCount:10,zIndex:"100",rightEdgeOffset:30},t.extend(r.prototype,{id:null,option:null,strategies:null,adapter:null,dropdown:null,$el:null,$iframe:null,initialize:function(){var e,i,n=this.$el.get(0);if(this.$el.prop("ownerDocument")!==document&&window.frames.length)for(var o=0;o<window.frames.length;o++)if(this.$el.prop("ownerDocument")===window.frames[o].document){this.$iframe=t(window.frames[o].frameElement);break}this.dropdown=new t.fn.textcomplete.Dropdown(n,this,this.option),this.option.adapter?e=this.option.adapter:(i=this.$el.is("textarea")||this.$el.is("input[type=text]")||this.$el.is("input[type=search]")?"number"==typeof n.selectionEnd?"Textarea":"IETextarea":"ContentEditable",e=t.fn.textcomplete[i]),this.adapter=new e(n,this,this.option)},destroy:function(){this.$el.off("."+this.id),this.adapter&&this.adapter.destroy(),this.dropdown&&this.dropdown.destroy(),this.$el=this.adapter=this.dropdown=null},deactivate:function(){this.dropdown&&this.dropdown.deactivate()},trigger:function(t,e){this.dropdown||this.initialize(),null!=t||(t=this.adapter.getTextFromHeadToCaret());var i=this._extractSearchQuery(t);if(i.length){var n=i[1];if(e&&this._term===n&&""!==n)return;this._term=n,this._search.apply(this,i)}else this._term=null,this.dropdown.deactivate()},fire:function(t){var e=Array.prototype.slice.call(arguments,1);return this.$el.trigger(t,e),this},register:function(t){Array.prototype.push.apply(this.strategies,t)},select:function(t,e,i){this._term=null,this.adapter.select(t,e,i),this.fire("change").fire("textComplete:select",t,e),this.adapter.focus()},_clearAtNext:!0,_term:null,_extractSearchQuery:function(e){for(var i=0;i<this.strategies.length;i++){var n=this.strategies[i],o=n.context(e);if(o||""===o){var s=t.isFunction(n.match)?n.match(e):n.match;a=o,"[object String]"===Object.prototype.toString.call(a)&&(e=o);var r=e.match(s);if(r)return[n,r[n.index],r]}}var a;return[]},_search:(e=function(t,e,i,n){var o=this;e.search(i,function(n,s){o.dropdown.shown||o.dropdown.activate(),o._clearAtNext&&(o.dropdown.clear(),o._clearAtNext=!1),o.dropdown.setPosition(o.adapter.getCaretPosition()),o.dropdown.render(o._zip(n,e,i)),s||(t(),o._clearAtNext=!0)},n)},function(){var t=Array.prototype.slice.call(arguments);if(i)n=t;else{i=!0;var o=this;t.unshift(function t(){if(n){var s=n;n=void 0,s.unshift(t),e.apply(o,s)}else i=!1}),e.apply(this,t)}}),_zip:function(e,i,n){return t.map(e,function(t){return{value:t,strategy:i,term:n}})}}),t.fn.textcomplete.Completer=r}),t("skylark-jquery-textcomplete/adapter",["skylark-jquery","./textcomplete"],function(t){"use strict";var e=Date.now||function(){return(new Date).getTime()};function i(){}t.extend(i.prototype,{id:null,completer:null,el:null,$el:null,option:null,initialize:function(i,n,o){var s,r,a,l,h,c,d,p;this.el=i,this.$el=t(i),this.id=n.id+this.constructor.name,this.completer=n,this.option=o,this.option.debounce&&(this._onKeyup=(s=this._onKeyup,r=this.option.debounce,p=function(){var t=e()-c;t<r?a=setTimeout(p,r-t):(a=null,d=s.apply(h,l),h=l=null)},function(){return h=this,l=arguments,c=e(),a||(a=setTimeout(p,r)),d})),this._bindEvents()},destroy:function(){this.$el.off("."+this.id),this.$el=this.el=this.completer=null},select:function(){throw new Error("Not implemented")},getCaretPosition:function(){var e=this._getCaretRelativePosition(),i=this.$el.offset(),n=this.option.appendTo;if(n){n instanceof t||(n=t(n));var o=n.offsetParent().offset();i.top-=o.top,i.left-=o.left}return e.top+=i.top,e.left+=i.left,e},focus:function(){this.$el.focus()},_bindEvents:function(){this.$el.on("keyup."+this.id,t.proxy(this._onKeyup,this))},_onKeyup:function(t){this._skipSearch(t)||this.completer.trigger(this.getTextFromHeadToCaret(),!0)},_skipSearch:function(t){switch(t.keyCode){case 9:case 13:case 16:case 17:case 18:case 33:case 34:case 40:case 38:case 27:return!0}if(t.ctrlKey)switch(t.keyCode){case 78:case 80:return!0}}}),t.fn.textcomplete.Adapter=i}),t("skylark-jquery-textcomplete/content_editable",["skylark-jquery","./textcomplete","./adapter"],function(t){"use strict";function e(t,e,i){this.initialize(t,e,i)}t.extend(e.prototype,t.fn.textcomplete.Adapter.prototype,{select:function(e,i,n){var o=this.getTextFromHeadToCaret(),s=this.el.ownerDocument.getSelection(),r=s.getRangeAt(0),a=r.cloneRange();a.selectNodeContents(r.startContainer);var l,h=a.toString(),c=h.substring(r.startOffset),d=i.replace(e,n);if(void 0!==d){t.isArray(d)&&(c=d[1]+c,d=d[0]),l=t.isFunction(i.match)?i.match(o):i.match,o=o.replace(l,d).replace(/ $/,"&nbsp"),r.selectNodeContents(r.startContainer),r.deleteContents();var p=this.el.ownerDocument.createElement("div");p.innerHTML=o;var u=this.el.ownerDocument.createElement("div");u.innerHTML=c;for(var f,m,v=this.el.ownerDocument.createDocumentFragment();f=p.firstChild;)m=v.appendChild(f);for(;f=u.firstChild;)v.appendChild(f);r.insertNode(v),r.setStartAfter(m),r.collapse(!0),s.removeAllRanges(),s.addRange(r)}},_getCaretRelativePosition:function(){var e=this.el.ownerDocument.getSelection().getRangeAt(0).cloneRange(),i=e.endContainer.parentNode,n=this.el.ownerDocument.createElement("span");e.insertNode(n),e.selectNodeContents(n),e.deleteContents(),setTimeout(function(){i.normalize()},0);var o=t(n),s=o.offset();if(s.left-=this.$el.offset().left,s.top+=o.height()-this.$el.offset().top,s.lineHeight=o.height(),this.completer.$iframe){var r=this.completer.$iframe.offset();s.top+=r.top,s.left+=r.left,s.top-=t(this.completer.$iframe[0].contentWindow.document).scrollTop()}return o.remove(),s},getTextFromHeadToCaret:function(){var t=this.el.ownerDocument.getSelection().getRangeAt(0),e=t.cloneRange();return e.selectNodeContents(t.startContainer),e.toString().substring(0,t.startOffset)}}),t.fn.textcomplete.ContentEditable=e}),t("skylark-jquery-textcomplete/vendor/textarea_caret",["skylark-jquery","../textcomplete"],function(t){var e=["direction","boxSizing","width","height","overflowX","overflowY","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth","borderStyle","paddingTop","paddingRight","paddingBottom","paddingLeft","fontStyle","fontVariant","fontWeight","fontStretch","fontSize","fontSizeAdjust","lineHeight","fontFamily","textAlign","textTransform","textIndent","textDecoration","letterSpacing","wordSpacing","tabSize","MozTabSize"],i="undefined"!=typeof window,n=i&&null!=window.mozInnerScreenX;t.fn.textcomplete.getCaretCoordinates=function(t,o,s){if(!i)throw new Error("textarea-caret-position#getCaretCoordinates should only be called in a browser");var r=s&&s.debug||!1;if(r){var a=document.querySelector("#input-textarea-caret-position-mirror-div");a&&a.parentNode.removeChild(a)}var l=document.createElement("div");l.id="input-textarea-caret-position-mirror-div",document.body.appendChild(l);var h=l.style,c=window.getComputedStyle?getComputedStyle(t):t.currentStyle;h.whiteSpace="pre-wrap","INPUT"!==t.nodeName&&(h.wordWrap="break-word");h.position="absolute",r||(h.visibility="hidden");e.forEach(function(t){h[t]=c[t]}),n?t.scrollHeight>parseInt(c.height)&&(h.overflowY="scroll"):h.overflow="hidden";l.textContent=t.value.substring(0,o),"INPUT"===t.nodeName&&(l.textContent=l.textContent.replace(/\s/g," "));var d=document.createElement("span");d.textContent=t.value.substring(o)||".",l.appendChild(d);var p={top:d.offsetTop+parseInt(c.borderTopWidth),left:d.offsetLeft+parseInt(c.borderLeftWidth)};r?d.style.backgroundColor="#aaa":document.body.removeChild(l);return p}}),t("skylark-jquery-textcomplete/textarea",["skylark-jquery","./textcomplete","./adapter","./vendor/textarea_caret"],function(t){"use strict";function e(t,e,i){this.initialize(t,e,i)}t.extend(e.prototype,t.fn.textcomplete.Adapter.prototype,{select:function(e,i,n){var o,s=this.getTextFromHeadToCaret(),r=this.el.value.substring(this.el.selectionEnd),a=i.replace(e,n);void 0!==a&&(t.isArray(a)&&(r=a[1]+r,a=a[0]),o=t.isFunction(i.match)?i.match(s):i.match,s=s.replace(o,a),this.$el.val(s+r),this.el.selectionStart=this.el.selectionEnd=s.length)},getTextFromHeadToCaret:function(){return this.el.value.substring(0,this.el.selectionEnd)},_getCaretRelativePosition:function(){var e=t.fn.textcomplete.getCaretCoordinates(this.el,this.el.selectionStart);return{top:e.top+this._calculateLineHeight()-this.$el.scrollTop(),left:e.left-this.$el.scrollLeft(),lineHeight:this._calculateLineHeight()}},_calculateLineHeight:function(){var t=parseInt(this.$el.css("line-height"),10);if(isNaN(t)){var e=this.el.parentNode,i=document.createElement(this.el.nodeName),n=this.el.style;i.setAttribute("style","margin:0px;padding:0px;font-family:"+n.fontFamily+";font-size:"+n.fontSize),i.innerHTML="test",e.appendChild(i),t=i.clientHeight,e.removeChild(i)}return t}}),t.fn.textcomplete.Textarea=e}),t("skylark-jquery-textcomplete/main",["./textcomplete","./strategy","./completer","./content_editable","./textarea"],function(){}),t("skylark-jquery-textcomplete",["skylark-jquery-textcomplete/main"],function(t){return t})}(i),!n){var r=require("skylark-langx-ns");o?module.exports=r:e.skylarkjs=r}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-jquery-textcomplete.js.map
