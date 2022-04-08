import * as vscode from 'vscode';

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

