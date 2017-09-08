/**
 * @name 对话框DOM控制器
 * @version 1.0.0
 */
+ function($) {
    'use strict';
    var dialog = function(event, $obj, $dialogElem) {
        this.init(event, $obj, $dialogElem);
    };
    dialog.prototype = {
        $footer: null,
        $framework: null,
        $obj: null,
        $wrap: null,
        animateSpeed: 'fast',
        close: function() {
            var _this = this;
            _this.$framework.animate({
                height: 0,
                opacity: '0.0',
                left: '50%',
                top: '50%',
                width: 0
            }, _this.animateSpeed, function() {
                _this.$footer.children().appendTo(_this.$dialogElem.insertBefore(_this.$framework).hide());
                _this.$framework.remove();
            });
        },
        dialogFramework: '<div class="dialog-mask">' +
            '                   <div class="dialog-wrap">' +
            '                       <span class="dialog-title">' +
            '                           <label></label>' +
            '                           <span class="dialog-close"></span>' +
            '                       </span>' +
            '                       <div class="dialog-content"></div>' +
            '                       <div class="dialog-footer"></div>' +
            '                   </div>' +
            '                </div>',
        event: null,
        init: function(event, $obj, $dialogElem) {
            this.event = event;
            this.$obj = $obj;
            this.$dialogElem = $dialogElem;
            this.show();
        },
        show: function() {
            var _this = this;
            _this.$framework = $(_this.dialogFramework);
            _this.$wrap = _this.$framework.find('div.dialog-wrap').hide();
            _this.$framework
                .attr({ id: 'dialog_' + _this.$obj.index() })
                .insertAfter(_this.$dialogElem);
            _this.$wrap.find('span.dialog-title label').text(_this.$dialogElem.attr('data-title'));
            _this.$wrap.find('span.dialog-close').on('click', function() {
                _this.close();
            });
            _this.$footer = _this.$wrap.find('div.dialog-footer');
            _this.$dialogElem
                .appendTo(_this.$wrap.find('div.dialog-content'))
                .find('[data-toggle="footer"]')
                .appendTo(_this.$footer);
            _this.$framework
                .animate({
                    height: '100%',
                    opacity: '0.8',
                    left: 0,
                    top: 0,
                    width: '100%',
                    'z-index': (new Date()).getTime()
                }, _this.animateSpeed, function() {
                    if (_this.$footer.children().length === 0) {
                        _this.$footer.hide();
                    } else {
                        _this.$footer.show().children().each(function(index, item) {
                            item.__dialog = _this;
                            $(item).find('[data-dismiss="true"]').off('click').on('click', function() {
                                _this.close();
                            });
                        });
                    }
                    _this.$wrap
                        .css({
                            'margin-left': '-' + (_this.$wrap.width() / 2) + 'px',
                            'margin-top': '-' + (_this.$wrap.height() / 2) + 'px',
                        })
                        .show();
                    _this.$dialogElem
                        .css({
                            'padding-top': 0
                        })
                        .show();
                });
        }
    };
    $(document).on('click', '[data-toggle="dialog"]', function(event) {
        if (typeof this.__dialog === 'undefined' || this.__dialog === 'undefined' || this.__dialog === null) {
            this.__dialog = new dialog(event || window.event, $(this), $($(this).attr('data-target')));
        } else {
            this.__dialog.show();
        }
    });
}(jQuery);