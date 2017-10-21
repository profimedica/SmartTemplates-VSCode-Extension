import { AjuroTemplate } from './AjuroTemplate';
import * as vscode from 'vscode';

import { TemplateManagerProvider } from './templateManagerProvider'
import { JsonOutlineProvider } from './jsonOutline'

export function activate(context: vscode.ExtensionContext) {
	const rootPath = vscode.workspace.rootPath;

	const templateManagerProvider = new TemplateManagerProvider(context);
	const jsonOutlineProvider = new JsonOutlineProvider(context);

	vscode.window.registerTreeDataProvider('templateManager', templateManagerProvider);
	vscode.window.registerTreeDataProvider('jsonOutline', jsonOutlineProvider);

	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => {
		vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`));
	});
	vscode.commands.registerCommand('templateManager.refreshEntry', () => templateManagerProvider.refresh());
	vscode.commands.registerCommand('templateManager.addEntry', node => vscode.window.showInformationMessage('Successfully called add entry'));
	vscode.commands.registerCommand('templateManager.deleteEntry', node => vscode.window.showInformationMessage('Successfully called delete entry'));

	vscode.commands.registerCommand('extension.openJsonSelection', range => {
		jsonOutlineProvider.select(range);
	});
			
	vscode.commands.registerCommand('openTemplateFile', (node: AjuroTemplate) => {
		const lastVersion = templateManagerProvider.FindLastVersion(node);
		if(lastVersion != null)
		{
			vscode.workspace.openTextDocument(node.FilePath + '\\' + node.FileName + '\\' + lastVersion).then(document => {
				vscode.window.showTextDocument(document);
			});
		}
	});
}