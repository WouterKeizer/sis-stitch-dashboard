const vscodeApi = acquireVsCodeApi(); 

const selectCarrier = () =>{
  let sCarrier = document.querySelector("#SelectedCarrier").value; 
  vscodeApi.postMessage({command: "startCarrier", text: sCarrier});
};