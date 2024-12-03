<script lang="ts">
	let dialogElement: HTMLDialogElement;

	function openControls() {
		console.log('open');
		dialogElement.showModal();
	}

	function closeControls() {
		dialogElement.close();
	}
</script>

<button
	class="
			main-btn
			bg-blue-600

			hover:bg-blue-700

			focus:ring-blue-500

"
	onclick={openControls}>Game Controls</button
>

<dialog bind:this={dialogElement} class="w-full max-w-md rounded-lg p-6 shadow-xl">
	<h2 class="mb-4 text-xl font-bold">Tetris Controls</h2>

	<div class="space-y-3">
		<div>
			<strong>Left Arrow ← or Swipe left </strong>: Move piece left
		</div>
		<div>
			<strong>Right Arrow → or Swipe right</strong>: Move piece right
		</div>
		<div>
			<strong>Down Arrow ↓ or Swipe down</strong>: Move piece down faster
		</div>
		<div>
			<strong>Up Arrow ↑ or Swipe up</strong>: Rotate piece
		</div>
	</div>

	<div class="mt-6 flex justify-end">
		<button onclick={closeControls} class="rounded bg-blue-500 px-4 py-2 text-white">
			Close
		</button>
	</div>
</dialog>

<style>
	dialog {
		background: white;
		border: 1px solid #ccc;
	}
	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
