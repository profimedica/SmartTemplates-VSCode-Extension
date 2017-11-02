import vscode = require( 'vscode' );
import path = require( 'path' );
import fs = require( 'fs' );
import { TextDocument } from 'vscode';

export class LivePreview {

    constructor(private context: vscode.ExtensionContext) {
        console.log('AJP - Registring live preview commands ...');
		context.subscriptions.push(
            vscode.commands.registerCommand( 'livePreview.updateLivePreview', (document: TextDocument) => {
                    this.updateLivePreview( document );
			})
        );
	}

    deactivate()
    {
    }

    activate(context: vscode.ExtensionContext)
    {
    }

    public updateLivePreview(document: TextDocument)
    {
        var onFormat = vscode.workspace.getConfiguration( 'templateProcessor' ).on;

        if (onFormat)
        {
            let content = document.getText();
            
            // Apply replacements
            let fileExtension = '';
            if(document != undefined && document.fileName != undefined && document.fileName.lastIndexOf('.') > -1)
            {
                fileExtension = document.fileName.substring(document.fileName.lastIndexOf('.') + 1);
            }
            const rulesContent = fs.readFileSync('AJP-Replacements-' + fileExtension + '.rules', 'UTF-8');
            let rulesList = rulesContent.split(/\r?\n/);

            rulesList.forEach(rule => {
                if(rule[0].trim() != '#'){
                    const ruleArray = rule.split('\t');
                    content = content.replace(new RegExp(ruleArray[0], 'g'), ruleArray[1]);
                }
            });
            // Write output
            const outputPath = document.fileName.replace('\\src\\', '\\live\\');
            const outputPathFragments = outputPath.split('\\');
            let partialOutputPath = '';
            outputPathFragments.forEach(fragment=>{
                partialOutputPath += outputPathFragments + '\\';
                if(!fs.existsSync(outputPath)) {
                    fs.mkdirSync(outputPath);
                }
            });
            fs.writeFile(outputPath, content, { flag: 'w' }, function (err) {
                if (err) 
                {
                    throw err;
                }
                if(!outputPath)
                {
                    console.log( 'AJP - Live file was created: ' + outputPath );
                }
            });
        }
    }
}
