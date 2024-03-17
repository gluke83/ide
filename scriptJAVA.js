// Initialize CodeMirror for Java editing
var javaEditor = CodeMirror.fromTextArea(document.getElementById("user-code"), {
    mode: "text/x-java",
    lineNumbers: true,
    theme: "default",
});

// Starter Java code with a Main class and a main method
var starterCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`;

javaEditor.setValue(starterCode); // Set the starter code as the initial content of the editor
var currentFontSize = 12; // Initial font size for the editor




function generatePDF() {
    var doc = new window.jspdf.jsPDF();
    doc.setFont("courier");
    doc.setFontSize(currentFontSize);
    doc.text(javaEditor.getValue(), 10, 10);
    doc.save("code.pdf");
}

// File loading and saving functionalities
function loadFile() {
    document.getElementById("fileInput").click();
}

function saveFile() {
    var content = javaEditor.getValue();
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "java_code.txt");
}

// Font size adjustment functions for the editor
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

// File input change event listener
document.getElementById("fileInput").addEventListener("change", function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        javaEditor.setValue(e.target.result);
    };
    reader.readAsText(file);
});
