import * as vscode from 'vscode';
import { getUri } from "../utilities/getUri";
import { getCarrierList, getCarrierOptionList } from "../utilities/carrierData";

 
export class CarrierDashboard {
	public static currentPanel: CarrierDashboard | undefined;
	private readonly _panel: vscode.WebviewPanel;
	private _disposables: vscode.Disposable[] = [];
  
	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
	  this._panel = panel;
	  this._panel.onDidDispose(this.dispose, null, this._disposables);
	  this._panel.webview.html = this._getMyWebviewContent(panel.webview,  "", extensionUri);
	  this._setWebviewMessageListener(this._panel.webview);
	}

	public static render(extensionUri: vscode.Uri) {
		if (CarrierDashboard.currentPanel) {
			CarrierDashboard.currentPanel._panel.reveal(vscode.ViewColumn.One);
		} else {
			const panel = vscode.window.createWebviewPanel("", "Start Carrier Dashboard", vscode.ViewColumn.One, {
				enableScripts: true,
			  });
			  CarrierDashboard.currentPanel = new CarrierDashboard(panel, extensionUri);
		}
	  }

	public dispose() {
		CarrierDashboard.currentPanel = undefined;
	
		this._panel.dispose();
	
		while (this._disposables.length) {
		  const disposable = this._disposables.pop();
		  if (disposable) {
			disposable.dispose();
		  }
		}
	}

	private _getMyWebviewContent(webview: vscode.Webview, carrier:string, extensionUri: vscode.Uri) { 
		const toolkitUri = getUri(webview, extensionUri, [
			"node_modules",
			"@vscode",
			"webview-ui-toolkit",
			"dist",
			"toolkit.js", // A toolkit.min.js file is also available
		  ]);
	
		const styleURI = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'style.css'));   
		const scriptURI = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'scripts', 'main.js'));  
	
		let carrierlist =  getCarrierList(carrier);
	
		return /*html*/ `
				<!DOCTYPE html>
				<html>
					<head>
						<link href="${styleURI}" rel="stylesheet" />  
						<script src="${scriptURI}"></script> 
					</head>
					<body>

					<h1>Carrier Dashboard</h1>

					<div class="header">
					<label>Select your carrier:</label>
					<select id="SelectedCarrier" onchange="selectCarrier()">
						${getCarrierOptionList()}
					</select>
					</div>	
						<div class="main">
							<h1>${carrier}</h1>
							${carrierlist}
						<div>
					</body>
					</html>
		`;
	}

	private _setWebviewMessageListener(webview: vscode.Webview) {
		webview.onDidReceiveMessage(
		(message: any) => {
			const command = message.command;
			const text = message.text;

			switch (command) {
				case 'startCarrier':
					message.text;
					break;
				return;
			}
		},
		undefined,
		this._disposables
		);
  }
}