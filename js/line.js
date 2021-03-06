/**
 * 折线图
 * Created by Yun on 2016/9/18.
 * E-mail：wushujia@vip.qq.com
 */
var canvas_0 = $('#canvas_0');

canvas_0.css({
    width: 300,
    height: 200
}).Line({
    data: [[0.21,0.38,0.12,0.44,0.36,0.21,0.25],[1,1,1,1,1,1,1]],                 //线条颜色颜色
    colors: ["#99d1fd", "#fed27c"],
    isArea: [true,false],                           //是否区域显示
    background: 'transparent',  //背景颜色
    frames: 60,        //帧数
    isAnimation: true,  //是否启用动画
    animationTime: 5,   //动画时间
    lineWidth: 1,       //折线宽度
    isDebug: false,     //是否调试模式
    events: {                                           //绘图事件
        start: function (options) {                     //开始绘图
        },
        drawing: function (cValue, tValue, options) {   //没帧开始
        },
        end: function (options) {                       //绘图结束
        }
    },
    axis: {                                             //坐标轴
        x:["08-22","08-31","09-07","09-14"],                                           //X轴显示的数据
        y:4,                                            //Y轴显示的数据
        fontSize: 10,                                   //坐标轴文字大小
        fontFamily: 'Microsoft YaHei',                  //坐标轴字体
        color: '#666666',                               //坐标轴文字颜色
        lineColor:'#EEEEEE',                            //坐标轴线条颜色
        lineWidth:1,                                    //坐标轴线条宽度
        precision: 2,                                   //精度
        isPercent: true,                                //是否是百分比模式
        manualY: false,                                 //是否手动控制Y轴的文字
        minY: 0,                                        //Y轴最小值
        maxY: 0                                         //Y轴最大值
    }
}).draw();