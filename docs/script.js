const pixelSize = 10;
const numCells = 32;
const canvas = document.getElementById("background");
canvas.width = pixelSize * numCells;
canvas.height = pixelSize * numCells;
const context = canvas.getContext("2d");
let arr = buildArr();

function debug(arr) {
  for (let i = 0; i < numCells; i++) {
    let linha = "";
    for (let j = 0; j < numCells; j++) {
      linha += arr[i][j];
    }
    console.log(linha);
  }
}

function buildArr() {
  var arr = [];
  for (let i = 0; i < numCells; i++) {
    const innerArr = [];
    for (let j = 0; j < numCells; j++) {
      innerArr.push(0);
    }
    arr.push(innerArr);
  }
  return arr;
}

function display(arr) {
  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr[x].length; y++) {
      drawCell(x, y, arr[x][y]);
    }
  }
}

function drawCell(x, y, alive) {
  context.beginPath();
  context.rect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  context.fillStyle = alive ? "black" : "#EEE";
  context.fill();
}

function random(arr) {
  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr[x].length; y++) {
      if (Math.log(Math.random() * 10) < 1.5) {
        arr[x][y] = 1;
      }
    }
  }
}

function aliveNeighbors(arr, x, y) {
  if (x > 0 && y > 0 && x < numCells - 1 && y < numCells - 1) {
    const totalAlive =
      arr[x - 1][y - 1] +
      arr[x][y - 1] +
      arr[x + 1][y - 1] +
      arr[x - 1][y] +
      //arr[x][y]+
      arr[x + 1][y] +
      arr[x - 1][y + 1] +
      arr[x][y + 1] +
      arr[x + 1][y + 1];
    return totalAlive;
  } else {
    return 0;
  }
}

function step(arr) {
  const newArr = buildArr();
  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr[x].length; y++) {
      const cell = arr[x][y];
      const alives = aliveNeighbors(arr, x, y);

      if (cell == 1) {
        if (alives < 2) {
          newArr[x][y] = 0;
        } else if (alives == 2 || alives == 3) {
          newArr[x][y] = 1;
        } else if (alives > 3) {
          newArr[x][y] = 0;
        }
      } else if (cell == 0 && alives == 3) {
        newArr[x][y] = 1;
      }
    }
  }

  return newArr;
}

function skip() {
  var newArr = step(arr);
  display(newArr);
  arr = newArr;
}

function manualSetup(event, arr) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / pixelSize);
  const y = Math.floor((event.clientY - rect.top) / pixelSize);

  if (arr[x][y] === 1) {
    drawCell(x, y, false);
    arr[x][y] = 0;
  } else {
    drawCell(x, y, true);
    arr[x][y] = 1;
  }

  console.log("x: " + x + " y: " + y);
}

random(arr);
display(arr);
let interval = null;

document.querySelector("#next").addEventListener("click", skip);

document.querySelector("#random").addEventListener("click", () => {
  arr = buildArr();
  random(arr);
  display(arr);
});
document.querySelector("#clear").addEventListener("click", () => {
  arr = buildArr();
  display(arr);
  clearInterval(interval);
});
document.querySelector("#background").addEventListener("click", (event) => {
  manualSetup(event, arr);
});
document.querySelector("#play").addEventListener("click", () => {
  if (!interval) {
    document.querySelector("#play").classList.add("active");
    interval = setInterval(function () {
      var newArr = step(arr);
      display(newArr);
      arr = newArr;
    }, 500);
  }
});
document.querySelector("#stop").addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  document.querySelector("#play").classList.remove("active");
});
