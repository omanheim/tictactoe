import _ from "lodash";

/** A turn that may be taken on a single board square */
export enum Move {
  x = "x",
  o = "o",
}

/** The possible states for any given square on the board */
export type SquareState = Move | null;

/**
 * A representation of a game board; contains three arrays corresponding to each
 * row, each containing three elements corresponding to the squares in each
 * column.
 */
export type Board = SquareState[][];

/** The two players; it's either the player's turn or the computer's */
export enum Player {
  human = "human",
  computer = "computer",
}

/** The move type associated with each player */
export const playerMoves: { [key in Player]: Move } = {
  [Player.human]: Move.x,
  [Player.computer]: Move.o,
};

/** The path to a board square is an [x,y] tuple */
export type Path = number[];

/** Returns an empty game board with 9 squares initialized to null */
export function emptyBoard(): Board {
  return _.times(3, () => _.times(3, () => null));
}

/** Returns the state of the square on the board at the given path */
function getBoardSquareState(board: Board, path: Path) {
  return board[path[0]][path[1]];
}

/** Returns the state of a board after a move has been made */
export function getUpdatedBoard(
  initialBoard: Board,
  pathToMove: Path,
  move: Move
) {
  const updatedBoard = [
    [...initialBoard[0]],
    [...initialBoard[1]],
    [...initialBoard[2]],
  ];
  updatedBoard[pathToMove[0]][pathToMove[1]] = move;
  return updatedBoard;
}

function isWinningLine(board: Board, paths: Path[]) {
  return (
    getBoardSquareState(board, paths[0]) &&
    _.uniqBy(paths, (path) => getBoardSquareState(board, path)).length === 1
  );
}

/**
 * Returns the set of squares constituting a win if one exists; otherwise,
 * returns null
 */
export function getWinningBoardSquares(board: Board): Path[] | null {
  for (let i = 0; i < 3; ++i) {
    const row = [
      [i, 0],
      [i, 1],
      [i, 2],
    ];
    if (isWinningLine(board, row)) return row;
    const column = [
      [0, i],
      [1, i],
      [2, i],
    ];
    if (isWinningLine(board, column)) return column;
  }
  const mainDiag = [
    [0, 0],
    [1, 1],
    [2, 2],
  ];
  if (isWinningLine(board, mainDiag)) return mainDiag;
  const minorDiag = [
    [0, 2],
    [1, 1],
    [2, 0],
  ];
  if (isWinningLine(board, minorDiag)) return minorDiag;
  return null;
}

/**
 * Returns the winner of the game if the board is in a win state; otherwise,
 * returns null
 */
export function getBoardWinner(board: Board): Player | null {
  const winningSquares = getWinningBoardSquares(board);
  if (winningSquares) {
    return (
      (Object.keys(playerMoves).find(
        (p) =>
          playerMoves[p as Player] ===
          getBoardSquareState(board, winningSquares[0])
      ) as Player) || null
    );
  }
  return null;
}

function otherPlayer(player: Player) {
  return player === Player.human ? Player.computer : Player.human;
}

/** Whether any moves remain, i.e. any squares are currently empty */
export function areMovesRemaining(board: Board) {
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      if (board[i][j] === null) {
        return true;
      }
    }
  }
  return false;
}

function minimax(board: Board, player: Player, depth: number) {
  const winner = getBoardWinner(board);
  if (winner) {
    return {
      value: winner === Player.computer ? 10 - depth : -10 + depth,
      move: [-1, -1],
    };
  } else if (!areMovesRemaining(board)) {
    return { value: 0, move: [-1, -1] };
  }

  let bestMove = {
    move: [-1, -1],
    value: player === Player.computer ? -Infinity : Infinity,
  };
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      if (board[i][j] === null) {
        const val = minimax(
          getUpdatedBoard(board, [i, j], playerMoves[player]),
          otherPlayer(player),
          depth + 1
        );
        const bestValue = bestMove.value;
        if (player === Player.computer && val.value > bestValue) {
          bestMove = { value: val.value, move: [i, j] };
        } else if (player === Player.human && val.value < bestValue) {
          bestMove = { value: val.value, move: [i, j] };
        }
      }
    }
  }
  return bestMove;
}

/** Returns the next best move to make based on a given game board */
export function getNextMove(board: Board) {
  return minimax(board, Player.computer, 0).move;
}
