<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import LandingPage from '$lib/components/journey/LandingPage.svelte';
	import { loadJourney } from '$lib/loaders/journey-loader';
	import type { Journey } from '$lib/types/journey';

	const slug = $derived($page.params.slug);
	
	let journey = $state<Journey | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		await loadJourneyData();
	});

	async function loadJourneyData() {
		loading = true;
		error = null;
		
		try {
			journey = await loadJourney(slug);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load journey';
			console.error('Error loading journey:', e);
		} finally {
			loading = false;
		}
	}

	// Reload when slug changes
	$effect(() => {
		if (slug) {
			loadJourneyData();
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
			<a href="/" class="govuk-link">Return to home</a>
		</main>
	</div>
{:else if journey?.landingPage}
	<LandingPage config={journey.landingPage} />
{:else}
	<div class="govuk-width-container">
		<main class="govuk-main-wrapper">
			<p class="govuk-body">No landing page configured for this journey.</p>
			<a href="/" class="govuk-link">Return to home</a>
		</main>
	</div>
{/if}
