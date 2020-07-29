hljs.initHighlightingOnLoad();

// Hijack console.log
function hijackConsole(methodName, newMethodFunction) {
    let newName = methodName + "2";
    console[newName] = console[methodName];
    let func = newMethodFunction.toString();
    let newFunc = func.replace(new RegExp("console." + methodName), "console." + newName);
    eval("console." + methodName + " = " + newFunc);
}

function consoleWrite(color, ...texts) {
    let content = "";
    if (color) content += "<span style='color: " + color +"'>"
    for (let i = 0; i < texts.length; i++) {
        content += texts[i];
        if (i < texts.length - 1) content += " ";
    }
    content += (color ? "</span>" : "") + "\n";
    consoleOutput.innerHTML += content;
}

yodaEditor.spellcheck = false;
hijackConsole("log", (...args) => {
    console.log(...args);
    consoleWrite(null, ...args);
})
hijackConsole("error", (...args) => {
    console.error(...args);
    consoleWrite("#f65", ...args);
})

function clearConsole() {
    consoleOutput.innerHTML = "";
    console.clear()
}
function clearOutput() {
    output.innerHTML = "";
}



compileBtn.onclick = () => {
    hljs.highlightBlock(yodaEditor);
    clearOutput();

    let generatorName = compileLang.options[compileLang.selectedIndex].value;
    let generator = Yoda.Generators[generatorName];

    if (!generator) {
        alert("Ooops! It seems like that generator is not implemented yet :/\nFeel free to implement it yourself and send me a pull-request!");
        return;
    }

    let code = Yoda.Transpile(yodaEditor.innerText, true, generator);
    output.innerHTML = code;
    
    hljs.highlightBlock(output);
}
runBtn.onclick = () => {
    hljs.highlightBlock(yodaEditor);
    clearConsole();
    let jscode = Yoda.Transpile(yodaEditor.innerText);
    let trycode = `
try {
    ${jscode}
}
catch(e) {console.error(e.stack);} 
    `;
    try {
        eval(trycode);
    }
    catch(e) {console.error("Syntax Error:", e.message);}
}
window.onkeydown = e => {
    if (e.ctrlKey && e.key == "Enter") {
        compileBtn.click();
        runBtn.click();
    }
}