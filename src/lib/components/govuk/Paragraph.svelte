<script lang="ts">
	interface Props {
		text: string;
		lead?: boolean;
	}

	let { text, lead = false }: Props = $props();

	const className = lead ? 'govuk-body-l' : 'govuk-body';
</script>

<p class={className}>
	{text}
</p>
