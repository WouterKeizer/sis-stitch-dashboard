import * as vscode from 'vscode';

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
	
	const myStyle = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, '../src/media', 'style.css'));   // <--- 'media' is the folder where the .css file is stored
	const mainUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, '../src/scripts', 'main.js'));
	
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

					<button class="carrier-button">
					<vscode-button id="submit-carrier">Save</vscode-button>

					<button type="button" onclick="alert('Hello world!')">Click Me!</button>

				  <label for="carriers">Choose a carrier:</label>

				  <select name="cars" id="cars">
				   ${getCarrierOptionList()}
				  </select>

				  	 <input id="myValue" type="number"></input>
					  <input id="myUnit" type="text"></input>

				  </div>
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

  async function renderCarrierList(): Promise<string> {
	let html: string = ``;
	let carrier: string = `UPS`;	
	let allIntegrations = await vscode.workspace.findFiles('**/carriers/ups/**');

	allIntegrations.forEach(async element => {
		html += `<li>${element.path}</li>`;

		// Example on reading file
		// let document = await vscode.workspace.openTextDocument(element.path);
		// document.getText();
	});

	return html;
  }