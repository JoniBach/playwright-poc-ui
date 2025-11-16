<script lang="ts">
	interface Props {
		title: string;
		body?: string;
	}

	let { title, body }: Props = $props();
</script>

<div class="govuk-panel govuk-panel--confirmation">
	<h1 class="govuk-panel__title">
		{title}
	</h1>
	{#if body}
		<div class="govuk-panel__body">
			{body}
		</div>
	{/if}
</div>
