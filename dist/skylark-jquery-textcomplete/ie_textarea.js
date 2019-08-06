/**
 * skylark-jquery-textcomplete - A version of jquery-textcomplete.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jquery-textcomplete/
 * @license MIT
 */
defin(["skylark-jquery","./textcomplete"],function(e){"use strict";var t="吶";function a(a,r,n){this.initialize(a,r,n),e("<span>"+t+"</span>").css({position:"absolute",top:-9999,left:-9999}).insertBefore(a)}e.extend(a.prototype,e.fn.textcomplete.Textarea.prototype,{select:function(t,a,r){var n,c=this.getTextFromHeadToCaret(),o=this.el.value.substring(c.length),i=a.replace(t,r);if(void 0!==i){e.isArray(i)&&(o=i[1]+o,i=i[0]),n=e.isFunction(a.match)?a.match(c):a.match,c=c.replace(n,i),this.$el.val(c+o),this.el.focus();var l=this.el.createTextRange();l.collapse(!0),l.moveEnd("character",c.length),l.moveStart("character",c.length),l.select()}},getTextFromHeadToCaret:function(){this.el.focus();var e=document.selection.createRange();e.moveStart("character",-this.el.value.length);var a=e.text.split(t);return 1===a.length?a[0]:a[1]}}),e.fn.textcomplete.IETextarea=a});
//# sourceMappingURL=sourcemaps/ie_textarea.js.map
