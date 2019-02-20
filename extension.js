// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const indentString = require('indent-string');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('extension.formatCucumberFeatureJSON', function () {

		var editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showInformationMessage('Please open a cucumber feature file');
			return; // No open text editor
		}

		// Get all content of opened document
		const content = editor.document.getText();
		const regex = /"""(.*?)\"""/sg;

		const formattedContent = content.replace(regex, (match, offset, index) => {
			let json = null;

			try {
				json = JSON.parse(offset);
			} catch (error) {
				console.log(error);
				vscode.window.showInformationMessage('Invalid JSON in feature\'s triple quotes');
				return;
			}

			const formattedJSON = JSON.stringify(json, null, 2);
			const [tripleQuotes, stepDefinition] = content
				.slice(0, index)
				.split(/\n/g)
				.reverse();
			const indentSize = stepDefinition.search(/\S|$/) + 2;
			return `"""\n${indentString(`${formattedJSON}\n"""`, indentSize)}`;
		});

		try {
			const firstLine = editor.document.lineAt(0);
			const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
			const textRange = new vscode.Range(0, 
				firstLine.range.start.character, 
				editor.document.lineCount - 1, 
				lastLine.range.end.character);
				editor.edit(edit => edit.replace(textRange, formattedContent));
		} catch (err) {
			console.log(err)
			vscode.window.showInformationMessage('Could not format JSON, an error occurred.');
		}
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
