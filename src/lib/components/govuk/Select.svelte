<script lang="ts">
	interface SelectOption {
		value: string;
		text: string;
		selected?: boolean;
	}

	interface Props {
		id: string;
		name: string;
		label: string;
		hint?: string;
		error?: string;
		items: SelectOption[];
		value?: string;
		onchange?: (e: Event) => void;
	}

	let { id, name, label, hint, error, items, value = $bindable(''), onchange }: Props = $props();
	
	function handleChange(e: Event) {
		if (onchange) {
			onchange(e);
		}
	}
</script>

<div class="govuk-form-group {error ? 'govuk-form-group--error' : ''}">
	<label class="govuk-label" for={id}>
		{label}
	</label>
	{#if hint}
		<div id="{id}-hint" class="govuk-hint">
			{hint}
		</div>
	{/if}
	{#if error}
		<p id="{id}-error" class="govuk-error-message">
			<span class="govuk-visually-hidden">Error:</span>
			{error}
		</p>
	{/if}
	<select
		class="govuk-select {error ? 'govuk-select--error' : ''}"
		{id}
		{name}
		bind:value
		onchange={handleChange}
		aria-describedby={[hint ? `${id}-hint` : '', error ? `${id}-error` : '']
			.filter(Boolean)
			.join(' ') || undefined}
	>
		{#each items as option}
			<option value={option.value} selected={option.selected}>
				{option.text}
			</option>
		{/each}
	</select>
</div>
