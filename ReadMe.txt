Extension name:
	SmartDeveloper

Extension identifier:
	smartdeveloper

Extension identifier:
	smartdeveloper

Code location:
	C:\PRO\ANG\material\VisualStudioCodeExtenson\VisualStudioCodeExtension

profimedica publisher:
	SAVED

Git
	https://github.com/profimedica/VisualStudioCodeExtension.git

Created based on:
	https://code.visualstudio.com/docs/extensions/yocode

Extension location:
	Windows %USERPROFILE%\.vscode\extensions
	Mac ~/.vscode/extensions
	Linux ~/.vscode/extensions\

Yo Extension Generator:
	https://github.com/Microsoft/vscode-generator-code
	npm install -g yo generator-code
	yo code

Publishing tool:
	https://code.visualstudio.com/docs/extensions/publish-extension
	npm install -g vsce
	vsce publish

× NODE_PATH matches the npm root
npm global root value is not in your NODE_PATH

[Info]
  NODE_PATH = %AppData%\npm\node_modules
  npm root  = C:\Users\fcumpanescu\AppData\Roaming\npm\node_modules

[Fix] Append the npm root value to your NODE_PATH variable
  If you're using cmd.exe, run this command to fix the issue:
    setx NODE_PATH "%NODE_PATH%;C:\Users\fcumpanescu\AppData\Roaming\npm\node_modules"
  Then restart your command-line. Otherwise, you can setup NODE_PATH manually:
    https://github.com/sindresorhus/guides/blob/master/set-environment-variables.md#windows
