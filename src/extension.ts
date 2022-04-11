import * as vscode from 'vscode';
import * as path from 'path';

import { BrotliCompress } from 'zlib';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
	  vscode.commands.registerCommand('mypanel.start', () => {
		// Create and show panel
		const panel = vscode.window.createWebviewPanel(
		  'mypanel',  // <--- identifier
		  'Stitch dashboard', // <--- title
		  vscode.ViewColumn.One,
		  {
			  enableScripts: true
		  }
		);
  
		const updateWebview = (carrier: string) => {
			getMyWebviewContent(panel.webview, context, carrier).then(html =>panel.webview.html = html);   // <--- HTML
		  };

		//Creates a webview with as default carrier selection
		updateWebview("tnt");

		panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'startCarrier':
						updateWebview(message.text);
						break;
				}
				return;
			},
			undefined,
			context.subscriptions
		);
	  })
	);
}

  async function getMyWebviewContent(webview: vscode.Webview, context: any, carrier:string) : Promise<string> { 
	let html: string = ``;
	
	const styleURI = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'style.css'));   
	const scriptURI = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src/scripts', 'main.js'));  
	
	let carrierlist = await rCarrierList(carrier);

	html += `
			<!DOCTYPE html>
			<html>
				<head>
				  	<link href="${styleURI}" rel="stylesheet" />  
					<script src="${scriptURI}"></script> 
				</head>
				<body>
				<div class="header">
					<button role="button" onclick="selectCarrier()" id="startCarrier">Start Carrier</button>
					<select id="SelectedCarrier">
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
	// -----------------------
	return html;
  }

function getCarriers(){
	let carriers= ["ups", "tnt", "dhl", "dpd", "dsv", "rhenus"];
	return carriers;
}

function getCarrierOptionList(): string {
	let html: string = ``;
	getCarriers().forEach(carrier => {
		html+= `<option value="${carrier}">${carrier}</option>`;
	});
	return html;
}

async function rCarrierList(srCarrier:string): Promise<string> {
	let html: string = ``;
	let allIntegrations = await vscode.workspace.findFiles(`**/carriers/${srCarrier}/**`);

	allIntegrations.forEach(async element => {
		html += `<li>${element.path}</li>`;

	// Example on reading file
	// let document = await vscode.workspace.openTextDocument(element.path);
	// document.getText();
	});
	return html;
}