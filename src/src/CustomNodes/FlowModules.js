import { LiteGraph } from "litegraph.js";


export class Start {
	static title = "Start";
	static type = 'flow/Start';



	constructor() {

		
		this.addOutput("", LiteGraph.EVENT);
		
		
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};


}


export class End {
	static title = "End";
	static type = 'flow/End';



	constructor() {

		
		this.addInput("", LiteGraph.EVENT);
		
		
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};


}




export class Number {
	static title = "Number";
	static type = 'flow/Number';
	constructor() {

		
		this.addOutput("value", "number");
        this.addProperty("value", 1.0);
        this.widget = this.addWidget("number","value",1,"value");
        this.widgets_up = true;
        this.size = [180, 30];
	
	
		
	};
	
	getTitle = function() {
        if (this.flags.collapsed) {
            return this.properties.value;
        }
        return this.title;
    };

	
	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};
	setValue = function(v)
	{
		this.setProperty("value",v);
	};
}



export class Variable {
	static title = "Variable";
	static type = 'flow/Variable';



	constructor() {
		this.addOutput("name", "number");
        this.addProperty("name", '');
        this.widget = this.addWidget("string","name",'',"name");
        this.widgets_up = true;
        this.size = [180, 30];
		
		// this.optSlot = this.addOutput("", 'string');
		
		// this.properties = {name:''};


	};
	getTitle = function() {
        if (this.flags.collapsed) {
            return this.properties.name;
        }
        return this.title;
    };
	// setValue = function(v)
	// {
	// 	this.setProperty("name",v);
	// }
	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};
	setValue = function(v)
	{
		this.setProperty("name",v);
	};



	

}


export class Delay {
	static title = "Delay";
	static type = 'flow/Delay';
	constructor() {

		this.addInput("event", LiteGraph.EVENT);
		this.slotDelay = this.addInput("delay(MS)", 'number');
		this.addOutput("done", LiteGraph.EVENT);
		
		this.properties = { delayMS:0 };
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};


	
	onPropertyChanged = function(name,v){
		// this.graph.renameOutput( this.name_in_graph, v );
		
		// if(name == 'name'){
		// 	this.optSlot.name = v;
		// }
		this.slotDelay.name = "delay(MS):" + v.toString();
	}


}


export class DelayWithCondition {
	static title = "DelayCond";
	static type = 'flow/DelayWithCondition';
	constructor() {

		this.addInput("event", LiteGraph.EVENT);
		this.addInput("delayMS", 'number');
		
		this.addOutput("done", LiteGraph.EVENT);
		this.properties = { delayMS:0,cond: '' };
		
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};

}

export class Watch {
	static title = "Watch";
	static type = 'flow/Watch';
	constructor() {

		this.addInput("event", LiteGraph.EVENT);
		this.addInput("delayMS", 'number');
		this.addInput("timeoutMS", 'number');
		
		this.addOutput("done", LiteGraph.EVENT);
		this.addOutput("fault", LiteGraph.EVENT);
		this.properties = {cond: '', delayMS:0,timeoutMS:0, };
		
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};

}


export class Branch {
	static title = "Brach";
	static type = 'flow/Bracnch';
	constructor() {


        this.addInput("event", LiteGraph.ACTION);
        this.addInput("condition", "boolean");
        this.addOutput("true", LiteGraph.EVENT);
        this.addOutput("false", LiteGraph.EVENT);

		
		this.properties = {cond: '' };
		
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};

}


export class Parallel {
	static title = "Parallel";
	static type = 'flow/Parallel';
	constructor() {


        this.addInput("event", LiteGraph.EVENT);
		this.addOutput("", LiteGraph.EVENT);
        var that = this;
		this.addWidget("button","+",null,function(){
	        that.addOutput("", LiteGraph.EVENT);
        });
		
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};

}

export class WaitAll {
	static title = "WaitAll";
	static type = 'flow/WaitAll';
	constructor() {


        this.addInput("", LiteGraph.EVENT);
		this.addOutput("done", LiteGraph.EVENT);
        var that = this;
		this.addWidget("button","+",null,function(){
	        that.addInput("", LiteGraph.EVENT);
        });
		
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};

}

export class WaitAny {
	static title = "WaitAny";
	static type = 'flow/WaitAny';
	constructor() {


        this.addInput("", LiteGraph.EVENT);
		this.addOutput("done", LiteGraph.EVENT);
        var that = this;
		this.addWidget("button","+",null,function(){
	        that.addInput("", LiteGraph.EVENT);
        });
		
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};

}











export class ExecModule {
	static title = "Exec";
	static type = 'flow/Exec';
	constructor() {

		this.addInput("event", LiteGraph.EVENT);
		
		this.addOutput("done", LiteGraph.EVENT);
		this.addOutput("err", LiteGraph.EVENT);
		// this.properties = { precision: 1 };
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};

}



export class Move {
	static title = "Move";
	static type = 'flow/Move';
	constructor() {

		this.addInput("event", LiteGraph.EVENT);
		this.addInput("in", "number");
		
		this.addOutput("done", LiteGraph.EVENT);
		this.addOutput("out", "number");
		
		// this.properties = { precision: 1 };
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};

}


export class Eval {
	static title = "Eval";
	static type = 'flow/Eval';
	constructor() {

		this.addInput("event", LiteGraph.EVENT);
		
		
		this.addOutput("done", LiteGraph.EVENT);
		this.addOutput("out", "number");
		
		this.properties = { exp: '' };
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};

}


export class Alarm{
	static title = "Alarm";
	static type = 'flow/Alarm';
	constructor() {

		this.addInput("event", LiteGraph.EVENT);
		
		
		// this.addOutput("done", LiteGraph.EVENT);
		// this.addOutput("message", "string");
		this.properties = {
			message:'',
			severity:0
		}
		
		
	};


	onExecute = function () {
		// var A = this.getInputData(0);
		// if (A === undefined)
		// 	A = 0;
		// var B = this.getInputData(1);
		// if (B === undefined)
		// 	B = 0;
		// this.setOutputData(0, A + B);
	};
}




