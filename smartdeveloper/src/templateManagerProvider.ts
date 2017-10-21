import { AjuroTemplate } from './AjuroTemplate';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class TemplateManagerProvider implements vscode.TreeDataProvider<AjuroTemplate> {

	private _onDidChangeTreeData: vscode.EventEmitter<AjuroTemplate | undefined> = new vscode.EventEmitter<AjuroTemplate | undefined>();
	readonly onDidChangeTreeData: vscode.Event<AjuroTemplate | undefined> = this._onDidChangeTreeData.event;
	private File = new AjuroTemplate('C:', 'AJP-Templates', true);

	constructor(private context: vscode.ExtensionContext) {
		console.log('Searching for templates ...');
		const LatestTemplatesAssress = 'https://github.com/profimedica/Templater/wiki/Ajuro-Template-Processor';
		if (this.pathExists(this.File.FilePath + '\\' + this.File.FileName)) {
			this.File.Children = this.getTemplates(this.File.FilePath + '\\' + this.File.FileName)
			console.log('Found: ' + this.File.Children.length + ' templates.');
		} else {
			vscode.window.showInformationMessage('Templates folder was not found: "' + this.File.FilePath + '\\' + this.File.FileName + '". Visit the project page to download templates: '+ LatestTemplatesAssress);
		}
	}

	FindLastVersion(node: AjuroTemplate): string {
		var fs = fs || require('fs');
		let fileName;
		let files = fs.readdirSync(node.FilePath + '\\' + node.FileName);
		fileName =  (<Array<string>>files).sort((a,b) => 0 - (a > b ? 1 : -1))[0];
		if(fs.statSync(node.FilePath + '\\' + node.FileName + '\\' + fileName).isDirectory())
		{
			fileName = null;
		}
		return (fileName);
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	/*getTreeItem(element: AjuroTemplate): vscode.TreeItem {
		return element;
	}*/
	getTreeItem(node: AjuroTemplate): vscode.TreeItem {
		if(node) {
			let nodeFileName = node.FileName;
			if(!node.IsDir && node.FileName.indexOf('.') > 0)
			{
				// nodeFileName = node.FileName.substring(0, node.FileName.lastIndexOf('.'))
			}
			let treeItem: vscode.TreeItem = new vscode.TreeItem(nodeFileName, node.Children.length > 0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);
			treeItem.command = {
				command: 'openTemplateFile',
				title: '',
				arguments: [node]
			};
			return treeItem;
		}
	}
	
	private _getChildren(node: AjuroTemplate) {
		if (node) {
			return Promise.resolve(this.getTemplates(node.FilePath + '\\' + node.FileName));
		} else {
			return Promise.resolve(this.File ? this.File.Children : []);
		}
	}

	getChildren(node?: AjuroTemplate): Thenable<AjuroTemplate[]> {
		if (node) {
			return Promise.resolve(this.getTemplates(node.FilePath + '\\' + node.FileName));
		} else {
			return Promise.resolve(this.File ? this.File.Children : []);
		}
	}

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	private getTemplates = function(dir) {
		var fs = fs || require('fs'),
			files = fs.readdirSync(dir);
		const templates = new Array();
		files.forEach(file => {
		  if (fs.statSync(dir + '\\' + file).isDirectory()) {
			var template = new AjuroTemplate(dir, file, true);
				template.Children = this.getTemplates(dir + '\\' + file);
				templates.push(template);
		  }
		  else {
			// templates.push(new AjuroTemplate(dir, file, false));
		  }
		});
		return templates;
	};

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}
}
