import * as React from "react";
import classNames from "classnames";
import { Move, SquareState, Player } from "../TicTacToe.lib";

interface Props {
  squareState: SquareState;
  turn: Player | null;

  /** Called when the user clicks the square to make their move */
  onClick: () => unknown;
}

/** A single square on a Tic Tac Toe game board */
export default class Square extends React.PureComponent<Props> {
  render() {
    const { squareState, onClick, turn } = this.props;

    return (
      <div
        className={`Square ${
          squareState !== null ? `Square__${squareState}` : ""
        }`}
      >
        <button
          type="button"
          disabled={squareState !== null || turn !== Player.human}
          onClick={onClick}
          className="Square__inner"
        >
          {[Move.x, Move.o].map((move) => (
            <span
              className={classNames(`Square__move`, {
                Square__visible: squareState === move,
              })}
            >
              {move}
            </span>
          ))}
        </button>
      </div>
    );
  }
}
