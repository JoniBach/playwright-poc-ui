<script lang="ts">
	interface Props {
		text: string;
		level?: 'xl' | 'l' | 'm' | 's';
		tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
		caption?: string;
	}

	let { text, level = 'xl', tag = 'h1', caption }: Props = $props();

	const className = `govuk-heading-${level}`;
</script>

{#if caption}
	<span class="govuk-caption-{level}">{caption}</span>
{/if}
<svelte:element this={tag} class={className}>
	{text}
</svelte:element>
