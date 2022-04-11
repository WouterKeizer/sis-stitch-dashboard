// Get access to the VS Code API from within the webview context
const vscode = acquireVsCodeApi();

// Just like a regular webpage we need to wait for the webview
// DOM to load before we can reference any of the HTML elements
// or toolkit components
window.addEventListener("load", main);

function main() {
  setVSCodeMessageListener();

  const carrierButton = document.getElementById("submit-carrier");
  carrierButton.addEventListener("click", () => showCarrierFiles("UPS"));

}

function showCarrierList(selectedCarrier){
	// let html = ``;
	// let carrier = `ups`;	
	// let allIntegrations = await vscode.workspace.findFiles('**/carriers/ups/**');

	// allIntegrations.forEach(async element => {
	// 	html += `<li>${element.path}</li>`;

	// 	// Example on reading file
	// 	// let document = await vscode.workspace.openTextDocument(element.path);
	// 	// document.getText();
	// });

    html += `<h1>${selectedCarrier}</h1>`;

	return html;
  }
