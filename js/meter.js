/**
 * 评分图例子
 * Created by Yun on 2016/9/9.
 * E-mail：wushujia@vip.qq.com
 */
var canvas_0 = $('#canvas_0');

canvas_0.css({
    width: 250,
    height: 250
}).Meter({
    target: 80,                 //目标值
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
        text: '当前资产评分',             //文本内容
        fontSize: 18,                   //文字大小
        fontFamily: 'Microsoft YaHei',  //字体
        color: '#333333'                //文字颜色
    },
    subTitle: {
        text: '您的当前资产配置良好',      //副标题
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
}).draw();