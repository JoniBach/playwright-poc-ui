<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		// Redirect to home page if someone visits just the department
		goto('/', { replaceState: true });
	});
</script>

<div class="govuk-width-container">
	<main class="govuk-main-wrapper">
		<p class="govuk-body">Redirecting...</p>
	</main>
</div>
