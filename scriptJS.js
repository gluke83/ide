var javaEditor;

window.onload = function() {
 javaEditor = CodeMirror.fromTextArea(
    document.getElementById("user-code"),
    {
        mode:  "text/javascript",
        lineNumbers: true,
        theme: "default",
    });

};

var currentFontSize = 12; // Initial font size

// Custom console
const customConsole = {
    log: (...args) => {
        // Append messages to your console div
        document.getElementById("console").innerText += args.join(" ") + "\n";
    },
    // You can add other console methods here if needed
};

var shouldStopExecution = false;

function runInSandbox(code) {
    // Injecting a stop condition into the execution context
    const modifiedCode = `
        function checkExecutionTime() {
            if (shouldStopExecution) {
                throw new Error('Execution time limit exceeded');
            }
        }
        ${code}
    `;

    try {
        // Create a new function with a limited scope
        const sandboxFunction = new Function("console", modifiedCode);

        // Start a timer that will set shouldStopExecution to true after 5 seconds
        shouldStopExecution = false;
        setTimeout(() => { shouldStopExecution = true; }, 5000);

        // Execute the function with customConsole as console
        sandboxFunction(customConsole);
    } catch (error) {
        // Displaying errors in your console div
        document.getElementById("console").innerText = "Error: " + error.message;
    }
}


function runCode() {
    
        document.getElementById("console").innerText = ""; // Clear console
        const code = javaEditor.getValue();

        runInSandbox(code);
 
}



function generatePDF() {
    var doc = new window.jspdf.jsPDF();
    doc.setFont("courier");
    doc.setFontSize(currentFontSize);
    doc.text(javaEditor.getValue(), 10, 10);
    doc.save("java_code.pdf");
}

function loadFile() {
    document.getElementById("fileInput").click();
}

function saveFile() {
    var content = javaEditor.getValue();
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "java_code.txt");
}

function increaseFontSize() {
    currentFontSize++;
    javaEditor.getWrapperElement().style.fontSize = currentFontSize + "px";
    javaEditor.refresh();
}

function decreaseFontSize() {
    if (currentFontSize > 1) {
        currentFontSize--;
        javaEditor.getWrapperElement().style.fontSize = currentFontSize + "px";
        javaEditor.refresh();
    }
}

document.getElementById("fileInput").addEventListener("change", function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        javaEditor.setValue(e.target.result);
    };
    reader.readAsText(file);
});
