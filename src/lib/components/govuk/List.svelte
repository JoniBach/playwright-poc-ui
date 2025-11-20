<script lang="ts">
	interface Props {
		items: string[];
		type?: 'bullet' | 'number';
		classes?: string;
	}

	let { items, type = 'bullet', classes = '' }: Props = $props();

	const listClass = $derived(() => {
		const base = 'govuk-list';
		const typeClass = type === 'bullet' ? 'govuk-list--bullet' : 'govuk-list--number';
		return [base, typeClass, classes].filter(Boolean).join(' ');
	});
</script>

{#if type === 'bullet'}
	<ul class={listClass()}>
		{#each items as item}
			<li>{item}</li>
		{/each}
	</ul>
{:else}
	<ol class={listClass()}>
		{#each items as item}
			<li>{item}</li>
		{/each}
	</ol>
{/if}
