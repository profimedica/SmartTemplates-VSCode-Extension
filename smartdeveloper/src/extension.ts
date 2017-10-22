import { AjuroTemplate } from './AjuroTemplate';
import * as vscode from 'vscode';

import { TemplateManagerProvider } from './templateManagerProvider';
import { TemplateProcessor } from './templateProcessor';
import { JsonOutlineProvider } from './jsonOutline';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = vscode.workspace.rootPath;

	const templateProcessor = new TemplateProcessor(context);
	const templateManagerProvider = new TemplateManagerProvider(context);
	const jsonOutlineProvider = new JsonOutlineProvider(context);

	vscode.window.registerTreeDataProvider('templateManager', templateManagerProvider);
	vscode.window.registerTreeDataProvider('jsonOutline', jsonOutlineProvider);
	vscode.workspace.onDidSaveTextDocument(document=>{
		vscode.commands.executeCommand('templateProcessor.processTemplate', document);		
	});
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => {
		vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`));
	});

	vscode.commands.registerCommand('extension.openJsonSelection', range => {
		jsonOutlineProvider.select(range);
	});
}