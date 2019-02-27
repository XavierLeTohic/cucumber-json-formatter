const vscode = require('vscode');
const indentString = require('indent-string');

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
		let success = 0;

		const formattedContent = content.replace(regex, (match, offset, index) => {
			let json = null;

			try {
				json = JSON.parse(offset);
			} catch (error) {
				const allLines = content.split(/\n/g);
				const compute = allLines.reduce((acc, line) => {
					if (acc.charSize < index) {
						acc.line += 1;
						acc.charSize += line.length
					}

					return acc;
				}, {
						line: 0,
						charSize: 0
					});

				if (error.message) {
					console.error(`Line ${compute.line}: Not a JSON object or invalid JSON detected: ${error.message}`);
				}

				vscode.window.showErrorMessage(`Line ${compute.line}: Not a JSON object or invalid JSON detected`);
				return match;
			}

			const formattedJSON = JSON.stringify(json, null, 2);
			const [tripleQuotes, stepDefinition] = content
				.slice(0, index)
				.split(/\n/g)
				.reverse();
			const indentSize = tripleQuotes.search(/\S|$/);
			success += 1;
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
			vscode.window.showErrorMessage('Could not format JSON, an error occurred.');
		}

		if (success > 0) {
			vscode.window.showInformationMessage(`${success} Cucumber steps formatted!`);
		}
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
