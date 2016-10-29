const intersectionBy = require("lodash.intersectionby");

const WINNING_MOVES = [
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],

  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],

  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]],
];

function firstPlayerMoves(game) {
  return game.moves.filter((e, i) => i % 2 === 0);
}

function secondPlayerMoves(game) {
  return game.moves.filter((e, i) => i % 2 === 1);
}

function areWinningMoves(moves) {
  for (const winningMoves of WINNING_MOVES) {
    const interMoves = intersectionBy(moves, winningMoves, x => JSON.stringify(x));
    if (interMoves.length === 3) return true;
  }
  return false;
}

function winner(game) {
  if (areWinningMoves(firstPlayerMoves(game))) {
    return game.first;
  }
  if (areWinningMoves(secondPlayerMoves(game))) {
    return game.first === "player1" ? "player2" : "player1";
  }
  if (game.moves.length === 9) {
    return "draw";
  }
  return null;
}

module.exports = {
  firstPlayerMoves,
  secondPlayerMoves,
  areWinningMoves,
  winner,
};
