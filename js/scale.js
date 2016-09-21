/**
 * 刻度图
 * Created by Yun on 2016/9/20.
 * E-mail：wushujia@vip.qq.com
 */
var canvas_0 = $('#canvas_0');

canvas_0.css({
    width: 300,
    height: 120
}).Scale({
    type: 1,                     //类型：【0】顶部 【1】居中
    min: 0,
    max: 100,
    target: 100,
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
        textEnd: ''                   //游标文字的前缀
    },
    colors: ['#3bb268', '#48efb2', '#ffee30', '#ffa530', '#ff6131']
}).draw();