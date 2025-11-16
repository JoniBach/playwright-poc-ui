<script lang="ts">
	import { onMount } from 'svelte';
	import LandingPage from '$lib/components/journey/LandingPage.svelte';
	import { loadJourney } from '$lib/loaders/journey-loader';
	import type { Journey } from '$lib/types/journey';

	let journey = $state<Journey | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			journey = await loadJourney('passport');
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load journey';
			console.error('Error loading journey:', e);
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="govuk-width-container">
		<main class="govuk-main-wrapper">
			<p class="govuk-body">Loading...</p>
		</main>
	</div>
{:else if error}
	<div class="govuk-width-container">
		<main class="govuk-main-wrapper">
			<h1 class="govuk-heading-l">Error</h1>
			<p class="govuk-body">{error}</p>
		</main>
	</div>
{:else if journey?.landingPage}
	<LandingPage config={journey.landingPage} />
{:else}
	<div class="govuk-width-container">
		<main class="govuk-main-wrapper">
			<p class="govuk-body">No landing page configured for this journey.</p>
		</main>
	</div>
{/if}
