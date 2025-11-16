<script lang="ts">
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { SummaryList, Button, Heading } from '$lib/components/govuk';
	import { journeyStore } from '$lib/stores/journey.svelte';

	interface Props {
		onSubmit: () => void;
		submitText?: string;
	}

	let { onSubmit, submitText = 'Accept and send' }: Props = $props();

	const summary = $derived(journeyStore.getSummary());
	const summaryRows = $derived(
		summary.map((item) => ({
			key: formatKey(item.key),
			value: formatValue(item.value),
			actions: item.changeLink
				? [
						{
							href: `#`,
							text: 'Change',
							visuallyHiddenText: formatKey(item.key)
						}
					]
				: undefined
		}))
	);

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
		return String(value);
	}

	function handleChange(pageId: string) {
		journeyStore.goToPage(pageId);
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

		<Button text={submitText} onclick={onSubmit} />
	{/snippet}
</GovUKPage>
