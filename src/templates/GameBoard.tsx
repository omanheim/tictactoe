import * as React from "react";
import { Board, getWinningBoardSquares, Path, Player } from "../TicTacToe.lib";
import classNames from "classnames";
import Square from "./Square";

interface Props {
  board: Board;
  turn: Player | null;

  /** Called when the user selects a playable square */
  onSquareClick: (path: Path) => unknown;
}

/** The game board for a playable tic tac toe interface */
export default class GameBoard extends React.PureComponent<Props> {
  render() {
    const { board, turn, onSquareClick } = this.props;

    // If a player has won, animate the winning squares
    const winningSquares = getWinningBoardSquares(board);

    return (
      <div className="GameBoard__board container col-8 offset-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4 px-0">
        {board.map((row, i) => (
          <div className="row no-gutters">
            {row.map((square, j) => (
              <div
                className={classNames("GameBoard__square col-4", {
                  GameBoard__winningSquare:
                    winningSquares &&
                    // Can't use `includes` as it won't consider the two arrays equal
                    winningSquares.find((sq) => sq[0] === i && sq[1] === j),
                })}
              >
                <Square
                  key={i.toString()}
                  squareState={square}
                  onClick={() => onSquareClick([i, j])}
                  turn={turn}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}
