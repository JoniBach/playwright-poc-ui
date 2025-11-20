<script lang="ts">
	interface CheckboxOption {
		value: string;
		text: string;
		hint?: string;
	}

	interface Props {
		id: string;
		name: string;
		legend: string;
		hint?: string;
		error?: string;
		items?: CheckboxOption[];
		options?: CheckboxOption[]; // Backward compatibility
		values?: string[];
	}

	let {
		id,
		name,
		legend,
		hint,
		error,
		items,
		options,
		values = $bindable([])
	}: Props = $props();

	// Support both 'items' and 'options' props
	const checkboxItems = $derived(items || options || []);
</script>

<div class="govuk-form-group {error ? 'govuk-form-group--error' : ''}">
	<fieldset class="govuk-fieldset" aria-describedby={hint ? `${id}-hint` : undefined}>
		<legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
			<h1 class="govuk-fieldset__heading">
				{legend}
			</h1>
		</legend>
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
		<div class="govuk-checkboxes" data-module="govuk-checkboxes">
			{#each checkboxItems as option, index}
				<div class="govuk-checkboxes__item">
					<input
						class="govuk-checkboxes__input"
						id="{id}-{index}"
						{name}
						type="checkbox"
						value={option.value}
						bind:group={values}
					/>
					<label class="govuk-label govuk-checkboxes__label" for="{id}-{index}">
						{option.text}
					</label>
					{#if option.hint}
						<div id="{id}-{index}-hint" class="govuk-hint govuk-checkboxes__hint">
							{option.hint}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</fieldset>
</div>
