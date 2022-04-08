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
	let lanes = getLanes();
	let htmlHeader: string = ``;
	let htmlBody: string =``;
	let html: string = ``;
	let htmlFiles: string = ``;
	htmlHeader 	+= ` 
	<div class="header">
		<h1>Details</h1>
	</div>
	<div class="navbar">
		<a class="active" href="#lanes">Lanes</a>
		<a href="#implementation">Implementation</a>
		<a href="#specifications">Specifications</a>
	</div>
	`;
	let files = vscode.workspace.findFiles('*.*').then(f =>{
		f.forEach(function(filex){
			htmlFiles += `<tr><td>${filex.path}</td></tr>`;
		});

		
		
	});
	
	htmlBody += `<div class="detailpane">
	<div style="overflow-x:auto;">
		<table class="table">
			<thead>
			<tr><td>Lane</td><td>EXPRESS</td><td>ECONOMY</td></tr>
			</thead>
			<tbody>
				<tr><td>NL-NL</td><td class="checkmark"><i class="fa fa-check"></i></td><td class="checkmark"><i class="fa fa-check"></i></td></tr>
				<tr><td>NL-DE</td><td class="checkmark"><i class="fa fa-check"></i></td><td class="checkmark"><i class="fa fa-check"></i></td></tr>
				<tr><td>NL-CH</td><td class="checkmark"><i class="fa fa-check"></i></td><td class="checkmark"><i class="fa fa-remove"></i></td></tr>
				<tr><td>NL-US</td><td class="checkmark"><i class="fa fa-check"></i></td><td class="checkmark"><i class="fa fa-remove"></i></td></tr>
				` + htmlFiles + `
			</tbody>
		</table>
	</div>
</div>`;

	html += htmlHeader + htmlBody;
	return html;
  }

  function getLanes(): string[]{
	return ['NL-NL','NL-DE','NL-CH', 'NL-US'];
  }

