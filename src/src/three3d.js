// 'use strict';

import * as THREE from 'three';
import axios from 'axios';
// var THREE = require('three');

import { GLTFLoader } from './threejs/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './threejs/jsm/loaders/DRACOLoader.js';
import { FBXLoader } from './threejs/jsm/loaders/FBXLoader.js';
import { OrbitControls } from './threejs/jsm/controls/OrbitControls.js';
import { EffectComposer } from './threejs/jsm/postprocessing/EffectComposer.js';
// 引入渲染器通道RenderPass
import { RenderPass } from './threejs/jsm/postprocessing/RenderPass.js';
// 引入OutlinePass通道
import { OutlinePass } from './threejs/jsm/postprocessing/OutlinePass.js';

import { ShaderPass } from "./threejs/jsm/postprocessing/ShaderPass.js"
import { FXAAShader } from "./threejs/jsm/shaders/FXAAShader.js"
import Stats from './threejs/jsm/libs/stats.module.js';

var camera;//相机
var scene;
var renderer;
var control;
var model;
var composer, renderPass, outlinePass;
var canvas;
const stats = new Stats();

class PickHelper {
	constructor() {
		this.raycaster = new THREE.Raycaster();
		this.pickedObject = null;
		this.pickedObjectSavedColor = 0;

		this.time = 0;
		// setInterval(()=>{
		// 	if(this.pickedObject != undefined){
		// 		this.pickedObject.material.emissive.setHex((this.time ) % 2 >= 1 ? 0xFFFF00 : 0xFF0000);
		// 	}
		// 	this.time ++;
		// 	if(this.time > 100){
		// 		this.time = 0;
		// 	}

		// },1000);
	}
	pick(scene, canvas, camera, time, event) {
		// 恢复上一个被拾取对象的颜色

		if (this.pickedObject) {
			// this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
			this.pickedObject = undefined;

		}

		var width = canvas.width;
		var height = canvas.height;

		// .offsetY、.offsetX以canvas画布左上角为坐标原点,单位px
		const px = event.offsetX;
		const py = event.offsetY;
		//屏幕坐标px、py转WebGL标准设备坐标x、y
		//width、height表示canvas画布宽高度
		const x = (px / width) * 2 - 1;
		const y = -(py / height) * 2 + 1;
		//创建一个射线投射器`Raycaster`
		const raycaster = new THREE.Raycaster();
		//.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
		// 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
		raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

		var objs = [];
		// model.traverse(function (obj) {
		scene.traverse(function (obj) {
			objs.push(obj);
		});


		const intersects = raycaster.intersectObjects(objs);
		//console.log("射线器返回的对象", intersects);
		// intersects.length大于0说明，说明选中了模型
		if (intersects.length > 0) {

			//RenderSelectedObject();
			//selectedObject.object = intersects[0];
			//selectedObject.oldcolor = intersects[0].object.material.color.clone();
			// 选中模型的第一个模型，设置为红色
			//selectedObject.object.object.material.color.set(selectedColor);
			// 通过.ancestors属性判断那个模型对象被选中了
			//outlinePass.selectedObjects = [intersects[0].object.ancestors];
			console.log("select Object:");
			console.log(intersects[0]);

			var data = {
				type: "SelectObject",
				args: [intersects[0].object.name],
				ui: cfgOption.ui
			};

			axios.post(cfgOption.serverurl, data, {
				headers: { "Content-type": "application/json" },
			})
				.then(function (response) {
					console.log(response);
				})
				.catch(function (error) {
					console.log(error);
				});


			this.pickedObject = intersects[0].object;
			// // 保存它的颜色
			// this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
			// // 设置它的发光为 黄色/红色闪烁
			// this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);

			// outlinePass.selectedObjects = this.pickedObject;



		} else {
			//RenderSelectedObject();
			//selectedObject.object = undefined;
		}

		if (this.pickedObject != undefined) {
			SetupEffect(width, height, [this.pickedObject]);

		} else {
			SetupEffect(width, height, []);
		}
	}
}




const pickPosition = { x: 0, y: 0 };
const pickHelper = new PickHelper();


var cfgOption = {
	fullscreen: true,
	modelscale: [1, 1, 1],
	background: 0x000000,
	serverurl: "./common_api",
	// postSelObject: "./selectObject",
	// postSyncState: "./syncState",
	modelurl: "factory5.fbx",
	ui: "",
	autoRotate: false,
};

var light = {
	ambient: null,
	directional: null,
	hemi: null
};

const VECTOR_X = new THREE.Vector3(1, 0, 0);
const VECTOR_Y = new THREE.Vector3(0, 1, 0);
const VECTOR_Z = new THREE.Vector3(0, 0, 1);

