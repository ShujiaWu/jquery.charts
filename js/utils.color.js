/**
 * 颜色的工具集
 * Created by Yun on 2016/9/7.
 * E-mail：wushujia@vip.qq.com
 */
window.ColorUtils = {
    /**
     * 16进制颜色转成rgba数组
     * @param color 颜色字符串，支持RGBA和16进制
     * @returns {*[]}
     */
    colorToRgbaArray: function (color) {
        var R = 0,
            G = 0,
            B = 0,
            A = 0;
        //16进制
        if (/^#([0-9a-zA-z]{3}|[0-9a-zA-z]{6})$/.test(color)) {
            var value = parseInt(RegExp.$1, 16);
            A = 1;
            R = value >> 16 & 0xff;
            G = value >> 8 & 0xff;
            B = value & 0xff;
        }
        //RGB或RGBA
        if (/^rgba?\((\d+),(\d+),(\d+),?(\d+)?\)$/.test(color)) {
            R = parseInt(RegExp.$1);
            G = parseInt(RegExp.$2);
            B = parseInt(RegExp.$3);
            A = parseFloat(RegExp.$4);
            A = isNaN(A) ? 1 : A;

        }
        return [R, G, B, A];
    },
    /**
     * 获取数值对应颜色
     * @param min   最小值
     * @param max   最大值
     * @param current   当前值
     * @param cArray    颜色节点数组
     * @returns {string}    RGBA字符串
     */
    getColorStop: function (min, max, current, cArray) {
        var step = cArray.length - 1;
        var cStopPosition = current / ((max - min ) / step);

        var cStopArea = parseInt(cStopPosition);        //所在的区间
        var colorOffset = cStopPosition - cStopArea;    //区间偏移量

        if (colorOffset == 0) {                         //区间点上
            var rgbaArray = this.colorToRgbaArray(cArray[cStopArea]);
            return 'rgba(' + rgbaArray[0] + ',' + rgbaArray[1] + ',' + rgbaArray[2] + ',' + rgbaArray[3] + ')';
        }

        var c1Array = this.colorToRgbaArray(cArray[cStopArea]);        //区间的节点
        var c2Array = this.colorToRgbaArray(cArray[cStopArea + 1]);

        var R = parseInt(c1Array[0] + (c2Array[0] - c1Array[0]) * colorOffset);
        var G = parseInt(c1Array[1] + (c2Array[1] - c1Array[1]) * colorOffset);
        var B = parseInt(c1Array[2] + (c2Array[2] - c1Array[2]) * colorOffset);
        var A = parseInt(c1Array[3] + (c2Array[3] - c1Array[3]) * colorOffset);
        return 'rgba(' + R + ',' + G + ',' + B + ',' + A + ')';
    },
    /**
     * 将指定的颜色进行透明化
     * @param color         将要透明化的颜色
     * @param opacity       透明度
     * @returns {string}    最终的颜色值RGBA
     */
    opacityColor: function (color, opacity) {
        var rgbaArr = this.colorToRgbaArray(color);
        rgbaArr[3] *= opacity;
        return 'rgba(' + rgbaArr[0] + ',' + rgbaArr[1] + ',' + rgbaArr[2] + ',' + rgbaArr[3] + ')';
    },
    /**
     * 随机产生一个颜色（RGB）
     */
    randomColor: function () {
        return 'rgb(' + parseInt(255 * Math.random()) + ',' + parseInt(255 * Math.random()) + ',' + parseInt(255 * Math.random()) + ')';
    }
};