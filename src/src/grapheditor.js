// import 


import './litegraph.css';
import './litegraph-editor.css';


import DefaultGraph from './default_graph.json';
import axios from 'axios';

// import printMe from './print.js';

import { LGraph, LGraphCanvas, LiteGraph } from 'litegraph.js';
import LiteGraphEditor from './litegraph_editor.js';


import { MyAddNode } from './CustomNodes/MyAddNode.js';


import * as FlowNodes from './CustomNodes/FlowModules.js'

class GraphInfo {
	constructor() {
		this.name = "";
		this.dataJson = null;

	}
}

export default class GraphEditor {
	constructor(id, nodes, server) {

		require('./editor.css');
		require('./litegraph.css');
		require('./litegraph-editor.css');

		this.server = server;
		var editor = this.editor = new LiteGraphEditor(id, { miniwindow: false });
		window.graphcanvas = editor.graphcanvas;
		window.graph = editor.graph;

		// this.httpRequest = new XMLHttpRequest();
		// this.httpRequest.onreadystatechange = () => { this.onReadyStateChangeHandle(this.httpRequest) };

		editor.onLoadHandle = (e) => { this.onLoadHandle(this); };
		editor.onSaveHandle = (e) => { this.onSaveHandle(this); };

		this.curGraph = new GraphInfo();


		this.updateEditorHiPPICanvas();

		this.registerNodes(nodes);



	}

	registerNodes = function (nodes) {
		nodes.forEach(nodeType => {
			LiteGraph.registerNodeType(nodeType.type, nodeType);
		});
	};

	onLoadHandle = function (owner) {
		var that = owner;
		var _url = that.server + '/load';
		if (that.curGraph.name != undefined) {
			var data = {
				name: that.curGraph.name
			}




			axios.post(_url, data, {
				headers: { "Content-type": "application/json" },
				})
				.then(function (response) {
					console.log(response);
				})
				.catch(function (error) {
					console.log(error);
				});

		}


		// that.httpRequest.open("POST", that.server + "/load", true);
		// that.httpRequest.setRequestHeader("Content-type", "application/json");
		// if(that.curGraph.name != undefined){
		// 	var data = {
		// 		name:that.curGraph.name
		// 	}
		// 	var json = JSON.stringify(data);
		// 	that.httpRequest.send(json);
		// }

	};


	getGraphByName = function (name) {
		var _url = this.server + '/load';
		if (name != undefined) {
			var data = {
				name: name
			}


			let that = this;
			axios.post(_url, data, {
				headers: { "Content-type": "application/json" },
				})
				.then(function (response) {
					console.log(response);
					var obj = response.data;
					if (obj != undefined) {

						that.curGraph.name = obj.name;
						that.loadGraph(obj.dataJson);
					}
				})
				.catch(function (error) {
					console.log(error);
				});

		}


		// this.httpRequest.open("POST", this.server + "/load", true);
		// this.httpRequest.setRequestHeader("Content-type", "application/json");
		// var data = {
		// 	name: name
		// };
		// var json = JSON.stringify(data);
		// this.httpRequest.send(json);
	}

	onSaveHandle = function (owner) {
		var that = owner;
		var graphData = that.editor.graph.serialize();

		var info = new GraphInfo();
		info.name = that.curGraph.name;
		info.dataJson = JSON.stringify(graphData);

		console.log(info);
		var _url = that.server + '/save';
		axios.post(_url, info, {
			headers: { "Content-type": "application/json" },
			})
			.then(function (response) {
				console.log(response);
			
			})
			.catch(function (error) {
				console.log(error);
			});


		// var json = JSON.stringify(info);


		// that.httpRequest.open("POST", that.server + "/save", true);
		// that.httpRequest.setRequestHeader("Content-type", "application/json");
		// that.httpRequest.send(json);

	}


	onReadyStateChangeHandle = function (httpRequest) {

		return;

		if (httpRequest.readyState == 4) {
			var url = new URL(httpRequest.responseURL);
			var pathname = url.pathname;
			var method = pathname.split('/').at(-1);
			//再判断状态码是否为200【200是成功的】
			if (httpRequest.status == 200) {
				switch (method) {
					case 'load':
						var text = httpRequest.responseText;
						console.log(text);
						var obj = JSON.parse(text);
						if (obj != undefined) {

							this.curGraph.name = obj.name;
							this.loadGraph(obj.dataJson);
						}

						break;
					case 'save':
						var text = httpRequest.responseText;
						console.log(text);
						break;
				}
				//得到服务端返回的文本数据

				//把服务端返回的数据写在div上
				// var div = document.getElementById("result");
				// div.innerText = text;
			} else {



				if (method == 'load') {
					let data = httpRequest.responseText;

					this.loadGraph(data);

				}
			}



		}
	}


