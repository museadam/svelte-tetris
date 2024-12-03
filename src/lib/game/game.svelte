<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { isValidMove, spawnNewPiece, type Piece } from './game';
	import { handleTouchStart, handleTouchEnd } from '../swipe/index.svelte';
	import Info from './info.svelte';

	const COLS = 10;
	const ROWS = 20;

	function rotatePiece(piece: Piece): Piece {
		const rotatedShape = piece.shape[0].map((_, index) =>
			piece.shape.map((row) => row[index]).reverse()
		);

		const rotatedPiece = {
			...piece,
			shape: rotatedShape
		};

		return rotatedPiece;
	}

	let board = $state(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
	let currentPiece: Piece | null = $state(null);
	// $inspect(currentPiece);
	// $inspect(board);

	let gameOver = $state(false);
	let score = $state(0);

	function movePieceLeft() {
		if (!currentPiece) return;

		const newPiece = { ...currentPiece, x: currentPiece.x - 1 };
		if (isValidMove(board, newPiece)) {
			currentPiece = newPiece;
		}
	}

	function movePieceRight() {
		if (!currentPiece) return;

		const newPiece = { ...currentPiece, x: currentPiece.x + 1 };
		if (isValidMove(board, newPiece)) {
			currentPiece = newPiece;
		}
	}

	function handleRotate() {
		if (!currentPiece) return;

		const rotatedPiece = rotatePiece(currentPiece);
		if (isValidMove(board, rotatedPiece)) {
			currentPiece = rotatedPiece;
		}
	}

	function lockPiece() {
		if (!currentPiece) return;

		const newBoard = $state.snapshot(board.map((row) => [...row]));

		for (let row = 0; row < currentPiece.shape.length; row++) {
			for (let col = 0; col < currentPiece.shape[row].length; col++) {
				if (currentPiece.shape[row][col] === 1) {
					const boardRow = currentPiece.y + row;
					const boardCol = currentPiece.x + col;

					if (
						boardRow >= 0 &&
						boardRow < newBoard.length &&
						boardCol >= 0 &&
						boardCol < newBoard[0].length
					) {
						newBoard[boardRow][boardCol] = currentPiece.color;
					}
				}
			}
		}

		board = newBoard;

		clearLines();

		currentPiece = spawnNewPiece();

		if (!isValidMove(board, currentPiece)) {
			gameOver = true;
		}
	}

	function movePieceDown() {
		if (!currentPiece) return;

		const newPiece = { ...currentPiece, y: currentPiece.y + 1 };

		if (isValidMove(board, newPiece)) {
			currentPiece = newPiece;
		} else {
			lockPiece();
		}
	}

	function clearLines() {
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
		score += linesCleared * 100;
	}
	function handleKeydown(e: KeyboardEvent | { key: string }) {
		if (gameOver) return;

		switch (e.key) {
			case 'ArrowLeft':
				movePieceLeft();
				break;
			case 'ArrowRight':
				movePieceRight();
				break;
			case 'ArrowDown':
				movePieceDown();
				break;
			case 'ArrowUp':
				handleRotate();
				break;
		}
	}
	let dropInterval = $state(0);

	function startGame() {
		currentPiece = spawnNewPiece();
		buttonName = 'Reset Game';
		dropInterval = setInterval(movePieceDown, 1000);

		window.addEventListener('keydown', handleKeydown);
	}
	onMount(() => {
		return () => {
			if (dropInterval) {
				clearInterval(dropInterval);
			}
			window.removeEventListener('keydown', handleKeydown);
		};
	});
	let buttonName = $state('Start Game');

	function restartGame() {
		board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
		currentPiece = null;
		gameOver = false;
		score = 0;
		startGame();
	}
	let isOn = $state(false);

	const toggleSwitch = () => {
		isOn = !isOn;
	};
</script>

<div
	class="swipe-background"
	role="button"
	tabindex="0"
	ontouchstart={handleTouchStart}
	onclick={(e) => {
		if (isOn) {
			handleKeydown({ key: 'ArrowUp' });
		}
	}}
	onkeydown={(e) => console.log()}
	ontouchmove={(e) => {
		if (isOn) {
			const ret = handleTouchEnd(e);
			handleKeydown({ key: ret });
		}
	}}
	ontouchend={(e) => {
		if (!isOn) {
			const ret = handleTouchEnd(e);
			handleKeydown({ key: ret });
		}
	}}
></div>
<div class="tetris-container">
	{#if gameOver}
		<div class="game-over">
			<h2>Game Over!</h2>
			<p>Score: {score}</p>
			<button
				class="main-btn bg-green-600
    hover:bg-green-700"
				onclick={restartGame}>Play again?</button
			>
		</div>
	{:else}
		<div class="game-board">
			{#each board as row, rowIndex}
				<div class="row">
					{#each row as cell, colIndex}
						<div
							class="cell"
							style={currentPiece?.shape[rowIndex - currentPiece?.y]?.[
								colIndex - currentPiece.x
							] === 1
								? `background-color: ${currentPiece.color}`
								: `background-color: ${cell}`}
							class:current-piece={currentPiece &&
								currentPiece.shape[rowIndex - currentPiece.y]?.[colIndex - currentPiece.x] === 1}
						></div>
					{/each}
				</div>
			{/each}
		</div>
		<div class="game-info">
			<p>Score: {score}</p>
			<button
				class="
				main-btn
						bg-green-600
    hover:bg-green-700

						"
				onclick={() => {
					if (!currentPiece) startGame();
					else restartGame();
				}}>{buttonName}</button
			>
		</div>
	{/if}

	<div
		role="button"
		tabindex="0"
		class="flex cursor-pointer items-center space-x-4 md:hidden"
		onclick={toggleSwitch}
		onkeydown={(e) => console.log()}
	>
		<div
			class={`flex h-6 w-12 items-center rounded-full p-1 transition-colors duration-300 ${
				isOn ? 'bg-green-500' : 'bg-gray-300'
			}`}
		>
			<div
				class={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
					isOn ? 'translate-x-6 border-2 border-green-500' : 'translate-x-0 border border-gray-300'
				}`}
			></div>
		</div>
		<span class="text-sm font-medium">{isOn ? 'Hold Swipe' : 'Tap Swipe'}</span>
	</div>
	<Info />
</div>

<style>
	:global(body) {
		background-color: #f0f0f0;
	}
	:global(html) {
		overscroll-behavior: contain;
	}
	.tetris-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: Arial, sans-serif;
	}

	.game-board {
		display: grid;
		grid-template-rows: repeat(20, var(--sq-size));
		border: 2px solid #333;
	}

	.row {
		display: grid;
		grid-template-columns: repeat(10, var(--sq-size));
	}

	.cell {
		width: var(--sq-size);
		height: var(--sq-size);
		border: 1px solid rgba(0, 0, 0, 0.1);
		transition: background-color 0.2s;
	}

	.current-piece {
		opacity: 0.7;
		border: 1px solid rgba(0, 0, 0, 0.5);
	}

	.game-over {
		text-align: center;
		padding: 20px;
		background-color: rgba(255, 0, 0, 0.1);
	}
	.swipe-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
