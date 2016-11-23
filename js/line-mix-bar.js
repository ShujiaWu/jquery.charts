/**
 * Created by Yun on 2016/11/18.
 */
var canvas_0 = $('#canvas_0');
var canvas_1 = $('#canvas_1');

canvas_0.css({
    width: 1900,
    height: 200
}).LineMixBar({
    data: {
        line: [[
            50, 60, 50, 60, 10,
            50, 60, 50, 60, 10,
            50, 60, 50, 60, 10,
            50, 60, 50, 60, 10,
            50, 60, 50, 60, 10,
            50, 60, 50, 60, 10
        ]],
        bar: [
            [0.1, 0.2], [0.3, 1], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2],
            [0.1, 0.2], [0.3, 0.7], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2],
            [0.1, 0.2], [0.3, 0.7], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2],
            [0.1, 0.2], [0.3, 0.7], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2],
            [0.1, 0.2], [0.3, 0.7], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2],
            [0.1, 0.2], [0.3, 0.7], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2]
        ],
        floatTitle: [
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日',
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日',
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日',
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日',
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日',
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日'
        ],
        top: [[
            '10000', '200', '30000', '10000', '1000',
            '10000', '200', '30000', '10000', '1000',
            '10000', '200', '30000', '10000', '1000',
            '10000', '200', '30000', '10000', '1000',
            '10000', '200', '30000', '10000', '1000',
            '10000', '200', '30000', '10000', '1000'
        ]]
    },
    legends: {
        bar: ['波动性', '流动性'],
        line: ['资产评分'],
        top: ['资产']
    },
    units: {
        bar: [],
        line: ['分'],
        top: []
    },
    colors: {
        line: ['#FFAA88'],
        bar: ['#FFEA98', '#C5EAFF', '#98D0FF'],
        top: ['#946A33']
    },                 //线条颜色颜色
    background: 'transparent',  //背景颜色
    isDebug: false,     //是否调试模式
    axis: {                                             //坐标轴
        x: [
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4'],
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4'],
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4'],
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4'],
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4'],
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4']
        ],                                              //X轴显示的数据
        fontSize: 12,                                   //坐标轴文字大小
        fontFamily: 'Microsoft YaHei',                  //坐标轴字体
        color: '#666666',                               //坐标轴文字颜色
        lineColor: '#EEEEEE',                           //坐标轴线条颜色
        lineWidth: 1,                                   //坐标轴线条宽度
        textMarginTopX: 5,                              //文字距离顶部的高度
        activeLine: {
            width: 1,
            color: '#999999'
        }
    },
    bar: {
        gap: 2,
        max: 1,
        min: 0,
        default:'',
        defaultColor:'#CCCCCC',
        width: undefined,
        type: 0               //【0】分开展示 【1】合并展示
    },
    line: {
        width: 2,
        dashedLength: 5,
        areaType: 1,          //【0】不显示【1】虚线不覆盖【2】虚线覆盖
        max: 100,
        min: 0,
        default:'',
        point: {
            radius: 3,
            width: 1,
            fill: 'white'
        }
    },
    top: {
        fontSize: 12,                                   //坐标轴文字大小
        fontFamily: 'Microsoft YaHei',                  //坐标轴字体
        color: '#666666',                               //坐标轴文字颜色
        textMarginBottom: 5
    }
}).draw();

canvas_1.css({
    width: 1900,
    height: 200
}).LineMixBar({
    data: {
        line: [[
            50, 60, 50, 60, 10,
            50, 60, 50, 60, 10,
            50, 60, 50, 60, 10,
            50, 60, 50, 60, 10,
            50, 60, 50, 60, 10,
            50, 60, 50, 60, 10
        ]],
        bar: [
            [0.1, 0.2], [0.3, 0.7], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2],
            [0.1, 0.2], [0.3, 0.7], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2],
            [0.1, 0.2], [0.3, 0.7], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2],
            [0.1, 0.2], [0.3, 0.7], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2],
            [0.1, 0.2], [0.3, 0.7], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2],
            [0.1, 0.2], [0.3, 0.7], [0.9, 0.6], [0.8, 0.4], [0.8, 0.2]
        ],
        floatTitle: [
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日',
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日',
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日',
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日',
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日',
            '10月10日', '10月11日', '10月12日', '10月13日', '10月14日'
        ],
        top: [[
            '10000', '200', '30000', '10000', '1000',
            '10000', '200', '30000', '10000', '1000',
            '10000', '200', '30000', '10000', '1000',
            '10000', '200', '30000', '10000', '1000',
            '10000', '200', '30000', '10000', '1000',
            '10000', '200', '30000', '10000', '1000'
        ]]
    },
    legends: {
        bar: ['波动性', '流动性'],
        line: ['资产评分'],
        top: ['资产']
    },
    units: {
        bar: [],
        line: ['分'],
        top: []
    },
    colors: {
        line: ['#FFAA88'],
        bar: ['#FFEA98', '#C5EAFF'],
        top: ['#946A33']
    },                 //线条颜色颜色
    background: 'transparent',  //背景颜色
    isDebug: false,     //是否调试模式
    axis: {                                             //坐标轴
        x: [
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4'],
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4'],
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4'],
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4'],
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4'],
            ['10-10', '稳健型A4'], ['10-11', '稳健型A4'], ['10-12', '稳健型A4'], ['10-13', '稳健型A4'], ['10-14', '稳健型A4']
        ],                                              //X轴显示的数据
        fontSize: 12,                                   //坐标轴文字大小
        fontFamily: 'Microsoft YaHei',                  //坐标轴字体
        color: '#666666',                               //坐标轴文字颜色
        lineColor: '#EEEEEE',                           //坐标轴线条颜色
        lineWidth: 1,                                   //坐标轴线条宽度
        textMarginTopX: 5,                              //文字距离顶部的高度
        activeLine: {
            width: 1,
            color: '#999999'
        }
    },
    bar: {
        gap: 2,
        max: 1,
        min: 0,
        width: undefined,
        type: 1               //【0】分开展示 【1】合并展示
    },
    line: {
        width: 2,
        dashedLength: 5,
        areaType: 1,          //【0】不显示【1】虚线不覆盖【2】虚线覆盖
        max: 100,
        min: 0,
        point: {
            radius: 3,
            width: 1,
            fill: 'white'
        }
    },
    top: {
        fontSize: 12,                                   //坐标轴文字大小
        fontFamily: 'Microsoft YaHei',                  //坐标轴字体
        color: '#666666',                               //坐标轴文字颜色
        textMarginBottom: 5
    }
}).draw();