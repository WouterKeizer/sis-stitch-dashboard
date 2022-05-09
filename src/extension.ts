import * as vscode from 'vscode';
import { CarrierDashboard } from './panels/CarrierDashboard';
import { HelloWorldPanel } from "./panels/HelloWorldPanel";

export function activate(context: vscode.ExtensionContext) {

	const helloCommand = vscode.commands.registerCommand("hello-world.helloWorld", () => {
		HelloWorldPanel.render(context.extensionUri);
	});
	context.subscriptions.push(helloCommand);

	const carrierDashboard = vscode.commands.registerCommand("sis-dashboard.carrier", () => {
		CarrierDashboard.render(context.extensionUri);
	});
	context.subscriptions.push(carrierDashboard);
	
  }