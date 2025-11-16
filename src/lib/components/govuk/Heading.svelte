<script lang="ts">
	interface Props {
		text: string;
		level?: 'xl' | 'l' | 'm' | 's';
		tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	}

	let { text, level = 'xl', tag = 'h1' }: Props = $props();

	const className = `govuk-heading-${level}`;
</script>

<svelte:element this={tag} class={className}>
	{text}
</svelte:element>
