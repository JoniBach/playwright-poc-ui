<script lang="ts">
	import { page } from '$app/stores';
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { SummaryList, Button, Heading } from '$lib/components/govuk';
	import { journeyStore } from '$lib/stores/journey.svelte';
	import { submitJourneyForm } from '$lib/utils/form-submission';
	import type { SubmissionResponse } from '$lib/utils/form-submission';

	interface Props {
		onSubmit: () => void;
		submitText?: string;
	}

	let { onSubmit, submitText = 'Accept and send' }: Props = $props();

	const summary = $derived(journeyStore.getSummary());
	const summaryRows = $derived(
		summary.map((item) => ({
			key: formatKey(item.key),
			value: formatValue(item.value)
		}))
	);

	let submitting = $state(false);
	let error = $state<string | null>(null);

	function formatKey(key: string): string {
		return key
			.split(/(?=[A-Z])|_|-/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

	function formatValue(value: any): string {
		if (Array.isArray(value)) {
			return value.join(', ');
		}
		if (typeof value === 'boolean') {
			return value ? 'Yes' : 'No';
		}
		// Handle date objects from DateInput component
		if (typeof value === 'object' && value !== null && 'day' in value && 'month' in value && 'year' in value) {
			return `${value.day} ${value.month} ${value.year}`;
		}
		return String(value);
	}

	async function handleSubmit() {
		submitting = true;
		error = null;

		try {
			// Get journey data from store
			const journeyData = journeyStore.currentState.data;
			const currentPageId = journeyStore.currentPageId;
			const department = $page.params.department;
			const slug = $page.params.slug;

			// Validate required params
			if (!department || !slug) {
				error = 'Missing journey parameters';
				return;
			}

			// Create FormData from journey data
			const formData = new FormData();
			for (const [key, value] of Object.entries(journeyData)) {
				if (value !== null && value !== undefined) {
					// Handle date objects
					if (typeof value === 'object' && 'day' in value && 'month' in value && 'year' in value) {
						formData.append(key, `${value.year}-${value.month}-${value.day}`);
					} else if (Array.isArray(value)) {
						// Handle arrays (checkboxes)
						value.forEach(v => formData.append(key, String(v)));
					} else {
						formData.append(key, String(value));
					}
				}
			}

			// Submit to server endpoint
			const response: SubmissionResponse = await submitJourneyForm(
				department,
				slug,
				currentPageId,
				formData
			);

			if (response.success && response.complete) {
				// Reference number will be displayed on confirmation page
				// Store it in journey data for now
				if (response.referenceNumber) {
					journeyStore.updateData('_referenceNumber', response.referenceNumber);
				}
				
				// Call the original onSubmit callback to navigate to confirmation
				onSubmit();
			} else if (!response.success) {
				// Handle error
				error = response.error || response.message || 'Failed to submit application';
				console.error('Submission error:', response);
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unexpected error occurred';
			console.error('Submission error:', err);
		} finally {
			submitting = false;
		}
	}
</script>

<GovUKPage title="Check your answers">
	{#snippet children()}
		<Heading text="Check your answers before submitting" level="l" tag="h2" />

		<SummaryList rows={summaryRows} />

		<Heading text="Now submit your application" level="m" tag="h2" />

		<p class="govuk-body">
			By submitting this application you are confirming that, to the best of your knowledge, the
			details you are providing are correct.
		</p>

		{#if error}
			<div class="govuk-error-summary" role="alert" aria-labelledby="error-summary-title" tabindex="-1">
				<h2 class="govuk-error-summary__title" id="error-summary-title">
					There is a problem
				</h2>
				<div class="govuk-error-summary__body">
					<p class="govuk-body">{error}</p>
				</div>
			</div>
		{/if}

		<Button text={submitting ? 'Submitting...' : submitText} onclick={handleSubmit} disabled={submitting} />
	{/snippet}
</GovUKPage>
