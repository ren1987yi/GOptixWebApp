import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// var require = { paths: { vs: 'monaco-editor/min/vs' } };
var editor;


export function InitEditor(container_id) {
    var html = '<div id="monaco" style="width: 100%; height: 100%; min-height:100%;min-width:100%;  border: 1px solid grey"></div>';
    var div = document.getElementById(container_id);
    div.innerHTML = html;


    editor = monaco.editor.create(document.getElementById("monaco"), {
        value: `console.log("hello,world")`,
        language: "javascript"

    });



    window.onresize = () => {
        var _editor = editor.getElementsByClassName('monaco-editor');

        _editor.heigth = window.innerHeight;
        _editor.window = window.innerWidth;

    };

}



