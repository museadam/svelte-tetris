<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-height: 100vh;
		margin: 0;
	}
</style>
