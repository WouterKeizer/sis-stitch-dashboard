const vscodeApi = acquireVsCodeApi(); 

var ScriptArgumentsField = document.getElementById('ScriptArguments');
ScriptArgumentsField.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {  
        executeScript();
    }
});
var ScriptCommandField =  document.getElementById('ScriptCommand');

function startScript(){
    vscodeApi.postMessage({command: "startScript", text: "Start Selected Script"});
  };

  function startCarrier(){
    vscodeApi.postMessage({command: "startCarrier", text: `${ScriptCommandField.value}`});
  };
