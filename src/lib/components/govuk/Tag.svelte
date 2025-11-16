<script lang="ts">
	interface Props {
		text: string;
		colour?:
			| 'grey'
			| 'green'
			| 'turquoise'
			| 'blue'
			| 'purple'
			| 'pink'
			| 'red'
			| 'orange'
			| 'yellow';
	}

	let { text, colour }: Props = $props();

	const className = $derived(() => {
		const base = 'govuk-tag';
		const colourClass = colour ? `govuk-tag--${colour}` : '';
		return [base, colourClass].filter(Boolean).join(' ');
	});
</script>

<strong class={className()}>
	{text}
</strong>
