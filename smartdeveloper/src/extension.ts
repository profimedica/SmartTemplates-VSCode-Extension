import * as vscode from 'vscode';

import { DepNodeProvider } from './nodeDependencies'
import { JsonOutlineProvider } from './jsonOutline'
import { FtpTreeDataProvider, FtpNode } from './ftpExplorer'

export function activate(context: vscode.ExtensionContext) {
	const rootPath = vscode.workspace.rootPath;

	const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	const jsonOutlineProvider = new JsonOutlineProvider(context);
	const ftpExplorerProvider = new FtpTreeDataProvider();

	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.window.registerTreeDataProvider('jsonOutline', jsonOutlineProvider);
	vscode.window.registerTreeDataProvider('ftpExplorer', ftpExplorerProvider);

	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => {
		vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`));
	});
	vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('nodeDependencies.addEntry', node => vscode.window.showInformationMessage('Successfully called add entry'));
	vscode.commands.registerCommand('nodeDependencies.deleteEntry', node => vscode.window.showInformationMessage('Successfully called delete entry'));

	vscode.commands.registerCommand('extension.openJsonSelection', range => {
		jsonOutlineProvider.select(range);
	});

	vscode.commands.registerCommand('openFtpResource', (node: FtpNode) => {
		vscode.workspace.openTextDocument(node.resource).then(document => {
			vscode.window.showTextDocument(document);
		});
	});
}