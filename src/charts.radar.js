/**
 * 雷达图
 * Created by Yun on 2016/11/23.
 * E-mail：wushujia@vip.qq.com
 */
(function ($) {
    $.fn.Radar = function (params) {
        var exports = {};       //函数返回对象
        var element = $(this);  //绘图元素
        var context = null;     //绘图上下文
        var eHeight = 0;        //画布高度
        var eWidth = 0;         //画布宽度
        var deviceRatio = 1;    //设备像素比例
        var centerPoint = {     //中心点
            x: 0,
            y: 0
        };
        var radius = 0;                 //雷达绘制半径

        var endPoint = [];              //计算维度终点的坐标
        var centerPointToEndPoint = []; //中心点到维度终点的线
        var dimensionNames = [];        //维度名称的位置
        var startAngle;
        var dimensionsPoints;           //维度的四个极值


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


        var options = {
            data: [],
            background: 'transparent',  //背景颜色
            min: 0,
            max: 10,
            dimensions: {
                data: [],
                fontSize: 12,                                   //文字大小
                fontFamily: 'Microsoft YaHei',                  //字体
                color: '#666666',                              //文字颜色
                margin: 5
            },
            colors: {
                base: {
                    line: '#ced0d1',
                    background: '#e2f6ff'
                },
                data: {
                    line: '#1799d3',
                    background: '#1799d3',
                    opacity:0.5
                }
            },

            frames: 60,        //帧数
            isAnimation: true,  //是否启用动画
            animationTime: 5,   //动画时间
            isDebug: false,     //是否调试模式
            events: {                                           //绘图事件
                start: function (options) {                     //开始绘图
                },
                drawing: function (cValue, tValue, options) {   //没帧开始
                },
                end: function (options) {                       //绘图结束
                }
            }
        };

        options = $.extend(true, options, params);


        function calculate() {
            var i;
            //计算最大的文字长度
            var maxTextWidth = 0;
            var textLength;
            for (i = 0; i < options.dimensions.data.length; i++) {
                textLength = window.ChartUtils.getTextWidth(context, options.dimensions.data[i], options.dimensions.fontSize * deviceRatio, options.dimensions.fontFamily);
                maxTextWidth = maxTextWidth > textLength ? maxTextWidth : textLength;
            }
            //计算文字的高度
            var textHeight = options.dimensions.fontSize * deviceRatio * 1.2;
            top_left = {
                x: maxTextWidth,
                y: textHeight
            };
            top_right = {
                x: eWidth - maxTextWidth,
                y: textHeight
            };
            bottom_left = {
                x: maxTextWidth,
                y: eHeight - textHeight
            };
            bottom_right = {
                x: eWidth - maxTextWidth,
                y: eHeight - textHeight
            };

            //计算中心点
            centerPoint.x = eWidth / 2;
            centerPoint.y = eHeight / 2;

            //计算绘制半径
            var dx = (top_right.x - top_left.x) / 2;
            var dy = (bottom_left.y - top_left.y) / 2;
            radius = dx > dy ? dy : dx;

            //计算维度极值
            dimensionsPoints = {
                top: eHeight / 2,
                right: eWidth / 2,
                bottom: eHeight / 2,
                left: eWidth / 2
            };

            if (options.dimensions.data.length % 2) {
                //奇数
                startAngle = 3 / 2;
            } else {
                //偶数
                startAngle = 3 / 2 + 1 / options.dimensions.data.length;
            }

            for (i = 0; i < options.dimensions.data.length; i++) {
                var angle = (startAngle + 2 / options.dimensions.data.length * i) * Math.PI;
                //计算维度终点坐标
                endPoint.push({
                    x: centerPoint.x + Math.cos(angle) * radius,
                    y: centerPoint.y + Math.sin(angle) * radius
                });
                //中心点到维度终点的线坐标
                centerPointToEndPoint.push([centerPoint, endPoint[i]]);

                //计算维度的极值
                dimensionsPoints.top = dimensionsPoints.top < endPoint[i].y ? dimensionsPoints.top : endPoint[i].y;
                dimensionsPoints.right = dimensionsPoints.right > endPoint[i].x ? dimensionsPoints.right : endPoint[i].x;
                dimensionsPoints.bottom = dimensionsPoints.bottom > endPoint[i].y ? dimensionsPoints.bottom : endPoint[i].y;
                dimensionsPoints.left = dimensionsPoints.left < endPoint[i].x ? dimensionsPoints.left : endPoint[i].x;

                //绘制维度名字坐标
                dimensionNames.push({
                    x: centerPoint.x + Math.cos(angle) * (radius + options.dimensions.margin * deviceRatio),
                    y: centerPoint.y + Math.sin(angle) * (radius + options.dimensions.margin * deviceRatio)
                });
            }

            console.log(dimensionsPoints);
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

                window.ChartUtils.drawCircle(context, centerPoint.x, centerPoint.y, radius, 0, 2, 'green', false, 1);
            }

            //绘制雷达图底图
            window.ChartUtils.drawPolygon(context, endPoint, options.colors.base.background, true, deviceRatio);
            window.ChartUtils.drawPolygon(context, endPoint, options.colors.base.line, false, deviceRatio);
            for (i = 0; i < centerPointToEndPoint.length; i++) {
                window.ChartUtils.drawLine(context, centerPointToEndPoint[i], options.colors.base.line, deviceRatio);
            }

            //绘制维度名称
            for (i = 0; i < dimensionNames.length; i++) {
                var h = 'center';
                var v = 'middle';
                switch (true) {
                    case dimensionNames[i].x - centerPoint.x < -0.00001:
                        h = 'right';
                        break;
                    case Math.abs(dimensionNames[i].x - centerPoint.x) < 0.00001:
                        h = 'center';
                        break;
                    case dimensionNames[i].x - centerPoint.x > 0.00001:
                        h = 'left';
                        break;
                }

                switch (true) {
                    case Math.abs(endPoint[i].y - dimensionsPoints.top) < 0.00001:
                        v = 'bottom';
                        break;
                    case Math.abs(endPoint[i].y - dimensionsPoints.bottom) < 0.00001:
                        h = 'center';
                        v = 'top';
                        break;
                }

                window.ChartUtils.drawText(context, options.dimensions.data[i], dimensionNames[i].x, dimensionNames[i].y, options.dimensions.color, options.dimensions.fontSize * deviceRatio, options.dimensions.fontFamily, h, v)
            }


        }

        /**
         * 绘制数据区域
         */
        function drawDataArea(cValue, tValue) {
            //绘制数据部分
            var i;
            var dataPoint = [];
            var diff = options.max - options.min;
            var currentRadius = radius / diff * cValue / tValue;
            for (i = 0; i < options.dimensions.data.length; i++) {
                var angle = (startAngle + 2 / options.dimensions.data.length * i) * Math.PI;
                dataPoint.push({
                    x: centerPoint.x + Math.cos(angle) * options.data[i] * currentRadius,
                    y: centerPoint.y + Math.sin(angle) * options.data[i] * currentRadius
                });
            }
            for (i = 0; i < options.dimensions.data.length; i++) {
                window.ChartUtils.drawCircle(context, dataPoint[i].x, dataPoint[i].y, 2 * deviceRatio, 0, 2, options.colors.data.line, false, 2 * deviceRatio);
            }
            //绘制雷达图底图
            window.ChartUtils.drawPolygon(context, dataPoint, window.ColorUtils.opacityColor(options.colors.data.background, options.colors.data.opacity), true, deviceRatio);
            window.ChartUtils.drawPolygon(context, dataPoint, options.colors.data.line, false, deviceRatio);

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

            if (options.dimensions.data.length < 3) {
                throw new Error('维度必须大于3');
            }

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