	loadGraph(data) {
		this.editor.graph.clear();
		var obj = null;
		if (data == undefined || data == "") {
			obj = DefaultGraph;
			// data = '{"last_node_id":7,"last_link_id":2,"nodes":[{"id":1,"type":"basic/const","pos":[200,200],"size":[180,30],"flags":{},"order":0,"mode":0,"outputs":[{"name":"value","type":"number","links":[1],"label":"4.500"}],"properties":{"value":4.5}},{"id":2,"type":"basic/watch","pos":[700,200],"size":{"0":140,"1":26},"flags":{},"order":3,"mode":0,"inputs":[{"name":"value","type":0,"link":1,"label":"0.000"}],"properties":{}},{"id":5,"type":"flow/Start","pos":[215,468],"size":{"0":140,"1":26},"flags":{},"order":1,"mode":0,"outputs":[{"name":"","type":-1,"links":[2],"slot_index":0}],"properties":{}},{"id":6,"type":"flow/End","pos":[925,416],"size":{"0":140,"1":26},"flags":{},"order":4,"mode":0,"inputs":[{"name":"","type":-1,"link":2}],"properties":{}},{"id":7,"type":"flow/Parallel","pos":[974,-66],"size":{"0":210,"1":178},"flags":{},"order":2,"mode":0,"inputs":[{"name":"event","type":-1,"link":null}],"outputs":[{"name":"","type":-1,"links":null},{"name":"","type":-1,"links":null},{"name":"","type":-1,"links":null},{"name":"","type":-1,"links":null},{"name":"","type":-1,"links":null},{"name":"","type":-1,"links":null},{"name":"","type":-1,"links":null}],"properties":{}}],"links":[[1,1,0,2,0,"number"],[2,5,0,6,0,-1]],"groups":[],"config":{},"extra":{},"version":0.4}';
		} else {
			try {

				obj = JSON.parse(data);
			} catch (error) {
				console.log(error);
				obj = DefaultGraph;
			}
		}
		// 	var node_const = LiteGraph.createNode("basic/const");
		// 	node_const.pos = [200, 200];
		// 	graph.add(node_const);
		// 	node_const.setValue(4.5);

		// 	var node_watch = LiteGraph.createNode("basic/watch");
		// 	node_watch.pos = [700, 200];
		// 	graph.add(node_watch);

		// 	node_const.connect(0, node_watch, 0);


		// 	var node_sum = LiteGraph.createNode("diy/sum");
		// 	node_sum.pos = [700, 400];
		// 	graph.add(node_sum);

		// 	var a = LiteGraph.createNode("flow/Exec");
		// 	a.pos = [700, 400];
		// 	graph.add(a);
		// }else{
		// 	var obj = JSON.parse(data);
		// }


		// var obj = JSON.parse(data);
		if (obj != null) {
			this.editor.graph.configure(obj, false);

		}


	}



	updateEditorHiPPICanvas = function () {
		const ratio = window.devicePixelRatio;
		if (ratio == 1) { return }
		const rect = editor.canvas.parentNode.getBoundingClientRect();
		const { width, height } = rect;
		editor.canvas.width = width * ratio;
		editor.canvas.height = height * ratio;
		editor.canvas.style.width = width + "px";
		editor.canvas.style.height = height + "px";
		editor.canvas.getContext("2d").scale(ratio, ratio);
		return editor.canvas;
	}

}



export function InitGraphEditor(container_id) {

	var nodes = [MyAddNode
		, FlowNodes.ExecModule
		, FlowNodes.Eval
		, FlowNodes.Move
		, FlowNodes.Delay
		, FlowNodes.DelayWithCondition
		, FlowNodes.Watch
		, FlowNodes.Branch
		, FlowNodes.Parallel
		, FlowNodes.WaitAll
		, FlowNodes.WaitAny
		, FlowNodes.Variable
		, FlowNodes.Start
		, FlowNodes.End
		, FlowNodes.Number
	];





	// FlowNodes.forEach(nodeItem => {
	// 	nodes.push(nodeItem);
	// });
	// const editor = new GraphEditor('main',[MyAddNode,FlowNodes.ExecModule]);

	var url = new URL(window.location.href);
	var paths = url.pathname.split('/');
	var roots = [];

	for (let i = 0; i < paths.length - 1; i++) {

		roots.push(paths[i]);
	}

	var root = roots.join('/');

	const editor = new GraphEditor(container_id, nodes, root);

	var name = url.searchParams.get('name');
	if (name != undefined) {

		editor.getGraphByName(name);
	}

}