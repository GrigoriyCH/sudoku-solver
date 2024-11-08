class SudokuSolver {
  // Validate if the puzzle string is correct
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    return true;
  }

  // Check if placing `value` in the specified row is valid
  checkRowPlacement(puzzleString, row, value) {
    const rowStart = row * 9;
    for (let i = rowStart; i < rowStart + 9; i++) {
      if (puzzleString[i] === value) return false;
    }
    return true;
  }

  // Check if placing `value` in the specified column is valid
  checkColumnPlacement(puzzleString, column, value) {
    for (let i = 0; i < 9; i++) {
      const index = i * 9 + column;
      if (puzzleString[index] === value) return false;
    }
    return true;
  }

  // Check if placing `value` in the specified 3x3 grid is valid
  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const index = (startRow + i) * 9 + (startCol + j);
        if (puzzleString[index] === value) return false;
      }
    }
    return true;
  }

  // Solve the puzzle if valid
  // Solve the puzzle if valid
  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    
    // Return a generic "cannot be solved" message if validation fails
    if (validation !== true) {
        return { error: 'Puzzle cannot be solved' };
    }

    const puzzleArray = puzzleString.split('');
    
    const solveHelper = (index) => {
        if (index >= 81) return true;  // Solution complete
        if (puzzleArray[index] !== '.') return solveHelper(index + 1);

        for (let num = 1; num <= 9; num++) {
            const char = num.toString();
            const row = Math.floor(index / 9);
            const col = index % 9;
            // Check if placing the number is valid
            if (
                this.checkRowPlacement(puzzleArray.join(''), row, char) &&
                this.checkColumnPlacement(puzzleArray.join(''), col, char) &&
                this.checkRegionPlacement(puzzleArray.join(''), row, col, char)
            ) {
                puzzleArray[index] = char; // Place the number
                if (solveHelper(index + 1)) return true; // Continue solving
                puzzleArray[index] = '.'; // Backtrack if not solvable
            }
        }
        return false; // No valid placements found
    };

    return solveHelper(0) ? { solution: puzzleArray.join('') } : { error: 'Puzzle cannot be solved' };
  };

};

module.exports = SudokuSolver;