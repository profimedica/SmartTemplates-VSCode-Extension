import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class TemplateManagerProvider implements vscode.TreeDataProvider<Template> {

	private _onDidChangeTreeData: vscode.EventEmitter<Template | undefined> = new vscode.EventEmitter<Template | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Template | undefined> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Template): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Template): Thenable<Template[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No dependency in empty workspace');
			return Promise.resolve([]);
		}

		return new Promise(resolve => {
			const TemplatesFolder = 'c:\\Templates\\';
			const LatestTemplatesAssress = 'https://github.com/profimedica/Templater/wiki/Ajuro-Template-Processor';
			if (this.pathExists(TemplatesFolder)) {
				let filelist = [];
				filelist = this.getTemplates(TemplatesFolder)
				vscode.window.showInformationMessage('Found: ' + filelist.length);
				resolve(filelist);
			} else {
				vscode.window.showInformationMessage('Templates forder was not found: ' + TemplatesFolder + '. Visit the project page to download templates: '+ LatestTemplatesAssress);
				resolve([]);
			}
		});
	}

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	private getTemplates = function(dir) {
		var fs = fs || require('fs'),
			files = fs.readdirSync(dir);
		const templates = new Array();
		files.forEach(file => {
		  if (fs.statSync(dir + file).isDirectory()) {
			  /*if(this != undefined)
			  {
				filelist.push( this.getTemplates(dir + file + '\\', filelist));
			  }*/
			  templates.push(new Template(file, vscode.TreeItemCollapsibleState.Expanded, null));
		  }
		  else {
			templates.push(new Template(file, vscode.TreeItemCollapsibleState.None, null));
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

class Template extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';

}