function SetupScene(option) {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);
	if (option != undefined) {
		if (option.background != undefined) {
			scene.background = new THREE.Color(parseInt(option.background));

		}
	}
	scene.fog = new THREE.Fog(0x000000, 10, 500);
}

function SetupLight() {



	var dirLight = new THREE.DirectionalLight(0xffffff);
	dirLight.position.set(- 3, 10, - 10);
	dirLight.castShadow = true;
	dirLight.shadow.camera.top = 2;
	dirLight.shadow.camera.bottom = - 2;
	dirLight.shadow.camera.left = - 2;
	dirLight.shadow.camera.right = 2;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 40;

	light.directional = dirLight;



	var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
	hemiLight.position.set(0, 20, 0);
	scene.add(hemiLight);

	light.hemi = hemiLight;

	scene.add(light.hemi);
	scene.add(light.directional);
}

function SetupRender(width, height) {
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(width, height);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	//remove web browser scroll bar
	renderer.domElement.style.display = 'block';
	renderer.domElement.style.outline = 'none';



	//return;
	renderer.domElement.addEventListener('click', function (event) {


		pickHelper.pick(model, canvas, camera, 1, event);
		return;


	});

}








function SetupEffect(width, height, objs) {
	// 创建后处理对象EffectComposer，WebGL渲染器作为参数
	composer = new EffectComposer(renderer);
	renderPass = new RenderPass(scene, camera);
	composer.addPass(renderPass);

	// 创建OutlinePass通道
	const v2 = new THREE.Vector2(width, height);
	outlinePass = new OutlinePass(v2, scene, camera);
	outlinePass.selectedObjects = objs;
	outlinePass.edgeStrength = 10.0 // 边框的亮度
	outlinePass.edgeGlow = 1.1// 光晕[0,1]
	outlinePass.usePatternTexture = false // 是否使用父级的材质
	outlinePass.edgeThickness = 1.0 // 边框宽度
	outlinePass.downSampleRatio = 1 // 边框弯曲度
	outlinePass.pulsePeriod = 5 // 呼吸闪烁的速度
	outlinePass.visibleEdgeColor.set(parseInt(0x00ffff)) // 呼吸显示的颜色
	outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0) // 呼吸消失的颜色

	outlinePass.clear = true

	composer.addPass(outlinePass);

	var effectFXAA = new ShaderPass(FXAAShader)
	effectFXAA.uniforms.resolution.value.set(1 / width, 1 / height)
	effectFXAA.renderToScreen = true
	composer.addPass(effectFXAA)


}

function SetupCamera(width, height, pos, lookat) {
	camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 3000);

	camera.position.set(pos.x, pos.y, pos.z);
	//camera.lookat.set(lookat.x,lookat.y,lookat.z);
	//camera.lookat.set(lookat.x,lookat.y,lookat.z);
}

function Init(option) {
	cfgOption = Object.assign(cfgOption, option);

	var width = window.innerWidth;
	var height = window.innerHeight;
	var id = "webgl";
	var modelurl = undefined;


	if (cfgOption != undefined) {
		if (!cfgOption.fullscreen) {
			width = cfgOption.width;
			height = cfgOption.height;
		}
		id = option.id;
		modelurl = option.modelurl;
	}



	SetupScene(option);
	SetupRender(width, height);

	var container = document.getElementById(id);
	if (container == undefined) {
		document.body.appendChild(renderer.domElement);
		document.body.appendChild(stats.domElement);
	} else {

		container.appendChild(renderer.domElement);
		container.appendChild(stats.domElement);
	}


	canvas = renderer.domElement;
	SetupCamera(width, height, new THREE.Vector3(5, 2, 8), new THREE.Vector3(0, 0, 0));
	SetupControl();


	// SetupEffect(width, height);
	SetupLight();
	//LoadGround();

	if (modelurl != undefined) {
		model = LoadModel(modelurl, option);
	} else {
		model = createTestMesh();
		let group = new THREE.Group();
		LoadedModel(group, model);
	}

	//load model 所有的userData把绑定的变量列出来
	scene.add(model);
	// if (model != undefined) {

	// } else {

	// 	scene.add(createTestMesh());
	// }

	// var xx = 0;
	function animate() {
		stats.update();
		renderer.render(scene, camera);

		control.update();
		requestAnimationFrame(animate);

		if (pickHelper.pickedObject != undefined) {


			if (composer) {
				composer.render();
			}
		}
	}





	animate();
	//animate2();


	// if (!nIntervId_SyncState) {

	//     nIntervId_SyncState = setInterval(() => {
	//         req_PostSyncState.open("POST", cfgOption.serverurl, true);
	//         req_PostSyncState.setRequestHeader("Content-type", "application/json");
	//         var data = {
	//             type:"SyncState",
	//             ui:cfgOption.ui
	//         };

	//         req_PostSyncState.send(JSON.stringify(data));


	//     }
	//         , 3000
	//     );
	// }

}

