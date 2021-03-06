/**
 * 散点图
 * Created by Yun on 2016/9/21.
 * E-mail：wushujia@vip.qq.com
 */
var canvas_0 = $('#canvas_0');

canvas_0.css({
    width: 300,
    height: 300
}).Scatter({
    alpha: 0.3,                 //α值
    beta: 1,                    //β值
    background: 'transparent',  //背景颜色
    frames: 60,                 //帧数
    isAnimation: true,          //是否启用动画
    animationTime: 5,           //动画时间
    lineWidth: 1,               //折线宽度
    isDebug: false,              //是否调试模式
    events: {                                           //绘图事件
        start: function (options) {                     //开始绘图
        },
        drawing: function (type,cValue, tValue, options) {   //没帧开始
        },
        end: function (options) {                       //绘图结束
        }
    },
    axis: {                                             //坐标轴
        color: '#666666',
        width: 1
    },
    point: {                //散点
        color: '#666666',   //散点的颜色
        radius: 1,          //散点的半径
        count: 60,          //散点的个数【仅需要产生点时有效】
        rang: 20            //波动范围【仅需要产生点时有效】
    },
    line: {                     //线
        base: {                 //回归线
            width: 1,           //回归宽度
            color: 'orange'     //回归线颜色
        },
        alpha: {
            width: 1,           //α线的宽度
            color: 'red'        //α线的颜色
        },
        beta: {
            width: 1,           //β线的宽度
            color: 'green'      //β线的颜色
        }
    },
    valueText: {                        //αβ值
        type: 2,                        //【0】α值【1】β值【2】αβ值
        fontSize: 12,                   //αβ值的文字大小
        fontFamily: 'Microsoft YaHei',  //αβ值的字体
        color: '#333333'                //αβ值的文字颜色
    }
}).draw();