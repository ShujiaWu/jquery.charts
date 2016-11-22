/**
 * Canvas绘图辅助工具包
 * Created by Yun on 2016/9/7.
 * E-mail：wushujia@vip.qq.com
 */
;
window.devicePixelRatio = window.devicePixelRatio || 1;
window.ChartUtils = {
    /**
     * 画圆
     * @param context   上下文
     * @param x         圆心x坐标
     * @param y         圆心y坐标
     * @param r         半径
     * @param s         开始弧度
     * @param e         结束弧度
     * @param style     画笔样式
     * @param type      绘图类型（false：画线，true：填充）
     * @param width     绘制的宽度，仅针对画线有用
     */
    drawCircle: function (context, x, y, r, s, e, style, type, width) {
        //绘制
        context.beginPath();
        context.arc(x, y, r, Math.PI * s, Math.PI * e);
        context.closePath();
        if (type) {
            //填充
            context.fillStyle = style;
            context.fill();
        } else {
            //画线
            context.width = width || 1;
            context.strokeStyle = style;
            context.stroke();
        }
    },

    /**
     * 绘制扇形
     * @param context   绘图上下文
     * @param x
     * @param y
     * @param r
     * @param s
     * @param e
     * @param style
     * @param type
     * @param width
     */
    drawSector: function (context, x, y, r, s, e, style, type, width) {
        //绘制
        context.beginPath();
        //当画一个完整的圆时
        if ((e - s) < 2) {
            context.moveTo(x, y);
        }
        context.arc(x, y, r, Math.PI * s, Math.PI * e);
        context.closePath();
        if (type) {
            //填充
            context.fillStyle = style;
            context.fill();
        } else {
            //画线
            context.width = (width || 1);
            context.strokeStyle = style;
            context.stroke();
        }
    },
    /**
     * 绘制弧
     * @param context   上下文
     * @param x         圆心x坐标
     * @param y         圆心y坐标
     * @param r         半径
     * @param s         开始弧度
     * @param e         结束弧度
     * @param style     画笔样式
     * @param width     线条宽带
     */
    drawArc: function (context, x, y, r, s, e, style, width) {
        //绘制
        context.beginPath();
        context.arc(x, y, r, Math.PI * s, Math.PI * e);
        //填充
        context.strokeStyle = style;
        context.lineWidth = width | 1;
        context.stroke();
    },

    /**
     * 画线
     * @param context   上下文
     * @param points    组成线条的点{x, y}
     * @param width     线条宽度
     * @param style     线条样式
     */
    drawLine: function (context, points, style, width) {
        context.beginPath();
        //绘制线条
        context.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }

        context.strokeStyle = style;
        context.lineWidth = width || 1;
        context.stroke();

    },

    drawDashedLine: function (context, points, style, length, width) {
        context.beginPath();
        //绘制线条
        context.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            var dx = points[i].x - points[i - 1].x;
            var dy = points[i].y - points[i - 1].y;
            var offset = Math.sqrt(dx * dx + dy * dy);
            length = length > offset ? offset : length;
            var interval = offset / length;

            var deltaX = dx * length / offset;
            var deltaY = dy * length / offset;

            for(var j = 0; j < interval; j++){
                if (j % 2){
                    context.lineTo(points[i-1].x + deltaX * j, points[i-1].y - deltaY * j);
                }else{
                    context.moveTo(points[i-1].x + deltaX * j, points[i-1].y - deltaY * j);
                }
            }
            // context.lineTo(points[i].x, points[i].y);

        }

        context.strokeStyle = style;
        context.lineWidth = width || 1;
        context.stroke();

    },
    /**
     * 画多边形
     * @param context   上下文
     * @param points    构成多边形的点
     * @param style     样式
     * @param type      绘图类型（false：画线，true：填充）
     * @param width     线条宽度
     */
    drawPolygon: function (context, points, style, type, width) {
        context.beginPath();
        //绘制线条
        context.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.closePath();
        if (type) {
            context.fillStyle = style;
            context.fill();
        } else {
            context.strokeStyle = style;
            context.lineWidth = width || 1;
            context.stroke();
        }
    },
    /**
     * 绘制文字
     * @param context       上下文
     * @param text          文字
     * @param x             x坐标
     * @param y             y坐标
     * @param fontSize      字体
     * @param fontFamily    字体
     * @param color         颜色
     * @param align         水平位置
     * @param vertical      垂直位置
     */
    drawText: function (context, text, x, y, color, fontSize, fontFamily, align, vertical) {
        context.font = (fontSize || 12) + 'px ' + (fontFamily || 'Microsoft YaHei');
        context.fillStyle = color;
        context.textAlign = align || 'center';
        context.textBaseline = vertical || 'middle';
        context.fillText(text, x || 0, y || 0);
    },

    /**
     * 绘制多行文字
     * @param context       上下文
     * @param text          文字
     * @param x             x坐标
     * @param y             y坐标
     * @param fontSize      字体
     * @param fontFamily    字体
     * @param color         颜色
     * @param align         水平位置
     * @param vertical      垂直位置
     * @param boxWidth      文本区域的宽度
     */
    drawMultiText: function (context, text, x, y, color, fontSize, fontFamily, align, vertical, boxWidth) {
        //文字的总长度
        var textWidth = this.getTextWidth(context, text, fontSize, fontFamily);
        //计算每一行的字符长度
        var sizePerLine = Math.floor(text.length * boxWidth / textWidth);
        //计算文字行数
        var textLine = Math.ceil(text.length / sizePerLine);
        //绘出每一行文字
        for (var i = 0; i < textLine; i++) {
            var text_new = text.substr(sizePerLine * i, sizePerLine);
            window.ChartUtils.drawText(context, text_new,
                x,
                y + i * fontSize * 1.2,
                color, fontSize, fontFamily, align, vertical);
        }
    },
    /**
     *
     * @param context       上下文
     * @param text          文本
     * @param fontSize      文字大小
     * @param fontFamily    字体
     * @param boxWidth      盒子宽度
     * @returns {number}    高度
     */
    getMultiTextHeight: function (context, text, fontSize, fontFamily, boxWidth) {
        //文字的总长度
        var textWidth = this.getTextWidth(context, text, fontSize, fontFamily);
        //计算每一行的字符长度
        var sizePerLine = Math.floor(text.length * boxWidth / textWidth);
        //计算文字行数
        var textLine = Math.ceil(text.length / sizePerLine);
        //返回文字的高度
        return fontSize * textLine * 1.2;
    },

    /**
     *  绘制圆角矩形
     * @param context   上下文
     * @param x         起点x坐标
     * @param y         起点y坐标
     * @param w         圆角矩形宽度
     * @param h         圆角矩形高度
     * @param r         圆角半径
     * @param style     样式
     * @param type      绘图类型（false：画线，true：填充）
     * @param width     绘制的宽度，仅针对画线有用
     */
    drawRoundRect: function (context, x, y, w, h, r, style, type, width) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        context.beginPath();
        context.moveTo(x + r, y);
        context.arcTo(x + w, y, x + w, y + h, r);
        context.arcTo(x + w, y + h, x, y + h, r);
        context.arcTo(x, y + h, x, y, r);
        context.arcTo(x, y, x + w, y, r);
        context.closePath();
        if (type) {
            context.fillStyle = style;
            context.fill();
        } else {
            context.strokeStyle = style;
            context.width = width || 1;
            context.stroke();
        }
    },
    /**
     * 获取文字的宽度
     * @param context       上下文
     * @param text          要测量的文本
     * @param fontSize      文本大小
     * @param fontFamily    文本字体
     * @returns {Number}    文本的宽度
     */
    getTextWidth: function (context, text, fontSize, fontFamily) {
        context.font = (fontSize || 12) + 'px ' + (fontFamily || 'Microsoft YaHei');
        return context.measureText(text).width;
    }
};