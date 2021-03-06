/**
 * 指数图
 * Created by Yun on 2016/9/21.
 * E-mail：wushujia@vip.qq.com
 */
var canvas_0 = $('#canvas_0');

canvas_0.css({
    width: 300,
    height: 200
}).Exponent({
    target: 3,
    data: [1.8142, 1.311, 0.8079],
    colors: ["#ffd076", "#43e1a7", "#fee0a6"],          //线条颜色颜色
    background: 'transparent',  //背景颜色
    frames: 60,         //帧数
    isAnimation: true,  //是否启用动画
    animationTime: 5,   //动画时间
    lineWidth: 1,       //折线宽度
    isDebug: false,     //是否调试模式
    isPercent: true,    //是否显示百分比
    events: {                                           //绘图事件
        start: function (options) {                     //开始绘图
        },
        drawing: function (cValue, tValue, options) {   //没帧开始
        },
        end: function (options) {                       //绘图结束
        }
    },
    axis: {                                             //坐标轴
        x: ['', '1年', '2年', '3年'],                                           //X轴显示的数据
        y: 4,                                            //Y轴显示的数据
        fontSize: 10,                                   //坐标轴文字大小
        fontFamily: 'Microsoft YaHei',                  //坐标轴字体
        color: '#666666',                               //坐标轴文字颜色
        lineColor: '#EEEEEE',                           //坐标轴线条颜色
        lineWidth: 1,                                   //坐标轴线条宽度
        manualY: false,                                 //是否手动控制Y轴的文字
        minY: 0,                                        //Y轴最小值
        maxY: 10,                                       //Y轴最大值
        isShowMinY: true
    }
}).draw();