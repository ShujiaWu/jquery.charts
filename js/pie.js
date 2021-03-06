/**
 * Created by Yun on 2016/9/9.
 * E-mail：wushujia@vip.qq.com
 */
var canvas_0 = $('#canvas_0');

canvas_0.css({
    width: 300,
    height: 300
}).Pie({
    data: [30, 30, 40],
    colors: ['#ff6131', '#ffad1f', '#4ebf42'],   //饼图颜色
    spacing: 30,        //饼图饼的宽度
    background: 'transparent',  //背景颜色
    frames: 60,        //帧数
    startAngle: 1,     //起始角度
    isAnimation: true,  //是否启用动画
    animationTime: 3,   //动画时间
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
        text: '标题一',               //文本内容
        fontSize: 20,                   //文字大小
        fontFamily: 'Microsoft YaHei',  //字体
        color: '#333333'                //文字颜色
    },
    subTitle: {
        text: '标题二',               //副标题
        fontSize: 14,                   //文字大小
        fontFamily: 'Microsoft YaHei',  //字体
        color: '#333333'                //文字颜色
    }
}).draw();