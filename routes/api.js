'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  // Route for checking placement validity
  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // Check for missing fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // Validate the puzzle string
      const validation = solver.validate(puzzle);
      if (validation !== true) {
        return res.json(validation);
      }

      // Check if the coordinate is valid
      const row = coordinate[0].toUpperCase(); // e.g., 'A'
      const col = coordinate[1]; // e.g., '1'

      // Ensure that the coordinate has exactly 2 characters
      if (coordinate.length !== 2 || !/[A-I]/.test(row) || !/[1-9]/.test(col)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // Calculate row and column indices
      const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0); // Convert row letter to index (0-8)
      const colIndex = parseInt(col) - 1; // Convert column number to index (0-8)

      // Validate the value
      if (!/^[1-9]$/.test(value)) { // Ensure value is a single digit between 1-9
        return res.json({ error: 'Invalid value' });
      }

      // Check if the value is already in the puzzle
      if (puzzle[rowIndex * 9 + colIndex] === value) {
        return res.json({ valid: true });
      }

      let conflicts = [];
      // Check for conflicts
      if (!solver.checkRowPlacement(puzzle, rowIndex, value)) conflicts.push('row');
      if (!solver.checkColumnPlacement(puzzle, colIndex, value)) conflicts.push('column');
      if (!solver.checkRegionPlacement(puzzle, rowIndex, colIndex, value)) conflicts.push('region');

      // Return valid or conflicting placements
      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      // If no conflicts, return valid true
      return res.json({ valid: true });
    });

  // Route for solving the puzzle
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validation = solver.validate(puzzle);
      if (validation !== true) {
        return res.json(validation);
      }

      const solution = solver.solve(puzzle);
      return res.json(solution.error ? solution : { solution: solution.solution });
    });
};
