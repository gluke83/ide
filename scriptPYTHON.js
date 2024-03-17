var pythonEditor;




window.onload = function() {
    pythonEditor = CodeMirror.fromTextArea(document.getElementById("user-code"), {
        mode: "python",
        lineNumbers: true,
        theme: "default",
    });

    brython(); // Initialize Brython
    overridePythonPrint();

    // Enable the run button after Brython is initialized
    document.getElementById("run-button").disabled = false;
};



function runCode() {
    document.getElementById("console").innerText = '';
    var userCode = pythonEditor.getValue();
    try {
        // Convert Python code to JavaScript
        var jsCode = __BRYTHON__.python_to_js(userCode);

        // Run the converted JavaScript code
        eval(jsCode);
    } catch (error) {
        customConsole.log("Error: " + error.message);
    }
}




var currentFontSize = 12;




const customConsole = {
    log: (data) => {
        if (data !== undefined && data !== null) {
            // Convert to string
            data = String(data);

        
            // Add the data with a single newline to the console
            document.getElementById("console").innerText += data;
        }
    },
};



function generatePDF() {
    var doc = new window.jspdf.jsPDF();
    doc.setFont("courier");
    doc.setFontSize(currentFontSize);
    doc.text(pythonEditor.getValue(), 10, 10);
    doc.save("python_code.pdf");
}

function loadFile() {
    document.getElementById("fileInput").click();
}

function saveFile() {
    var content = pythonEditor.getValue();
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "python_code.txt");
}

function increaseFontSize() {
    currentFontSize++;
    pythonEditor.getWrapperElement().style.fontSize = currentFontSize + "px";
    pythonEditor.refresh();
}

function decreaseFontSize() {
    if (currentFontSize > 1) {
        currentFontSize--;
        pythonEditor.getWrapperElement().style.fontSize = currentFontSize + "px";
        pythonEditor.refresh();
    }
}

document.getElementById("fileInput").addEventListener("change", function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        pythonEditor.setValue(e.target.result);
    };
    reader.readAsText(file);
});



function overridePythonPrint() {
    var _print = console.log;
    console.log = function(...args) {
        customConsole.log(...args);
        _print.apply(console, args);
    };

    window.__BRYTHON__.stdout.write = function(data) {
        customConsole.log(data);
    };
}