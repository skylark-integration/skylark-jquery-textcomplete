/**
 * skylark-jquery-textcomplete - A version of jquery-textcomplete.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jquery-textcomplete/
 * @license MIT
 */
define(["skylark-jquery","./textcomplete","./content_editable"],function(t){"use strict";function e(t,e,n){this.initialize(t,e,n)}t.extend(e.prototype,t.fn.textcomplete.ContentEditable.prototype,{_bindEvents:function(){var e=this;this.option.ckeditor_instance.on("key",function(t){var n=t.data;if(e._onKeyup(n),e.completer.dropdown.shown&&e._skipSearch(n))return!1},null,null,1),this.$el.on("keyup."+this.id,t.proxy(this._onKeyup,this))}}),t.fn.textcomplete.CKEditor=e});
//# sourceMappingURL=sourcemaps/ckeditor.js.map
