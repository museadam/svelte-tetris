export type Piece = {
    shape: number[][];
    x: number;
    y: number;
    color: string;
};

const COLS = 10;
const ROWS = 20;

export function isValidMove(board: (string | null)[][], piece: Piece): boolean {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col] === 0) continue;

            const boardRow = piece.y + row;
            const boardCol = piece.x + col;

            if (
                boardRow < 0 ||
                boardRow >= board.length ||
                boardCol < 0 ||
                boardCol >= board[0].length
            ) {
                return false;
            }

            if (
                boardRow >= 0 &&
                boardRow < board.length &&
                boardCol >= 0 &&
                boardCol < board[0].length &&
                board[boardRow][boardCol] !== null
            ) {
                return false;
            }
        }
    }
    return true;
}

export function clearLines(board: (string | null)[][], level: number, score: number) {
    let linesCleared = 0;

    const newBoard = board.filter((row) => {
        const isComplete = row.every((cell) => cell !== null);
        if (isComplete) {
            linesCleared++;
            return false;
        }
        return true;
    });

    while (newBoard.length < ROWS) {
        newBoard.unshift(Array(COLS).fill(null));
    }

    // Update board and score
    board = newBoard;
    level = level + 1

    score += linesCleared * 100;
}

export function rotatePiece(piece: Piece): Piece {
    const rotatedShape = piece.shape[0].map((_, index) =>
        piece.shape.map((row) => row[index]).reverse()
    );

    const rotatedPiece = {
        ...piece,
        shape: rotatedShape
    };

    return rotatedPiece;
}

const PIECES = [
    {
        shape: [[1, 1, 1, 1]],
        color: 'cyan'
    },
    {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 'yellow'
    },
    {
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        color: 'green'
    },
    {
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        color: 'red'
    },
    {
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ],
        color: 'blue'
    },
    {
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ],
        color: 'orange'
    },
    {
        shape: [
            [1, 1, 1],
            [0, 1, 0]
        ],
        color: 'purple'
    }
];

export function spawnNewPiece(): Piece {
    const randomPiece = PIECES[Math.floor(Math.random() * PIECES.length)];

    return {
        ...randomPiece,
        x: Math.floor(COLS / 2) - Math.floor(randomPiece.shape[0].length / 2),
        y: 0
    };
}

