const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function activate(context) {
    let bulletDisposable = vscode.commands.registerCommand('vscode-destroyer.destroy', () => {
        showDestructionEffect(context);
    });

    let hammerDisposable = vscode.commands.registerCommand('vscode-destroyer.hammer', () => {
        showDestructionEffect(context);
    });
    
    let flamethrowerDisposable = vscode.commands.registerCommand('vscode-destroyer.flamethrower', () => {
        showDestructionEffect(context);
    });

    context.subscriptions.push(bulletDisposable);
    context.subscriptions.push(hammerDisposable);
    context.subscriptions.push(flamethrowerDisposable);
}

function showDestructionEffect(context) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const text = editor.document.getText();
        
        const panel = vscode.window.createWebviewPanel(
            'destructionView',
            'Editor Destruction',
            {
                viewColumn: vscode.ViewColumn.One,
                preserveFocus: false
            },
            { 
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'src'))
                ]
            }
        );

        panel.webview.html = getWebviewContent(panel.webview, context.extensionPath, text);
    }
}

function getWebviewContent(webview, extensionPath, editorText) {
    const htmlPath = path.join(extensionPath, 'src', 'view.html');
    const cssPath = path.join(extensionPath, 'src', 'styles', 'styles.css');
    
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    const srcUri = webview.asWebviewUri(
        vscode.Uri.file(path.join(extensionPath, 'src'))
    ).toString();
    
    htmlContent = htmlContent
        .replace('${styles}', cssContent)
        .replace('${editorContent}', escapeHtml(editorText))
        .replace(/\${srcPath}/g, srcUri);
    
    return htmlContent;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
