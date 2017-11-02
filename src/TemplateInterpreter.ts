import { WebHelper } from './WebHelper';
// add the following line for intellisense
// <reference path="../../vscode.d.ts" />
import { connect } from 'net';

import vscode = require('vscode');
import path = require('path');
import fs = require('fs');
import { TextDocument } from 'vscode';

export class TemplateInterpreter {

    
    private CurrentFile: string;
    private CurrentSection: string;
    private CurrentCodeFragment: string;
    private cn = "Driver={SQL Server Native Client 11.0};Server=myServerAddress;Database=Northwind;Trusted_Connection=yes;"
    private Markers = 
    {
        StartingMarker : ['\nFile: ', '\n'],
        FileMarker : ['\nFile: ', '\n'],
        SectionMarker : ['AJP-SECTION ', '\n'],
        CodeFragmentMarker : ['---------------------------', '---------------------------']
    };

    constructor(private context: vscode.ExtensionContext) {
        console.log('AJP - Registring template interpreter commands ...');
		context.subscriptions.push(
            vscode.commands.registerCommand( 'templateInterpreter.enable', this.enable ),
            vscode.commands.registerCommand( 'templateInterpreter.disable', this.disable ),
            vscode.commands.registerCommand( 'templateInterpreter.toggle', this.toggle ),
            vscode.commands.registerCommand( 'templateInterpreter.applyTemplate', (document: TextDocument) => {
                let fileExtension = '';
                if(document != undefined && document.fileName != undefined && document.fileName.lastIndexOf('.') > -1)
                {
                    fileExtension = document.fileName.substring(document.fileName.lastIndexOf('.') + 1);
                }
                if(fileExtension == vscode.workspace.getConfiguration('templateInterpreter').templateReadyFilesExtension)
                {
                    this.applyTemplate( document );
                }
			})
        );
	}

    enable()
    {
        console.log('* enable');
        vscode.workspace.getConfiguration( 'templateProcessor' ).update( 'on', true, true );
        vscode.window.setStatusBarMessage( "Trigger process template on save Enabled", 1000 );
    }

    disable()
    {
        console.log('* disable');
	    vscode.workspace.getConfiguration( 'templateProcessor' ).update( 'on', false, true );
        vscode.window.setStatusBarMessage( "Trigger process template on save Disabled", 1000 );
    }

    toggle()
    {
        console.log('* toggle');
        if( vscode.workspace.getConfiguration( 'templateProcessor' ).get( 'on' ) )
        {
            this.disable();
        }
        else
        {
            this.enable();
        }
    }

    deactivate()
    {
    }

    activate(context: vscode.ExtensionContext)
    {
    }

    public applyTemplate(document: TextDocument)
    {
        let content = document.getText();
        let nextFilePosition = content.indexOf(this.Markers.StartingMarker[0]);
        while(nextFilePosition > -1)
        {
            nextFilePosition += this.Markers.StartingMarker[0].length;
            this.CurrentFile = content.substring(nextFilePosition, content.indexOf(this.Markers.StartingMarker[1], nextFilePosition)).trim();
            content = content.substring(content.indexOf(this.Markers.StartingMarker[1], nextFilePosition));
            
            nextFilePosition = content.indexOf(this.Markers.SectionMarker[0]);
            this.CurrentSection = content.substring(nextFilePosition, content.indexOf(this.Markers.SectionMarker[1], nextFilePosition)).trim();
            content = content.substring(content.indexOf(this.Markers.SectionMarker[1], nextFilePosition));
            
            nextFilePosition = content.indexOf(this.Markers.CodeFragmentMarker[0]);
            nextFilePosition += this.Markers.CodeFragmentMarker[0].length;
            this.CurrentCodeFragment = content.substring(nextFilePosition, content.indexOf(this.Markers.CodeFragmentMarker[1], nextFilePosition));
            this.CurrentCodeFragment = this.CurrentCodeFragment.substring(this.CurrentCodeFragment.indexOf('\n') + 1);
            this.CurrentCodeFragment = this.CurrentCodeFragment.substring(0, this.CurrentCodeFragment.lastIndexOf('\n'));
            content = content.substring(content.indexOf(this.Markers.CodeFragmentMarker[1], nextFilePosition));
            

            if(this.CurrentFile == 'RUN-SQL')
            {
                const webHelper = new WebHelper();
                webHelper.apiCall(this.CurrentCodeFragment);
                // Run it yourself !!!
                // Or spend some time reading this post and implement one ot the solutions they are discussing.
                // Consider working with Edge.js: https://github.com/tjanczuk/edge
            }
            else { 
                this.injectIntoFile(this.CurrentFile, this.CurrentSection, this.CurrentCodeFragment);
            }

            nextFilePosition = content.indexOf(this.Markers.StartingMarker[0]);
        }
    }

    injectIntoFile(relativeFilePath: string, insertionMarker: string, codeFragment: string)
    {
        const absoluteFilePath = 'c:\\PRO\\ANG\\material\\IonicHelloWorld\\IonicHelloWorld\\' +  relativeFilePath;
        if(fs.existsSync(absoluteFilePath))
        {
            const firstLine = codeFragment.split(/\r?\n/)[0];
            
            // read file
            let fileContent = fs.readFileSync(absoluteFilePath, 'utf-8');
            // seek to end of marker
            let markerPosition = fileContent.indexOf(insertionMarker); 
            markerPosition = fileContent.indexOf('\n', markerPosition) + 1;
            let StartingFrom = markerPosition;
            let EndingTo = markerPosition;
            const sectionNameIndex = firstLine.indexOf('<!-- AJP-BEGIN:');
            if(sectionNameIndex > 0)
            {
                // Section is named, Find the section.
                let nextSectionPosition = fileContent.indexOf(this.Markers.SectionMarker[0], markerPosition);
                const namedSectionBegin = '<!-- AJP-BEGIN:' + ' ' + firstLine.substring(sectionNameIndex, firstLine.indexOf('-->')).trim() + ' -->';
                const namedSectionEnd = '<!-- AJP-END:' + ' ' + firstLine.substring(sectionNameIndex, firstLine.indexOf('-->')).trim() + ' -->';
                let namedSectionBeginPosition = fileContent.indexOf(namedSectionBegin);
                if(nextSectionPosition < 0 || namedSectionBeginPosition < nextSectionPosition) {
                    StartingFrom =  fileContent.indexOf('\n', namedSectionBeginPosition + namedSectionBegin.length) + 1;
                    let namedSectionEndPosition = fileContent.indexOf(namedSectionEnd);
                    EndingTo =  fileContent.indexOf('\n', namedSectionEndPosition + namedSectionEnd.length) + 1;
                }
            }
            // Insert code
            fileContent = fileContent.substring(0, StartingFrom) + codeFragment + fileContent.substring(EndingTo);
            fs.writeFileSync(absoluteFilePath, fileContent, 'utf-8');
        }
        else
        {
            console.log( 'AJP - No such file to be updated: ' + absoluteFilePath );
        }
    }
}
