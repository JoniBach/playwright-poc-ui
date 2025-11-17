<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import JourneyPage from '$lib/components/journey/JourneyPage.svelte';
	import CheckYourAnswers from '$lib/components/journey/CheckYourAnswers.svelte';
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { Panel, Button } from '$lib/components/govuk';
	import { journeyStore } from '$lib/stores/journey.svelte';
	import { loadJourney, loadJourneyIndex } from '$lib/loaders/journey-loader';

	const departmentSlug = $derived($page.params.department);
	const slug = $derived($page.params.slug);
	const currentPageId = $derived(journeyStore.currentPageId);
	const isCheckAnswersPage = $derived(currentPageId === 'check-answers');
	const isCompleted = $derived(journeyStore.currentState.completed);

	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		await loadJourneyData();
	});

	async function loadJourneyData() {
		loading = true;
		error = null;
		
		try {
			// Verify the department/slug combination exists in the index
			const index = await loadJourneyIndex();
			const journeyMeta = index.journeys.find(
				(j: any) => j.departmentSlug === departmentSlug && j.slug === slug && j.enabled
			);
			
			if (!journeyMeta) {
				error = 'Journey not found';
				return;
			}
			
			const journey = await loadJourney(journeyMeta.id);
			journeyStore.initJourney(journey);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load journey';
			console.error('Error loading journey:', e);
		} finally {
			loading = false;
		}
	}

	function handleSubmit() {
		goto('/');
	}

	function handleCheckAnswersSubmit() {
		// Navigate to next page (which will mark journey as completed if no next page)
		journeyStore.goToNextPage();
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
			<a href="/" class="govuk-link">Return to home</a>
		{/snippet}
	</GovUKPage>
{:else if isCompleted}
	<GovUKPage title="Application complete">
		{#snippet children()}
			<Panel
				title="Application complete"
				text="Your reference number is HDJ2123F"
			/>

			<p class="govuk-body">We have sent you a confirmation email.</p>

			<h2 class="govuk-heading-m">What happens next</h2>
			<p class="govuk-body">
				We've sent your application to our processing team. They will contact you either to confirm
				your appointment or to ask for more information.
			</p>

			<Button text="Return to start" onclick={handleSubmit} />
		{/snippet}
	</GovUKPage>
{:else if isCheckAnswersPage}
	<CheckYourAnswers onSubmit={handleCheckAnswersSubmit} />
{:else}
	<JourneyPage />
{/if}
