import { AjuroTemplate } from './AjuroTemplateFolderModel';
import * as vscode from 'vscode';

import { TemplateManagerProvider } from './TemplateManagerProvider';
import { TemplateProcessor } from './TemplateProcessor';
import { TemplateInterpreter } from './TemplateInterpreter';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = vscode.workspace.rootPath;

	const templateProcessor = new TemplateProcessor(context);
	const templateInterpreter = new TemplateInterpreter(context);
	const templateManagerProvider = new TemplateManagerProvider(context);

	vscode.window.registerTreeDataProvider('templateManager', templateManagerProvider);
	vscode.workspace.onDidSaveTextDocument(document => {
		let fileExtension = '';
		if(document != undefined && document.fileName != undefined && document.fileName.lastIndexOf('.') > -1)
		{
			fileExtension = document.fileName.substring(document.fileName.lastIndexOf('.') + 1);
		}
		if(fileExtension == vscode.workspace.getConfiguration('templateProcessor').templateFilesExtension)
		{
			vscode.commands.executeCommand('templateProcessor.processTemplate', document);
		} else	
		if(fileExtension == vscode.workspace.getConfiguration('templateInterpreter').templateReadyFilesExtension)
		{
			vscode.commands.executeCommand('templateInterpreter.applyTemplate', document);
		} else 
		if(vscode.workspace.getConfiguration('livePreview').livePreviewFilesExtensions.split(' ').includes(fileExtension))
		{			
			vscode.commands.executeCommand('livePreview.createLivePreview', document);
		}
	});
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => {
		vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`));
	});
}