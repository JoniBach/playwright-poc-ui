<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import JourneyPage from '$lib/components/journey/JourneyPage.svelte';
	import CheckYourAnswers from '$lib/components/journey/CheckYourAnswers.svelte';
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { Panel, Button } from '$lib/components/govuk';
	import { journeyStore } from '$lib/stores/journey.svelte';
	import { exampleJourney } from '$lib/journeys/example-journey';

	const state = $derived(journeyStore.currentState);
	const isCheckAnswersPage = $derived(state.currentPageId === 'check-answers');
	const isCompleted = $derived(state.completed);

	onMount(() => {
		journeyStore.initJourney(exampleJourney);
	});

	function handleSubmit() {
		console.log('Journey completed with data:', state.data);
		journeyStore.currentState.completed = true;
	}

	function handleStartAgain() {
		journeyStore.reset();
	}
</script>

{#if isCompleted}
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
