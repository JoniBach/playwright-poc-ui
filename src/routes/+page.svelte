<script>
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { Button, Heading, Paragraph } from '$lib/components/govuk';
</script>

<GovUKPage title="Welcome to GOV.UK">
	{#snippet children()}
		<Paragraph
			text="This is a SvelteKit application using the GOV.UK Design System with reusable Svelte components."
			lead={true}
		/>

		<Heading text="Features" level="l" tag="h2" />
		<ul class="govuk-list govuk-list--bullet">
			<li>15+ reusable GOV.UK Design System components</li>
			<li>Full TypeScript support with type-safe props</li>
			<li>Dynamic component rendering from JSON configuration</li>
			<li>Svelte 5 with modern runes syntax</li>
		</ul>

		<Heading text="Examples" level="l" tag="h2" />
		<Paragraph
			text="Explore the component library and see how to use them in your application."
		/>

		<div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
			<Button text="View all components" href="/components" startButton={true} />
			<Button text="Dynamic rendering" href="/dynamic" variant="secondary" />
		</div>

		<hr class="govuk-section-break govuk-section-break--xl govuk-section-break--visible" />

		<Heading text="Quick Start" level="m" tag="h3" />
		<Paragraph text="Import and use components in your Svelte pages:" />

		<pre
			style="background: #f3f2f1; padding: 1rem; overflow-x: auto; border-left: 4px solid #1d70b8;"
		><code>{`import { Button, Heading, Paragraph } from '$lib/components/govuk';

<Heading text="Page Title" level="xl" tag="h1" />
<Paragraph text="Your content here" />
<Button text="Click me" onclick={() => alert('Hello!')} />`}</code></pre>
	{/snippet}
</GovUKPage>
