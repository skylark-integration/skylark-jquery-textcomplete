defin([
  "skylark-jquery",
  "./textcomplete"
],function ($) {
  'use strict';

  // CKEditor adapter
  // =======================
  //
  // Adapter for CKEditor, based on contenteditable elements.
  function CKEditor (element, completer, option) {
    this.initialize(element, completer, option);
  }

  $.extend(CKEditor.prototype, $.fn.textcomplete.ContentEditable.prototype, {
    _bindEvents: function () {
      var $this = this;
      this.option.ckeditor_instance.on('key', function(event) {
        var domEvent = event.data;
        $this._onKeyup(domEvent);
        if ($this.completer.dropdown.shown && $this._skipSearch(domEvent)) {
          return false;
        }
      }, null, null, 1); // 1 = Priority = Important!
      // we actually also need the native event, as the CKEditor one is happening to late
      this.$el.on('keyup.' + this.id, $.proxy(this._onKeyup, this));
    },
});

  $.fn.textcomplete.CKEditor = CKEditor;

});
