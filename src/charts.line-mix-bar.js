/**
 * 折线图 柱状图混合
 * Created by Yun on 2016/11/18.
 * E-mail：wushujia@vip.qq.com
 */
(function ($) {
    $.fn.LineMixBar = function (params) {
        var exports = {};       //函数返回对象
        var element = $(this);  //绘图元素
        var context = null;     //绘图上下文
        var eHeight = 0;        //画布高度
        var eWidth = 0;         //画布宽度
        var deviceRatio = 1;    //设备像素比例

        var $parent = null;     //最外层元素

        var barWidth = 0;       //柱状图的宽度
        var bars = [];          //柱状图数据（坐标）
        var lines = [];         //折线数据（坐标）
        var lineAreas = [];     //折线区域数据（坐标）
        var $floatMsg;
        var floatMsgMargin = 3;

        var perAreaWidth = 0;   //每个区间的宽度


        var top_left = {
                x: 0,
                y: 0
            },
            top_right = {
                x: 0,
                y: 0
            },
            bottom_left = {
                x: 0,
                y: 0
            },
            bottom_right = {
                x: 0,
                y: 0
            };

        var vLine = []; //垂直方向上的线


        var options = {
            data: {
                line: [],
                bar: [],
                floatTitle: [],
                top: []
            },
            legends: {
                bar: [],
                line: [],
                top: []
            },
            units: {
                bar: [],
                line: [],
                top: []
            },
            colors: {
                line: [],
                bar: [],
                top: []
            },                 //线条颜色颜色
            background: 'transparent',  //背景颜色
            isDebug: false,     //是否调试模式
            axis: {                                             //坐标轴
                x: [],                                          //X轴显示的数据
                fontSize: 12,                                   //坐标轴文字大小
                fontFamily: 'Microsoft YaHei',                  //坐标轴字体
                color: '#666666',                               //坐标轴文字颜色
                lineColor: '#EEEEEE',                           //坐标轴线条颜色
                lineWidth: 1,                                   //坐标轴线条宽度
                textMarginTopX: 5,                              //文字距离顶部的高度
                activeLine: {
                    width: 1,
                    color: '#999999'
                }
            },
            bar: {
                gap: 2,
                max: 1,
                min: 0,
                defaultValue: '',
                width: undefined,
                type: 0,               //【0】分开展示 【1】合并展示
                defaultColor:'#CCCCCC'
            },
            line: {
                width: 2,
                dashedLength: 5,
                areaType: 1,          //【0】不显示【1】虚线不覆盖【2】虚线覆盖
                max: 100,
                min: 0,
                defaultValue: '',
                point: {
                    radius: 3,
                    width: 1,
                    fill: 'white'
                }
            },
            top: {
                fontSize: 12,                                   //坐标轴文字大小
                fontFamily: 'Microsoft YaHei',                  //坐标轴字体
                color: '#666666',                               //坐标轴文字颜色
                textMarginBottom: 5
            }
        };

        options = $.extend(true, options, params);


        function calculate() {
            var i;
            var j;
            if (!options.axis.x.length) {
                console.error('坐标轴数据不能为空！');
                return false;
            }
            var topHeight = options.top.fontSize * options.data.top.length * deviceRatio * 1.2 + options.top.textMarginBottom * options.data.top.length * deviceRatio;
            var chartHeight = eHeight - (options.axis.fontSize + options.axis.textMarginTopX) * deviceRatio * options.axis.x[0].length * 1.2;
            top_left = {
                x: 0,
                y: topHeight
            };
            top_right = {
                x: eWidth,
                y: topHeight
            };
            bottom_left = {
                x: 0,
                y: chartHeight
            };
            bottom_right = {
                x: eWidth,
                y: chartHeight
            };

            var offsetWidth = eWidth / options.axis.x.length;
            if (options.isDebug) {
                console.log('区间宽度：' + offsetWidth);
            }
            //计算垂直方向上的直线坐标
            for (i = 0; i < options.axis.x.length; i++) {
                vLine.push(
                    [{
                        x: offsetWidth / 2 + (offsetWidth * i),
                        y: topHeight
                    }, {
                        x: offsetWidth / 2 + (offsetWidth * i),
                        y: bottom_right.y
                    }]);
            }

            if (options.data.bar.length) {
                //计算柱状图的宽度
                barWidth = options.bar.width ? (options.bar.width * deviceRatio) : ((offsetWidth - (barWidth * options.axis.x.length - 1) ) / (options.bar.type == 1 ? 3 : (options.data.bar[0].length + 1)));
                if (options.isDebug) {
                    console.log('柱状图宽度：' + barWidth);
                }
                //计算每个柱状图的坐标位置
                var tmp;
                var diff = options.bar.max - options.bar.min;
                //计算开始绘制柱状图的x坐标
                var barStartX;
                switch (options.bar.type) {
                    case 0:
                        barStartX = (offsetWidth - (barWidth * options.data.bar[0].length + options.bar.gap * deviceRatio * (options.data.bar[0].length - 1))) / 2;
                        if (options.isDebug) {
                            console.log('柱状图偏移：' + barStartX);
                        }
                        for (i = 0; i < options.data.bar.length; i++) {
                            //柱状图数据
                            tmp = [];
                            for (j = 0; j < options.data.bar[i].length; j++) {
                                if (!options.data.bar[i][j]) {
                                    continue;
                                }
                                if (options.data.bar[i][j] > options.bar.max || options.data.bar[i][j] < options.bar.min) {
                                    console.warn('柱状图数值超出范围！[' + i + '][' + j + ']');
                                }
                                tmp.push([[{
                                    x: barStartX + offsetWidth * i + (options.bar.gap * deviceRatio + barWidth) * j,
                                    y: bottom_left.y
                                }, {
                                    x: barStartX + offsetWidth * i + (options.bar.gap * deviceRatio + barWidth) * j,
                                    y: (options.data.bar[i][j] > options.bar.max || options.data.bar[i][j] < options.bar.min) ? bottom_left.y : bottom_left.y - (bottom_left.y - top_left.y) * options.data.bar[i][j] / diff
                                }, {
                                    x: barStartX + offsetWidth * i + (options.bar.gap * deviceRatio + barWidth) * j + barWidth,
                                    y: (options.data.bar[i][j] > options.bar.max || options.data.bar[i][j] < options.bar.min) ? bottom_left.y : bottom_left.y - (bottom_left.y - top_left.y) * options.data.bar[i][j] / diff
                                }, {
                                    x: barStartX + offsetWidth * i + (options.bar.gap * deviceRatio + barWidth) * j + barWidth,
                                    y: bottom_left.y
                                }]])
                            }
                            bars.push(tmp);
                        }
                        break;
                    case 1:
                        var barStartY;
                        barStartX = (offsetWidth - barWidth) / 2;
                        if (options.isDebug) {
                            console.log('柱状图偏移：' + barStartX);
                        }
                        for (i = 0; i < options.data.bar.length; i++) {
                            //柱状图数据
                            tmp = [];
                            var sum = 0;
                            for (j = 0; j < options.data.bar[i].length; j++) {
                                if (options.data.bar[i][j] > options.bar.max || options.data.bar[i][j] < options.bar.min) {
                                    console.warn('柱状图数值超出范围！[' + i + '][' + j + ']');
                                }
                                sum += parseFloat(options.data.bar[i][j]);
                            }
                            if (sum == 0) {
                                options.data.bar[i].push(options.bar.max);
                                sum = options.bar.max;
                                if (options.data.bar[i].length > options.colors.bar.length) {
                                    //补充默认颜色
                                    options.colors.bar.push(options.bar.defaultColor);
                                }
                            }
                            for (j = 0; j < options.data.bar[i].length; j++) {
                                barStartY = bottom_left.y;
                                if (j > 0) {
                                    barStartY = tmp[0][j - 1][1].y;
                                }

                                (tmp[0] = tmp[0] || []).push([{
                                    x: barStartX + offsetWidth * i,
                                    y: barStartY
                                }, {
                                    x: barStartX + offsetWidth * i,
                                    y: barStartY - (bottom_left.y - top_left.y) *
                                    ((options.data.bar[i][j] > options.bar.max || options.data.bar[i][j] < options.bar.min) ?
                                        options.bar.min : options.data.bar[i][j]) / sum
                                }, {
                                    x: barStartX + offsetWidth * i + barWidth,
                                    y: barStartY - (bottom_left.y - top_left.y) *
                                    ((options.data.bar[i][j] > options.bar.max || options.data.bar[i][j] < options.bar.min) ?
                                        options.bar.min : options.data.bar[i][j]) / sum
                                }, {
                                    x: barStartX + offsetWidth * i + barWidth,
                                    y: barStartY
                                }])
                            }
                            bars.push(tmp);
                        }
                        console.log(bars);
                        break;
                }
            }

            //折线数据
            diff = options.line.max - options.line.min;
            for (i = 0; i < options.data.line.length; i++) {
                //柱状图数据
                tmp = [];
                for (j = 0; j < options.data.line[i].length; j++) {
                    tmp.push({
                        x: vLine[j][0].x,
                        y: (options.data.line[i][j] < options.line.min || options.data.line[i][j] > options.line.max) ? bottom_left.y : bottom_left.y - (bottom_left.y - top_left.y) * options.data.line[i][j] / diff
                    })
                }
                lines.push(tmp);
            }

            //计算每一个区间的宽度
            perAreaWidth = eWidth / options.axis.x.length;
            return true;
        }

        /**
         * 绘制基础区域
         */
        function drawBaseArea() {
            var i;
            //辅助绘图的 辅助线
            if (options.isDebug) {
                window.ChartUtils.drawPolygon(context, [
                    top_left, top_right, bottom_right, bottom_left, top_left
                ], 'green', false, deviceRatio);

                for (i = 0; i < vLine.length; i++) {
                    window.ChartUtils.drawLine(context, vLine[i], 'gray', deviceRatio);
                }

            }
            //绘制坐标轴
            window.ChartUtils.drawLine(context, [{
                x: bottom_left.x,
                y: bottom_left.y
            }, {
                x: bottom_right.x,
                y: bottom_right.y
            }], options.axis.lineColor, options.axis.lineWidth * deviceRatio);

            return true;
        }

        /**
         * 绘制数据区域
         */
        function drawDataArea() {
            var i;
            var j;
            var k;
            //画柱状图
            for (i = 0; i < bars.length; i++) {
                for (j = 0; j < bars[i].length; j++) {
                    for (k = 0; k < bars[i][j].length; k++) {
                        window.ChartUtils.drawPolygon(context, bars[i][j][k], options.bar.type == 0 ? options.colors.bar[j] : options.colors.bar[k], true, deviceRatio);
                    }
                }
            }

            //绘制折线
            for (i = 0; i < lines.length; i++) {
                var line = lines[i];
                var linePointCount = line.length;
                //绘制实线部分
                window.ChartUtils.drawLine(context, line, options.colors.line[i], options.line.width * deviceRatio);
                //绘制虚线部分
                window.ChartUtils.drawDashedLine(context,
                    [{
                        x: 0,
                        y: line[0].y
                    }, {
                        x: line[0].x,
                        y: line[0].y
                    }],
                    options.colors.line[i], options.line.dashedLength * deviceRatio, options.line.width * deviceRatio);
                window.ChartUtils.drawDashedLine(context,
                    [{
                        x: line[linePointCount - 1].x,
                        y: line[linePointCount - 1].y
                    }, {
                        x: eWidth,
                        y: line[linePointCount - 1].y
                    }],
                    options.colors.line[i], options.line.dashedLength * deviceRatio, options.line.width * deviceRatio);
                //绘制折线上的点
                for (j = 0; j < lines[i].length; j++) {
                    window.ChartUtils.drawCircle(context, lines[i][j].x, lines[i][j].y, options.line.point.radius * deviceRatio, 0, 2, options.line.point.fill, true);
                    window.ChartUtils.drawCircle(context, lines[i][j].x, lines[i][j].y, options.line.point.radius * deviceRatio, 0, 2, options.colors.line[i], false, options.line.point.width * deviceRatio);
                }

                switch (options.line.areaType) {
                    case 0:
                        break;
                    case 1:
                        (lineAreas = []).push(line.concat());
                        lineAreas[i].unshift({
                            x: line[0].x,
                            y: bottom_left.y
                        });
                        lineAreas[i].push({
                            x: line[linePointCount - 1].x,
                            y: bottom_left.y
                        });
                        break;
                    case 2:
                        //形成需要绘制区域的点坐标
                        (lineAreas = []).push(line.concat());
                        lineAreas[i].unshift({
                            x: 0,
                            y: line[0].y
                        });
                        lineAreas[i].unshift({
                            x: 0,
                            y: bottom_left.y
                        });
                        lineAreas[i].push({
                            x: eWidth,
                            y: line[linePointCount - 1].y
                        });
                        lineAreas[i].push({
                            x: eWidth,
                            y: bottom_left.y
                        });
                        break;
                }
            }

            if (options.line.areaType > 0) {
                //绘制折线的区域
                for (i = 0; i < lineAreas.length; i++) {
                    var colorStyle = context.createLinearGradient(top_left.x, top_left.y, bottom_left.x, bottom_left.y);
                    colorStyle.addColorStop(0, window.ColorUtils.opacityColor(options.colors.line[i], 0.5));
                    colorStyle.addColorStop(1, window.ColorUtils.opacityColor(options.colors.line[i], 0));
                    window.ChartUtils.drawPolygon(context, lineAreas[i], colorStyle, true, deviceRatio);
                }
            }

            //绘制坐标轴文字
            for (i = 0; i < options.axis.x.length; i++) {
                for (j = 0; j < options.axis.x[i].length; j++) {
                    window.ChartUtils.drawText(context, options.axis.x[i][j],
                        vLine[i][1].x,
                        vLine[i][1].y + (options.axis.fontSize * j + options.axis.textMarginTopX * (j + 1)) * deviceRatio,
                        options.axis.color,
                        options.axis.fontSize * deviceRatio,
                        options.axis.fontFamily, 'center', 'top');
                }

            }

            //绘制顶部数据
            for (i = 0; i < options.data.top.length; i++) {
                for (j = 0; j < options.data.top[i].length; j++) {
                    window.ChartUtils.drawText(context, options.data.top[i][j],
                        vLine[j][0].x,
                        (options.top.fontSize + options.top.textMarginBottom) * i * deviceRatio,
                        options.colors.top[i],
                        options.top.fontSize * deviceRatio,
                        options.top.fontFamily, 'center', 'top');
                }
            }
            return true;
        }


        function canvasClick(pos) {
            var i;
            var j;
            clearCanvas();
            drawBaseArea();
            drawDataArea();

            //绘制中心线
            window.ChartUtils.drawLine(context, vLine[pos], options.axis.activeLine.color, options.axis.activeLine.width * deviceRatio);

            //生成子元素
            var child = '';
            for (i = 0; i < options.legends.top.length; i++) {
                if (options.data.top[i]) {
                    child += '<li><span class="icon" style="background:' + options.colors.top[i] + '"></span><span>'
                        + options.legends.top[i] + '：'
                        + options.data.top[i][pos]
                        + (options.units.top[i] || '') + '</span></li>';
                }
            }
            for (i = 0; i < options.legends.line.length; i++) {
                if (options.data.line[i]) {
                    child += '<li><span class="icon" style="background:' + options.colors.line[i] + '"></span><span>'
                        + options.legends.line[i] + '：'
                        + ((options.data.line[i][pos] < options.line.min || options.data.line[i][pos] > options.line.max) ? options.line.defaultValue : options.data.line[i][pos] + (options.units.line[i] || ''))
                        + '</span></li>';
                }
            }

            for (i = 0; i < options.legends.bar.length; i++) {
                j = options.bar.type == 1 ? options.legends.bar.length-1 - i : i;
                if (options.data.bar[pos]) {
                    child += '<li><span class="icon" style="background:' + options.colors.bar[j] + '"></span><span>'
                        + options.legends.bar[j] + '：'
                        + ((options.data.bar[pos][j] < options.bar.min || options.data.bar[pos][j] > options.bar.max) ? options.bar.defaultValue : options.data.bar[pos][j] + (options.units.bar[j] || ''))
                        + '</span></li>';
                }
            }
            //添加
            $floatMsg.find('.title').text(options.data.floatTitle[pos]);
            $floatMsg.find('ul').empty().append(child);
            //计算浮动信息的出现的位置
            var top;
            if (!lines[0]) {
                top = eHeight / 2 / deviceRatio;
            } else {
                top = lines[0][pos].y / deviceRatio - floatMsgMargin;
            }
            var left = vLine[pos][0].x / deviceRatio + floatMsgMargin;
            if (top + $floatMsg.outerHeight() > bottom_left.y / deviceRatio) {
                //修正低于x轴的情况
                top = bottom_right.y / deviceRatio - $floatMsg.outerHeight() - floatMsgMargin;
            }
            if (left + $floatMsg.outerWidth() > bottom_right.x / deviceRatio) {
                left = bottom_right.x / deviceRatio - $floatMsg.outerWidth() - floatMsgMargin;
            }
            //设置位置并显示
            $floatMsg.css({
                opacity: 1,
                top: top,
                left: left
            });

        }

        function clearCanvas() {
            //清空画布
            context.clearRect(0, 0, eWidth, eHeight);
            context.fillStyle = options.background;
            context.fillRect(0, 0, eWidth, eHeight);
        }


        /**
         * 绘制图形
         */
        function drawing() {
            //计算数值
            if (calculate() && drawBaseArea() && drawDataArea()) {
                element.on('click', function (event) {
                    //计算当前点击所在的区间
                    var pos = parseInt(event.offsetX * deviceRatio / perAreaWidth);
                    //显示浮动信息
                    canvasClick(pos);
                });
            }
        }

        /**
         * 绘制图形
         */
        exports.draw = function () {
            if (options.isDebug) {
                console.log(options);
            }
            deviceRatio = window.devicePixelRatio;  //获取屏幕像素比
            context = element[0].getContext('2d');

            if (options.bar.width) {
                var o_width = element.width();
                var width = (options.bar.width * ( options.bar.type == 1 ? 3 : (options.data.bar[0].length + 1)) +
                    options.bar.gap * (options.bar.type == 1 ? 0 : (options.data.bar[0].length - 1))) * options.data.bar.length;
                element.css({
                    width: width > o_width ? width : o_width
                })
            }

            //获取画布高度，设置画布的实际显示大小
            eHeight = element.height() * deviceRatio;   //画布的高度
            eWidth = element.width() * deviceRatio;     //画布的宽度

            eWidth = eWidth == 0 ? eHeight : eWidth;
            eHeight = eHeight == 0 ? eWidth : eHeight;

            element.attr('height', eHeight);
            element.attr('width', eWidth);

            //给canvas添加符元素
            $parent = element.wrap('<div class="line-mix-bar"><div style="overflow: auto;text-align: center;"><div class="line-mix-bar-canvas"></div></div></div>').parents('.line-mix-bar');
            //添加图例
            var $legends = $(
                '<div><ul  class="line-mix-bar-legends"></ul></div>'
            );

            var $legendsItems = $legends.find('.line-mix-bar-legends');
            var $canvasParent = $parent.find('.line-mix-bar-canvas');

            var i;
            //柱状图图例
            //顶部
            for (i = 0; i < options.legends.top.length; i++) {
                $legendsItems.append(
                    '<li><span class="icon bar" style="background: ' + options.colors.top[i] + '"></span><span>' + options.legends.top[i] + '</span></li>'
                );
            }
            for (i = 0; i < options.legends.bar.length; i++) {
                $legendsItems.append(
                    '<li><span class="icon bar" style="background: ' + options.colors.bar[i] + '"></span><span>' + options.legends.bar[i] + '</span></li>'
                );
            }
            //折线图例
            for (i = 0; i < options.legends.line.length; i++) {
                $legendsItems.append(
                    '<li><span class="icon line" style="background: ' + options.colors.line[i] + '"></span><span>' + options.legends.line[i] + '</span></li>'
                );
            }
            $floatMsg = $(
                '<div class="line-mix-bar-float-msg"><div class="title"></div><ul></ul></div>'
            ).css({
                top: 0,
                left: 0
            });
            //添加浮动信息
            $canvasParent.append($floatMsg);
            //添加图例
            $parent.append($legends);

            //绘图
            drawing();
        };

        exports.redraw = function () {
            clearCanvas();
            drawBaseArea();
            drawDataArea();
            $floatMsg.find('ul').empty();
            $floatMsg.css({
                opacity: 0,
                top: 0,
                left: 0
            });
        };
        return exports;
    }

})(jQuery);