/**
 * Created by Yun on 2016/9/8.
 * E-mail：wushujia@vip.qq.com
 */
(function ($) {
    $.fn.Pie = function (params) {
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

        var options = {
            data: [],
            colors: [],   //饼图颜色
            spacing: 30,        //饼图饼的宽度
            background: 'transparent',  //背景颜色
            frames: 60,        //帧数
            startAngle: 1,     //起始角度
            isAnimation: true,  //是否启用动画
            animationTime: 3,   //动画时间
            defaultColor: '#eff5f6',             //默认颜色
            isDebug: false,                      //是否启用调试模式
            events: {                           //绘图事件
                start: function (options) {            //开始绘图
                },
                drawing: function (cValue, tValue, options) {   //没帧开始
                },
                end: function (options) {              //绘图结束
                }
            },
            proportion: {                       //占比
                isShow: true,                  //是否显示
                fontSize: 10,                    //字号
                fontFamily: 'Microsoft YaHei',  //字体
                textColor: '#333333',           //字颜色
                lineColor: '#333333',           //线颜色
                lineWidth: 1,                    //线粗细
                lineLength: 20
            },
            title: {                             //主标题
                text: '',                        //文本内容
                fontSize: 20,                   //文字大小
                fontFamily: 'Microsoft YaHei',  //字体
                color: '#333333'                //文字颜色
            },
            subTitle: {
                text: '',                       //副标题
                fontSize: 14,                   //文字大小
                fontFamily: 'Microsoft YaHei',  //字体
                color: '#333333'                //文字颜色
            }
        };

        options = $.extend(true, options, params);

        /**
         * 绘制数据区域
         */
        function drawDataArea(cValue, tValue) {
            //进度
            var percent = cValue / tValue;

            //数据显示角度
            var angles = [];

            var sum = 0;
            var i;
            //计算数据总和
            for (i = 0; i < options.data.length; i++) {
                sum += options.data[i];
            }
            //计算目标角度
            for (i = 0; i < options.data.length; i++) {
                angles[i] = {
                    start: i == 0 ? options.startAngle : angles[i - 1].end,
                    end: (i == 0 ? options.startAngle : angles[i - 1].end) + 2 * options.data[i] / sum * percent
                };
                //绘制弧
                window.ChartUtils.drawArc(context, centerPoint.x, centerPoint.y, options.radius,
                    angles[i].start, angles[i].end,
                    options.colors[i], options.spacing
                );

                //绘制百分比
                if (options.proportion.isShow) {
                    var x1 = centerPoint.x + options.radius * Math.cos((angles[i].start + angles[i].end) / 2 * Math.PI);
                    var y1 = centerPoint.y + options.radius * Math.sin((angles[i].start + angles[i].end) / 2 * Math.PI);

                    var x2 = centerPoint.x + (options.radius + options.spacing / 2 + options.proportion.lineLength) * Math.cos((angles[i].start + angles[i].end) / 2 * Math.PI);
                    var y2 = centerPoint.y + (options.radius + options.spacing / 2 + options.proportion.lineLength) * Math.sin((angles[i].start + angles[i].end) / 2 * Math.PI);

                    context.font = options.proportion.fontSize * deviceRatio + 'px ' + options.proportion.fontFamily;
                    var text = ' ' + parseFloat((options.data[i] / sum * 100 * percent).toFixed(2)) + '% ';
                    var x3 = x2 + (x2 > centerPoint.x ? context.measureText(text).width : -context.measureText(text).width);
                    // var y3 = y2;

                    window.ChartUtils.drawLine(context, [
                        {x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y2}
                    ], options.proportion.lineColor, options.proportion.lineWidth * deviceRatio);


                    window.ChartUtils.drawText(context, text,
                        x2 > centerPoint.x ? x2 : x3, y2,
                        options.proportion.textColor,
                        options.proportion.fontSize * deviceRatio,
                        options.proportion.fontFamily,
                        'left',
                        'bottom');
                }


            }


            //绘制文字
            if (options.subTitle.text) {
                //存在副标题
                window.ChartUtils.drawText(context, options.title.text, centerPoint.x, centerPoint.y,
                    options.title.color, options.title.fontSize * deviceRatio, options.title.fontFamily, 'center', 'bottom');
                window.ChartUtils.drawText(context, options.subTitle.text, centerPoint.x, centerPoint.y,
                    options.subTitle.color, options.subTitle.fontSize * deviceRatio, options.subTitle.fontFamily, 'center', 'top');

            } else {
                window.ChartUtils.drawText(context, options.title.text, centerPoint.x, centerPoint.y,
                    options.title.color, options.title.fontSize * deviceRatio, options.title.fontFamily, 'center', 'middle');
            }
        }


        /**
         * 绘制饼图
         */
        function drawing() {
            //绘制开始
            if (options.events && options.events.start) {
                options.events.start(options);
            }
            var cValue = options.isAnimation ? 0 : 1;
            var tValue = 1;

            if (options.data.length == 0) {
                options.colors.length = 0;
                options.data.push(100);
                options.proportion.isShow = false;
                options.colors.push(options.defaultColor);
            }

            //当颜色数量小于数据数量时，添加缺少的颜色
            if (options.colors.length < options.data.length) {
                for (var i = options.colors.length; i < options.data.length; i++) {
                    options.colors.push(window.ColorUtils.randomColor());
                }
            }

            if (/^0+$/.test(options.data.join(''))) {
                options.data.push(100);
                options.proportion.isShow = false;
                options.colors.push(options.defaultColor);
            }

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

            //获取圆心
            centerPoint.x = eWidth / 2;
            centerPoint.y = eHeight / 2;

            //起始角度
            options.startAngle = options.startAngle ? options.startAngle : parseFloat((2 * Math.random()).toFixed(2));

            options.spacing *= deviceRatio;

            var textWidth = (options.spacing / 2 + options.proportion.lineLength) + window.ChartUtils.getTextWidth(context, '99.99%', options.proportion.fontSize * deviceRatio, options.proportion.fontFamily);

            options.radius = options.proportion.isShow ?
                (centerPoint.x < centerPoint.y ? centerPoint.x - textWidth : centerPoint.y - textWidth) :
                (centerPoint.x < centerPoint.y ? centerPoint.x - options.spacing / 2 : centerPoint.y - options.spacing / 2);

            //绘图
            drawing();
        };

        return exports;
    }

})(jQuery);