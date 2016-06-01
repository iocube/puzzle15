(function() {
  'use strict';

  angular.module('puzzle15').controller('GameController', GameController);

  GameController.$inject = ['storageService'];

  function GameController(storageService) {
    var gc = this;

    gc.isGameStarted = false;
    gc.isGameEnded = false;
    gc.boardSize = {
      col: 4,
      row: 4
    };
    gc.board = initializeBoard();
    gc.cursor = {row: gc.boardSize.row-1, col: gc.boardSize.col-1};

    function initializeBoard() {
      var numbers = generateNumbers(gc.boardSize.row * gc.boardSize.col - 1);
      randomize(numbers);

      var board = [];
      for (var i = 0, k = 0; i < gc.boardSize.row; i += 1) {
        board[i] = [];
        for (var j = 0; j < gc.boardSize.col; j += 1, k += 1) {
          board[i].push(numbers[k]);
        }
      }

      // mark last cell as empty
      board[gc.boardSize.row-1][gc.boardSize.col-1] = null;

      return board;
    }

    // generate array of n numbers
    function generateNumbers(n) {
      var numbers = [];

      for (var i = 0; i < n; i += 1) {
        numbers.push(i);
      }

      return numbers;
    }

    // randomize given array
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

    gc.moveDown = function() {
      move(gc.cursor.row-1, gc.cursor.col);
    };

    gc.moveUp = function() {
      move(gc.cursor.row+1, gc.cursor.col);
    };

    gc.moveRight = function() {
      move(gc.cursor.row, gc.cursor.col-1);
    };

    gc.moveLeft = function() {
      move(gc.cursor.row, gc.cursor.col+1);
    };

    function isValidMove(row, col) {
      return gc.board[row] && gc.board[row][col] >= 0;
    }

    function move(row, col) {
      if (!isValidMove(row, col) || (!gc.isGameStarted && !gc.isGameEnded)) {
        return;
      }

      // swap between the two cells
      var tmp = gc.board[row][col];
      gc.board[row][col] = gc.board[gc.cursor.row][gc.cursor.col];
      gc.board[gc.cursor.row][gc.cursor.col] = tmp;

      // update cursor new position
      gc.cursor.row = row;
      gc.cursor.col = col;

      // if cursor is moved to the bottom-right corner, check if puzzle is solved.
      if (gc.cursor.row === gc.boardSize.row-1 &&
        gc.cursor.col === gc.boardSize.col-1) {
        if (isSolved()) {
          gc.endGame();
        }
      }
    }

    function isSolved() {
      // iterate over all rows except the last one (special case)
      for (var i = 0; i < gc.boardSize.row-1; i += 1) {
        if (!isRowSolved(gc.board[i])) {
          return false;
        }
      }

      // last row is an exception as it contains 'null'
      var exceptLastItem = gc.board[row-1].length-1;
      return isRowSolved(gc.board[row-1].slice(0, exceptLastItem));
    }

    // row considered solved if each number is greater then previous number by exactly one.
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
       gc.isGameEnded = false;
     };

     gc.endGame = function() {
       gc.stopCounter();
       gc.isGameStarted = false;
       gc.isGameEnded = true;

       // after game is ended save game result
       var result = gc.getCounter();
       saveGameResult(result);
     };

     function saveGameResult(result) {
       var bestResults = storageService.load();

       if (bestResults.length === 0) {
         bestResults.push(result);
         storageService.save(bestResults);
         return;
       }

       // find place to insert new result
       for (var i = 0; i < bestResults.length; i += 1) {
         if (result <= bestResults[i]) {
           bestResults.splice(i, 0, result);
           break;
         }
       }

       // only best of ten results should be saved
       var bestOfTen = bestResults.slice(0, 10);
        storageService.save(bestOfTen);
      }
  }
})();
