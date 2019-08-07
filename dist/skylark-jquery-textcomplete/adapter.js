/**
 * skylark-jquery-textcomplete - A version of jquery-textcomplete.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jquery-textcomplete/
 * @license MIT
 */
define(["skylark-jquery","./textcomplete"],function(t){"use strict";var e=Date.now||function(){return(new Date).getTime()};function i(){}t.extend(i.prototype,{id:null,completer:null,el:null,$el:null,option:null,initialize:function(i,n,o){var s,c,l,r,u,a,h,f;this.el=i,this.$el=t(i),this.id=n.id+this.constructor.name,this.completer=n,this.option=o,this.option.debounce&&(this._onKeyup=(s=this._onKeyup,c=this.option.debounce,f=function(){var t=e()-a;t<c?l=setTimeout(f,c-t):(l=null,h=s.apply(u,r),u=r=null)},function(){return u=this,r=arguments,a=e(),l||(l=setTimeout(f,c)),h})),this._bindEvents()},destroy:function(){this.$el.off("."+this.id),this.$el=this.el=this.completer=null},select:function(){throw new Error("Not implemented")},getCaretPosition:function(){var e=this._getCaretRelativePosition(),i=this.$el.offset(),n=this.option.appendTo;if(n){n instanceof t||(n=t(n));var o=n.offsetParent().offset();i.top-=o.top,i.left-=o.left}return e.top+=i.top,e.left+=i.left,e},focus:function(){this.$el.focus()},_bindEvents:function(){this.$el.on("keyup."+this.id,t.proxy(this._onKeyup,this))},_onKeyup:function(t){this._skipSearch(t)||this.completer.trigger(this.getTextFromHeadToCaret(),!0)},_skipSearch:function(t){switch(t.keyCode){case 9:case 13:case 16:case 17:case 18:case 33:case 34:case 40:case 38:case 27:return!0}if(t.ctrlKey)switch(t.keyCode){case 78:case 80:return!0}}}),t.fn.textcomplete.Adapter=i});
//# sourceMappingURL=sourcemaps/adapter.js.map
