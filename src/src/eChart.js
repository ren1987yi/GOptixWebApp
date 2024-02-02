import * as echarts from 'echarts';
import * as Helper from './Helper.js';
import axios from 'axios';


class Configure {
    constructor() {
        this.background = '#ffffff';
        this.hasData = false;
        this.blob = undefined;
        this.chartid = undefined;
    }

    GetChartId= ()=>{
        if(this.chartid == undefined){
            return "";
        }else{
            return this.chartid;
        }
    };

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

    v = params.get('id');
    if (v != undefined) {
        config.chartid = v;
    }

}



function getData() {
    let action = 'init';
    let _url = './echarts/' + action + '?id=' + config.GetChartId();

    axios.post(_url, {}, {
        headers: { "Content-type": "application/json" },
    })
        .then(function (response) {
            console.log(response);
           
            onInitHandle(response);


            if (option != null) {
                updateData();
                setInterval(() => {
                   updateData();

                }, 3000);

            }


        })
        .catch(function (error) {
            console.log(error);
        });
}



function onInitHandle(response){
    try {

        // option = Helper.looseJsonParse(response.data);
        option = null;
        var _data = response.data;
        if(_data.Sucess){
            option = Helper.looseJsonParse(_data.Data);
        }

    } catch (error) {
        option = null;
    }

    option && myChart.setOption(option);

}

function updateData(){
    let action = 'update';
    let _url = './echarts/' + action + '?id=' + config.GetChartId();

    axios.post(_url, {}, {
        headers: { "Content-type": "application/json" },
    }).then(function (response) {
        try {
            option = null;
            var _data = response.data;
            if(_data.Sucess){
                option = Helper.looseJsonParse(_data.Data);
            }
            // option = JSON.parse(response.data);
            // option = Helper.looseJsonParse(response.data);
        } catch (error) {
            option = null;
        }
        option && myChart.setOption(option);

    }).catch(function (error) {
        console.log(error);
    });

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

            option = null;

            option && myChart.setOption(option);


            getData();


        } else {
            // if(!Helper.isNull(config.blob)){
            //     let blob = Helper.b64_to_utf8(config.blob);
            //     option = Helper.looseJsonParse(blob);
            //     option && myChart.setOption(option);
            // }

            option = Helper.base64_to_object(config.blob);
            option && myChart.setOption(option);
        }

        document.body.style.backgroundColor = config.background;

    };

    window.onresize = function () {
        myChart.resize()
    };




}