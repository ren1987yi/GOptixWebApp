


import './luckysheet/plugins/css/pluginsCss.css';
import './luckysheet/plugins/plugins.css';
import './luckysheet/css/luckysheet.css';
import './luckysheet/assets/iconfont/iconfont.css';

// import './luckysheet/plugins/js/plugin.js';

import './luckysheet/luckysheet.umd.js';

import './luckysheet/luckyexcel/luckyexcel.umd.js';




export function InitExcel(container_id){
 var html ='<div id="luckysheet" style="margin:0px;padding:0px;position:absolute;width:100%;left: 0px;top: 0px;bottom: 0px;outline: none;"></div>';
    var div = document.getElementById(container_id);
    div.innerHTML = html;
}