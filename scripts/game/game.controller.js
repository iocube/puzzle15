(function() {
  'use strict';

  angular.module('puzzle15').controller('GameController', GameController);

  GameController.$inject = ['storageService',
                            'MAXIMUM_BOARD_SIZE',
                            'MINIMUM_BOARD_SIZE',
                            'TOTAL_PICTURES'];

  function GameController(storageService, MAXIMUM_BOARD_SIZE, MINIMUM_BOARD_SIZE, TOTAL_PICTURES) {
    var gc = this;

    gc.isGameStarted = false;
    gc.isGameEnded = false;
    gc.boardSize = {
      col: MINIMUM_BOARD_SIZE,
      row: MINIMUM_BOARD_SIZE
    };
    gc.board = [];

    initializeBoard();
    gc.cursor = {row: gc.boardSize.row-1, col: gc.boardSize.col-1};

    function initializeBoard() {
      var numbers = generateNumbers(gc.boardSize.row * gc.boardSize.col - 1);

      gc.board = [];
      for (var i = 0, k = 0; i < gc.boardSize.row; i += 1) {
        gc.board[i] = [];
        for (var j = 0; j < gc.boardSize.col; j += 1, k += 1) {
          gc.board[i].push({'number': numbers[k], 'pictureId': numbers[k] % TOTAL_PICTURES});
        }
      }

      // mark last cell as empty
      gc.board[gc.boardSize.row-1][gc.boardSize.col-1] = null;
    }

    // generate array of n numbers
    function generateNumbers(n) {
      var numbers = [];

      for (var i = 0; i < n; i += 1) {
        numbers.push(i);
      }

      return numbers;
    }

    function randomizeBoard() {
      var min = 0,
        max = gc.boardSize.row - 1,
        randomRow,
        randomCol,
        tmp;

      for (var i = 0; i < gc.boardSize.row; i += 1) {
        for (var j = 0; j < gc.boardSize.col; j += 1) {
          randomRow = random(min, max);
          randomCol = random(min, max);

          if (gc.board[randomRow][randomCol] === null ||
            gc.board[i][j] === null) {
            continue;
          }

          tmp = gc.board[i][j];
          gc.board[i][j] = gc.board[randomRow][randomCol];
          gc.board[randomRow][randomCol] = tmp;
        }
      }
    }

    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
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
      return gc.board[row] &&
        gc.board[row][col] &&
        gc.board[row][col].number >= 0;
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
      var exceptLastItem = gc.board[gc.boardSize.row-1].length-1;
      return isRowSolved(gc.board[gc.boardSize.row-1].slice(0, exceptLastItem));
    }

    // row considered solved if each number is greater then previous number by exactly one.
    function isRowSolved(row) {
      for (var i = 1; i < row.length; i += 1) {
          if ((row[i-1].number+1 !== row[i].number)) {
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

       randomizeBoard();
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

      gc.increaseBoardSize = function() {
        if (gc.isGameStarted || (gc.boardSize.row + 1 > MAXIMUM_BOARD_SIZE)) {
          return;
        }

        gc.boardSize = {
          col: gc.boardSize.col + 1,
          row: gc.boardSize.row + 1
        };

        initializeBoard();
        gc.cursor = {row: gc.boardSize.row-1, col: gc.boardSize.col-1};
      };

      gc.decreaseBoardSize = function() {
        if (gc.isGameStarted || (gc.boardSize.row - 1 < MINIMUM_BOARD_SIZE)) {
          return;
        }

        gc.boardSize = {
          col: gc.boardSize.col - 1,
          row: gc.boardSize.row - 1
        };

        initializeBoard();
        gc.cursor = {row: gc.boardSize.row-1, col: gc.boardSize.col-1};
      };
  }
})();
