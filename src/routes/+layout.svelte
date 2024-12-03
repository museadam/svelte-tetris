<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main>
	{@render children()}
</main>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-height: 100vh;
		margin: 0;
		--sq-size: 24px;
	}
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
