/**
 * skylark-jquery-textcomplete - A version of jquery-textcomplete.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jquery-textcomplete/
 * @license MIT
 */
define(["skylark-jquery"],function(e){"use strict";var t=1;e.fn.textcomplete=function(a,o){var r=Array.prototype.slice.call(arguments);return this.each(function(){var n=e(this),i=n.data("textComplete");if(i||(o||(o={}),o._oid=t++,i=new e.fn.textcomplete.Completer(this,o),n.data("textComplete",i)),"string"==typeof a){if(!i)return;r.shift(),i[a].apply(i,r),"destroy"===a&&n.removeData("textComplete")}else e.each(a,function(t){e.each(["header","footer","placement","maxCount"],function(e){var a;t[e]&&(i.option[e]=t[e],a=e+"as a strategy param is deprecated. Use option.",console.warn&&console.warn(a),delete t[e])})}),i.register(e.fn.textcomplete.Strategy.parse(a,{el:this,$el:n}))})}});
//# sourceMappingURL=sourcemaps/textcomplete.js.map