function SetupControl() {

	control = new OrbitControls(camera, renderer.domElement);
	control.enableDamping = true;
	control.enablePan = false;
	control.autoRotate = cfgOption.autoRotate;//自动旋转
	control.autoRotateSpeed = 1;
	control.minPolarAngle = Math.PI / 4;
	control.maxPolarAngle = Math.PI / 2;
	control.update();

}

//获取URL的后缀
function GetUrlExt(url) {
	return url.substring(url.lastIndexOf(".") + 1);
}
function LoadModel(url, option) {
	var ext = GetUrlExt(url).toLowerCase();

	switch (ext) {
		case "glb":
		case "gltf":
			return LoadGLTF(url, option);
			break;
		case "fbx":
			return LoadFBX(url, option);
			break;
	}
}





function LoadGLTF(url, option) {
	var group = new THREE.Group();

	var dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath('./threejs/jsm/libs/draco/gltf/');

	var loader = new GLTFLoader();
	loader.setDRACOLoader(dracoLoader);


	loader.load(url, function (gltf) {

		var m = gltf.scene;
		LoadedModel(group, m);
		// // var m = object;
		// console.log("模型", m);
		// var sx = cfgOption.modelscale[0];
		// var sy = cfgOption.modelscale[1];
		// var sz = cfgOption.modelscale[2];

		// m.scale.set(sx, sy, sz);

		// var box3 = new THREE.Box3();
		// box3.expandByObject(m);
		// console.log('包围盒', box3);

		// var center = new THREE.Vector3();
		// center.addVectors(box3.max, box3.min);

		// m.position.set(-center.x / 2, -center.y / 2, -center.z / 2);

		// // m.position.set(0,0,0);

		// CollectModelUserData(m);

		// group.add(m);
		// if (option.wireframe) {

		// 	edgeGeometryWireframe(m, true);
		// 	lineGroup.scale.set(sx, sy, sz);
		// }


	}
		, undefined
		, function (error) {

			console.error("加载模型错误", error);
		}

	);
	group.visible = true;


	return group;
}




function LoadFBX(url, option) {
	var group = new THREE.Group();



	var loader = new FBXLoader();

	loader.load(url, function (object) {
		LoadedModel(group, object);

		// document.getElementById("container").style.display = 'none';
	}
		, function (xhr) {
			// var percent = xhr.loaded / xhr.total;
			// percentDiv.style.width = percent * 400 + "px"; //进度条元素长度
			// percentDiv.style.textIndent = percent * 400 + 5 + "px"; //缩进元素中的首行文本
			// // Math.floor:小数加载进度取整
			// percentDiv.innerHTML = Math.floor(percent * 100) + '%'; //进度百分比
		}
		, function (error) {

			console.error("加载模型错误", error);
		}

	);


	group.visible = true;


	return group;
}



function LoadedModel(group, object) {
	var m = object;
	console.log("模型", m);
	var sx = cfgOption.modelscale[0];
	var sy = cfgOption.modelscale[1];
	var sz = cfgOption.modelscale[2];

	m.scale.set(sx, sy, sz);

	var box3 = new THREE.Box3();
	box3.expandByObject(m);
	console.log('包围盒', box3);

	var center = new THREE.Vector3();
	center.addVectors(box3.max, box3.min);

	m.position.set(-center.x / 2, -center.y / 2, -center.z / 2);

	// m.position.set(0,0,0);

	CollectModelUserData(m);
	group.add(m);
	if (cfgOption.wireframe) {

		edgeGeometryWireframe(m, true);
		lineGroup.scale.set(sx, sy, sz);
	}

}


// EdgesGeometry线框1
var lineGroup = null;


//线框模式 线的材质
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1E90FF });
//线框模式 面的材质
const faceMaterial = new THREE.MeshBasicMaterial({
	color: 0x1E90FF,
	side: THREE.DoubleSide,
	transparent: true, // 设置为true，opacity才会生效
	opacity: 0.1,
	depthWrite: false, // 不遮挡后面的模型
	// depthWrite: false // 关闭深度测试
});
function edgeGeometryWireframe(model, isShow) {
	//要按model 结构
	if (model) {
		if (!lineGroup) {
			lineGroup = new THREE.Group();

			enumAddWireframe(model, lineGroup);

			scene.add(lineGroup);
		}
		// model.visible = !isShow;

		lineGroup.rotation.x = model.rotation.x;
		lineGroup.rotation.y = model.rotation.y;
		lineGroup.rotation.z = model.rotation.z;
		lineGroup.position.x = model.position.x;
		lineGroup.position.y = model.position.y;
		lineGroup.position.z = model.position.z;

		lineGroup.visible = isShow;
	}

}


