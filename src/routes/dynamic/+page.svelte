<script lang="ts">
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { componentMap, type ComponentConfig, Heading } from '$lib/components/govuk';

	// Example: Dynamic component configuration from JSON/API
	const pageConfig: ComponentConfig[] = [
		{
			type: 'heading',
			props: {
				text: 'Dynamic Page Rendering',
				level: 'xl',
				tag: 'h1'
			}
		},
		{
			type: 'paragraph',
			props: {
				text: 'This page is rendered dynamically from a configuration object. This allows you to build pages from JSON data or API responses.',
				lead: true
			}
		},
		{
			type: 'panel',
			props: {
				title: 'Success',
				body: 'Your application has been submitted'
			}
		},
		{
			type: 'heading',
			props: {
				text: 'What happens next',
				level: 'l',
				tag: 'h2'
			}
		},
		{
			type: 'paragraph',
			props: {
				text: 'We will send you an email to let you know the outcome. You can also track your application online.'
			}
		},
		{
			type: 'button',
			props: {
				text: 'View your applications',
				href: '#'
			}
		},
		{
			type: 'details',
			props: {
				summary: 'How to track your application',
				text: 'You can track your application by logging into your account and viewing the status page.'
			}
		},
		{
			type: 'summaryList',
			props: {
				rows: [
					{
						key: 'Application number',
						value: 'HDJ2123F'
					},
					{
						key: 'Submitted',
						value: '16 November 2025'
					},
					{
						key: 'Status',
						value: 'Processing'
					}
				]
			}
		},
		{
			type: 'warningText',
			props: {
				text: 'Do not close your browser until you receive a confirmation email.'
			}
		}
	];
</script>

<GovUKPage title="Dynamic Rendering Example">
	{#snippet children()}
		{#each pageConfig as config}
			{@const Component = componentMap[config.type]}
			<div style="margin-bottom: 1.5rem;">
				<Component {...config.props} />
			</div>
		{/each}

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

		<Heading text="Configuration JSON" level="m" tag="h3" />
		<details class="govuk-details">
			<summary class="govuk-details__summary">
				<span class="govuk-details__summary-text">View page configuration</span>
			</summary>
			<div class="govuk-details__text">
				<pre style="background: #f3f2f1; padding: 1rem; overflow-x: auto;"><code>{JSON.stringify(
						pageConfig,
						null,
						2
					)}</code></pre>
			</div>
		</details>
	{/snippet}
</GovUKPage>
