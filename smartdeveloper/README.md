# Smart Template Processor

Not functional extension at this time.

Smart Template Processor extension helps you code faster by using the power of Ajuro Template Processor (AJP) directly from your IDE.
While the WEB version of AJP can not apply the code into files, this extension has this advantage.
Good templates can increase your productivity, saving the time you usualy spend on writing support code.

Read more on the github AJP page:
https://github.com/profimedica/Templater/wiki/Ajuro-Template-Processor

## Features

v.0.0.X
The code processor has 2 components:

TemplateProcessor creates an .ajpready file when a template file .ajp is saved.

TemplayeInterpreter will inject the code fragments into your code when a .ajpready file is saved. 

## Requirements

Directory C:\\AJP-Templates is used by default, but you can change the root location of the templates from configuration.

Also you can change the template files extension and the template ready files extension.

## Extension Settings

None

## Known Issues

Next step is to split the template files and the file of variables that the user provides for the TemplateProcessor.

For the moment, the template code and the vatiables that appy to the template are located in the same file.

## Release Notes

### 0.0.1
Created a templates view. 
On disk, each templates has it's own folder. Inside the folder there are multiple versions of the same template.
On the view, only the folders are displayed. Selecting a node opns the most recent template for edit.

-----------------------------------------------------------------------------------------------------------

**Enjoy!**