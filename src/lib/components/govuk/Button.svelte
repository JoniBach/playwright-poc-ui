<script lang="ts">
	interface Props {
		text: string;
		href?: string;
		variant?: 'default' | 'secondary' | 'warning' | 'inverse';
		disabled?: boolean;
		startButton?: boolean;
		onclick?: () => void;
	}

	let {
		text,
		href,
		variant = 'default',
		disabled = false,
		startButton = false,
		onclick
	}: Props = $props();

	const classes = $derived(() => {
		const base = 'govuk-button';
		const variants = {
			secondary: 'govuk-button--secondary',
			warning: 'govuk-button--warning',
			inverse: 'govuk-button--inverse'
		};
		const variantClass = variant !== 'default' ? variants[variant] : '';
		const startClass = startButton ? 'govuk-button--start' : '';
		return [base, variantClass, startClass].filter(Boolean).join(' ');
	});
</script>

{#if href}
	<a {href} role="button" draggable="false" class={classes()} data-module="govuk-button">
		{text}
		{#if startButton}
			<svg
				class="govuk-button__start-icon"
				xmlns="http://www.w3.org/2000/svg"
				width="17.5"
				height="19"
				viewBox="0 0 33 40"
				aria-hidden="true"
				focusable="false"
			>
				<path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
			</svg>
		{/if}
	</a>
{:else}
	<button
		type="button"
		class={classes()}
		{disabled}
		data-module="govuk-button"
		{onclick}
	>
		{text}
	</button>
{/if}
