import * as echarts from 'echarts';

import * as Helper from './Helper.js';


class Configure {
    constructor() {
        this.background = '#ffffff';
        this.hasData = false;
        this.blob = undefined;
    }
}

var myChart;
var option;
var config = new Configure();

function FillConfigWithQuery() {
    let url = new URL(window.location.href);

    let params = url.searchParams;

    let v = params.get('bg');
    if (v != undefined) {
        config.background = '#' + v;
    }

    v = params.get('blob');
    if (v != undefined) {
        config.hasData = true;
        config.blob = v;
    } else {
        config.hasData = false;
    }

}


export function InitEChart(container_id) {

    window.onload = function () {


        var chartDom = document.getElementById(container_id);
        myChart = echarts.init(chartDom);

        FillConfigWithQuery();

        if (!config.hasData) {



            option = {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [150, 230, 224, 218, 135, 147, 260],
                        type: 'line'
                    }
                ]
            };

            option && myChart.setOption(option);
        }else{
            if(!Helper.isNull(config.blob)){
                let blob = Helper.b64_to_utf8(config.blob);
                option = Helper.looseJsonParse(blob);
                option && myChart.setOption(option);
            }
        }

        document.body.style.backgroundColor = config.background;

    };

    window.onresize = function () {
        myChart.resize()
    };

}