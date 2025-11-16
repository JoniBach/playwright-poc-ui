<script lang="ts">
	interface RadioOption {
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
		options: RadioOption[];
		value?: string;
		inline?: boolean;
		onchange?: (e: Event) => void;
	}

	let {
		id,
		name,
		legend,
		hint,
		error,
		options,
		value = '',
		inline = false,
		onchange
	}: Props = $props();
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
		<div class="govuk-radios {inline ? 'govuk-radios--inline' : ''}" data-module="govuk-radios">
			{#each options as option, index}
				<div class="govuk-radios__item">
					<input
						class="govuk-radios__input"
						id="{id}-{index}"
						{name}
						type="radio"
						value={option.value}
						checked={value === option.value}
						{onchange}
					/>
					<label class="govuk-label govuk-radios__label" for="{id}-{index}">
						{option.text}
					</label>
					{#if option.hint}
						<div id="{id}-{index}-hint" class="govuk-hint govuk-radios__hint">
							{option.hint}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</fieldset>
</div>
