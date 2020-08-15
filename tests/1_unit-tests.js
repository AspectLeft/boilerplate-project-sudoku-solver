/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let Solver;

suite('UnitTests', () => {
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    return JSDOM.fromFile('./views/index.html')
      .then((dom) => {
        global.window = dom.window;
        global.document = dom.window.document;

        Solver = require('../public/sudoku-solver.js');
      });
  });
  
  // Only the digits 1-9 are accepted
  // as valid input for the puzzle grid
  suite('Function ____()', () => {
    test('Valid "1-9" characters', (done) => {
      const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      
      input.forEach(digit => {
        const input = global.document.getElementById('A1');
        input.setAttribute('value', digit);
        
        const event = new window.Event('input');
        input.dispatchEvent(event);
        
        console.log(global.document.getElementById('A1').value);
        
        assert.equal(global.document.getElementById('A1').value, digit);
      })

      done();
    });

    // Invalid characters or numbers are not accepted 
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9") are not accepted', (done) => {
      const input = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];

      input.forEach(digit => {
        const input = global.document.getElementById('A1');
        input.setAttribute('value', digit);
        
        const event = new window.Event('input');
        input.dispatchEvent(event);
        
        assert.equal(global.document.getElementById('A1').value, '');
      })
      done();
    });
  });
  
  suite('Function parseInput()', () => {
    test('Parses a valid puzzle string into an object', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      
      const grid = Solver.parseInput(input);
      
      for (var row = 0; row < 9; ++row) {
        for (var col = 0; col < 9; ++col) {
          assert.equal(grid[row][col], input.charAt(row * 9 + col));
        }
      }
      done();
    });
    
    // Puzzles that are not 81 numbers/periods long show the message 
    // "Error: Expected puzzle to be 81 characters long." in the
    // `div` with the id "error-msg"
    test('Shows an error for puzzles that are not 81 numbers long', done => {
      const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
      const errorDiv = document.getElementById('error-msg');
      
      Solver.parseInput(shortStr);
      assert.equal(errorDiv.text, errorMsg);
      Solver.parseInput(longStr);
      assert.equal(errorDiv.text, errorMsg);
      
      done();
    });
  });

  suite('Function validateGrid()', () => {
    // Valid complete puzzles pass
    test('Valid puzzles pass', done => {
      const input = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      
      assert.isTrue(Solver.validateGrid(Solver.parseInput(input)));
      done();
    });

    // Invalid complete puzzles fail
    test('Invalid puzzles fail', done => {
      const input = '769235418851496372732178956174569283395842761628713549283657194516924837947381625';

      assert.isFalse(Solver.validateGrid(Solver.parseInput(input)));
      done();
    });
  });
  
  
  suite('Function solveGrid()', () => {
    // Returns the expected solution for a valid, incomplete puzzle
    test('Returns the expected solution for an incomplete puzzle', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const expectedOutput = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      
      const grid = Solver.parseInput(input);
      Solver.solveGrid(grid);
      assert.equal(Solver.gridToInput(grid), expectedOutput);
      done();
    });
  });
});
