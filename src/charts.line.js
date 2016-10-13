/**
 * 折线图
 * Created by Yun on 2016/9/8.
 * E-mail：wushujia@vip.qq.com
 */
(function ($) {
    $.fn.Line = function (params) {
        var exports = {};       //函数返回对象
        var element = $(this);  //绘图元素
        var context = null;     //绘图上下文
        var eHeight = 0;        //画布高度
        var eWidth = 0;         //画布宽度
        var deviceRatio = 1;    //设备像素比例
        var lineData = [];      //折线的数据
        var axisOffsetX = 0;    //X轴点的坐标偏移量
        var axisOffsetY = 0;    //X轴点的坐标偏移量
        var valueY = [];        //Y轴上点的值
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
            },
            maxValue = 0,               //数据最大值
            minValue = 0;               //数据最小值


        var options = {
            data: [],
            colors: ["#99d1fd", "#fed27c"],                 //线条颜色颜色
            isArea: [true, false],                           //是否区域显示
            background: 'transparent',  //背景颜色
            frames: 60,        //帧数
            isAnimation: true,  //是否启用动画
            animationTime: 5,   //动画时间
            lineWidth: 1,       //折线宽度
            isDebug: false,     //是否调试模式
            events: {                                           //绘图事件
                start: function (options) {                     //开始绘图
                },
                drawing: function (cValue, tValue, options) {   //没帧开始
                },
                end: function (options) {                       //绘图结束
                }
            },
            axis: {                                             //坐标轴
                x: [],                                          //X轴显示的数据
                y: 4,                                           //Y轴显示的数据
                fontSize: 10,                                   //坐标轴文字大小
                fontFamily: 'Microsoft YaHei',                  //坐标轴字体
                color: '#666666',                               //坐标轴文字颜色
                lineColor: '#EEEEEE',                           //坐标轴线条颜色
                lineWidth: 1,                                   //坐标轴线条宽度
                isPercent: false,                                //是否是百分比模式
                precision: 2,                                   //精度
                manualY: true,                                  //是否手动控制Y轴的文字
                minY: 0,                                        //Y轴最小值
                maxY: 100                                      //Y轴最大值
            }
        };

        options = $.extend(true, options, params);


        function calculate() {
            var i;
            //折线数据兼容性处理
            if (options.data.length > 0) {
                //有数据情况
                if (typeof options.data[0] == 'number') {
                    lineData[0] = options.data;
                } else {
                    lineData = options.data;
                }
            }

            //线条颜色值检测
            var needPushColorCount = lineData.length - options.colors.length;
            if (needPushColorCount > 0) {
                for (i = 0; i < needPushColorCount; i++) {
                    options.colors.push(window.ColorUtils.randomColor());
                    console.log(options.colors);
                }
            }


            //计算最大值与最小值
            var dataArr = options.data.join(',').split(',');
            if (options.axis.manualY) {
                maxValue = Math.max(options.axis.minY, options.axis.maxY);
                minValue = Math.min(options.axis.minY, options.axis.maxY);
            } else {
                maxValue = Math.max.apply(null, dataArr);
                minValue = Math.min.apply(null, dataArr);
            }

            //计算y轴上的点的值
            var diffValueY = 0;
            var valueYMaxWidth = 0; //Y轴上点的最大长度
            var value;
            var textWidth;

            if (options.axis.manualY) {
                diffValueY = (maxValue - minValue) / (options.axis.y + 1);
                for (i = 0; i < options.axis.y + 1; i++) {
                    if (options.axis.isPercent) {
                        value = parseFloat((minValue + diffValueY * i).toFixed(options.axis.precision));
                    } else {
                        value = parseFloat(((minValue + diffValueY * i) * 100).toFixed(options.axis.precision)) + '%';
                    }
                    valueY.push(value);
                    textWidth = window.ChartUtils.getTextWidth(context, value + '', options.axis.fontSize * deviceRatio, options.axis.fontFamily);
                    valueYMaxWidth = textWidth > valueYMaxWidth ? textWidth : valueYMaxWidth;
                }
            } else {
                diffValueY = (maxValue - minValue) / (options.axis.y - 1);
                for (i = 0; i < options.axis.y + 2; i++) {
                    if (options.axis.isPercent) {
                        value = parseFloat(((minValue + diffValueY * (i - 1)) * 100).toFixed(options.axis.precision)) + '%';
                    } else {
                        value = parseFloat((minValue + diffValueY * (i - 1)).toFixed(options.axis.precision));
                    }
                    valueY.push(value);
                    textWidth = window.ChartUtils.getTextWidth(context, value + '', options.axis.fontSize * deviceRatio, options.axis.fontFamily);
                    valueYMaxWidth = textWidth > valueYMaxWidth ? textWidth : valueYMaxWidth;
                }
            }


            //加上y轴文字与y轴的距离
            valueYMaxWidth += 5 * deviceRatio;
            //计算左边距
            textWidth = window.ChartUtils.getTextWidth(context, options.axis.x[0] + '', options.axis.fontSize * deviceRatio, options.axis.fontFamily) / 2;
            valueYMaxWidth = textWidth > valueYMaxWidth ? textWidth : valueYMaxWidth;

            //计算参考点坐标
            top_left.x = bottom_left.x = valueYMaxWidth;
            top_left.y = top_right.y = 0;
            top_right.x = bottom_right.x = eWidth - window.ChartUtils.getTextWidth(context, options.axis.x[options.axis.x.length - 1] + '', options.axis.fontSize * deviceRatio, options.axis.fontFamily) / 2;
            bottom_left.y = bottom_right.y = eHeight - options.axis.fontSize * deviceRatio - 5 * deviceRatio * 2;

            //计算X轴的坐标偏移量
            axisOffsetX = (top_right.x - top_left.x) / (options.axis.x.length - 1);
            axisOffsetY = (bottom_left.y - top_left.y) / (options.axis.y + 1);

            //Y轴上坐标点的最值
            options.axis.minY = minValue - diffValueY;
            options.axis.maxY = maxValue + diffValueY;
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
                window.ChartUtils.drawLine(context, [
                    {
                        x: bottom_left.x,
                        y: bottom_left.y / 2
                    },
                    {
                        x: bottom_right.x,
                        y: bottom_right.y / 2
                    }
                ], 'green', deviceRatio);
            }
            //绘制坐标轴
            window.ChartUtils.drawLine(context, [{
                x: top_left.x,
                y: top_left.y
            }, {
                x: bottom_left.x,
                y: bottom_left.y
            }, {
                x: bottom_right.x,
                y: bottom_right.y
            }], options.axis.lineColor, options.axis.lineWidth * deviceRatio);

            //绘制与Y轴平行的线
            for (i = 1; i < options.axis.x.length - 1; i++) {
                window.ChartUtils.drawLine(context, [{
                    x: top_left.x + axisOffsetX * i,
                    y: top_left.y
                }, {
                    x: bottom_left.x + axisOffsetX * i,
                    y: bottom_left.y
                }], options.axis.lineColor, options.axis.lineWidth * deviceRatio);
            }

            //绘制X轴上点的文本
            for (i = 0; i < options.axis.x.length; i++) {
                window.ChartUtils.drawText(context, options.axis.x[i],
                    bottom_left.x + axisOffsetX * i, bottom_left.y + 5 * deviceRatio, options.axis.color, options.axis.fontSize * deviceRatio, options.axis.fontFamily, 'center', 'top');
            }

            //绘制与X轴平行的线与文字
            for (i = 1; i < options.axis.y + 1; i++) {
                var points = [{
                    x: top_left.x,
                    y: bottom_left.y - axisOffsetY * i
                }, {
                    x: top_right.x,
                    y: bottom_left.y - axisOffsetY * i
                }];
                //线
                window.ChartUtils.drawLine(context, points, options.axis.lineColor, options.lineWidth * deviceRatio);
                //文字
                window.ChartUtils.drawText(context, valueY[i],
                    bottom_left.x - 5 * deviceRatio,
                    bottom_left.y - axisOffsetY * i,
                    options.axis.color, options.axis.fontSize * deviceRatio, options.axis.fontFamily, 'right', 'middle');
            }
        }

        /**
         * 绘制数据区域
         */
        function drawDataArea(cValue, tValue) {
            //进度
            var percent = cValue / tValue;
            var diffValue = (bottom_left.y - top_left.y) / (options.axis.maxY - options.axis.minY);

            for (var i = 0; i < lineData.length; i++) {
                var data = lineData[i];
                var points = [];
                var offsetX = (top_right.x - top_left.x) / (data.length - 1);
                for (var j = 0; j <= (data.length - 1) * percent; j++) {
                    points.push({
                        x: bottom_left.x + offsetX * j,
                        y: bottom_left.y - (data[j] - options.axis.minY) * diffValue
                    });
                }
                //计算不在x坐标轴上的点
                var tPercent = (data.length - 1) * percent % 1;
                if (tPercent > 0 && tPercent < 1) {
                    var offset = 0;
                    offset = (data[j] - data[j - 1]) * tPercent;
                    points.push({
                        x: bottom_left.x + (bottom_right.x - bottom_left.x) * percent,
                        y: bottom_left.y - (data[j - 1] + offset - options.axis.minY ) * diffValue
                    });
                }

                //绘制线条
                window.ChartUtils.drawLine(context, points, options.colors[i], options.lineWidth * deviceRatio);

                if (options.isArea[i]) {
                    points.unshift({
                        x: bottom_left.x,
                        y: bottom_left.y
                    });
                    points.push({
                        x: points[points.length - 1].x,
                        y: bottom_right.y
                    });
                    window.ChartUtils.drawPolygon(context, points, window.ColorUtils.opacityColor(options.colors[i], 0.3), options.lineWidth * deviceRatio);
                }
            }
        }


        /**
         * 绘制图形
         */
        function drawing() {
            //绘制开始
            if (options.events && options.events.start) {
                options.events.start(options);
            }
            var cValue = options.isAnimation ? 0 : 1;
            var tValue = 1;
            //计算数值
            calculate();
            var timer = setInterval(function () {
                //每帧回调
                if (options.events && options.events.drawing) {
                    options.events.drawing(cValue, tValue, options);
                }

                //清空画布
                context.clearRect(0, 0, eWidth, eHeight);
                context.fillStyle = options.background;
                context.fillRect(0, 0, eWidth, eHeight);

                cValue = cValue + 1 / (options.animationTime * 1000 / options.frames) > tValue ? tValue : cValue + 1 / (options.animationTime * 1000 / options.frames);


                //绘制基础区域
                drawBaseArea();
                //绘制数据部分
                drawDataArea(cValue, tValue);

                //判断是否结束绘制
                if (cValue == tValue) {
                    clearInterval(timer);
                    if (options.events && options.events.end) {
                        options.events.end(options);
                    }
                }
            }, 1000 / options.frames);

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

            //获取画布高度，设置画布的实际显示大小
            eHeight = element.height() * deviceRatio;   //画布的高度
            eWidth = element.width() * deviceRatio;     //画布的宽度

            eWidth = eWidth == 0 ? eHeight : eWidth;
            eHeight = eHeight == 0 ? eWidth : eHeight;

            element.attr('height', eHeight);
            element.attr('width', eWidth);

            //绘图
            drawing();
        };

        return exports;
    }

})(jQuery);