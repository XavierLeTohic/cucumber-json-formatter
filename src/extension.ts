import * as vscode from 'vscode';

interface ComputeAcc {
	line: number;
	charSize: number;
}

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext): void {
	const disposable = vscode.commands.registerCommand(
		'extension.formatCucumberFeatureJSON',
		async () => {
			const { default: indentString } = await import('indent-string');
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				vscode.window.showErrorMessage('Please open a .feature file to run this command');
				return;
			}

			const fileName = editor.document.uri.fsPath;

			if (!fileName.endsWith('.feature')) {
				vscode.window.showErrorMessage('This command can only be used on a .feature file');
				return;
			}

			// Get all content of opened document
			const content = editor.document.getText();
			const regex = /"""(.*?)\"""/sg;
			let success = 0;

			const formattedContent = content.replace(regex, (match: string, offset: string, index: number) => {
				let json: unknown = null;

				try {
					json = JSON.parse(offset);
				} catch (error) {
					const allLines = content.split(/\n/g);
					const compute = allLines.reduce((acc: ComputeAcc, line: string) => {
						if (acc.charSize < index) {
							acc.line += 1;
							acc.charSize += line.length;
						}

						return acc;
					}, {
						line: 0,
						charSize: 0
					});

					if (error instanceof Error) {
						console.error(`Line ${compute.line}: Not a JSON object or invalid JSON detected: ${error.message}`);
					}

					vscode.window.showErrorMessage(`Line ${compute.line}: Not a JSON object or invalid JSON detected`);
					return match;
				}

				const tabSize = editor.options.tabSize || 4;
				const formattedJSON = JSON.stringify(json, null, typeof tabSize === 'number' ? tabSize : 4);
				const [tripleQuotes, stepDefinition] = content
					.slice(0, index)
					.split(/\n/g)
					.reverse();
				const fileIndentSize = tripleQuotes.search(/\S|$/);
				success += 1;
				return `"""\n${indentString(`${formattedJSON}\n"""`, fileIndentSize)}`;
			});

			try {
				const firstLine = editor.document.lineAt(0);
				const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
				const textRange = new vscode.Range(
					0,
					firstLine.range.start.character,
					editor.document.lineCount - 1,
					lastLine.range.end.character
				);
				editor.edit((editBuilder: vscode.TextEditorEdit) =>
					editBuilder.replace(textRange, formattedContent)
				);
			} catch (err) {
				console.error(err);
				vscode.window.showErrorMessage('Could not format JSON, an error occurred.');
			}

			if (success > 0) {
				vscode.window.showInformationMessage(`${success} Cucumber steps formatted!`);
			}
		}
	);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate(): void { }
