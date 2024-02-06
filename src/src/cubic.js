export function InitCubic(container_id) {

    window.onload = () => {



        const echarts = require('echarts/lib/echarts');
        const Spline = require('cubic-spline');
        require('echarts/lib/component/title');
        require('echarts/lib/component/tooltip');
        require('echarts/lib/component/grid');
        require('echarts/lib/component/dataZoom');
        require('echarts/lib/component/graphic');
        require('echarts/lib/chart/line');
        var chartDom = document.getElementById(container_id);
        var myChart = echarts.init(chartDom);
        // var chartDom = document.getElementById('main');
        // var myChart = echarts.init(chartDom);
        var option;

        const symbolSize = 20;
        const data = [
            [0, -10],
            [1, -5],
            [2, 20],
            [3, 40],
            [4, 50]
        ];

        var data1 = [];
        option = {
            title: {
                text: 'Try Dragging these Points',
                left: 'center'
            },
            tooltip: {
                triggerOn: 'none',
                formatter: function (params) {
                    return (
                        'X: ' +
                        params.data[0].toFixed(2) +
                        '<br>Y: ' +
                        params.data[1].toFixed(2)
                    );
                }
            },
            grid: {
                top: '8%',
                bottom: '12%'
            },
            xAxis: {
                min: 0,
                max: 360,
                type: 'value',
                axisLine: { onZero: false }
            },
            yAxis: {
                min: 0,
                max: 1000,
                type: 'value',
                axisLine: { onZero: false }
            },
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'none'
                },
                {
                    type: 'slider',
                    yAxisIndex: 0,
                    filterMode: 'none'
                },
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    filterMode: 'none'
                },
                {
                    type: 'inside',
                    yAxisIndex: 0,
                    filterMode: 'none'
                }
            ],
            series: [
                
                {
                    id: 'b',
                    type: 'line',
                    smooth: true,
                    symbolSize: 0,
                    data: data1,
                    lineStyle: {
                        width: 1
                    }
                },{
                    id: 'a',
                
                    type: 'line',
                    smooth: true,
                    symbolSize: symbolSize,
                    data: data,
                    lineStyle: {
                        width: 0
                    }
                },
            ]
        };
        setTimeout(function () {
            // Add shadow circles (which is not visible) to enable drag.
            myChart.setOption({
                graphic: data.map(function (item, dataIndex) {
                    return {
                        type: 'circle',
                        position: myChart.convertToPixel('grid', item),
                        shape: {
                            cx: 0,
                            cy: 0,
                            r: symbolSize / 2
                        },
                        invisible: true,
                        draggable: true,
                        ondrag: function (dx, dy) {
                            onPointDragging(dataIndex, [this.x, this.y]);
                        },
                        ondragend: function (ev) {
                            //calc cubic line
                            var xs = [];
                            var ys = [];
                            data.forEach(item => {
                                xs.push(item[0]);
                                ys.push(item[1]);
                            });

                            var spline = new Spline(xs, ys);

                            data1.length = 0;
                            var _max = Math.max(...xs);
                            var _min = Math.min(...xs);
                            for (let i = _min; i < _max; i += 0.1) {

                                data1.push([i, spline.at(i)]);
                            }

                            myChart.setOption({
                                series: [

                                    {
                                        id: 'b',
                                        data: data1
                                    }
                                ]
                            });
                        },
                        onmousemove: function () {
                            showTooltip(dataIndex);
                        },
                        onmouseout: function () {
                            hideTooltip(dataIndex);
                        },
                        z: 100
                    };
                })
            });
        }, 0);



        window.addEventListener('resize', updatePosition);
        myChart.on('dataZoom', updatePosition);
        function updatePosition() {
            myChart.setOption({
                graphic: data.map(function (item, dataIndex) {
                    return {
                        position: myChart.convertToPixel('grid', item)
                    };
                })
            });
        }
        function showTooltip(dataIndex) {
            myChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: dataIndex
            });
        }
        function hideTooltip(dataIndex) {
            myChart.dispatchAction({
                type: 'hideTip'
            });
        }
        function onPointDragging(dataIndex, pos) {
            data[dataIndex] = myChart.convertFromPixel('grid', pos);






            // Update data
            myChart.setOption({
                series: [
                    {
                        id: 'a',
                        data: data
                    }
                   
                ]
            });
        }

        // setInterval(() => {

        //     //calc cubic line
        //     var xs = [];
        //     var ys = [];
        //     data.forEach(item => {
        //         xs.push(item[0]);
        //         ys.push(item[1]);
        //     });

        //     var spline = new Spline(xs, ys);

        //     data1.length = 0;
        //     var _max = Math.max(...xs);
        //     var _min = Math.min(...xs);
        //     for (let i = _min; i < _max; i += 0.1) {

        //         data1.push([i, spline.at(i)]);
        //     }

        //     myChart.setOption({
        //         series: [

        //             {
        //                 id: 'b',
        //                 data: data1
        //             }
        //         ]
        //     });
        // }, 1000);

        option && myChart.setOption(option);
    };
}