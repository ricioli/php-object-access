const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate() {
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

    if (event.contentChanges[0].text === '-' || event.contentChanges[0].text === '>') {
      let selection = editor.selection;
      let originalPosition = selection.start;
      let newPosition = selection.active.translate(0, 1);
      let text = editor.document.getText(new vscode.Range(new vscode.Position(0, 0), originalPosition));

      // if (/[\)a-zA-Z0-9][-][>]$/.test(text)) {
      //   // TODO: bug in ctrl+z and ctrl+y
      //   editor.edit((editBuilder) => {
      //     const deleteSelection = new vscode.Selection(originalPosition, originalPosition.translate(0, 1));
      //     editBuilder.delete(deleteSelection);
      //     vscode.commands.executeCommand('editor.action.triggerSuggest');
      //   });
      //   return;
      // }

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

  console.log('Congratulations, your extension "php-object-access" is now active!');
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
