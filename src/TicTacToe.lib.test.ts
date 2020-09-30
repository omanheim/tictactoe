import { getBoardWinner, getNextMove, Move, Player } from "./TicTacToe.lib";

describe(getBoardWinner, () => {
  it("expects null for an empty board", () => {
    const winner = getBoardWinner([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    expect(winner).toBe(null);
  });

  it("expects null for an incomplete board", () => {
    const winner = getBoardWinner([
      [Move.x, null, Move.x],
      [Move.x, Move.o, Move.o],
      [null, null, Move.o],
    ]);
    expect(winner).toBe(null);
  });

  it("recognizes a winning row", () => {
    const winner = getBoardWinner([
      [Move.x, Move.x, Move.x],
      [Move.x, Move.o, Move.o],
      [null, null, Move.o],
    ]);
    expect(winner).toBe(Player.human);
  });

  it("recognizes a winning column", () => {
    const winner = getBoardWinner([
      [Move.x, Move.x, Move.o],
      [Move.x, Move.o, Move.o],
      [null, null, Move.o],
    ]);
    expect(winner).toBe(Player.computer);
  });

  it("recognizes a winning major diagonal", () => {
    const winner = getBoardWinner([
      [Move.o, Move.x, Move.x],
      [Move.x, Move.o, Move.o],
      [null, null, Move.o],
    ]);
    expect(winner).toBe(Player.computer);
  });

  it("recognizes a winning minor diagonal", () => {
    const winner = getBoardWinner([
      [Move.x, Move.x, Move.o],
      [Move.x, Move.o, Move.o],
      [Move.o, null, Move.x],
    ]);
    expect(winner).toBe(Player.computer);
  });
});

describe(getNextMove, () => {
  it("picks the next best move", () => {
    const board = [
      [Move.x, Move.o, Move.x],
      [null, Move.o, null],
      [Move.o, Move.x, Move.x],
    ];
    const bestMove = getNextMove(board);
    expect(bestMove[0]).toBe(1);
    expect(bestMove[1]).toBe(2);
  });
});
