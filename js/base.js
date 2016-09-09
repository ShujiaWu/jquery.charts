/**
 * 图形测试
 * Created by Yun on 2016/9/7.
 * E-mail：wushujia@vip.qq.com
 */
console.log(devicePixelRatio);

//画圆
var canvas_0 = $('#canvas_0')[0];
var context_0 = canvas_0.getContext('2d');
window.ChartUtils.drawCircle(context_0, 50, 50, 30, 0, 2, 'red', true, 1);

var canvas_1 = $('#canvas_1')[0];
var context_1 = canvas_1.getContext('2d');
window.ChartUtils.drawCircle(context_1, 50, 50, 30, 0, 2, 'red', false, 1);

var canvas_2 = $('#canvas_2')[0];
var context_2 = canvas_2.getContext('2d');
window.ChartUtils.drawCircle(context_2, 50, 50, 30, 0, 0.8, 'red', true, 1);

var canvas_3 = $('#canvas_3')[0];
var context_3 = canvas_3.getContext('2d');
window.ChartUtils.drawCircle(context_3, 50, 50, 30, 0, 0.8, 'red', false, 1);

//画扇形
var canvas_10 = $('#canvas_10')[0];
var context_10 = canvas_10.getContext('2d');
window.ChartUtils.drawSector(context_10, 50, 50, 30, 0, 2, 'red', true, 1);

var canvas_11 = $('#canvas_11')[0];
var context_11 = canvas_11.getContext('2d');
window.ChartUtils.drawSector(context_11, 50, 50, 30, 0, 2, 'red', false, 1);

var canvas_12 = $('#canvas_12')[0];
var context_12 = canvas_12.getContext('2d');
window.ChartUtils.drawSector(context_12, 50, 50, 30, 0, 0.8, 'red', true, 1);

var canvas_13 = $('#canvas_13')[0];
var context_13 = canvas_13.getContext('2d');
window.ChartUtils.drawSector(context_13, 50, 50, 30, 0, 0.8, 'red', false, 1);

//画弧
var canvas_20 = $('#canvas_20')[0];
var context_20 = canvas_20.getContext('2d');
window.ChartUtils.drawArc(context_20, 50, 50, 30, 0, 2, 'red', 1);

var canvas_21 = $('#canvas_21')[0];
var context_21 = canvas_21.getContext('2d');
window.ChartUtils.drawArc(context_21, 50, 50, 30, 0, 0.8, 'red', 1);

//画线
var canvas_30 = $('#canvas_30')[0];
var context_30 = canvas_30.getContext('2d');
window.ChartUtils.drawLine(context_30, [{x: 10, y: 10}, {x: 90, y: 90}], 'red', 1);

var canvas_31 = $('#canvas_31')[0];
var context_31 = canvas_31.getContext('2d');
window.ChartUtils.drawLine(context_31, [{x: 10, y: 10}, {x: 90, y: 10}, {x: 90, y: 90}], 'red', 1);

//画多边形
var canvas_40 = $('#canvas_40')[0];
var context_40 = canvas_40.getContext('2d');
window.ChartUtils.drawPolygon(context_40, [{x: 10, y: 10}, {x: 90, y: 10}, {x: 90, y: 90}], 'red', true, 1);

var canvas_41 = $('#canvas_41')[0];
var context_41 = canvas_41.getContext('2d');
window.ChartUtils.drawPolygon(context_41, [{x: 10, y: 10}, {x: 90, y: 10}, {x: 90, y: 90}], 'red', false, 1);

//画文字
var canvas_50 = $('#canvas_50')[0];
var context_50 = canvas_50.getContext('2d');
window.ChartUtils.drawText(context_50, '测试文本', 10, 10, 'red', 18, 'Microsoft YaHei', 'left', 'top');

var canvas_51 = $('#canvas_51')[0];
var context_51 = canvas_51.getContext('2d');
window.ChartUtils.drawText(context_51, '测试文本', 100, 100, 'red', 18, 'Microsoft YaHei', 'right', 'bottom');

//画圆角矩形
var canvas_60 = $('#canvas_60')[0];
var context_60 = canvas_60.getContext('2d');
window.ChartUtils.drawRoundRect(context_60, 10, 10, 70, 50, 25, 'red', true);

var canvas_61 = $('#canvas_61')[0];
var context_61 = canvas_61.getContext('2d');
window.ChartUtils.drawRoundRect(context_61, 10, 10, 70, 50, 10, 'red', false, 1);