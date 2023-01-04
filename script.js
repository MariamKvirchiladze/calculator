`use strict`;

const keys = document.querySelectorAll(`.key`);
const displayInput = document.querySelector(`.display .input`);
const displayOutput = document.querySelector(`.display .output`);
let input = "";
for (let key of keys) {
  const value = key.dataset.key;

  key.addEventListener(`click`, () => {
    playsound();

    if (value == `clear`) {
      input = "";
      displayInput.innerHTML = "";
      displayOutput.innerHTML = "";
    } else if (value == `backspace`) {
      input = input.slice(0, -1);
      displayInput.innerHTML = cleanInput(input);
    } else if (value == `=`) {
      let result = eval(percentInput(input));
      displayOutput.innerHTML = cleanOutput(result);
    } else if (value == `brackets`) {
      if (
        input.indexOf("(") == -1 ||
        (input.indexOf("(") != -1 &&
          input.indexOf(")") != -1 &&
          input.lastIndexOf("(") < input.lastIndexOf(")"))
      ) {
        input += "(";
      } else if (
        (input.indexOf("(") != -1 && input.indexOf(")") == -1) ||
        (input.indexOf("(") != -1 &&
          input.indexOf(")") != -1 &&
          input.lastIndexOf("(") > input.lastIndexOf(")"))
      ) {
        input += ")";
      }
      displayInput.innerHTML = cleanInput(input);
    } else {
      if (checkInput(value)) {
        input += value;
        displayInput.innerHTML = cleanInput(input);
      }
    }
  });
}

function cleanInput(input) {
  let inputArr = input.split("");
  let inputAllLength = inputArr.length;

  for (let i = 0; i < inputAllLength; i++) {
    if (inputArr[i] == "*") {
      inputArr[i] = `<span class="operator">X</span>`;
    } else if (inputArr[i] == "/") {
      inputArr[i] = `<span class="operator">/</span>`;
    } else if (inputArr[i] == "+") {
      inputArr[i] = `<span class="operator">+</span>`;
    } else if (inputArr[i] == "-") {
      inputArr[i] = `<span class="operator">-</span>`;
    } else if (inputArr[i] == "+") {
      inputArr[i] = `<span class="operator">+</span>`;
    } else if (inputArr[i] == "(") {
      inputArr[i] = `<span class="brackets">(</span>`;
    } else if (inputArr[i] == ")") {
      inputArr[i] = `<span class="brackets">)</span>`;
    } else if (inputArr[i] == "%") {
      inputArr[i] = `<span class="percent">%</span>`;
    }
  }
  return inputArr.join("");
}

function cleanOutput(output) {
  let outputStr = output.toString();
  let decimal = outputStr.split(".")[1];
  outputStr = outputStr.split(".")[0];

  let outputArr = outputStr.split("");

  if (outputArr.length > 3) {
    for (let i = outputArr.length - 3; i > 0; i -= 3) {
      outputArr.splice(i, 0, ",");
    }
  }
  if (decimal) {
    outputArr.push(".");
    outputArr.push(decimal);
  }
  return outputArr.join("");
}

function checkInput(value) {
  let lastInput = input.slice(-1);
  let operators = ["+", "-", "/", "*"];

  if (value == "." && lastInput == ".") {
    return false;
  }
  if (operators.includes(value)) {
    if (operators.includes(lastInput)) {
      return false;
    } else {
      return true;
    }
  }
  return true;
}

function percentInput(input) {
  let input_arr = input.split("");

  for (let i = 0; i < input_arr.length; i++) {
    if (input_arr[i] == "%") {
      input_arr[i] = "/100";
    }
  }
  return input_arr.join("");
}

const audio = new Audio();

const soundbtn = document.querySelector(`.sound`);
soundbtn.addEventListener(`click`, () => {
  soundbtn.classList.toggle(`on`);
});
function playsound() {
  audio.src = `sound.mp3`;
  if (soundbtn.classList.contains(`on`)) {
    audio.play();
  }
}

const microphone = document.querySelector(`.audio-recognition`);

microphone.addEventListener(`click`, speechRecognition);

function speechRecognition() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";

  recognition.onstart = function () {
    microphone.classList.add(`listening`);
  };
  recognition.onspeechend = function () {
    microphone.classList.remove(`listening`);
    recognition.stop();
  };
  recognition.onresult = function (event) {
    console.log(event);
    const transcript = event.results[0][0].transcript;

    let result = eval(transcript);
    displayOutput.innerHTML = cleanOutput(result);
  };

  recognition.start();
}
