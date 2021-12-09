// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (!event.contentChanges[0]) {
      return;
    }

    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    let config = vscode.workspace.getConfiguration('php-object-access', editor.document.uri);
    if (!config.get('phpObjectAccessEnable', true)) {
      return;
    }

    let languageId = editor.document.languageId;
    if (languageId !== 'php') return;

    let languages = config.get('activationOnLanguage', ['*']);
    let disableOnLanguage = config.get('disableOnLanguage', []);
    if (
      (languages.indexOf('*') === -1 && languages.indexOf(languageId) === -1) ||
      disableOnLanguage.indexOf(languageId) !== -1
    ) {
      return;
    }

    if (event.contentChanges[0].text === '-') {
      let selection = editor.selection;
      let originalPosition = selection.start;

      let newPosition = selection.active.translate(0, 1);

      let text = editor.document.getText(new vscode.Range(new vscode.Position(0, 0), originalPosition));

      let notInsideString = (text.match(/["]/g) || []).length % 2 === 0 && (text.match(/[']/g) || []).length % 2 === 0;
      let isValidLastChar = /[\)a-zA-Z0-9]$/.test(text);

      if (notInsideString && isValidLastChar) {
        editor.edit((editBuilder) => {
          editBuilder.insert(newPosition, '>');
          vscode.commands.executeCommand('editor.action.triggerSuggest');
        });
      }
    }
  });

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "php-object-access" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('php-object-access.PHPObjectAccessActivate', function () {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Success activate PHP object access!');
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
