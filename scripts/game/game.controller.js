(function() {
  'use strict';

  angular.module('puzzle15').controller('GameController', GameController);

  GameController.$inject = [];

  function GameController() {
    var gc = this;
    gc.message = 'Welcome, players!';

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

      return sequence
    }

    function swap(sequence, indexA, indexB) {
      var tmp = sequence[indexA];
      sequence[indexA] = sequence[indexB];
      sequence[indexB] = tmp;
    }

    gc.board = initializeBoard(row, col);
    var cursor = {row: row-1, col: col-1};

    function moveDown(cursor) {
      if (isValidMove(cursor.row-1, cursor.col)) {
        move({row: cursor.row, col: cursor.col}, {row: cursor.row-1, col: cursor.col})
      }
    }

    function moveUp(cursor) {
      if (isValidMove(cursor.row+1, cursor.col)) {
        move({row: cursor.row, col: cursor.col}, {row: cursor.row+1, col: cursor.col})
      }
    }

    function moveLeft(cursor) {
      if (isValidMove(cursor.row, cursor.col-1)) {
        move({row: cursor.row, col: cursor.col}, {row: cursor.row, col: cursor.col-1})
      }
    }

    function moveRight(cursor) {
      if (isValidMove(cursor.row, cursor.col+1)) {
        move({row: cursor.row, col: cursor.col}, {row: cursor.row, col: cursor.col+1})
      }
    }

    function isValidMove(toRow, toCol) {
      return gc.board[toRow] && gc.board[toRow][toCol] >= 0;
    }

    function move(fromWhere, toWhere) {
      tmp = gc.board[toWhere.row][toWhere.col];
      gc.board[toWhere.row][toWhere.col] = gc.board[fromWhere.row][fromWhere.col];
      gc.board[fromWhere.row][fromWhere.col] = tmp;
    }
  }
})();
