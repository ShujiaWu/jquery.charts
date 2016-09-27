/**
 * Created by Yun on 2016/9/12.
 * E-mail：wushujia@vip.qq.com
 */
(function ($) {
    $.fn.Meter = function (params) {
        var exports = {};       //函数返回对象
        var element = $(this);  //绘图元素
        var context = null;     //绘图上下文
        var eHeight = 0;        //画布高度
        var eWidth = 0;         //画布宽度
        var centerPoint = {     //圆心
            x: 0,
            y: 0
        };
        var deviceRatio = 1;    //设备像素比例
        var zoomRatio = 1;      //缩放基准

        var subTitleHeight = 0;     //副标题高度

        var options = {
            target: -1,                 //目标值
            min: 0,                     //最小值
            max: 100,                   //最大值
            background: 'transparent',  //背景颜色
            frames: 60,                 //帧数
            startAngle: 0.8,            //起始角度
            endAngle: 2.2,              //结束角度
            isAnimation: true,          //是否启用动画
            animationTime: 3,           //动画时间
            isDebug: false,             //是否启用调试
            events: {                                   //绘图事件
                start: function (options) {             //开始绘图
                },
                drawing: function (cValue, tValue, options) {   //每帧开始
                },
                end: function (options) {               //绘图结束
                }
            },
            colors: ['#ff6131', '#ffad1f', '#4ebf42', '#317fff'],
            title: {                            //主标题
                text: '',                       //文本内容
                fontSize: 18,                   //文字大小
                fontFamily: 'Microsoft YaHei',  //字体
                color: '#333333'                //文字颜色
            },
            subTitle: {
                text: '',                       //副标题
                fontSize: 14,                   //文字大小
                fontFamily: 'Microsoft YaHei',  //字体
                color: '#333333'                //文字颜色
            },
            arc: {
                type: 0,                                //刻度的类型，0：渐变，1：固定颜色
                defaultColor: 'rgba(51, 51, 51,0.2)',
                targetColor: '#FFFFFF',
                width: 1,
                pointRadius: 6
            },
            tick: {
                type: 0,    //刻度的类型，0：渐变，1：固定颜色，
                length: 10,
                width: 1,
                defaultColor0: '#3c3c3c',
                defaultColor1: '#3c3c3c',
                targetColor: '#3c3c3c'
            },
            tickText: {
                fontSize: 10,                   //刻度文字大小
                color: '#3c3c3c',               //刻度文字颜色
                fontFamily: 'Microsoft YaHei'   //刻度文字字体
            },
            scoreText: {
                fontSize: 50,
                fontFamily: 'Microsoft YaHei',
                type: 0,    //刻度的类型，0：渐变，1：固定颜色
                color: '#333333',
                precision: 2
            }
        };

        options = $.extend(true, options, params);

        /**
         * 获取x的值
         * @param radius    半径
         * @param angle     角度
         * @returns {number}    基于(0,0) x的位置
         */
        function getX(radius, angle) {
            return centerPoint.x + radius * Math.cos(angle * Math.PI);
        }

        /**
         * 获取x轴的偏移量
         * @param radius    半径
         * @param angle     角度
         * @returns {number}    偏移量
         */
        function getOffsetX(radius, angle) {
            return radius * Math.cos(angle * Math.PI);
        }

        /**
         * 获取y的值
         * @param radius    半径
         * @param angle     角度
         * @returns {number}    基于(0,0) y的位置
         */
        function getY(radius, angle) {
            return centerPoint.y + radius * Math.sin(angle * Math.PI);
        }

        /**
         * 获取y轴的偏移量
         * @param radius    半径
         * @param angle     角度
         * @returns {number}    偏移量
         */
        function getOffsetY(radius, angle) {
            return radius * Math.sin(angle * Math.PI);
        }

        function drawTick(current) {
            var i;
            //刻度的开始半径
            var r1;
            //刻度的结束半径
            var r2;
            //刻度文字的半径
            var r3;
            //角度
            var angle;

            //绘制进度刻度
            var percent;
            if (current != undefined) {
                //绘制进度刻度
                percent = current / options.max;
            }
            for (i = 0; i < 51; i++) {
                //刻度的开始半径
                r1 = options.radius + (i % 5 == 0 ? options.tickText.spacing + options.tick.length * deviceRatio : options.tickText.spacing + options.tick.length * deviceRatio - 2 * deviceRatio );
                //刻度的结束半径
                r2 = options.radius + (i % 5 == 0 ? options.tickText.spacing : options.tickText.spacing + 2 * deviceRatio);
                //刻度文字的半径
                r3 = (options.radius + r2) / 2;
                //角度
                angle = options.startAngle + (options.endAngle - options.startAngle) / 50 * i;
                window.ChartUtils.drawLine(context, [{
                        x: getX(r1, angle),
                        y: getY(r1, angle)
                    }, {
                        x: getX(r2, angle),
                        y: getY(r2, angle)
                    }],
                    i / 51 < percent ? (options.tick.type == 0 ? window.ColorUtils.getColorStop(0, 51, i, options.colors) : options.tick.targetColor):(i % 5 == 0 ? options.tick.defaultColor1 : options.tick.defaultColor0),
                    options.tick.width * deviceRatio);
                if (i % 10 == 0) {
                    window.ChartUtils.drawText(
                        context,
                        options.max / 50 * i,
                        getX(r3, angle),
                        getY(r3, angle),
                        options.tickText.color,
                        options.tickText.fontSize * deviceRatio,
                        options.tickText.fontFamily,
                        'center', 'middle');
                }
            }


            // if (current != undefined) {
            //     //绘制进度刻度
            //     var percent = current / options.max;
            //     for (i = 0; i / 51 < percent; i++) {
            //         //刻度的开始半径
            //         r1 = options.radius + (i % 5 == 0 ? options.tickText.spacing + options.tick.length * deviceRatio : options.tickText.spacing + options.tick.length * deviceRatio - 2 * deviceRatio );
            //         //刻度的结束半径
            //         r2 = options.radius + (i % 5 == 0 ? options.tickText.spacing : options.tickText.spacing + 2 * deviceRatio);
            //         //刻度文字的半径
            //         r3 = (options.radius + r2) / 2;
            //         //角度
            //         angle = options.startAngle + (options.endAngle - options.startAngle) / 50 * i;
            //         window.ChartUtils.drawLine(context, [{
            //                 x: getX(r1, angle),
            //                 y: getY(r1, angle)
            //             }, {
            //                 x: getX(r2, angle),
            //                 y: getY(r2, angle)
            //             }],
            //             options.tick.type == 0 ? window.ColorUtils.getColorStop(0, 51, i, options.colors) : options.tick.targetColor,
            //             options.tick.width * deviceRatio);
            //     }
            // } else {
            //     //绘制基础刻度
            //     for (i = 0; i < 51; i++) {
            //         //刻度的开始半径
            //         r1 = options.radius + (i % 5 == 0 ? options.tickText.spacing + options.tick.length * deviceRatio : options.tickText.spacing + options.tick.length * deviceRatio - 2 * deviceRatio );
            //         //刻度的结束半径
            //         r2 = options.radius + (i % 5 == 0 ? options.tickText.spacing : options.tickText.spacing + 2 * deviceRatio);
            //         //刻度文字的半径
            //         r3 = (options.radius + r2) / 2;
            //         //角度
            //         angle = options.startAngle + (options.endAngle - options.startAngle) / 50 * i;
            //         window.ChartUtils.drawLine(context, [{
            //                 x: getX(r1, angle),
            //                 y: getY(r1, angle)
            //             }, {
            //                 x: getX(r2, angle),
            //                 y: getY(r2, angle)
            //             }],
            //             i % 5 == 0 ? options.tick.defaultColor1 : options.tick.defaultColor0,
            //             options.tick.width);
            //         if (i % 10 == 0) {
            //             window.ChartUtils.drawText(
            //                 context,
            //                 options.max / 50 * i,
            //                 getX(r3, angle),
            //                 getY(r3, angle),
            //                 options.tickText.color,
            //                 options.tickText.fontSize * deviceRatio,
            //                 options.tickText.fontFamily,
            //                 'center', 'middle');
            //         }
            //     }
            // }

        }

        function drawBaseArea() {
            if (options.isDebug) {
                //绘制辅助线
                window.ChartUtils.drawLine(context, [{x: centerPoint.x, y: 0}, {
                    x: centerPoint.x,
                    y: eHeight
                }], 'red', 1);
                window.ChartUtils.drawLine(context, [{x: 0, y: centerPoint.y}, {
                    x: eWidth,
                    y: centerPoint.y
                }], 'red', 1);
            }
            //绘制表盘
            window.ChartUtils.drawArc(context, centerPoint.x, centerPoint.y, options.radius, options.startAngle, options.endAngle, options.arc.defaultColor, options.arc.width * deviceRatio);
            //绘制刻度
            drawTick();

        }

        /**
         * 绘制数据区域
         */
        function drawDataArea(cValue) {
            var i;
            //进度
            var percent = cValue / options.max;
            drawTick(cValue);
            //绘制进度
            if (options.arc.type == 0) {
                // 渐变
                //计算渐变点的数据
                var x1 = getX(options.radius, options.startAngle),
                    y1 = getY(options.radius, options.startAngle),
                    x2 = centerPoint.x,
                    y2 = getY(options.radius, 1.5),
                    x3 = getX(options.radius, options.endAngle),
                    y3 = getY(options.radius, options.endAngle);
                //设置渐变颜色的起点和终端
                var lg = context.createLinearGradient(x1, y1, x2, y2);
                var lg2 = context.createLinearGradient(x3, y3, x2, y2);
                //获取中间点的颜色值
                var centerColorStop = window.ColorUtils.getColorStop(options.min, options.max, (options.max - options.min) / 2, options.colors);
                //渐变颜色数组
                options.colorStop1 = [];
                options.colorStop2 = [];

                //计算原始颜色数组接近中心点的下标值
                var center = parseInt(options.colors.length / 2);
                //渐变点间距角度
                var perAngle = (options.endAngle - options.startAngle) / (options.colors.length - 1);
                //生成新的渐变点颜色数组
                for (i = 0; i < options.colors.length; i++) {
                    if (options.colors.length % 2 != 0) {
                        //颜色数组为偶数
                        //左
                        if (i <= center) {
                            options.colorStop1.push({
                                color: options.colors[i],
                                angle: options.startAngle + perAngle * i
                            })
                        }
                        //右
                        if (i >= center) {
                            options.colorStop2.push({
                                color: options.colors[i],
                                angle: options.startAngle + perAngle * i
                            })
                        }
                    } else {
                        //颜色数组为奇数
                        //左
                        if (i < center) {
                            options.colorStop1.push({
                                color: options.colors[i],
                                angle: options.startAngle + perAngle * i
                            });
                        }
                        if (i == center) {
                            options.colorStop1.push({
                                color: centerColorStop,
                                angle: (options.endAngle + options.startAngle) / 2
                            });
                            options.colorStop2.push({
                                color: centerColorStop,
                                angle: (options.endAngle + options.startAngle) / 2
                            });
                        }
                        //右
                        if (i >= center) {
                            options.colorStop2.push({
                                color: options.colors[i],
                                angle: options.startAngle + perAngle * i
                            });
                        }
                    }
                }
                //计算设置渐变点
                var pos;
                var arcHeight = options.radius * (1 + Math.sin(options.startAngle * Math.PI));
                for (i = 0; i < options.colorStop1.length; i++) {
                    pos = (getOffsetY(options.radius, options.startAngle) - getOffsetY(options.radius, options.colorStop1[i].angle)) / arcHeight;
                    lg.addColorStop(pos, options.colorStop1[i].color);
                }
                for (i = 0; i < options.colorStop2.length; i++) {
                    pos = (getOffsetY(options.radius, options.endAngle) - getOffsetY(options.radius, options.colorStop2[i].angle)) / arcHeight;
                    lg2.addColorStop(pos, options.colorStop2[i].color);
                }

                if (options.isDebug) {
                    //渐变辅助线
                    window.ChartUtils.drawLine(context, [{x: x1, y: y1}, {
                        x: x2,
                        y: y2
                    }], lg, options.tick.width * deviceRatio);
                    window.ChartUtils.drawLine(context, [{x: x3, y: y3}, {
                        x: x2,
                        y: y2
                    }], lg2, options.tick.width * deviceRatio);
                }

                //绘制弧形
                if (percent <= 0.5) {
                    window.ChartUtils.drawArc(context, centerPoint.x, centerPoint.y, options.radius,
                        options.startAngle, options.startAngle + (options.endAngle - options.startAngle) * percent,
                        lg, options.arc.width * deviceRatio);

                } else {
                    window.ChartUtils.drawArc(context, centerPoint.x, centerPoint.y, options.radius,
                        options.startAngle, options.startAngle + (options.endAngle - options.startAngle) * 0.5,
                        lg, options.arc.width * deviceRatio);
                    window.ChartUtils.drawArc(context, centerPoint.x, centerPoint.y, options.radius,
                        options.startAngle + (options.endAngle - options.startAngle) * 0.5, options.startAngle + (options.endAngle - options.startAngle) * percent,
                        lg2, options.arc.width * deviceRatio);
                }

            } else {
                //单色
                window.ChartUtils.drawArc(context, centerPoint.x, centerPoint.y, options.radius,
                    options.startAngle, options.startAngle + (options.endAngle - options.startAngle) * percent,
                    options.arc.targetColor, options.arc.width * deviceRatio);
            }

            //绘制进度点
            var x = getX(options.radius, (options.startAngle + (options.endAngle - options.startAngle) * percent));
            var y = getY(options.radius, (options.startAngle + (options.endAngle - options.startAngle) * percent));
            var grd = context.createRadialGradient(x, y, 0, x, y, 6 * deviceRatio);
            var targetColor = options.arc.type == 0 ? window.ColorUtils.getColorStop(options.min, options.max, cValue, options.colors) : options.arc.targetColor;
            grd.addColorStop(0, targetColor);
            grd.addColorStop(0.5, targetColor);
            grd.addColorStop(1, window.ColorUtils.opacityColor(targetColor, 0.3));
            window.ChartUtils.drawCircle(context, x, y, options.arc.pointRadius * deviceRatio, 0, 2, grd, true);

            //绘制分数
            window.ChartUtils.drawText(context, parseFloat(cValue.toFixed(options.scoreText.precision)),
                centerPoint.x,
                options.title.text ? centerPoint.y - options.scoreText.fontSize / 2 * deviceRatio : centerPoint.y,
                options.scoreText.type == 0 ? window.ColorUtils.getColorStop(options.min, options.max, cValue, options.colors) : options.scoreText.color,
                options.scoreText.fontSize * deviceRatio, options.scoreText.fontFamily, 'center', 'middle'
            );
            //绘制主标题
            if (options.title.text) {
                window.ChartUtils.drawText(context, options.title.text,
                    centerPoint.x, centerPoint.y + options.title.fontSize / 2 * deviceRatio + options.radius * 0.1,
                    options.title.color,
                    options.title.fontSize * deviceRatio, options.scoreText.fontFamily, 'center', 'middle'
                )
            }
        }


        /**
         * 绘制
         */
        function drawing() {
            if (options.events && options.events.start) {
                options.events.start();
            }
            //特殊情况
            if (options.target > options.max){
                options.target = options.max;
            }
            if (options.target < options.min) {
                if (options.events && options.events.drawing) {
                    options.events.drawing();
                }
                //清空画布
                context.clearRect(0, 0, eWidth, eHeight);
                context.fillStyle = options.background;
                context.fillRect(0, 0, eWidth, eHeight);
                //绘制背景（不变的部分）
                drawBaseArea();
                //绘制数据部分
                //分数
                window.ChartUtils.drawText(context,
                    '暂无',
                    centerPoint.x,
                    options.title.text ? centerPoint.y - options.scoreText.fontSize / 2 * deviceRatio : centerPoint.y,
                    options.scoreText.color,
                    options.scoreText.fontSize * deviceRatio, options.scoreText.fontFamily, 'center', 'middle'
                );
                //绘制主标题
                if (options.title.text) {
                    window.ChartUtils.drawText(context, options.title.text,
                        centerPoint.x, centerPoint.y + options.title.fontSize / 2 * deviceRatio + options.radius * 0.1,
                        options.title.color,
                        options.title.fontSize * deviceRatio, options.scoreText.fontFamily, 'center', 'middle'
                    )
                }


                if (options.subTitle.text) {
                    var textTopPosY = ((eHeight - subTitleHeight) + Math.max(getY(options.radius + options.tickText.spacing + options.tick.length * deviceRatio, options.startAngle), getY(options.radius + options.tickText.spacing + options.tick.length * deviceRatio, options.endAngle))) / 2;
                    window.ChartUtils.drawMultiText(context, options.subTitle.text,
                        centerPoint.x,
                        textTopPosY,
                        options.subTitle.color,
                        options.subTitle.fontSize * deviceRatio,
                        options.subTitle.fontFamily,
                        'center', 'top',
                        eWidth * 0.9);
                }

                if (options.events && options.events.end) {
                    options.events.end();
                }
                return;
            }


            var tValue = options.target;        //目标值
            var cValue = options.isAnimation ? 0 : options.target; //当前值

            var timer = setInterval(function () {
                if (options.events && options.events.drawing) {
                    options.events.drawing(cValue);
                }
                //清空画布
                context.clearRect(0, 0, eWidth, eHeight);
                context.fillStyle = options.background;
                context.fillRect(0, 0, eWidth, eHeight);
                //计算当前值
                cValue = cValue + (options.max - options.min) / (options.animationTime * 1000 / 60) > tValue ? tValue : cValue + (options.max - options.min) / (options.animationTime * 1000 / 60);
                //绘制背景（不变的部分）
                drawBaseArea();
                //绘制数据部分
                drawDataArea(cValue);
                //判断是否结束绘制
                if (cValue == tValue) {
                    clearInterval(timer);
                    //绘制副标题
                    if (options.subTitle.text) {
                        var textTopPosY = ((eHeight - subTitleHeight) + Math.max(getY(options.radius + options.tickText.spacing + options.tick.length * deviceRatio, options.startAngle), getY(options.radius + options.tickText.spacing + options.tick.length * deviceRatio, options.endAngle))) / 2;
                        window.ChartUtils.drawMultiText(context, options.subTitle.text,
                            centerPoint.x,
                            textTopPosY,
                            options.subTitle.color,
                            options.subTitle.fontSize * deviceRatio,
                            options.subTitle.fontFamily,
                            'center', 'top',
                            eWidth * 0.9);
                    }

                    if (options.events && options.events.end) {
                        options.events.end();
                    }
                }
            }, 1000 / options.frames);
        }

        /**
         * 绘制图形
         */
        exports.draw = function () {
            deviceRatio = window.devicePixelRatio;  //获取屏幕像素比

            context = element[0].getContext('2d');

            //获取画布高度，设置画布的实际显示大小
            eHeight = element.height() * deviceRatio;   //画布的高度
            eWidth = element.width() * deviceRatio;     //画布的宽度

            eWidth = eWidth == 0 ? eHeight : eWidth;
            eHeight = eHeight == 0 ? eWidth : eHeight;

            zoomRatio = Math.min(eWidth, eHeight) / 250;

            element.attr('height', eHeight);
            element.attr('width', eWidth);

            // //获取圆心
            // centerPoint.x = eWidth / 2;
            // centerPoint.y = eHeight / (1 + Math.sin(options.startAngle));

            var textWidth = window.ChartUtils.getTextWidth(context, options.max, options.tickText.fontSize * deviceRatio, options.tickText.fontFamily);
            var tickTextSpacing = options.tickText.spacing = Math.sqrt(options.tickText.fontSize * deviceRatio * options.tickText.fontSize * deviceRatio + textWidth * textWidth);


            //副标题高度
            if (options.subTitle.text) {
                subTitleHeight = window.ChartUtils.getMultiTextHeight(context, options.subTitle.text,
                    options.subTitle.fontSize * deviceRatio, options.subTitle.fontFamily, eWidth * 0.9);
            }

            // options.radius = Math.min(centerPoint.x, centerPoint.y) - options.arc.width * deviceRatio - tickTextSpacing - options.tick.length * deviceRatio;

            // //获取圆心
            centerPoint.x = eWidth / 2;
            centerPoint.y = (eHeight - subTitleHeight) / (1 + Math.sin(options.startAngle));

            options.radius = Math.min(centerPoint.x, centerPoint.y)
                - options.arc.width * deviceRatio
                - tickTextSpacing
                - options.tick.length * deviceRatio;


            if (options.isDebug) {
                console.log(options);
                console.log('圆心位置： X: ' + centerPoint.x + '  y: ' + centerPoint.y);
                console.log('半径：' + options.radius);
                console.log('刻度文字的宽度：' + tickTextSpacing);
                console.log('副标题的高度：' + subTitleHeight);
            }

            //绘图
            drawing();
        };

        return exports;
    }

})(jQuery);