<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		summary: string;
		text?: string;
		open?: boolean;
		children?: Snippet;
	}

	let { summary, text, open = false, children }: Props = $props();
</script>

<details class="govuk-details" {open}>
	<summary class="govuk-details__summary">
		<span class="govuk-details__summary-text">
			{summary}
		</span>
	</summary>
	<div class="govuk-details__text">
		{#if children}
			{@render children()}
		{:else if text}
			{text}
		{/if}
	</div>
</details>
