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
            const content = document.getText();
            
            // Apply replacements
            let fileExtension = '';
            if(document != undefined && document.fileName != undefined && document.fileName.lastIndexOf('.') > -1)
            {
                fileExtension = document.fileName.substring(document.fileName.lastIndexOf('.') + 1);
            }
            const rulesContent = fs.readFileSync('ajp-replacements.' + fileExtension, 'UTF-8');
            const rulesList = rulesContent.split(/\r?\n/);

            rulesList.forEach(rule => {
                const ruleArray = rule.split('\t');
                rulesContent = Result.replace(/</g, ruleArray[1]);
            });
            // Write output
            const outputPath = document.fileName.replace('/src/', '/live/');
            const fileExistsOriginal = fs.existsSync(outputPath);
            fs.writeFile(outputPath, processed, { flag: 'w' }, function (err) {
                if (err) 
                {
                    throw err;
                }
                if(!fileExistsOriginal)
                {
                    console.log( 'AJP - Live file was created: ' + outputPath );
                }
            });
        }
    }

    AddFormat(Result) {
        Result = Result.replace(/</g, '&lt;');
        Result = Result.replace(/ /g, '&nbsp;');
        Result = Result.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
        Result = Result.replace(/\n/g, '</br>\n');
        return Result; 
    }
}