function enumAddWireframe(modelgroup, linegroup) {
	(modelgroup.children).forEach(child => {
		var lineS = buildWireframe(child);
		if (lineS) {

			linegroup.add(lineS);
			enumAddWireframe(child, lineS);
		} else {
			var gg = new THREE.Group();
			gg.position.x = child.position.x;
			gg.position.y = child.position.y;
			gg.position.z = child.position.z;
			gg.rotation.x = child.rotation.x;
			gg.rotation.y = child.rotation.y;
			gg.rotation.z = child.rotation.z;
			linegroup.add(gg);
			enumAddWireframe(child, gg);
		}
	});
}



function buildWireframe(obj, parent) {
	if (obj.isMesh) {
		let edges = new THREE.EdgesGeometry(obj.geometry);
		let lineS = new THREE.LineSegments(edges, lineMaterial);
		lineS.position.x = obj.position.x;
		lineS.position.y = obj.position.y;
		lineS.position.z = obj.position.z;
		lineS.rotation.x = obj.rotation.x;
		lineS.rotation.y = obj.rotation.y;
		lineS.rotation.z = obj.rotation.z;

		obj.material = faceMaterial;

		return lineS;
	} else {
		return null;
	}
}






/**
 * 已经绑定的动画属性和optix变量
 */
var bindObjects = [];

const CUSTOME_PROPERTY_FIX = 'optix_';

/**
 * 搜集模型内 userData中，定义的optix交互属性
 * @param {THREE.Mesh} model 
 */
function CollectModelUserData(model) {
	bindObjects = [];
	console.log(model.name);

	function _collect(root) {
		if (root.userData != undefined) {
			Object.keys(root.userData).forEach((key) => {

				if (key.toLowerCase().startsWith(CUSTOME_PROPERTY_FIX)) {
					console.log(key + ":" + root.userData[key]);
					var _key = key.substring(6);
					var b = new ObjectPropetyBind(root, _key, root.userData[key]);
					bindObjects.push(b);
				}
			});
		}
		root.children.forEach(child => {
			_collect(child);
		});
	}

	model.children.forEach(child => {
		_collect(child);
	});

}



class ObjectPropetyBind {
	constructor(model, property_name, property_value) {
		this.model = model;
		this.name = property_name;
		this.value = property_value;
	}
}





function createTestMesh() {
	var group = new THREE.Group();

	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			for (let z = 0; z < 10; z++) {

				var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
				var material = new THREE.MeshNormalMaterial();

				var mesh = new THREE.Mesh(geometry, material);
				// mesh.position = new THREE.Vector3(x,y,0);
				mesh.translateX(x);
				mesh.translateZ(y);
				mesh.translateY(z);

				group.add(mesh);
			}
		}
	}


	return group;
}


export function InitThree3D() {
	require('./three3d.css');
	let url = new URL(window.location.href);

	let params = url.searchParams;
	let option = {};
	let val = params.get('model');
	if (val != undefined) {
		option.modelurl = val;
	} else {
		option.modelurl = 'http://127.0.0.1/three3d/assert/models/box_4.glb';
		// option.modelurl = 'http://127.0.0.1/three3d/assert/models/t1.fbx';
		// option.modelurl = undefined;
	}
	val = params.get('scale');
	if (val != undefined) {
		var fscale = parseFloat(val);
		if (!isNaN(fscale)) {
			option.modelscale = [fscale, fscale, fscale];
		}
	}
	val = params.get('wire');
	if (val != undefined) {
		option.wireframe = val.toLowerCase() == "true" || val.toLowerCase() == "1";
	} else {
		option.wireframe = false;
	}

	val = params.get('bg');
	if (val != undefined) {
		option.background = '0x' + val;
	}

	val = params.get('ui');
	if (val != undefined) {
		option.ui = val;
	}

	Init(option);
	// document.body.style.cssText += 'overflow: hidden;';
	// animate();

	windowResize();
	window.onresize = function () { windowResize(); };
}


function windowResize() {
	var width = window.innerWidth;
	var height = window.innerHeight;

	if (cfgOption != undefined) {
		if (!cfgOption.fullscreen) {
			width = cfgOption.width;
			height = cfgOption.height;
		}
	}

	// 重置渲染器输出画布canvas尺寸
	renderer.setSize(width, height);
	// 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
	camera.aspect = width / height;
	// 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
	// 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
	// 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
	camera.updateProjectionMatrix();
};