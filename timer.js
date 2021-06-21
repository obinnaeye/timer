const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 7;
const ALERT_THRESHOLD = 3;

const schedule = [
  {
    minister: "HOJ Choir",
    time: 0.25,
    item: "Praise/Worship"
  },
  {
    minister: "Bisi",
    time: 0.25,
    item: "Praise/Worship"
  },
  {
    minister: "Sis Yemisi",
    time: 0.25,
    item: "Praise/Worship"
  },
  {
    minister: "RCCG, Grace Center",
    time: 0.25,
    item: "Praise/Worship"
  },
  {
    minister: "HOJ Choir",
    time: 0.25,
    item: "Praise/Worship"
  }
]

let current_index = 0;

let COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

let TIME_LIMIT = 5;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
let eventData = [];
let refresh = true;
let timeouts = [];

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
<div><i style="font-size:24px" class="fa" onclick="startStop()">&#xf04b;</i></div>
<div class="settings-button-container"><i id="settings-button" style="font-size:24px" class="fa" onclick="settingsDisplay()">&#xf013;</i></div>
`;

function startStop() {
    reset();
    clearInterval(timerInterval);
    startTimer();
}

function reset() {
    const current_schedule = schedule[current_index];
    document.getElementById("item").innerHTML = current_schedule.item;
    document.getElementById("minister").innerHTML = current_schedule.minister;
    TIME_LIMIT = current_schedule.time * 60;
    COLOR_CODES.warning["threshold"] = current_schedule.time * 60 * 0.25;
    COLOR_CODES.alert["threshold"] = current_schedule.time * 60 * 0.12;
    clearInterval(timerInterval);
    const elm = document.getElementById("base-timer-label");
    removeClass(elm, "white");
    removeClass(elm, "flash");
    refresh = true;
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    timerInterval = null;
    flashTimerInterval1 = null;
    flashTimerInterval2 = null;
    remainingPathColor = COLOR_CODES.info.color;
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(COLOR_CODES.alert.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(COLOR_CODES.warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(COLOR_CODES.info.color);
    eventData = [];
}

const elm = document.getElementById("base-timer-label");

function onTimesUp() {
    clearInterval(timerInterval);
    current_index++;
    if (current_index < schedule.length) {
        console.log("here now ")
        startStop();
    } else {
        flashlight();
    }
}

function startTimer() {
    refresh = false;
    const elm = document.getElementById("base-timer-label");
    removeClass(elm, "white");
    removeClass(elm, "flash");
    timerInterval = setInterval(() => {
        if (timeLeft === 0) {
            onTimesUp();
        } else {
          timePassed = timePassed += 1;
          timeLeft = TIME_LIMIT - timePassed;
          document.getElementById("base-timer-label").innerHTML = formatTime(
              timeLeft
          );
          setCircleDasharray();
          setRemainingPathColor(timeLeft);
        }
    }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

var obj_csv = {
    size:0,
    dataFile:[]
};
 
function readFile(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsBinaryString(input.files[0]);
        reader.onload = function (e) {
            obj_csv.size = e.total;
            obj_csv.dataFile = e.target.result
            eventData = parseData(obj_csv.dataFile);
                    
        }
    }
    input.value = null
}
 
function parseData(data){
    let csvData = [];
    let lbreak = data.split("\n");
    lbreak.forEach(res => {
        csvData.push(res.split(","));
    });
    return csvData;
}

function settingsDisplay() {
    document.getElementById("settings").style.display = "block"
}

function settingsClose() {
  document.getElementById("settings").style.display = "none"
}



// function flashlight() {
//     var cls = "flash";
//     addClass(elm, "white")
//     removeClass(elm, cls);
//     flashTimerInterval1 = setInterval(function() {
//       removeClass(elm, "white")
//       addClass(elm, cls);
//       flashTimerInterval2 = setInterval(function(){
//           flashlight();
//       }, 500)
//     }, 1000);
// }
const delay = ms => new Promise(res => setTimeout(res, ms));

// function flashlight() {
//   var cls = "flash";
//   addClass(elm, "white")
//   removeClass(elm, cls);
//   for (let i = 0; i <= 10; i++) {
//     setTimeout(function() {
//       removeClass(elm, "white")
//       addClass(elm, cls);
//       setTimeout(function(){
//         addClass(elm, "white")
//         removeClass(elm, cls);
//       }, 500)
//     }, 1000);
//   }
// }

async function flashlight() {
  var cls = "flash";
  addClass(elm, "white")
  removeClass(elm, cls);
  for (let i = 0; timeLeft <= i; i += 0) {
      await delay(500)
      removeClass(elm, "white")
      addClass(elm, cls);

      await delay(500)
      
      addClass(elm, "white")
      removeClass(elm, cls);
  }
  removeClass(elm, "white");
}

function addClass(element, cls) {
  var arr;
  arr = element.className.split(" ");
  if (arr.indexOf(cls) == -1) {
    element.className = element.className.trim() + " " + cls;
  }
}

function removeClass(element, cls) {
  // var re = new RegExp("/ *\b"+cls+"\b */", "g"); 
  element.className = element.className.split(cls).join("");
  // element.className = element.className.replace(/ *\bflash\b */g, " ");
}