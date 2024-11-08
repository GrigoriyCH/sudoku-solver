const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Update this path according to your server file
const assert = chai.assert;

// Define constants for the puzzles
const expectedSolution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
const validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const invalidPuzzleCharacters = 'Ф.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const incompletePuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..';

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  // Test to solve a puzzle with valid puzzle string
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        assert.equal(res.body.solution.length, 81); // Solution should be 81 characters
        done();
      });
  });

  // Test to solve a puzzle with missing puzzle string
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field missing' });
        done();
      });
  });

  // Test to solve a puzzle with invalid characters
  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidPuzzleCharacters })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  // Test to solve a puzzle with incorrect length
  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    const shortPuzzle = validPuzzle.slice(0, 80); // Create a short puzzle with 80 characters
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: shortPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  // Test to solve a puzzle that cannot be solved
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    const unsolvablePuzzle = validPuzzle + '.'; // An example of an unsolvable puzzle
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: unsolvablePuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  // Check a puzzle placement with all fields
  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    const coordinate = 'A1';
    const value = '7';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: true });
        done();
      });
  });

  // Check a puzzle placement with single placement conflict
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    const coordinate = 'A2';
    const value = '1'; // Conflict with existing '1' in the puzzle
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, conflict: ['row'] });
        done();
      });
  });

  // Check a puzzle placement with multiple placement conflicts
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    const coordinate = 'B1'; // Assume 'B1' has conflicts
    const value = '1'; // Conflict with existing '1'
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, conflict: ['column'] });
        done();
      });
  });

  // Check a puzzle placement with all placement conflicts
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    const coordinate = 'A1'; // Assume 'C3' has all conflicts
    const value = '5'; // Conflict with existing '1'
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] });
        done();
      });
  });

  // Check a puzzle placement with missing required fields
  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '', coordinate: 'A1' }) // Missing value
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  // Check a puzzle placement with invalid characters
  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    const coordinate = 'A1';
    const value = '3';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: invalidPuzzleCharacters, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  // Check a puzzle placement with incorrect length
  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    const shortPuzzle = validPuzzle.slice(0, 80); // Create a short puzzle with 80 characters
    const coordinate = 'A1';
    const value = '3';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: shortPuzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  // Check a puzzle placement with invalid placement coordinate
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    const coordinate = 'J1'; // Invalid coordinate
    const value = '3';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid coordinate' });
        done();
      });
  });

  // Check a puzzle placement with invalid placement value
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    const coordinate = 'A1';
    const value = '0'; // Invalid value
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate, value })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid value' });
        done();
      });
  });
});