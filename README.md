# elastic-band
WEB 在线区域绘画 支持放大缩小等较为简单功能
<div id="#demo"></div>
$('#demo').ElasticBand({
    // 指定背景图，默认为none
    background: 'none',
    height: 0,
    // 各区域块右上角是否显示删除区域图标
    isShowDelete: true,
    items: [],
    // 绘画最小区域
    minSize: {
        height: 0,
        width: 0
    },
    onAfterAddRect: function($rectItem) {},
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
    onLoadError: function() {
        try {
            throw new Error('ElasticBand.onLoadError is undefined.');
        } catch (err) {
            console.log(err.name, ':', err.message);
            return false;
        }
    },
    reSetItem: function() {
        try {
            throw new Error('ElasticBand.reSetItem is undefined.');
        } catch (err) {
            console.log(err.name, ':', err.message);
            return false;
        }
    },
    width: 0
});
