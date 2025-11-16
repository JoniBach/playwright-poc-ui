<script lang="ts">
	import { onMount } from 'svelte';
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { Heading, Paragraph, Button } from '$lib/components/govuk';
	import { loadJourneyIndex } from '$lib/loaders/journey-loader';

	let journeys = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const index = await loadJourneyIndex();
			journeys = index.journeys.filter((j: any) => j.enabled);
		} catch (e) {
			console.error('Error loading journeys:', e);
		} finally {
			loading = false;
		}
	});
</script>

<GovUKPage title="GOV.UK Design System Examples">
	{#snippet children()}
		<Paragraph
			text="Explore working examples of GOV.UK Design System components and patterns built with SvelteKit."
			lead={true}
		/>

		<Heading text="Services" level="l" tag="h2" />

		{#if loading}
			<p class="govuk-body">Loading services...</p>
		{:else if journeys.length > 0}
			{#each journeys as journey}
				<div class="govuk-!-margin-bottom-8">
					<Heading text={journey.name} level="m" tag="h3" />
					<p class="govuk-body">{journey.description}</p>
					<Button text="Start now" href="/service/{journey.slug}" startButton={true} />
				</div>
			{/each}
		{:else}
			<p class="govuk-body">No services available.</p>
		{/if}

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

		<Heading text="Developer Examples" level="l" tag="h2" />

		<div class="govuk-!-margin-bottom-8">
			<Heading text="Component showcase" level="m" tag="h3" />
			<p class="govuk-body">
				View all 15+ GOV.UK Design System components including buttons, forms, tables, and more.
			</p>
			<Button text="View components" href="/components" startButton={true} />
		</div>

		<div class="govuk-!-margin-bottom-8">
			<Heading text="Developer information" level="m" tag="h3" />
			<p class="govuk-body">
				Technical details, features, and quick start guide for developers.
			</p>
			<Button text="View documentation" href="/info" startButton={true} />
		</div>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

		<Heading text="About this project" level="m" tag="h2" />
		<p class="govuk-body">
			This is a demonstration of the GOV.UK Design System implemented in SvelteKit with:
		</p>
		<ul class="govuk-list govuk-list--bullet">
			<li>Reusable Svelte components</li>
			<li>Multi-page journey system</li>
			<li>Form validation and state management</li>
			<li>Full TypeScript support</li>
			<li>Svelte 5 with modern runes syntax</li>
		</ul>
	{/snippet}
</GovUKPage>
