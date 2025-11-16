<script lang="ts">
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { Button, Heading, Paragraph, InsetText, WarningText, Details } from '$lib/components/govuk';
	import type { LandingPage } from '$lib/types/journey';

	interface Props {
		config: LandingPage;
	}

	let { config }: Props = $props();
</script>

<GovUKPage title={config.title}>
	{#snippet children()}
		<Paragraph text={config.lead} lead={true} />

		{#each config.sections as section}
			{#if section.type === 'heading'}
				<Heading text={section.content as string} level={section.level || 'm'} tag="h2" />
			{:else if section.type === 'paragraph'}
				<p class="govuk-body">{section.content}</p>
			{:else if section.type === 'list'}
				{#if section.listType === 'bullet'}
					<ul class="govuk-list govuk-list--bullet">
						{#each section.content as item}
							<li>{item}</li>
						{/each}
					</ul>
				{:else if section.listType === 'number'}
					<ol class="govuk-list govuk-list--number">
						{#each section.content as item}
							<li>{item}</li>
						{/each}
					</ol>
				{:else}
					<ul class="govuk-list">
						{#each section.content as item}
							<li>{item}</li>
						{/each}
					</ul>
				{/if}
			{:else if section.type === 'insetText'}
				<InsetText text={section.content as string} />
			{:else if section.type === 'warningText'}
				<WarningText text={section.content as string} />
			{:else if section.type === 'details'}
				<Details summary={section.summary || 'Details'} text={section.content as string} />
			{/if}
		{/each}

		<Button 
			text={config.startButtonText || 'Start now'} 
			href={config.startButtonHref} 
			startButton={true} 
		/>
	{/snippet}
</GovUKPage>
