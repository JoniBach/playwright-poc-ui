<script lang="ts">
	import { onMount } from 'svelte';
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { Heading, Paragraph, Button } from '$lib/components/govuk';
	import { loadJourneyIndex } from '$lib/loaders/journey-loader';
	import ValidationStatus from '$lib/components/ValidationStatus.svelte';

	let journeys = $state<any[]>([]);
	let loading = $state(true);
	let journeysByDepartment = $derived(() => {
		const grouped = new Map<string, any[]>();
		journeys.forEach((journey) => {
			const dept = journey.department || 'Other';
			if (!grouped.has(dept)) {
				grouped.set(dept, []);
			}
			grouped.get(dept)!.push(journey);
		});
		return Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));
	});

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
		{:else if journeysByDepartment().length > 0}
			{#each journeysByDepartment() as [department, deptJourneys]}
				<div class="govuk-!-margin-bottom-9">
					<Heading text={department} level="m" tag="h2" />
					
					{#each deptJourneys as journey}
						<div class="govuk-!-margin-bottom-6">
							<Heading text={journey.name} level="s" tag="h3" />
							<p class="govuk-body">{journey.description}</p>
							<Button text="Start now" href="/{journey.departmentSlug}/{journey.slug}" startButton={true} />
						</div>
					{/each}
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

		<!-- Validation Status Section -->
		<ValidationStatus />
	{/snippet}
</GovUKPage>
