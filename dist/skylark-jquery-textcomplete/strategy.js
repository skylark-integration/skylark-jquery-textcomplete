/**
 * skylark-jquery-textcomplete - A version of jquery-textcomplete.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jquery-textcomplete/
 * @license MIT
 */
defin(["skylark-jquery","./textcomplete"],function(t){"use strict";var e=function(t){var e={};return function(n,c){e[n]?c(e[n]):t.call(this,n,function(t){e[n]=(e[n]||[]).concat(t),c.apply(null,arguments)})}};function n(n){t.extend(this,n),this.cache&&(this.search=e(this.search))}n.parse=function(e,c){return t.map(e,function(t){var e=new n(t);return e.el=c.el,e.$el=c.$el,e})},t.extend(n.prototype,{match:null,replace:null,search:null,id:null,cache:!1,context:function(){return!0},index:2,template:function(t){return t},idProperty:null}),t.fn.textcomplete.Strategy=n});
//# sourceMappingURL=sourcemaps/strategy.js.map
