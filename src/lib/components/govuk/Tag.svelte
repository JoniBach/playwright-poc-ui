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
			| 'yellow'
			| 'success'
			| 'warning'
			| 'error'
			| 'info'
			| 'inactive';
	}

	let { text, colour }: Props = $props();

	// Map semantic colors to GOV.UK colors
	const semanticColorMap: Record<string, string> = {
		success: 'green',
		warning: 'yellow',
		error: 'red',
		info: 'blue',
		inactive: 'grey'
	};

	const className = $derived(() => {
		const base = 'govuk-tag';
		const mappedColour = colour && semanticColorMap[colour] ? semanticColorMap[colour] : colour;
		const colourClass = mappedColour ? `govuk-tag--${mappedColour}` : '';
		return [base, colourClass].filter(Boolean).join(' ');
	});
</script>

<strong class={className()}>
	{text}
</strong>
