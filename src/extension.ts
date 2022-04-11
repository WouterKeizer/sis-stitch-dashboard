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
  
		// And set its HTML content
			
		const updateWebview = (carrier: string) => {
			getMyWebviewContent(panel.webview, context, carrier).then(html =>panel.webview.html = html);   // <--- HTML
		  };

		updateWebview("tnt");


		// Get path to script on disk
			let scriptPath = vscode.Uri.file(
				path.join(context.extensionPath, 'scripts', 'script.ps1')
			);
			// let scriptPath = Uri.URI.file(context.asAbsolutePath(path.join('scripts', 'script.ps1')));

			// Pre-allocate terminal and terminalExists
			let terminal: vscode.Terminal;
			let terminalExists: boolean;

		panel.webview.onDidReceiveMessage(
			message => {
				// check if terminal exists and is still alive
				terminalExists = (terminal && !(terminal.exitStatus));

				switch (message.command) {
					case 'startScript':
						if (!terminalExists) {
							vscode.window.showErrorMessage(message.text);
							terminal = startScript('','',`Write-Host 'Hello World!'`);
						} else {
							vscode.window.showErrorMessage('Script already started!');
						}
						break;

					case 'startCarrier':
						
						//updateWebview(message.text);
						terminal = startScript('','',message.text);

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

function startScript (fileName ?: string , filePath ?: string , command ?: string) : vscode.Terminal {
	let terminal = vscode.window.createTerminal('bram');
	terminal.show();
	//terminal.sendText('Get-Location');
	if (filePath && filePath !== '') {
		terminal.sendText(`cd ${filePath}`);
	};
	
	if (fileName && fileName !== '') {
		terminal.sendText(`./${fileName}`);
	};

	if (command && command !== '') {
		terminal.sendText(command);
	};
	
	return terminal;
}

  async function getMyWebviewContent(webview: vscode.Webview, context: any, carrier:string) : Promise<string> { 
	let html: string = ``;
	let foldersHtml: string = ``;
	
	const myStyle = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'style.css'));   // <--- 'media' is the folder where the .css file is stored
	const scriptURI = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src/scripts', 'main.js'));   // <--- 'media' is the folder where the .css file is stored
	
	let carrierlist = await rCarrierList(carrier);
	// construct your HTML code
	html += `
			<!DOCTYPE html>
			<html>
				<head>
				  	<link href="${myStyle}" rel="stylesheet" />  
					<script src="${scriptURI}"></script> 
				</head>
				<body>
				<div>
					<button class="button-34" role="button" onclick="startScript()" id="startScript">Start script</button>
					<button class="button-34" role="button" onclick="startCarrier()" id="startCarrier">Start Carrier</button>
				</div>
				  <div class="main"> 
					<label for="carriers">Choose a carrier:</label>
					<select id="terst">
						${getCarrierOptionList()}
					</select>

					<input type="text" maxlength="512" id="ScriptCommand" class="searchField"/>

					<button class="button-34" role="button" onclick="renderCarrierList()" id="renderCarrierList">Refresh</button>



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

  async function rCarrierList(selectedCarrier:string): Promise<string> {
	let html: string = ``;
	let allIntegrations = await vscode.workspace.findFiles(`**/carriers/${selectedCarrier}/**`);

	allIntegrations.forEach(async element => {
		html += `<li>${element.path}</li>`;

		// Example on reading file
		// let document = await vscode.workspace.openTextDocument(element.path);
		// document.getText();
	});

	return html;
  }