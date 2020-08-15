const textArea = document.getElementById("text-input");
// import { puzzlesAndSolutions } from './puzzle-strings.js';

const validateGridCell = (r0, c0, grid) => {
  if (grid[r0][c0] === ".") {
    return true;
  }

  for (var row = 0; row < 9; ++row) {
    if (row === r0) continue;
    if (grid[row][c0] === grid[r0][c0]) {
      return false;
    }
  }

  for (var col = 0; col < 9; ++col) {
    if (col === c0) continue;
    if (grid[r0][col] === grid[r0][c0]) {
      return false;
    }
  }

  for (var rb = Math.floor(r0 / 3) * 3, dr = 0; dr < 3; rb++, dr++) {
    for (var cb = Math.floor(c0 / 3) * 3, dc = 0; dc < 3; cb++, dc++) {
      if (r0 === rb && c0 === cb) continue;
      if (grid[rb][cb] === grid[r0][c0]) {
        return false;
      }
    }
  }

  return true;
};

const validateGrid = grid => {
  for (var row = 0; row < 9; ++row) {
    for (var col = 0; col < 9; ++col) {
      if (!validateGridCell(row, col, grid)) {
        return false;
      }
    }
  }
  return true;
};

const dfs = (grid, r0, c0) => {
  if (r0 === 9) return true;

  if (grid[r0][c0] !== ".") {
    var c1 = c0 + 1;
    var r1 = r0;
    if (c1 === 9) {
      c1 = 0;
      r1++;
    }

    return dfs(grid, r1, c1);
  }

  for (var value = 1; value < 10; ++value) {
    grid[r0][c0] = "" + value;
    if (validateGridCell(r0, c0, grid)) {
      var c1 = c0 + 1;
      var r1 = r0;
      if (c1 === 9) {
        c1 = 0;
        r1++;
      }

      if (dfs(grid, r1, c1)) {
        return true;
      }
    }
    grid[r0][c0] = '.';
  }
  return false;
};

const solveGrid = grid => {
  console.log("Solving: ");
  console.log(grid);
  dfs(grid, 0, 0);
  console.log("Solved: ");
  console.log(grid);
  return grid;
};

const gridToInput = grid => {
  var str = "";
  for (var row = 0; row < 9; ++row) {
    for (var col = 0; col < 9; ++col) {
      str += grid[row][col];
    }
  }
  return str;
};

const buildGridId = i => {
  const row = Math.floor(i / 9);
  const col = i % 9;
  return String.fromCharCode("A".charCodeAt(0) + row) + (1 + col);
};

const breakGridId = id => {
  const row = id.charCodeAt(0) - "A".charCodeAt(0);
  const col = Number(id.charAt(1)) - 1;
  return row * 9 + col;
};

const textInputToGrid = str => {
  console.log('textArea -> grid');
  for (var i = 0, c = ""; i < str.length; ++i) {
    c = str[i];
    document.getElementById(buildGridId(i)).value = (c === '.' ? '' : c);
  }
};

const gridToTextInput = () => {
  console.log('grid -> text input');
  var str = "";
  for (var i = 0, cell; i < 81; ++i) {
    cell = document.getElementById(buildGridId(i)).value;
    if (i === 0) {
      console.log('Cell:' + cell);
    }
    str += cell ? cell : ".";
  }
  document.getElementById("text-input").value = str;
};

const parseInput = str => {
  if (!/^[1-9\.]{81}$/.test(str)) {
    document.getElementById("error-msg").text =
      "Error: Expected puzzle to be 81 characters long.";
    return null;
  }

  const grid = [];

  for (var row = 0; row < 9; ++row) {
    var rowArr = [];
    for (var col = 0; col < 9; ++col) {
      rowArr.push(str.charAt(row * 9 + col));
    }
    grid.push(rowArr);
  }

  return grid;
};

const textAreaOnInput = event => {
  const str = document.getElementById("text-input").value;

  textInputToGrid(str);
};

document
  .getElementById("text-input")
  .addEventListener("input", textAreaOnInput);

document.addEventListener("DOMContentLoaded", () => {
  // Load a simple puzzle into the text area
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  textAreaOnInput(null);
});

for (var i = 0; i < 81; ++i) {
  document.getElementById(buildGridId(i)).addEventListener("input", event => {
    const id = event.srcElement.id;
    if (!/^[1-9]$/.test(event.srcElement.value)) {
      event.srcElement.value = "";
      return;
    }
    gridToTextInput();
  });
}

const clearInput = () => {
  textArea.value = '';
  for (var i = 0; i < 81; ++i) {
    document.getElementById(buildGridId(i)).value = '';
  }
}

document.getElementById('solve-button').onclick = () => {
  showSolution(solve(document.getElementById('text-input').value));
}
document.getElementById('clear-button').onclick = clearInput;
/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/

const solve = (input) => {
  return solveGrid(parseInput(input));
}

const showSolution = (grid) => {
  const str = gridToInput(grid);
  document.getElementById('text-input').value = str
  textInputToGrid(str);
}

try {
  module.exports = {
    parseInput,
    validateGrid,
    solveGrid,
    gridToInput,
    clearInput,
    showSolution,
    solve
  };
} catch (e) {}
