<script>
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { Heading, Paragraph, Button } from '$lib/components/govuk';
</script>

<GovUKPage title="GOV.UK Design System Examples">
	{#snippet children()}
		<Paragraph
			text="Explore working examples of GOV.UK Design System components and patterns built with SvelteKit."
			lead={true}
		/>

		<Heading text="Examples" level="l" tag="h2" />

		<div class="govuk-!-margin-bottom-8">
			<Heading text="Apply for a passport" level="m" tag="h3" />
			<p class="govuk-body">
				A complete multi-page journey demonstrating form validation, state management, and the "Check your answers" pattern.
			</p>
			<Button text="Start now" href="/journey" startButton={true} />
		</div>

		<div class="govuk-!-margin-bottom-8">
			<Heading text="Component showcase" level="m" tag="h3" />
			<p class="govuk-body">
				View all 15+ GOV.UK Design System components including buttons, forms, tables, and more.
			</p>
			<Button text="View components" href="/components" startButton={true} />
		</div>

		<div class="govuk-!-margin-bottom-8">
			<Heading text="Dynamic rendering" level="m" tag="h3" />
			<p class="govuk-body">
				See how pages can be built dynamically from JSON configuration.
			</p>
			<Button text="View example" href="/dynamic" startButton={true} />
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
