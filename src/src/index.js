import _, { forEach } from 'lodash';
import './style.css';
var $ = require("jquery");

import { GraphEditor, InitGraphEditor } from './grapheditor.js';

// import { InitExcel } from './excel.js';
import { InitEditor } from './codeeditor.js';
import { InitThree3D } from './three3d.js';
import { InitApex } from './apexChart.js';
import { InitEChart } from './eChart.js';
import { InitCubic } from './cubic.js';

function component() {
	const element = document.createElement('div');
	element.id = 'main';
	return element;
}



function printInfo() {
	var divMain = document.getElementById('main');
	var contents = [
		" page=grapheditor is a grapheditor",
		" page=monaco is a code editor like vs",
	];
	contents.forEach(content => {
		var p = document.createElement('p');
		p.textContent = content;

		divMain.appendChild(p);

		var bbr = document.createElement('br');
		divMain.appendChild(bbr);
	});
}


var url = new URL(window.location.href);

var params = url.searchParams;
var page = params.get('page');

if (page == undefined) {

	printInfo();



} else {

	switch (page.toLowerCase()) {
		case 'cubic':
		

			require('./eChart.css');
			var div = document.createElement('div');
			div.id = 'chart';
			
			document.body.appendChild(div);
			InitCubic('chart');
			break;
		case 'grapheditor':
			document.body.appendChild(component());
			InitGraphEditor('main');
			break;
		// case 'excel':
		// 	// InitExcel('main');
		// 	break;
		case 'monaco':
			document.body.appendChild(component());
			InitEditor('main');
			break;
		case 'three':


			InitThree3D();
			document.body.style.overflow = 'hidden';
			break;
		case 'apex':
			var div = document.createElement('div');
			div.id = 'chart';
			div.style.height = '100vh';
			// div.style.width = '100vw';
			div.style.minHeight = '100vh';
			document.body.appendChild(div);
			InitApex('chart');

			document.body.style.overflow = 'hidden';
			document.body.style.width = '100%';
			document.body.style.height = '100%';


			break;
			case 'echart':
				require('./eChart.css');
			var div = document.createElement('div');
			div.id = 'chart';
			
			document.body.appendChild(div);
			InitEChart('chart');

		


			break;
		default:
			printInfo();
			break;
	}

	//initGraph();
}


