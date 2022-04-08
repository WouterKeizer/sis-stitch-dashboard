import * as vscode from 'vscode';
import { BrotliCompress } from 'zlib';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
	  vscode.commands.registerCommand('mypanel.start', () => {
		// Create and show panel
		const panel = vscode.window.createWebviewPanel(
		  'mypanel',  // <--- identifier
		  'Stitch dashboard', // <--- title
		  vscode.ViewColumn.One,
		  {}
		);
  
		// And set its HTML content
		getMyWebviewContent(panel.webview, context).then(html =>panel.webview.html = html);   // <--- HTML
	  })	
	);
}

  async function getMyWebviewContent(webview: vscode.Webview, context: any) : Promise<string> { 
	let html: string = ``;
	let foldersHtml: string = ``;
	
	const myStyle = webview.asWebviewUri(vscode.Uri.joinPath(
		  context.extensionUri, 'media', 'style.css'));   // <--- 'media' is the folder where the .css file is stored
	
	let carrierlist = await renderCarrierList();
	// construct your HTML code
	html += `
			<!DOCTYPE html>
			<html>
				<head>
				  <link href="${myStyle}" rel="stylesheet" />   
				</head>
				<body>
				  <div class="main"> 
					<div class="carrier-list">`+ carrierlist +` </div>
					<div class="carrier-detail">`+ getCarrierDetail() +` </div>
				  </div>
				</body>
			 </html>
	`;
	// -----------------------
	return html;
  }


  async function renderCarrierList(): Promise<string> {
	let html: string = ``;
	
	var myList = [
		{ "ID":1, "Carrier": "UPS", "Scenarios":["standard-packages", "multi-package","dg-test"]},
		{ "ID":2, "Carrier": "DHL", "Services":[1,2,4] },
		{ "ID":3, "Carrier": "FED", "Services":["09:00","12:00"] }
	];

	var test = await vscode.workspace.findFiles('**/*.integration.json');

	test.forEach(async element => {
		html += `<li>${element.path}</li>`;

		// Example on reading file
		// let document = await vscode.workspace.openTextDocument(element.path);
		// document.getText();
	});

	html += buildHtmlTable(myList);
	return html;
  }

  function getCarrierDetail(): string {
	let html2: string = ``;
	html2 	+= ` 
	<div class="header">
		<h1>Details</h1>
	</div>
	<div class="navbar">
		<a class="active" href="#lanes">Lanes</a>
		<a href="#implementation">Implementation</a>
		<a href="#specifications">Specifications</a>
	</div>
	`;

	return html2;
  }
