"use strict";
var __webpack_modules__ = {
    "indent-string": function(module) {
        module.exports = import("../node_modules/indent-string/index.js");
    }
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
        exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
}
(()=>{
    __webpack_require__.d = function(exports1, definition) {
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };
})();
(()=>{
    __webpack_require__.r = function(exports1) {
        if ('undefined' != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
var __webpack_exports__ = {};
(()=>{
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
        deactivate: ()=>deactivate,
        activate: ()=>activate
    });
    const external_vscode_namespaceObject = require("vscode");
    function activate(context) {
        const disposable = external_vscode_namespaceObject.commands.registerCommand('extension.formatCucumberFeatureJSON', async ()=>{
            const { default: indentString } = await Promise.resolve().then(__webpack_require__.bind(__webpack_require__, "indent-string"));
            const editor = external_vscode_namespaceObject.window.activeTextEditor;
            if (!editor) {
                external_vscode_namespaceObject.window.showErrorMessage('Please open a .feature file to run this command');
                return;
            }
            const fileName = editor.document.uri.fsPath;
            if (!fileName.endsWith('.feature')) {
                external_vscode_namespaceObject.window.showErrorMessage('This command can only be used on a .feature file');
                return;
            }
            const content = editor.document.getText();
            const regex = /"""(.*?)\"""/sg;
            let success = 0;
            const formattedContent = content.replace(regex, (match, offset, index)=>{
                let json = null;
                try {
                    json = JSON.parse(offset);
                } catch (error) {
                    const allLines = content.split(/\n/g);
                    const compute = allLines.reduce((acc, line)=>{
                        if (acc.charSize < index) {
                            acc.line += 1;
                            acc.charSize += line.length;
                        }
                        return acc;
                    }, {
                        line: 0,
                        charSize: 0
                    });
                    if (error instanceof Error) console.error(`Line ${compute.line}: Not a JSON object or invalid JSON detected: ${error.message}`);
                    external_vscode_namespaceObject.window.showErrorMessage(`Line ${compute.line}: Not a JSON object or invalid JSON detected`);
                    return match;
                }
                const tabSize = editor.options.tabSize || 4;
                const formattedJSON = JSON.stringify(json, null, 'number' == typeof tabSize ? tabSize : 4);
                const [tripleQuotes, stepDefinition] = content.slice(0, index).split(/\n/g).reverse();
                const fileIndentSize = tripleQuotes.search(/\S|$/);
                success += 1;
                return `"""\n${indentString(`${formattedJSON}\n"""`, fileIndentSize)}`;
            });
            try {
                const firstLine = editor.document.lineAt(0);
                const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
                const textRange = new external_vscode_namespaceObject.Range(0, firstLine.range.start.character, editor.document.lineCount - 1, lastLine.range.end.character);
                editor.edit((editBuilder)=>editBuilder.replace(textRange, formattedContent));
            } catch (err) {
                console.error(err);
                external_vscode_namespaceObject.window.showErrorMessage('Could not format JSON, an error occurred.');
            }
            if (success > 0) external_vscode_namespaceObject.window.showInformationMessage(`${success} Cucumber steps formatted!`);
        });
        context.subscriptions.push(disposable);
    }
    function deactivate() {}
})();
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__)__webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});
