(function() {
  'use strict';

  angular.module('puzzle15').controller('GameController', GameController);

  GameController.$inject = [];

  function GameController() {
    var gc = this;
    gc.message = 'Welcome, players!';

    gc.isGameStarted = false;
    var row = 4;
    var col = 4;

    function initializeBoard(row, col) {
      var numbers = generateSequenceOfNumbers(row*col-1);
      randomize(numbers);

      var board = [];
      for (var i = 0, k = 0; i < row; i += 1) {
        board[i] = [];
        for (var j = 0; j < col; j += 1, k += 1) {
          board[i].push(numbers[k]);
        }
      }

      board[row-1][col-1] = null;

      return board;
    }

    function generateSequenceOfNumbers(len) {
      var sequence = [];

      for (var i = 0; i < len; i += 1) {
        sequence.push(i);
      }

      return sequence;
    }

    function randomize(sequence) {
      var min = 0,
        max = sequence.length - 1,
        randomIndex;

      for (var i = 0; i < sequence.length; i += 1) {
        randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
        swap(sequence, i, randomIndex);
      }

      return sequence;
    }

    function swap(sequence, indexA, indexB) {
      var tmp = sequence[indexA];
      sequence[indexA] = sequence[indexB];
      sequence[indexB] = tmp;
    }

    gc.board = initializeBoard(row, col);
    var cursor = {row: row-1, col: col-1};

    gc.moveDown = function() {
      gc.move({row: cursor.row, col: cursor.col}, {row: cursor.row-1, col: cursor.col});
    };

    gc.moveUp = function() {
      gc.move({row: cursor.row, col: cursor.col}, {row: cursor.row+1, col: cursor.col});
    };

    gc.moveRight = function() {
      gc.move({row: cursor.row, col: cursor.col}, {row: cursor.row, col: cursor.col-1});
    };

    gc.moveLeft = function() {
      gc.move({row: cursor.row, col: cursor.col}, {row: cursor.row, col: cursor.col+1});
    };

    gc.isValidMove = function(toRow, toCol) {
      return gc.board[toRow] && gc.board[toRow][toCol] >= 0;
    };

    gc.move = function(fromWhere, toWhere) {
      if (!gc.isValidMove(toWhere.row, toWhere.col)) {
        return;
      }

      var tmp = gc.board[toWhere.row][toWhere.col];
      gc.board[toWhere.row][toWhere.col] = gc.board[fromWhere.row][fromWhere.col];
      gc.board[fromWhere.row][fromWhere.col] = tmp;
      cursor.row = toWhere.row;
      cursor.col = toWhere.col;

      // check solution only when cursor is moved to the bottom right corner
      // of the board.
      if (cursor.row === row-1 && cursor.col === col-1) {
        gc.isSolved = gc.checkSolution();

        if (gc.isSolved) {
          gc.endGame();
        }
      }
    };

    gc.checkSolution = function() {
      for (var i = 0; i < row-1; i += 1) {
        if (!isRowSolved(gc.board[i])) {
          return false;
        }
      }

      // last row is an exception as it contains 'null'
      var exceptLastItem = gc.board[row-1].length-1;
      return isRowSolved(gc.board[row-1].slice(0, exceptLastItem));
    };

    // check that numbers are greater than previous one by exactly one.
    function isRowSolved(row) {
      for (var i = 1; i < row.length; i += 1) {
          if ((row[i-1]+1 !== row[i])) {
              return false;
          }
      }

      return true;
     }

     gc.startCounter = function() {};
     gc.stopCounter = function() {};
     gc.getCounter = function() {};

     gc.startGame = function() {
       if (gc.isGameStarted) {
         return;
       }
       
       gc.startCounter();
       gc.isGameStarted = true;
     }

     gc.endGame = function() {
       gc.stopCounter();
       gc.isGameStarted = false;
     }
  }
})();
