/**
 * 散点图
 * Created by Yun on 2016/9/21.
 * E-mail：wushujia@vip.qq.com
 */
(function ($) {
    $.fn.Scatter = function (params) {
        var exports = {};       //函数返回对象
        var element = $(this);  //绘图元素
        var context = null;     //绘图上下文
        var eHeight = 0;        //画布高度
        var eWidth = 0;         //画布宽度
        var deviceRatio = 1;    //设备像素比例

        var zeroPoint = {                 //零点坐标
            x: 0,
            y: 0
        };
        var abPoints = null;
        var options = {
            alpha: 0.3,                 //α值
            beta: 1,                    //β值
            background: 'transparent',  //背景颜色
            frames: 60,                 //帧数
            isAnimation: true,          //是否启用动画
            animationTime: 5,           //动画时间
            lineWidth: 1,               //折线宽度
            isDebug: false,              //是否调试模式
            events: {                                           //绘图事件
                start: function (options) {                     //开始绘图
                },
                drawing: function (type,cValue, tValue, options) {   //没帧开始
                },
                end: function (options) {                       //绘图结束
                }
            },
            axis: {                                             //坐标轴
                color: '#666666',
                width: 1
            },
            point: {                //散点
                color: '#666666',   //散点的颜色
                radius: 1,          //散点的半径
                count: 60,          //散点的个数【仅需要产生点时有效】
                rang: 20            //波动范围【仅需要产生点时有效】
            },
            line: {                     //线
                base: {                 //回归线
                    width: 1,           //回归宽度
                    color: 'orange'     //回归线颜色
                },
                alpha: {
                    width: 1,           //α线的宽度
                    color: 'red'        //α线的颜色
                },
                beta: {
                    width: 1,           //β线的宽度
                    color: 'green'      //β线的颜色
                }
            },
            valueText: {                        //αβ值
                type: 2,                        //【0】α值【1】β值【2】αβ值
                fontSize: 12,                   //αβ值的文字大小
                fontFamily: 'Microsoft YaHei',  //αβ值的字体
                color: '#333333'                //αβ值的文字颜色
            }
        };

        options = $.extend(true, options, params);


        /**
         * 根据x值获取y值（相对于零点的偏移）
         * @param x
         * @returns {number}
         */
        function getYOffset(x) {
            return options.beta * x + options.alpha * (eHeight * 3 / 4)
        }

        /**
         * 根据y值获取x值（相对于零点的偏移）
         * @param y
         * @returns {number}
         */
        function getXOffset(y) {
            return (y - options.alpha * (eHeight * 3 / 4)) / options.beta;
        }

        /**
         * Y值的波动范围
         * @param scope
         * @returns {Number}
         */
        function getPointY(scope) {
            return parseInt(scope * Math.sqrt(Math.pow(options.beta, 2) + 1));
        }

        /**
         * 绘图前计算
         */
        function calculate() {
            var i;
            //计算零点坐标
            zeroPoint.x = eWidth / 2;
            zeroPoint.y = eHeight * 3 / 4;

            //不存在散点数据时，生成散点数据
            var scopeY = getPointY(options.point.rang * deviceRatio);
            if (!options.point.data) {
                var offsetX = eWidth / 2 / options.point.count;
                options.point.data = [];
                for (i = 1; i < options.point.count; i++) {
                    var rx = offsetX * i; //随机生成x的值（基于零点的偏移）
                    var y = getYOffset(rx);              //取到对应的y的值（给予零点的偏移量）
                    var ry = y - Math.random() * scopeY + Math.random() * scopeY; //随机波动（一正一负）
                    options.point.data.push({
                        x: zeroPoint.x + rx,
                        y: zeroPoint.y - ry
                    });
                }
            }

            //计算αβ线的点坐标
            var x1 = options.beta > 0 ? Math.abs(getXOffset(eHeight * 3 / 4) / 2) : Math.abs(getXOffset(eHeight / 4) / 2);
            if (x1 < 5) {
                x1 = getXOffset(eHeight * 3 / 4);
            }
            if (x1 > eWidth / 2) {
                x1 = eWidth / 2 / 2;
            }
            var y1 = getYOffset(x1);

            var x2 = x1;
            var y2 = getYOffset(0);

            //y轴与线的焦点
            var x3 = 0;
            var y3 = getYOffset(0);

            abPoints = {
                point0: {
                    x: zeroPoint.x + x1,
                    y: zeroPoint.y - y1
                },
                point1: {
                    x: zeroPoint.x + x2,
                    y: zeroPoint.y - y2
                },
                point2: {
                    x: zeroPoint.x + x3,
                    y: zeroPoint.y - y3
                }
            };
        }

        /**
         * 绘制基础区域
         */
        function drawBaseArea() {
            //绘制坐标轴
            window.ChartUtils.drawLine(context, [
                {
                    x: 0,
                    y: zeroPoint.y
                }, {
                    x: eWidth,
                    y: zeroPoint.y
                }
            ], options.axis.color, options.axis.width * deviceRatio);
            window.ChartUtils.drawLine(context, [
                {
                    x: zeroPoint.x,
                    y: 0
                }, {
                    x: zeroPoint.x,
                    y: eHeight
                }
            ], options.axis.color, options.axis.width * deviceRatio);

        }

        /**
         * 绘制散点
         * @param cValue
         * @param tValue
         */
        function drawTargetPoint(cValue, tValue) {
            //进度
            var percent = cValue / tValue;

            //绘制点
            for (var i = 0; i < options.point.data.length * percent; i++) {
                window.ChartUtils.drawCircle(context,
                    options.point.data[i].x,
                    options.point.data[i].y,
                    options.point.radius * deviceRatio
                    , 0, 2, options.point.color, true);
            }
        }

        /**
         * 绘制回归直线
         * @param cValue
         * @param tValue
         */
        function drawTargetLine(cValue, tValue) {
            //进度
            var percent = cValue / tValue;
            //绘制线
            window.ChartUtils.drawLine(context, [
                {
                    x: 0,
                    y: zeroPoint.y - getYOffset(-eWidth / 2)
                }, {
                    x: eWidth * percent,
                    y: zeroPoint.y - getYOffset(-eWidth / 2 + eWidth * percent)
                }
            ], options.line.base.color, options.line.base.width *deviceRatio);
        }

        /**
         * 绘制α值和β值
         */
        function drawValueText() {
            //绘制αβ线
            if (options.valueText.type == 0 || options.valueText.type == 2) {
                //α线
                window.ChartUtils.drawLine(context, [
                    {x: zeroPoint.x, y: zeroPoint.y}, abPoints.point2
                ], options.line.alpha.color, options.line.alpha.width *deviceRatio);
            }
            if (options.valueText.type == 1 || options.valueText.type == 2) {
                //β线
                window.ChartUtils.drawLine(context, [
                    abPoints.point0, abPoints.point1, abPoints.point2
                ], options.line.beta.color, options.line.beta.width *deviceRatio);
            }

            //绘制αβ值
            var textPosY = (zeroPoint.y + abPoints.point2.y ) / 2;
            var text = '';
            switch (options.valueText.type) {
                case 0:
                    text = 'α = ' + options.alpha;
                    break;
                case 1:
                    text = 'β = ' + options.beta;
                    break;
                case 2:
                    text = 'α = ' + options.alpha + ' ' + 'β = ' + options.beta;
            }
            if (eHeight * 3 / 4 * options.alpha < options.valueText.fontSize * deviceRatio) {
                textPosY = zeroPoint.y +  (options.beta < 0 ? -(options.valueText.fontSize * deviceRatio) : (options.valueText.fontSize * deviceRatio))
            }
            window.ChartUtils.drawText(context, text,
                zeroPoint.x + 10 * deviceRatio,
                textPosY,
                options.valueText.color,
                options.valueText.fontSize * deviceRatio,
                options.valueText.fontFamily,
                'left', 'middle');

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
                    options.events.drawing('point',cValue, tValue, options);
                }

                //清空画布
                context.clearRect(0, 0, eWidth, eHeight);
                context.fillStyle = options.background;
                context.fillRect(0, 0, eWidth, eHeight);

                cValue = cValue + 1 / (options.animationTime * 0.8 * 1000 / options.frames) > tValue ? tValue : cValue + 1 / (options.animationTime * 0.8 * 1000 / options.frames);

                //绘制基础区域
                drawBaseArea();
                //绘制数据部分
                drawTargetPoint(cValue, tValue);
                //判断是否结束绘制
                if (cValue == tValue) {
                    clearInterval(timer);

                    cValue = options.isAnimation ? 0 : 1;
                    tValue = 1;
                    timer = setInterval(function () {
                        if (options.events && options.events.drawing) {
                            options.events.drawing('line',cValue, tValue, options);
                        }
                        //清空画布
                        context.clearRect(0, 0, eWidth, eHeight);
                        context.fillStyle = options.background;
                        context.fillRect(0, 0, eWidth, eHeight);
                        cValue = cValue + 1 / (options.animationTime * 0.2 * 1000 / options.frames) > tValue ? tValue : cValue + 1 / (options.animationTime * 0.2 * 1000 / options.frames);

                        //绘制基础区域
                        drawBaseArea();
                        //绘制数据部分
                        drawTargetPoint(1, 1);
                        drawTargetLine(cValue, tValue);
                        //判断是否结束绘制
                        if (cValue == tValue) {
                            clearInterval(timer);
                            drawValueText();
                            if (options.events && options.events.end) {
                                options.events.end(options);
                            }
                        }
                    }, 1000 / options.frames);
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