import * as React from "react";
import classNames from "classnames";
import {
  areMovesRemaining,
  Board,
  emptyBoard,
  getBoardWinner,
  getNextMove,
  getUpdatedBoard,
  Player,
  playerMoves,
} from "../TicTacToe.lib";
import GameBoard from "./GameBoard";

interface Props {}

interface State {
  /** The current state of the game board */
  board: Board;

  /** The player whose turn it is, or null if the game is over */
  turn: Player | null;
}

function getSubheading(turn: Player | null) {
  switch (turn) {
    case Player.computer:
      return "Thinking...";
    case Player.human:
      return "Your turn!";
    default:
      return "Game over!";
  }
}

function getInitialState() {
  return { board: emptyBoard(), turn: Player.human };
}

/** A constant amount of time to simulate the AI "thinking" before its move */
const kComputerWaitingTimeMs = 700;

/** A playable Tic Tac Toe game for a user to play against an AI opponent */
export default class TicTacToe extends React.PureComponent<Props, State> {
  state: State = getInitialState();

  makeComputerMove = () => {
    const { board } = this.state;
    // Only attempt to make a move if empty squares remain
    if (!areMovesRemaining(board)) return;

    // Artificially simulator a wait time before the AI makes a move
    setTimeout(() => {
      const nextMove = getNextMove(board);
      const updatedBoard = getUpdatedBoard(
        board,
        nextMove,
        playerMoves[Player.computer]
      );
      this.setState({
        board: updatedBoard,
        turn: Player.human,
      });
    }, kComputerWaitingTimeMs);
  };

  handleSquareClick = (path: number[]) => {
    const { board, turn } = this.state;
    // Only process clicks if it's the user's turn
    if (turn === Player.human) {
      const updatedBoard = getUpdatedBoard(
        board,
        path,
        playerMoves[Player.human]
      );
      this.setState(
        {
          board: updatedBoard,
          turn: Player.computer,
        },
        this.makeComputerMove
      );
    }
  };

  handlePlayAgain = () => {
    this.setState(getInitialState());
  };

  render() {
    const { board, turn: turnIfPossible } = this.state;

    // No need to save a win/end state since the component will always re-render
    // after each move
    const gameOver = getBoardWinner(board) || !areMovesRemaining(board);
    const turn = gameOver ? null : turnIfPossible;

    return (
      <div className="text-center">
        <div className="position-relative mb-3 d-inline-block">
          <h1 className="TicTacToe__heading d-inline-block">Tic Tac Toe</h1>
          <div className="TicTacToe__underline" />
        </div>
        <div
          className={classNames("TicTacToe__subheading mb-4", {
            "font-weight-bold": turn === Player.human || !turn,
            "font-italic": turn === Player.computer,
          })}
        >
          <span>{getSubheading(turn)}</span>
          {gameOver && (
            <button
              type="button"
              onClick={this.handlePlayAgain}
              className="TicTacToe__playAgain ml-3"
            >
              Play again
            </button>
          )}
        </div>
        <GameBoard
          board={board}
          turn={turn}
          onSquareClick={this.handleSquareClick}
        />
      </div>
    );
  }
}
