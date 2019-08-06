/**
 * skylark-jquery-textcomplete - A version of jquery-textcomplete.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jquery-textcomplete/
 * @license MIT
 */
defin(["skylark-jquery","./textcomplete","./adapter","./vendor/textarea_caret"],function(e){"use strict";function t(e,t,i){this.initialize(e,t,i)}e.extend(t.prototype,e.fn.textcomplete.Adapter.prototype,{select:function(t,i,n){var l,a=this.getTextFromHeadToCaret(),s=this.el.value.substring(this.el.selectionEnd),r=i.replace(t,n);void 0!==r&&(e.isArray(r)&&(s=r[1]+s,r=r[0]),l=e.isFunction(i.match)?i.match(a):i.match,a=a.replace(l,r),this.$el.val(a+s),this.el.selectionStart=this.el.selectionEnd=a.length)},getTextFromHeadToCaret:function(){return this.el.value.substring(0,this.el.selectionEnd)},_getCaretRelativePosition:function(){var t=e.fn.textcomplete.getCaretCoordinates(this.el,this.el.selectionStart);return{top:t.top+this._calculateLineHeight()-this.$el.scrollTop(),left:t.left-this.$el.scrollLeft(),lineHeight:this._calculateLineHeight()}},_calculateLineHeight:function(){var e=parseInt(this.$el.css("line-height"),10);if(isNaN(e)){var t=this.el.parentNode,i=document.createElement(this.el.nodeName),n=this.el.style;i.setAttribute("style","margin:0px;padding:0px;font-family:"+n.fontFamily+";font-size:"+n.fontSize),i.innerHTML="test",t.appendChild(i),e=i.clientHeight,t.removeChild(i)}return e}}),e.fn.textcomplete.Textarea=t});
//# sourceMappingURL=sourcemaps/textarea.js.map
