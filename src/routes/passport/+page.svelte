<script lang="ts">
	import LandingPage from '$lib/components/journey/LandingPage.svelte';
	import { exampleJourney } from '$lib/journeys/example-journey';
</script>

{#if exampleJourney.landingPage}
	<LandingPage config={exampleJourney.landingPage} />
{:else}
	<p>No landing page configured for this journey.</p>
{/if}
