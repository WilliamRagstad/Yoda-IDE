"use strict";

hljs.initHighlightingOnLoad(); // Hijack console.log

function hijackConsole(methodName, newMethodFunction) {
  var newName = methodName + "2";
  console[newName] = console[methodName];
  var func = newMethodFunction.toString();
  var newFunc = func.replace(new RegExp("console." + methodName), "console." + newName);
  eval("console." + methodName + " = " + newFunc);
}

function consoleWrite(color) {
  var content = "";
  if (color) content += "<span style='color: " + color + "'>";

  for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i++) {
    content += i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];
    if (i < (arguments.length <= 1 ? 0 : arguments.length - 1) - 1) content += " ";
  }

  content += (color ? "</span>" : "") + "\n";
  consoleOutput.innerHTML += content;
}

yodaEditor.spellcheck = false;
hijackConsole("log", function () {
  var _console;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  (_console = console).log.apply(_console, args);

  consoleWrite.apply(void 0, [null].concat(args));
});
hijackConsole("error", function () {
  var _console2;

  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  (_console2 = console).error.apply(_console2, args);

  consoleWrite.apply(void 0, ["#f65"].concat(args));
});

function clearConsole() {
  consoleOutput.innerHTML = "";
  console.clear();
}

function clearOutput() {
  output.innerHTML = "";
}

compileBtn.onclick = function () {
  hljs.highlightBlock(yodaEditor);
  clearOutput();
  var generatorName = compileLang.options[compileLang.selectedIndex].value;
  var generator = Yoda.Generators[generatorName];

  if (!generator) {
    alert("Ooops! It seems like that generator is not implemented yet :/\nFeel free to implement it yourself and send me a pull-request!");
    return;
  }

  var code = Yoda.Transpile(yodaEditor.innerText, true, generator);
  output.innerHTML = code;
  hljs.highlightBlock(output);
};

runBtn.onclick = function () {
  hljs.highlightBlock(yodaEditor);
  clearConsole();
  var jscode = Yoda.Transpile(yodaEditor.innerText);
  var trycode = "\ntry {\n    ".concat(jscode, "\n}\ncatch(e) {console.error(e.stack);} \n    ");

  try {
    eval(trycode);
  } catch (e) {
    console.error("Syntax Error:", e.message);
  }
};

window.onkeydown = function (e) {
  if (e.ctrlKey && e.key == "Enter") {
    compileBtn.click();
    runBtn.click();
  }
};