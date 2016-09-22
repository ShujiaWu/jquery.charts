/**
 * 刻度图
 * Created by Yun on 2016/9/8.
 * E-mail：wushujia@vip.qq.com
 */
(function ($) {
    $.fn.Scale = function (params) {
        var exports = {};       //函数返回对象
        var element = $(this);  //绘图元素
        var context = null;     //绘图上下文
        var eHeight = 0;        //画布高度
        var eWidth = 0;         //画布宽度
        var deviceRatio = 1;    //设备像素比例
        var tick = [];

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
            type: 1,                     //类型：【0】顶部 【1】居中
            min: 0,
            max: 100,
            target: 50,
            background: 'transparent',  //背景颜色
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
            },
            tick: {
                colorType: 0,                   //刻度的类型，【0】渐变 【1】固定颜色
                valueType: 0,                   //数值类型：【0】小数 【1】百分数
                width: 1,                       //刻度的宽度
                defaultColor: '#CCCCCC',        //刻度的颜色
                targetColor: '#ffc733',         //目标颜色值（仅当colorType=0时有效）
                tickCount: 100,                 //刻度数
                textColor: '#999999',           //刻度文字的颜色
                fontSize: 12,                   //刻度文字的大小
                fontFamily: 'Microsoft YaHei'   //刻度文字字体
            },
            cursor: {
                textColor: 'white',             //游标的文字颜色
                fontSize: 10,                   //游标的文字大小
                fontFamily: 'Microsoft YaHei',  //字体
                background: 'black',            //游标的背景
                triangleColor: 'black',         //游标小三角形的颜色
                textStart: '',                  //游标文字的前缀
                textEnd: ''                     //游标文字的前缀
            },
            colors: []
        };

        options = $.extend(true, options, params);


        function calculate() {
            var i;
            top_left.x = eWidth * 0.05;
            top_left.y = 0;

            top_right.x = eWidth * 0.95;
            top_right.y = 0;

            bottom_left.x = eWidth * 0.05;
            bottom_left.y = eHeight;

            bottom_right.x = eWidth * 0.95;
            bottom_right.y = eHeight;

            var tickPosTopY = eHeight / 3;                            //刻度的顶部Y坐标,eHight * 1/3
            var perTickSpacing = (top_right.x - top_left.x) / options.tick.tickCount;     //刻度间的间距
            var lineHeight = 0;                         //刻度线的高度
            var lineTopOffset = 0;                      //刻度的y轴坐标偏移量（仅对type = 0有效）
            var tickInfo;
            for (i = 0; i <= options.tick.tickCount; i++) {
                tickInfo = {};
                lineHeight = eHeight / 9;           //普通刻度线的高度 eHight * 1/3 * 1/3
                lineTopOffset = options.type == 0 ? 0 : eHeight / 9;   //刻度线Y轴坐标的偏移量 eHeight * 1 / 3 * 1 / 3
                if (i % 5 == 0) {
                    lineHeight = eHeight * 2 / 9;       //中间刻度线
                    lineTopOffset = options.type == 0 ? 0 : eHeight / 18;  //刻度线Y轴坐标的偏移量 eHeight * 1 / 3 * 1 / 6
                }
                if (i % 10 == 0) {
                    lineHeight = eHeight / 3;       //最长的刻度线  eHeight * 1 / 3
                    lineTopOffset = 0;
                    var tickValue = parseFloat(((options.max - options.min) * i / options.tick.tickCount).toFixed(2));
                    tickInfo.text = {
                        x: top_left.x + (top_right.x - top_left.x) * i / options.tick.tickCount,
                        y: eHeight * 7 / 9,        //eHeight * 2 / 3 + eHeight * 1 / 9
                        content: options.tick.valueType == 0 ? tickValue : tickValue * 100 + '%'
                    };
                }
                tickInfo.pointTop = {
                    x: top_left.x + perTickSpacing * i,
                    y: tickPosTopY + lineTopOffset
                };
                tickInfo.pointBottom = {
                    x: top_left.x + perTickSpacing * i,
                    y: tickPosTopY + lineTopOffset + lineHeight
                };
                tick.push(tickInfo);
            }
        }

        /**
         * 绘制基础区域
         */
        function drawBaseArea() {
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
        }

        /**
         * 绘制数据区域
         */
        function drawDataArea(cValue) {
            //进度
            var percent = cValue / (options.max - options.min);
            var i;
            //绘制进度刻度极文字
            for (i = 0; i <= options.tick.tickCount; i++) {
                var item = tick[i];
                //绘制刻度
                if (i <= options.tick.tickCount * percent) {
                    window.ChartUtils.drawLine(context,
                        [item.pointTop, item.pointBottom],
                        options.tick.colorType == 0 ? window.ColorUtils.getColorStop(0, options.tick.tickCount, i, options.colors) : options.tick.targetColor,
                        options.tick.width * deviceRatio);
                } else {
                    window.ChartUtils.drawLine(context,
                        [item.pointTop, item.pointBottom],
                        options.tick.defaultColor, options.tick.width * deviceRatio);
                }
                //绘制刻度文字
                if (item.text) {
                    window.ChartUtils.drawText(context,
                        item.text.content,
                        item.text.x,
                        item.text.y,
                        options.tick.textColor,
                        options.tick.fontSize * deviceRatio,
                        options.tick.fontFamily,
                        'center', 'top'
                    )
                }
            }
            //绘制游标
            //小三角形
            var x = top_left.x + (top_right.x - top_left.x) * percent;  //三角形的x轴坐标
            var y_top = eHeight * 13 / 18;     //三角形的顶部y轴坐标 eHeight * 2/3 + eHeight * 1/3 * 1/6
            var y_bottom = eHeight * 7 / 9;   //三角形的底部y轴坐标 eHeight * 2/3 + eHeight * 1/3 *1/3
            //绘制游标小三角形
            window.ChartUtils.drawPolygon(context, [{
                x: x,
                y: y_top
            }, {
                x: x + (y_bottom - y_top),
                y: y_bottom
            }, {
                x: x - (y_bottom - y_top),
                y: y_bottom
            }], options.cursor.triangleColor, true);

            var currentValueText = options.tick.valueType == 0 ? parseFloat(cValue.toFixed(2)) : parseFloat((cValue * 100).toFixed(2)) + '%';
            currentValueText = options.cursor.textStart + currentValueText + options.cursor.textEnd;

            var cursorTextWidth = window.ChartUtils.getTextWidth(context, currentValueText, options.cursor.fontSize * deviceRatio, options.cursor.fontFamily);
            var cursorTextHeight = options.cursor.fontSize * deviceRatio;

            var cursorRadius = cursorTextHeight / 2;


            if(x - cursorTextWidth / 2 - cursorRadius < 0){
                window.ChartUtils.drawRoundRect(context,
                    0,
                    eHeight * 5 /18 - cursorTextHeight * 1.2 - cursorRadius / 2,
                    cursorTextWidth + cursorRadius * 2,
                    cursorTextHeight + cursorRadius,
                    cursorRadius * 2,
                    options.cursor.background,true);
                window.ChartUtils.drawText(context,currentValueText,
                    cursorRadius,
                    eHeight * 5 / 18,    // eHeight * 1 / 3 * 5 / 6
                    options.cursor.textColor,
                    options.cursor.fontSize * deviceRatio,options.cursor.fontFamily,
                    'left','bottom'
                )
            } else if(x + cursorTextWidth / 2 + cursorRadius > eWidth){
                window.ChartUtils.drawRoundRect(context,
                    eWidth - cursorTextWidth - cursorRadius * 2,
                    eHeight * 5 /18 - cursorTextHeight * 1.2 - cursorRadius / 2,
                    cursorTextWidth + cursorRadius * 2,
                    cursorTextHeight + cursorRadius,
                    cursorRadius * 2,
                    options.cursor.background,true);
                window.ChartUtils.drawText(context,currentValueText,
                    eWidth - cursorRadius,
                    eHeight * 5 / 18,    // eHeight * 1 / 3 * 5 / 6
                    options.cursor.textColor,
                    options.cursor.fontSize * deviceRatio,options.cursor.fontFamily,
                    'right','bottom'
                )
            }else{
                window.ChartUtils.drawRoundRect(context,
                    x - cursorTextWidth / 2 - cursorRadius,
                    eHeight * 5 /18 - cursorTextHeight * 1.2 - cursorRadius / 2,
                    cursorTextWidth + cursorRadius * 2,
                    cursorTextHeight + cursorRadius,
                    cursorRadius * 2,
                    options.cursor.background,true);
                window.ChartUtils.drawText(context,currentValueText,
                    x,
                    eHeight * 5 / 18,    // eHeight * 1 / 3 * 5 / 6
                    options.cursor.textColor,
                    options.cursor.fontSize * deviceRatio,options.cursor.fontFamily,
                    'center','bottom'
                )
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
            var cValue = options.isAnimation ? options.min : options.max;
            var tValue = options.target;

            var valueStep = (options.max - options.min) / (options.animationTime * 1000 / options.frames);
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

                cValue = cValue + valueStep > tValue ? tValue : cValue + valueStep;

                //绘制基础区域
                drawBaseArea();
                //绘制数据部分
                drawDataArea(cValue);

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
            if(options.isDebug){
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