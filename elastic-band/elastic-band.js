/**
 * Created by ZhangH on 2017/5/10.
 * @version 1.0.0
 * @version 1.0.1
 * 修改：增加位置比例参数，应用于不同图像尺寸的大小使用
 */
+(function($) {
    'use strict';
    $.fn.ElasticBand = function(ElasticBandConf) {
        var ElasticBand = (function() {
            var _ElasticBandComponent = {
                cacheWinddowMouseEvent: null,
                divStr: '<div class="elastic-band-delete" name="rectDelete"></div><div class="elastic-band-zoom" name="rectZoom"></div>',
                rectElemStr: '<div class="elastic-band-tmp"></div>',
                rectItemStr: 'div.elastic-band-draw[name="ElasticBandDraw"] div.elastic-band[name="rectItem"]',
                rectDeleteStr: 'div.elastic-band-draw[name="ElasticBandDraw"] div.elastic-band-delete[name="rectDelete"]',
                $draw: null,
                $scroll: null,
                $tmpRectELem: null,
                $window: $(window),
                calculateScroll: function() {
                    var _position = {
                        x: (this.event.pageX || this.event.clientX) - this.$draw.offset().left,
                        y: (this.event.pageY || this.event.clientY) - this.$draw.offset().top
                    };
                    if (this.tmpRect.x2 === 0 && this.tmpRect.y2 === 0) {
                        return;
                    }
                    this.scrollInfo.xD = this.$scroll.width();
                    this.scrollInfo.xH = this.$draw.width();
                    this.scrollInfo.yD = this.$scroll.height();
                    this.scrollInfo.yH = this.$draw.height();
                    if (_position.x >= this.scrollInfo.xD + this.$scroll[0].scrollLeft) {
                        this.$scroll[0].scrollLeft += this.scrollInfo.xP();
                    }
                    if (_position.x <= this.$scroll[0].scrollLeft && this.$scroll[0].scrollLeft > 0 && this.tmpRect.x1 !== this.tmpRect.x2) {
                        this.$scroll[0].scrollLeft -= this.scrollInfo.xP();
                    }
                    if (_position.y >= this.scrollInfo.yD + this.$scroll[0].scrollTop) {
                        this.$scroll[0].scrollTop += this.scrollInfo.yP();
                    }
                    if (_position.y < this.$scroll[0].scrollTop && this.$scroll[0].scrollTop > 0 && this.tmpRect.y1 !== this.tmpRect.y2) {
                        this.$scroll[0].scrollTop -= this.scrollInfo.yP();
                    }
                },
                createWrap: function($obj) {
                    this.$scroll = $('<div></div>');
                    this.$scroll
                        .attr({
                            name: 'ElasticBandScroll'
                        })
                        .toggleClass('elastic-band-scroll');
                    this.$draw = $('<div></div>');
                    this.$draw
                        .attr({
                            name: 'ElasticBandDraw'
                        })
                        .height(this.defaultConf.height)
                        .toggleClass('elastic-band-draw')
                        .width(this.defaultConf.width);
                    this.setBackground(this.defaultConf.background);
                    this.$scroll.append(this.$draw);
                    // this.$window
                    this.$scroll
                        .off('mousedown mousemove mouseup resize')
                        .on('mousedown', function(event) {
                            _ElasticBandComponent.onMouseDown(event);
                        })
                        .on('mousemove', function(event) {
                            _ElasticBandComponent.onMouseMove(event);
                        })
                        .on('mouseup', function(event) {
                            _ElasticBandComponent.onMouseUp(event);
                        })
                        .on('resize', function() {
                            _ElasticBandComponent.onResize();
                        });
                    $(document)
                        .off('click', this.rectItemStr)
                        .on('click', this.rectItemStr, function() {
                            _ElasticBandComponent.onRectItemClick($(this));
                        });
                    $(document)
                        .off('click', this.rectDeleteStr)
                        .on('click', this.rectDeleteStr, function() {
                            _ElasticBandComponent.onDeleteRectClick($(this));
                        });
                    $obj.append(this.$scroll);
                },
                defaultConf: {
                    background: 'none',
                    height: 0,
                    items: [],
                    minSize: {
                        height: 0,
                        width: 0
                    },
                    onAfterAddRect: function($rectItem) {
                        try {
                            throw new Error('ElasticBand.onAfterAddRect is undefined.');
                        } catch (err) {
                            console.log(err.name, ':', err.message);
                            return false;
                        }
                    },
                    onAfterChangeRect: function() {
                        try {
                            throw new Error('ElasticBand.onAfterChangeRect is undefined.');
                        } catch (err) {
                            console.log(err.name, ':', err.message);
                            return false;
                        }
                    },
                    onAfterLoad: function(obj) {
                        try {
                            throw new Error('ElasticBand.onAfterLoad is undefined.');
                        } catch (err) {
                            console.log(err.name, ':', err.message);
                            return false;
                        }
                    },
                    onBeforeLoad: function() {
                        try {
                            throw new Error('ElasticBand.onBeforeLoad is undefined.');
                        } catch (err) {
                            console.log(err.name, ':', err.message);
                            return false;
                        }
                    },
                    onDeleteRect: function() {
                        try {
                            throw new Error('ElasticBand.onBeforeLoad is undefined.');
                        } catch (err) {
                            console.log(err.name, ':', err.message);
                            return false;
                        }
                    },
                    onLoadError: function() {
                        try {
                            throw new Error('ElasticBand.onLoadError is undefined.');
                        } catch (err) {
                            console.log(err.name, ':', err.message);
                            return false;
                        }
                    },
                    width: 0
                },
                deleteItem: function(index) {
                    var _index = -1;
                    _index = index.toString().replace(/\d/ig, '');
                    if (_index.length === 0 || (_index.length > 0 && (_index === 'all' || _index === 'last' || _index === 'first'))) {
                        if (_index === 'last') {
                            _index = this.defaultConf.items.length - 1;
                        } else {
                            if (_index === 'first') {
                                _index = 0;
                            } else {
                                if (_index === 'all') {
                                    while (this.defaultConf.items.length > 0) {
                                        this.defaultConf.items[0].$elem.remove();
                                        this.defaultConf.items.splice(0, 1);
                                    }
                                    return;
                                } else {
                                    _index = parseInt(index);
                                }
                            }
                        }
                        this.defaultConf.items[_index].$elem.remove();
                        this.defaultConf.items.splice(_index, 1);
                    }
                },
                drawRect: function() {
                    this.isDrawRect = true;
                    this.restoreRectItemInitStyle($(this.rectItemStr));
                },
                event: null,
                fullSize: function() {
                    this.zoomInterval.value(0);
                },
                getPosition: function(isStartingPoint) {
                    var _position = {
                        x: this.$scroll[0].scrollLeft,
                        y: this.$scroll[0].scrollTop
                    };
                    _position.x = (this.event.pageX || this.event.clientX) - this.$draw.offset().left;
                    if (_position.x <= 0) {
                        _position.x = 1;
                    }
                    if (_position.x >= this.$draw.width()) {
                        _position.x = this.$draw.width() - 3;
                    }
                    _position.y = (this.event.pageY || this.event.clientY) - this.$draw.offset().top;
                    if (_position.y < 0) {
                        _position.y = 1;
                    }
                    if (_position.y >= this.$draw.height()) {
                        _position.y = this.$draw.height() - 3;
                    }
                    return _position;
                },
                getScrollRatio: function() {
                    this.zoomInterval.scroll.left.val = this.$scroll[0].scrollLeft;
                    this.zoomInterval.scroll.top.val = this.$scroll[0].scrollTop;
                    if (this.zoomInterval.scroll.left.val > 0) {
                        this.zoomInterval.scroll.left.ratio = this.$scroll[0].scrollLeft / (this.$scroll[0].scrollWidth - this.$scroll[0].clientWidth);
                    }
                    if (this.zoomInterval.scroll.top.val > 0) {
                        this.zoomInterval.scroll.top.ratio = this.$scroll[0].scrollTop / (this.$scroll[0].scrollHeight - this.$scroll[0].clientHeight);
                    }
                },
                isDrawRect: true,
                isMoveRect: false,
                isMouseLeftBtn: false,
                items: function() {
                    return this.defaultConf.items;
                },
                isZoomRect: false,
                mouseMoveMonitor: [],
                moveRect: function() {
                    this.isDrawRect = false;
                },
                onDeleteRectClick: function($obj) {
                    try {
                        var _index = $obj.parent().index();
                        if (typeof this.defaultConf.onDeleteRect === 'function') {
                            this.defaultConf.onDeleteRect(_index);
                        }
                        this.deleteItem(_index);
                    } catch (err) {
                        console.log(err.name, ':', err.message);
                    } finally {}
                },
                onMouseDown: function(event) {
                    this.event = event || window.event;
                    var _$target = $(this.event.target);
                    var _tarName = _$target.attr('name');
                    if ([typeof _tarName, _tarName].indexOf('undefined') >= 0) {
                        return;
                    }
                    var _position = {
                        x: this.event.pageX || this.event.clientX,
                        y: this.event.pageY || this.event.clientY
                    };
                    if ((_position.x - this.$scroll.offset().left >= this.$scroll[0].clientWidth &&
                            this.$scroll[0].scrollHeight > 0 &&
                            this.$scroll[0].offsetWidth > this.$scroll[0].clientWidth) ||
                        (_position.y - this.$scroll.offset().top >= this.$scroll[0].clientHeight &&
                            this.$scroll[0].scrollWidth > 0 &&
                            this.$scroll[0].offsetHeight > this.$scroll[0].clientHeight)) {
                        return;
                    }
                    if (_tarName === 'rectDelete') {
                        return;
                    }
                    if (this.isMoveRect || this.isDrawRect) {
                        var _position = this.getPosition();
                        if (_position === null) {
                            return;
                        }
                        if (_position.x > 0 || _position.y > 0) {
                            this.tmpRect.x1 = _position.x;
                            this.tmpRect.y1 = _position.y;
                            this.isMouseLeftBtn = (this.event.buttons === 1);
                            if (this.isDrawRect) {
                                this.$tmpRectELem = $(this.rectElemStr);
                                this.$draw.append(this.$tmpRectELem.css({ display: 'none' }));
                            } else {
                                if (this.isMoveRect && _tarName !== 'ElasticBandDraw') {
                                    if (['rectItem', 'rectZoom'].indexOf(_tarName) >= 0) {
                                        this.tmpRect.old.height = _tarName === 'rectZoom' ? _$target.parent()[0].offsetHeight : _$target[0].offsetHeight;
                                        this.tmpRect.old.left = _tarName === 'rectZoom' ? parseFloat(_$target.parent().css('left')) : parseFloat(_$target.css('left'));
                                        this.tmpRect.old.top = _tarName === 'rectZoom' ? parseFloat(_$target.parent().css('top')) : parseFloat(_$target.css('top'));
                                        this.tmpRect.old.width = _tarName === 'rectZoom' ? _$target.parent()[0].offsetWidth : _$target[0].offsetWidth;
                                        if (_tarName === 'rectZoom') {
                                            this.isZoomRect = true;
                                        }
                                        if (_tarName === 'rectItem') {
                                            if (_$target.attr('data-selected') === 'false') {
                                                return;
                                            }
                                        }
                                    } else {
                                        return;
                                    }
                                } else {
                                    this.restoreRectItemInitStyle(_$target.children());
                                    return;
                                }
                            }
                            this.startMonitorMouseMove();
                        }
                    }
                },
                onMouseMove: function(event) {
                    if ((this.isMoveRect || this.isDrawRect) && this.isMouseLeftBtn) {
                        this.event = event || window.event;
                        if (this.$tmpRectELem !== null) {
                            if (this.$tmpRectELem.css('display') === 'none') {
                                this.$tmpRectELem.css({ display: 'block' });
                            }
                        }
                    }
                },
                onMouseUp: function(event) {
                    try {
                        if (this.$tmpRectELem !== null) {
                            if (this.$tmpRectELem.height() <= 2 || this.$tmpRectELem.width() <= 2) {
                                throw new Error('所画区域过小（宽高小于3px），不被创建。');
                            } else {
                                if (this.$tmpRectELem[0].offsetHeight < this.defaultConf.minSize.height || this.$tmpRectELem[0].offsetWidth < this.defaultConf.minSize.width) {
                                    throw new Error('所画区域超出最小范围（最小宽' + this.defaultConf.minSize.width +
                                        'px；最小高' + this.defaultConf.minSize.width + 'px），不被创建。');
                                }
                                if (typeof this.defaultConf.onAfterAddRect === 'function') {
                                    var _ratio = this.ratio();
                                    this.$tmpRectELem
                                        .toggleClass('elastic-band-tmp')
                                        .toggleClass('elastic-band')
                                        .attr({ 'data-selected': false, name: 'rectItem' })
                                        .css({ 'z-index': 1 })
                                        .append(this.divStr);
                                    this.$tmpRectELem.children().each(function(idx, item) {
                                        var _size = {
                                            height: 0,
                                            width: 0
                                        };
                                        var _$elem = $(item);
                                        _size.height = _$elem.height() * _ratio.y;
                                        _size.width = _$elem.width() * _ratio.x;
                                        _$elem.css({
                                            height: _size.height + 'px',
                                            width: _size.width + 'px',
                                        });
                                    });
                                    if (typeof this.defaultConf.onDeleteRect !== 'function') {
                                        this.$tmpRectELem.children(':first').hide();
                                    }
                                    var _rectItemsCnt = this.defaultConf.items.length;
                                    var _tmpRectItem = {
                                        $elem: this.$tmpRectELem,
                                        bHeight: this.$tmpRectELem[0].offsetHeight / _ratio.y,
                                        bWidth: this.$tmpRectELem[0].offsetWidth / _ratio.x,
                                        height: this.$tmpRectELem.height() / _ratio.y,
                                        left: parseFloat(this.$tmpRectELem.css('left')) / _ratio.x,
                                        top: parseFloat(this.$tmpRectELem.css('top')) / _ratio.y,
                                        width: this.$tmpRectELem.width() / _ratio.x
                                    }
                                    _tmpRectItem.bottom = _tmpRectItem.top + _tmpRectItem.height;
                                    _tmpRectItem.right = _tmpRectItem.left + _tmpRectItem.width;
                                    _tmpRectItem.proportion = {
                                        bottom: _tmpRectItem.bottom / this.defaultConf.height,
                                        left: _tmpRectItem.left / this.defaultConf.width,
                                        right: _tmpRectItem.right / this.defaultConf.width,
                                        top: _tmpRectItem.top / this.defaultConf.height
                                    }
                                    this.defaultConf.items.push(_tmpRectItem);
                                    if (!this.defaultConf.onAfterAddRect(_tmpRectItem)) {
                                        this.defaultConf.items.splice(_rectItemsCnt, 1);
                                        throw new Error('区域添加失败，可能是onAfterAddRect的回调函数（方法）中存在异常或与后台数据交换失败。');
                                    }
                                } else {
                                    throw new Error('参数onAfterAddRect必须是一个具有返回值（返回值必须为true|false）的函数（或方法）。');
                                }
                            }
                        }
                    } catch (err) {
                        this.$tmpRectELem.remove();
                        this.$draw.children('div.elastic-band-tmp').remove();
                        console.log(err.name, ':', err.message);
                    } finally {
                        try {
                            if (!this.isDrawRect) {
                                if (typeof this.defaultConf.onAfterChangeRect === 'function') {
                                    if ((this.isZoomRect && (this.tmpRect.new.height !== this.tmpRect.old.height || this.tmpRect.new.width !== this.tmpRect.old.width)) ||
                                        this.tmpRect.new.left !== this.tmpRect.old.left || this.tmpRect.new.top !== this.tmpRect.old.top) {
                                        var _ratio = this.ratio();
                                        var _rectIdx = this.$draw.find('div.elastic-band-selected[name="rectItem"]').index();
                                        if (this.isZoomRect && this.tmpRect.new.height !== this.tmpRect.old.height) {
                                            this.defaultConf.items[_rectIdx].height = this.tmpRect.new.height / _ratio.y;
                                        }
                                        if (this.isZoomRect && this.tmpRect.new.width !== this.tmpRect.old.width) {
                                            this.defaultConf.items[_rectIdx].width = this.tmpRect.new.width / _ratio.x;
                                        }
                                        if (!this.isZoomRect && this.tmpRect.new.left !== this.tmpRect.old.left && this.tmpRect.new.left > 0) {
                                            this.defaultConf.items[_rectIdx].left = this.tmpRect.new.left / _ratio.x;
                                        }
                                        if (!this.isZoomRect && this.tmpRect.new.top !== this.tmpRect.old.top && this.tmpRect.new.top > 0) {
                                            this.defaultConf.items[_rectIdx].top = this.tmpRect.new.top / _ratio.y;
                                        }
                                        this.defaultConf.onAfterChangeRect(this.defaultConf.items[_rectIdx]);
                                    }
                                } else {
                                    throw new Error('参数onAfterChangeRect必须是一个函数（或方法）。');
                                }
                            }
                        } catch (err) {
                            console.log(err.name, ':', err.message);
                        } finally {
                            this.isMouseLeftBtn = false;
                            this.tmpRect.x1 = 0;
                            this.tmpRect.x2 = 0;
                            this.tmpRect.y1 = 0;
                            this.tmpRect.y2 = 0;
                            this.tmpRect.new = {
                                height: 0,
                                left: 0,
                                top: 0,
                                width: 0
                            };
                            this.tmpRect.old = {
                                height: 0,
                                left: 0,
                                top: 0,
                                width: 0
                            };
                            this.isZoomRect = false;
                            this.$tmpRectELem = null;
                            this.stopMonitorMouseMove();
                        }
                    }
                },
                onRectItemClick: function($obj) {
                    if (!this.isDrawRect) {
                        this.restoreRectItemInitStyle($obj.parents('div.elastic-band-draw[name="ElasticBandDraw"]').children());
                        $obj
                            .addClass('elastic-band-selected')
                            .attr({
                                'data-selected': true
                            })
                            .css({
                                'z-index': 2
                            })
                            .children(':last')
                            .css({ display: 'block' });
                        this.isMoveRect = true;
                    }
                },
                onResize: function() {
                    var _scrollLeft = 0;
                    var _scrollTop = 0;
                    if (this.$draw.width() > this.$scroll.width()) {
                        _scrollLeft = (this.$scroll[0].scrollWidth - this.$scroll[0].clientWidth) * this.zoomInterval.scroll.left.ratio;
                    }
                    if (this.$draw.height() > this.$scroll.height()) {
                        _scrollTop = (this.$scroll[0].scrollHeight - this.$scroll[0].clientHeight) * this.zoomInterval.scroll.top.ratio;
                    }
                    this.$draw
                        .css({
                            left: this.$draw.width() > this.$scroll.width() ? 0 : '50%',
                            'margin-left': this.$draw.width() > this.$scroll.width() ? 0 : -1 * this.$draw.width() / 2,
                            'margin-top': this.$draw.height() > this.$scroll.height() ? 0 : -1 * this.$draw.height() / 2,
                            top: this.$draw.height() > this.$scroll.height() ? 0 : '50%'
                        });
                    if (_scrollLeft > 0) {
                        this.$scroll[0].scrollLeft = _scrollLeft;
                    }
                    if (_scrollTop > 0) {
                        this.$scroll[0].scrollTop = _scrollTop;
                    }
                },
                ratio: function() {
                    return {
                        x: this.$draw.width() / this.defaultConf.width,
                        y: this.$draw.height() / this.defaultConf.height
                    };
                },
                restoreRectItemInitStyle: function($obj) {
                    $obj
                        .attr({
                            'data-selected': false
                        })
                        .css({
                            cursor: 'default',
                            'z-index': 1
                        })
                        .each(function(idx, item) {
                            $(item)
                                .children(':last')
                                .css({
                                    display: 'none'
                                });
                        })
                        .removeClass('elastic-band-selected');
                    this.isMoveRect = false;
                },
                reSetItem: function() {
                    var _this = this;
                    var _ratio = this.ratio();
                    this.$draw.children().each(function(idx, item) {
                        var _$item = $(item);
                        _$item.css({
                            height: _this.defaultConf.items[idx].height * _ratio.y,
                            left: _this.defaultConf.items[idx].left * _ratio.x,
                            top: _this.defaultConf.items[idx].top * _ratio.y,
                            width: _this.defaultConf.items[idx].width * _ratio.x
                        }).children().each(function(subIdx, subItem) {
                            var _$subItem = $(subItem);
                            var _size = 14
                            if (subIdx === 1) {
                                _size = 9;
                            }
                            _$subItem.css({
                                height: _size * _ratio.y,
                                width: _size * _ratio.x
                            });
                        });
                    });
                    this.onResize();
                },
                saveAsJPG: function() {
                    if (typeof this.defaultConf.background !== 'undefined' || this.defaultConf.background !== 'undefined' || this.defaultConf.background !== '') {
                        // this.$draw.append();
                    }
                },
                scrollInfo: {
                    xD: 0,
                    xH: 0,
                    xP: function() {
                        if (this.xH > this.xD) {
                            return (this.xH - this.xD) * (this.xD - this.xD / this.xH * this.xD) / (this.xH - this.xD) / 100;
                        }
                        return 0;
                    },
                    yD: 0,
                    yH: 0,
                    yP: function() {
                        if (this.yH > this.yD) {
                            return (this.yH - this.yD) * (this.yD - (this.yD / this.yH * this.yD)) / (this.yH - this.yD) / 100;
                        }
                        return 0;
                    }
                },
                selectLayer: function(layerIndex) {
                    var _$elem = this.$draw.children(':eq(' + layerIndex + ')');
                    this.onRectItemClick(_$elem);
                    _$elem
                        .css({
                            'z-index': 3
                        });
                },
                setBackground: function(url) {
                    try {
                        var _this = this;
                        if (typeof url === 'string') {
                            if (url === 'none') {
                                _this.setItems(_this.defaultConf.items);
                                return;
                            }
                            var _$cacheImage = _this.$scroll.children('img[name="cacheImage"]');
                            if (_$cacheImage.length === 0) {
                                if (typeof _this.defaultConf.onBeforeLoad === 'function') {
                                    _this.defaultConf.onBeforeLoad();
                                    _$cacheImage = $('<img>');
                                    _this.$scroll.append(_$cacheImage
                                        .attr({
                                            name: 'cacheImage',
                                            src: url
                                        })
                                        .css({
                                            display: 'none'
                                        })
                                        .off('load error')
                                        .on('load', function() {
                                            var _$img = $(this);
                                            _this.defaultConf.height = _$img.height();
                                            _this.defaultConf.width = _$img.width();
                                            _this.$draw
                                                .css({
                                                    'background-image': 'url(\'' + _$img.attr('src') + '\')',
                                                    'background-repeat': 'no-repeat'
                                                })
                                                .height(_this.defaultConf.height)
                                                .width(_this.defaultConf.width);
                                            _this.setItems(_this.defaultConf.items);
                                            if (typeof _this.defaultConf.onAfterLoad === 'function') {
                                                _this.defaultConf.onAfterLoad(this);
                                            }
                                        })
                                        .on('error', function() {
                                            if (typeof _this.defaultConf.onLoadError === 'function') {
                                                _this.defaultConf.onLoadError(this);
                                            }
                                        })
                                    );
                                } else {
                                    throw new Error('参数onBeforeLoad必须是一个具有返回值（返回值必须为true|false）的函数（或方法）。');
                                }
                            } else {
                                _$cacheImage.attr('src', url);
                            }
                        } else {
                            throw new Error('在setBackground方法执行过程中出现错误, "url"参数必须是有效字符串类型.');
                        }
                    } catch (err) {
                        console.log(err.name, ':', err.message);
                    } finally {}
                },
                setItems: function(items) {
                    var _itemsCnt = items.length;
                    var _ratio = this.ratio();
                    var _itemPoint = {};
                    var _setitemPoint = function(point) {
                        _itemPoint.height = (point.bottom - point.top) * point.height;
                        _itemPoint.left = point.left * point.width;
                        _itemPoint.top = point.top * point.height;
                        _itemPoint.width = (point.right - point.left) * point.width;
                    };
                    for (var i = 0; i < _itemsCnt; i++) {
                        var _item = items[i];
                        var _$tmpElem = $('<div></div>');
                        _setitemPoint({
                            bottom: _item.proportion.bottom,
                            height: this.defaultConf.height,
                            left: _item.proportion.left,
                            right: _item.proportion.right,
                            top: _item.proportion.top,
                            width: this.defaultConf.width
                        });
                        if (isNaN(_itemPoint.height)) {
                            _item.proportion.bottom = (_item.height + _item.top) / this.defaultConf.height;
                        }
                        if (isNaN(_itemPoint.left)) {
                            _item.proportion.left = _item.left / this.defaultConf.width;
                        }
                        if (isNaN(_itemPoint.top)) {
                            _item.proportion.top = _item.top / this.defaultConf.height;
                        }
                        if (isNaN(_itemPoint.width)) {
                            _item.proportion.right = (_item.left + _item.width) / this.defaultConf.width;
                        }
                        if (isNaN(_itemPoint.height) || isNaN(_itemPoint.left) || isNaN(_itemPoint.top) || isNaN(_itemPoint.width)) {
                            _setitemPoint({
                                bottom: _item.proportion.bottom,
                                height: this.defaultConf.height,
                                left: _item.proportion.left,
                                right: _item.proportion.right,
                                top: _item.proportion.top,
                                width: this.defaultConf.width
                            });
                        }
                        _itemPoint.height *= _ratio.y;
                        _itemPoint.left *= _ratio.x;
                        _itemPoint.top *= _ratio.y;
                        _itemPoint.width *= _ratio.x;
                        _$tmpElem
                            .attr({
                                'data-selected': false,
                                name: 'rectItem'
                            })
                            .css({
                                cursor: 'default',
                                height: _itemPoint.height + 'px',
                                left: _itemPoint.left + 'px',
                                top: _itemPoint.top + 'px',
                                width: _itemPoint.width + 'px',
                                'z-index': 1
                            })
                            .toggleClass('elastic-band')
                            .append(this.divStr);
                        _$tmpElem.children().each(function(subIdx, subItem) {
                            var _$subItem = $(subItem);
                            var _size = 14
                            if (subIdx === 1) {
                                _size = 9;
                            }
                            if (subIdx === 0 && typeof this.defaultConf.onDeleteRect !== 'function') {
                                _$subItem.hide();
                            } else {
                                _$subItem.show();
                            }
                            _$subItem.css({
                                height: _size * _ratio.y,
                                width: _size * _ratio.x
                            });
                        });
                        this.$draw.append(_$tmpElem);
                        _item.$elem = _$tmpElem;
                        _item.bHeight = _$tmpElem[0].offsetHeight;
                        _item.bWidth = _$tmpElem[0].offsetWidth;
                    }
                    this.onResize();
                },
                showTmpRectElem: function() {
                    try {
                        var _position = this.getPosition();
                        this.tmpRect.x2 = _position.x;
                        this.tmpRect.y2 = _position.y;
                        if (this.isDrawRect) {
                            if (this.$tmpRectELem === null) {
                                this.stopMonitorMouseMove();
                                return;
                            }
                            this.$tmpRectELem
                                .css({
                                    left: this.tmpRect.left() + 'px',
                                    top: this.tmpRect.top() + 'px'
                                })
                                .height(this.tmpRect.height())
                                .width(this.tmpRect.width());
                        } else {
                            this.$tmpRectELem = this.$draw.find('div.elastic-band[name="rectItem"][data-selected="true"]');
                            if (typeof this.$tmpRectELem[0] !== 'undefined' && this.$tmpRectELem[0] !== 'undefined') {
                                var _borderHeight = this.$tmpRectELem[0].offsetHeight - this.$tmpRectELem.height();
                                var _borderWidth = this.$tmpRectELem[0].offsetWidth - this.$tmpRectELem.width();
                                if (this.isZoomRect) {
                                    var _height = this.tmpRect.y2 - this.tmpRect.y1 + this.tmpRect.old.height;
                                    var _width = this.tmpRect.x2 - this.tmpRect.x1 + this.tmpRect.old.width;
                                    this.tmpRect.new.height = (_height < this.defaultConf.minSize.height ?
                                        this.defaultConf.minSize.height : _height + this.tmpRect.old.top > this.$draw.height() ?
                                        this.$draw.height() - this.tmpRect.old.top - 1 : _height) - _borderHeight;
                                    this.tmpRect.new.width = (_width < this.defaultConf.minSize.width ?
                                        this.defaultConf.minSize.width : _width + this.tmpRect.old.left > this.$draw.width() ?
                                        this.$draw.width() - this.tmpRect.old.left - 1 : _width) - _borderWidth;
                                    this.$tmpRectELem
                                        .height(this.tmpRect.new.height)
                                        .width(this.tmpRect.new.width);
                                } else {
                                    var _left = this.tmpRect.x2 - this.tmpRect.x1 + this.tmpRect.old.left;
                                    var _top = this.tmpRect.y2 - this.tmpRect.y1 + this.tmpRect.old.top;
                                    this.tmpRect.new.left = _left < 1 ? 1 : _left + this.tmpRect.old.width > this.$draw.width() ?
                                        this.$draw.width() - this.tmpRect.old.width - 1 : _left;
                                    this.tmpRect.new.top = _top < 1 ? 1 : _top + this.tmpRect.old.height > this.$draw.height() ?
                                        this.$draw.height() - this.tmpRect.old.height - 1 : _top;
                                    this.$tmpRectELem.css({
                                        left: this.tmpRect.new.left + 'px',
                                        top: this.tmpRect.new.top + 'px'
                                    })
                                }
                            }
                            this.$tmpRectELem = null;
                        }
                    } catch (err) {
                        console.log(err.name, ':', err.message);
                    }
                },
                startMonitorMouseMove: function() {
                    var _this = this;
                    var _Interval = function() {
                        _this.calculateScroll();
                        _this.showTmpRectElem();
                    };
                    this.mouseMoveMonitor = [];
                    this.mouseMoveMonitor.push(setInterval(_Interval, 1));
                },
                stopMonitorMouseMove: function() {
                    while (this.mouseMoveMonitor.length > 0) {
                        clearInterval(this.mouseMoveMonitor[0]);
                        this.mouseMoveMonitor.splice(0, 1);
                    }
                    this.mouseMoveMonitor = [];
                },
                tmpRect: {
                    height: function() {
                        if (this.y2 > 0) {
                            return Math.abs(this.y2 - this.y1);
                        } else {
                            return this.y2;
                        }
                    },
                    left: function() {
                        return Math.min(this.x1, this.x2);
                    },
                    new: {
                        height: 0,
                        left: 0,
                        top: 0,
                        width: 0
                    },
                    offset: {
                        left: function() {
                            return _ElasticBandComponent.$draw.offset().left;
                        },
                        scrollLeft: function() {
                            return _ElasticBandComponent.$scroll[0].scrollLeft;
                        },
                        scrollTop: function() {
                            return _ElasticBandComponent.$scroll[0].scrollTop;
                        },
                        top: function() {
                            return _ElasticBandComponent.$draw.offset().top;
                        }
                    },
                    old: {
                        height: 0,
                        left: 0,
                        top: 0,
                        width: 0
                    },
                    top: function() {
                        return Math.min(this.y1, this.y2);
                    },
                    width: function() {
                        if (this.x2 > 0) {
                            return Math.abs(this.x2 - this.x1);
                        } else {
                            return this.x2;
                        }
                    },
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 0
                },
                zoomHeight: function() {
                    var _height = this.$scroll[0].clientHeight;
                    this.zoomInterval.ratio = _height / this.defaultConf.height;
                    var _width = this.defaultConf.width * this.zoomInterval.ratio;
                    this.getScrollRatio();
                    this.$draw.height(_height).width(_width);
                    this.reSetItem();
                },
                zoomIn: function(val) { this.zoomInterval.value(1, val); },
                zoomInterval: {
                    max: 2.0,
                    min: 0.05,
                    ratio: 1,
                    scroll: {
                        left: {
                            val: 0,
                            ratio: 0
                        },
                        top: {
                            val: 0,
                            ratio: 0
                        }
                    },
                    step: 0.05,
                    value: function(operationID, val) {
                        var _this = _ElasticBandComponent;
                        _this.getScrollRatio();
                        if (typeof val === 'undefined') {
                            switch (operationID) {
                                case 1:
                                    this.ratio += this.step;
                                    if (this.ratio > this.max) {
                                        this.ratio = this.max;
                                    }
                                    break;
                                case 0:
                                    this.ratio = this.max / 2;
                                    break;
                                case -1:
                                    this.ratio -= this.step;
                                    if (this.ratio < this.min) {
                                        this.ratio = this.min;
                                    }
                                    break;
                            }
                        } else {
                            this.ratio = val;
                        }
                        _this.$draw.height(_this.defaultConf.height * this.ratio).width(_this.defaultConf.width * this.ratio);
                        _this.reSetItem();
                    }
                },
                zoomOut: function() { this.zoomInterval.value(-1); },
                zoomWidth: function() {
                    var _width = this.$scroll[0].clientWidth;
                    this.zoomInterval.ratio = _width / this.defaultConf.width;
                    var _height = this.defaultConf.height * this.zoomInterval.ratio;
                    this.getScrollRatio();
                    this.$draw.height(_height).width(_width);
                    this.reSetItem();
                }
            };
            return _ElasticBandComponent;
        }());
        ElasticBand.defaultConf = $.extend(ElasticBand.defaultConf, ElasticBandConf);
        ElasticBand.createWrap($(this));
        // this.data('ElasticBand', $.extend({
        return $.extend(this, {
            deleteItem: function(index) {
                ElasticBand.deleteItem(index);
            },
            drawRect: function() {
                ElasticBand.drawRect();
            },
            fullSize: function() {
                ElasticBand.fullSize();
            },
            items: function() {
                return ElasticBand.items();
            },
            moveRect: function() {
                ElasticBand.moveRect();
            },
            ratio: function() {
                return ElasticBand.ratio();
            },
            saveAsJPG: function() {
                ElasticBand.saveAsJPG();
            },
            selectLayer: function(layerIndex) {
                ElasticBand.selectLayer(layerIndex);
            },
            setBackground: function(url) {
                ElasticBand.setBackground(url);
            },
            setItems: function(items) {
                ElasticBand.setItems(items);
            },
            zoomHeight: function() {
                return ElasticBand.zoomHeight();
            },
            zoomIn: function(val) {
                return ElasticBand.zoomIn(val);
            },
            zoomOut: function(val) {
                return ElasticBand.zoomOut(val);
            },
            zoomWidth: function() {
                return ElasticBand.zoomWidth();
            }
        }, null);
    };
})(jQuery);
