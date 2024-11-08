const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
const solver = new SudokuSolver();

suite('Unit Tests', () => {

  const expectedSolution =        '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
  const validPuzzle =             '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const invalidPuzzleCharacters = 'Ф.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const incompletePuzzle =        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..';


  test('Logic handles a valid puzzle string of 81 characters', () => {
    const result = solver.validate(validPuzzle);
    assert.strictEqual(result, true, 'Expected puzzle to be valid');
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const result = solver.validate(invalidPuzzleCharacters);
    assert.deepEqual(result, { error: 'Invalid characters in puzzle' }, 'Expected puzzle to contain invalid characters');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const result = solver.validate(incompletePuzzle);
    assert.deepEqual(result, { error: 'Expected puzzle to be 81 characters long' }, 'Expected puzzle to be invalid due to length');
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, '4'), 'Expected row placement to be valid');
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, '1'), 'Expected row placement to be invalid');
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColumnPlacement(validPuzzle, 2, '3'), 'Expected column placement to be valid');
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(solver.checkColumnPlacement(validPuzzle, 1, '5'), 'Expected column placement to be invalid');
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 0, 0, '7'), 'Expected region placement to be valid');
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 0, 0, '5'), 'Expected region placement to be invalid');
  });

  test('Valid puzzle strings pass the solver', () => {
    const solution = solver.solve(validPuzzle);
    assert.property(solution, 'solution', 'Expected a solution to be returned');
  });

  test('Invalid puzzle strings fail the solver', () => {
    const solution = solver.solve(invalidPuzzleCharacters);
    assert.deepEqual(solution, { error: 'Puzzle cannot be solved' }, 'Expected an error for unsolvable puzzle');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const solution = solver.solve(validPuzzle).solution;
    assert.strictEqual(solution, expectedSolution, 'Expected the solution to match');
  });
});
