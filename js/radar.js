var canvas_0 = $('#canvas_0');

canvas_0.css({
    width: 300,
    height: 300
}).Radar({
    data: [8, 8, 6, 4, 7],
    background: 'transparent',  //背景颜色
    min: 0,
    max: 10,
    dimensions: {
        data: ['风险把控', '投资回报', '稳定性', '行情把握', '经验值'],
        fontSize: 12,                                   //文字大小
        fontFamily: 'Microsoft YaHei',                  //字体
        color: '#666666',                              //文字颜色
        margin: 5
    },
    colors: {
        base: {
            line: '#ced0d1',
            background: '#e2f6ff'
        },
        data: {
            line: '#1799d3',
            background: '#1799d3',
            opacity:0.5
        }
    },

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
    }
}).draw();