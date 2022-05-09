import * as vscode from 'vscode';

export function getCarriers(){
	let carriers= ["ups", "tnt", "dhl", "dpd", "dsv", "rhenus"];
	return carriers;
}

export function getCarrierOptionList(): string {
	let html: string = ``;
	getCarriers().forEach(carrier => {
		html+= `<option value="${carrier}">${carrier}</option>`;
	});
	return html;
}

export async function getCarrierList(srCarrier:string): Promise<string> {
	let html: string = ``;
	let allIntegrations = await vscode.workspace.findFiles(`**/carriers/${srCarrier}/**`);

	allIntegrations.forEach(async element => {
		html += `<li>${element.path}</li>`;

	});
	return html;
}
