+(function($) {
    'use strict';
    $.fn.Dialog = function(DialogConf) {
        var Dialog = (function() {
            var _Dialog = {
                $control: $('body'),
                $dialogFooter: null,
                $dialogContent: null,
                $dialogWrap: null,
                $maskLayer: $('<div class="dialog-mask"></div>'),
                animateSpeed: 'fast',
                iconList: ['error', 'file', 'question', 'warning'],
                typeList: ['confirm', 'prompt'],
                closeDialog: function() {
                    _Dialog.$maskLayer.animate({
                        height: 0,
                        opacity: '0.0',
                        left: '50%',
                        top: '50%',
                        width: 0
                    }, _Dialog.animateSpeed, function() {
                        _Dialog.$maskLayer.children(':first').hide();
                        _Dialog.$maskLayer.remove();
                    });
                },
                create: function() {
                    this.$control.append(_Dialog.$maskLayer);
                    this.$maskLayer.animate({
                            height: '100%',
                            opacity: '0.8',
                            left: 0,
                            top: 0,
                            width: '100%'
                        }, _Dialog.animateSpeed, function() {
                            var _dialogHTML = '<div class="dialog-wrap">' +
                                '     <span class="dialog-title">' + _Dialog.defaultConf.title +
                                '         <span class="dialog-close"></span>' +
                                '     </span>' +
                                '     <div class="dialog-content">' +
                                '     </div>' +
                                '     <div class="dialog-footer"></div>' +
                                '</div>';
                            _Dialog.$maskLayer.append(_dialogHTML);
                            _Dialog.$dialogFooter = _Dialog.$maskLayer.find('.dialog-footer');
                            _Dialog.$dialogContent = _Dialog.$maskLayer.find('.dialog-content');
                            _Dialog.$dialogWrap = _Dialog.$maskLayer.find('div.dialog-wrap');
                            var _$elemArr = [$('<div></div>'), $('<div></div>')];
                            if (_Dialog.iconList.indexOf(_Dialog.defaultConf.icon) >= 0) {
                                _$elemArr[0]
                                    .css({
                                        margin: '8px'
                                    })
                                    .toggleClass('dialog-icon icon-' + _Dialog.defaultConf.icon);
                            }
                            if (_Dialog.defaultConf.type === 'prompt') {
                                _$elemArr.push($('<div><input></div>'));
                                _$elemArr[_$elemArr.length - 1].css({ 'padding-top': '14px' });
                            }
                            _Dialog.$dialogContent.append(_$elemArr);
                            _Dialog.loadHTML();
                            _Dialog.$dialogWrap.find('.dialog-title').children(':first').off('click').on('click', function() {
                                _Dialog.closeDialog();
                            });
                        })
                        .attr({
                            id: 'dialog_' + (new Date()).getTime()
                        });
                },
                defaultConf: {
                    buttons: [],
                    /**
                     * null | '' | undefined: 不显示图标
                     * error: 错误图标
                     * file: 自定义图标文件(.jpg|.png|.gif)
                     * question: 疑问图标
                     * warning: 警告图标
                     */
                    icon: '',
                    onCancelClick: function() {
                        try {
                            throw new Error('Dialog.onCancelClick is undefined. Please set the onOkClick method in the parameter.');
                        } catch (err) {
                            console.log(err.name, ':', err.message);
                        }
                    },
                    onOkClick: function() {
                        try {
                            throw new Error('Dialog.onOkClick is undefined. Please set the onCancelClick method in the parameter.');
                        } catch (err) {
                            console.log(err.name, ':', err.message);
                        }
                    },
                    title: 'dialog',
                    /**
                     * confirm: 显示一个带有指定消息和 OK 及取消按钮的对话框
                     * prompt: 显示可提示用户进行输入的对话框
                     */
                    type: 'confirm' || 'prompt'
                },
                getHeight: function() {
                    var _result = 'auto';
                    try {
                        if (typeof this.defaultConf.height !== 'undefined' && this.defaultConf.height !== 'undefined') {
                            var _height = this.defaultConf.height;
                            var _heightStr = _height.toString();
                            var _chk = _height.replace(/\d/g, '');
                            if (_chk === '%' && _height.indexOf('%') === _height.length - 1) {
                                _result = _height;
                            }
                            if (_chk === '') {
                                _result = _height + 'px';
                            }
                        }
                    } catch (err) {} finally {
                        return _result;
                    }
                },
                getWidth: function() {
                    var _result = 'auto';
                    try {
                        if (typeof this.defaultConf.width !== 'undefined' && this.defaultConf.width !== 'undefined') {
                            var _width = this.defaultConf.width;
                            var _widthStr = _width.toString();
                            var _chk = _width.replace(/\d/g, '');
                            if (_chk === '%' && _width.indexOf('%') === _width.length - 1) {
                                _result = _width;
                            }
                            if (_chk === '') {
                                _result = _width + 'px';
                            }
                        }
                    } catch (err) {} finally {
                        return _result;
                    }
                },
                initDialog: function() {
                    var _buttonsHTML = '';
                    var _item = null;
                    var _buttons = this.defaultConf.buttons;
                    if (typeof _buttons.length === 'undefined' || _buttons.length === 'undefined') {
                        _buttons = [];
                    }
                    this.$dialogWrap
                        .css({
                            // height: this.getHeight(),
                            // width: this.getWidth(),
                            // 'left': (this.$maskLayer[0].offsetWidth - this.$dialogWrap[0].offsetWidth) / 2,
                            // 'top': (this.$maskLayer[0].offsetHeight - this.$dialogWrap[0].offsetHeight) / 2
                            'margin-left': '-' + (this.$dialogWrap.width() / 2) + 'px',
                            'margin-top': '-' + (this.$dialogWrap.height() / 2) + 'px'
                        });
                    if ((this.defaultConf.type === 'confirm' || this.defaultConf.type === 'prompt') && _buttons.length === 0) {
                        _buttons = [{
                            defaultClick: true,
                            id: 'ok',
                            onClick: function($dialogWrap, closeDialog) {
                                if (typeof _Dialog.defaultConf.onOkClick === 'function') {
                                    _Dialog.defaultConf.onOkClick($dialogWrap);
                                }
                                closeDialog();
                            },
                            title: '确定'
                        }, {
                            defaultClick: false,
                            id: 'cancel',
                            onClick: function($dialogWrap, closeDialog) {
                                if (typeof _Dialog.defaultConf.onCancelClick === 'function') {
                                    _Dialog.defaultConf.onCancelClick($dialogWrap);
                                }
                                closeDialog();
                            },
                            title: '取消'
                        }]
                    }
                    for (var _idx = 0; _idx < _buttons.length; _idx++) {
                        _item = _buttons[_idx];
                        _buttonsHTML += '<button id="dlg_btn_' + _idx +
                            '" data-default="' + _item.defaultClick +
                            '">' + _item.title + '</button>';
                    }
                    if (_buttonsHTML !== '') {
                        this.$dialogFooter.append(_buttonsHTML).children().each(function(idx, item) {
                            var _button = null;
                            var _id = '';
                            _button = _buttons[idx];
                            _button.$elem = $(item);
                            _button.$elem.off('click').on('click', function() {
                                _button.onClick(_Dialog.$dialogWrap, _Dialog.closeDialog);
                            });
                        });
                        if (_Dialog.defaultConf.type === 'prompt') {
                            var _$elem = _Dialog.$dialogContent.children(':last');
                            var _$input = _$elem.children('input');
                            _$input
                                .css({
                                    'font-weight': 'bold'
                                })
                                .off('keypress')
                                .on('keypress', function(event) {
                                    var _event = event || window.event;
                                    if (_event.keyCode === 13) {
                                        _Dialog.$dialogFooter.children('button[data-default="true"]').click();
                                    }
                                });
                            _Dialog.$dialogContent.css({
                                'padding-footer': 2
                            });
                            _$input[0].focus();
                        }
                    } else {
                        this.$dialogFooter.hide();
                    }
                },
                loadHTML: function() {
                    var _$elem = _Dialog.$dialogContent.children(':eq(1)');
                    var _setDialogContent = function(status) {
                        _$elem.css({
                            'margin-left': _Dialog.iconList.indexOf(_Dialog.defaultConf.icon) >= 0 ? '52px' : '8px',
                            'padding-footer': '8px',
                            'padding-left': 0,
                            'padding-right': '8px',
                            'padding-top': '18px'
                        });
                        if (status !== 'success' || typeof status === 'undefined' || status === 'undefined') {
                            _$elem.html(_Dialog.defaultConf.html);
                        }
                        _Dialog.initDialog();
                    };
                    if (this.typeList.indexOf(this.defaultConf.type) < 0 && this.defaultConf.html !== '') {
                        _$elem.load(this.defaultConf.html, function(response, status, xhr) {
                            if (status === 'success') {}
                            _setDialogContent(status);
                        });
                    } else {
                        _setDialogContent();
                    }
                }
            };
            return _Dialog;
        }());
        $.extend(Dialog.defaultConf, DialogConf);
        Dialog.create();
        this.data('Dialog', $.extend({}, null));
    };
})(jQuery);
/*
 * Demo
 */
// $(document).Dialog({
//     // buttons: [{
//     //     defaultClick: true,
//     //     id: 'apply',
//     //     onClick: function($dialogWrap, closeDialog) {
//     //         console.log('您点击了Apply按钮.', $dialogWrap);
//     //         closeDialog();
//     //     },
//     //     title: '应用-Apply'
//     // }, {
//     //     defaultClick: false,
//     //     id: 'ok',
//     //     onClick: function($dialogWrap, closeDialog) {
//     //         console.log('您点击了确定按钮.', $dialogWrap);
//     //         closeDialog();
//     //     },
//     //     title: '确定-Ok'
//     // }],
//     // html: 'confirm 显示一个带有指定消息和 OK 及取消按钮的对话框<br>显示一个带有指定消息和 OK 及取消按钮的对话框',
//     html: '../../../report/dialogDemo.html #dialog',
//     icon: 'error',
//     title: 'Dialog Title',
//     // prompt | confirm
//     type: 'prompt'
// });