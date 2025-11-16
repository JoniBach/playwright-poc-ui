<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import JourneyPage from '$lib/components/journey/JourneyPage.svelte';
	import CheckYourAnswers from '$lib/components/journey/CheckYourAnswers.svelte';
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { Panel, Button } from '$lib/components/govuk';
	import { journeyStore } from '$lib/stores/journey.svelte';
	import { loadJourney } from '$lib/loaders/journey-loader';

	const state = $derived(journeyStore.currentState);
	const isCheckAnswersPage = $derived(state.currentPageId === 'check-answers');
	const isCompleted = $derived(state.completed);

	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			const journey = await loadJourney('passport');
			journeyStore.initJourney(journey);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load journey';
			console.error('Error loading journey:', e);
		} finally {
			loading = false;
		}
	});

	function handleSubmit() {
		console.log('Journey completed with data:', state.data);
		journeyStore.currentState.completed = true;
	}

	function handleStartAgain() {
		journeyStore.reset();
	}
</script>

{#if loading}
	<GovUKPage title="Loading...">
		{#snippet children()}
			<p class="govuk-body">Loading journey...</p>
		{/snippet}
	</GovUKPage>
{:else if error}
	<GovUKPage title="Error">
		{#snippet children()}
			<p class="govuk-body">{error}</p>
		{/snippet}
	</GovUKPage>
{:else if isCompleted}
	<GovUKPage title="Application complete">
		{#snippet children()}
			<Panel
				title="Application complete"
				body="Your reference number is HDJ2123F"
			/>

			<h2 class="govuk-heading-m">What happens next</h2>
			<p class="govuk-body">
				We've sent you a confirmation email.
			</p>
			<p class="govuk-body">
				Your passport should arrive within 3 weeks. You can track your application online.
			</p>

			<Button text="Start again" onclick={handleStartAgain} />

			<h3 class="govuk-heading-s" style="margin-top: 2rem;">Submitted data:</h3>
			<pre style="background: #f3f2f1; padding: 1rem; overflow-x: auto;"><code>{JSON.stringify(
					state.data,
					null,
					2
				)}</code></pre>
		{/snippet}
	</GovUKPage>
{:else if isCheckAnswersPage}
	<CheckYourAnswers onSubmit={handleSubmit} submitText="Submit application" />
{:else}
	<JourneyPage />
{/if}
