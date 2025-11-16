<script lang="ts">
	interface Props {
		id: string;
		name: string;
		legend: string;
		hint?: string;
		errorMessage?: string;
		dayValue?: string;
		monthValue?: string;
		yearValue?: string;
		dayError?: boolean;
		monthError?: boolean;
		yearError?: boolean;
	}

	let {
		id,
		name,
		legend,
		hint,
		errorMessage,
		dayValue = '',
		monthValue = '',
		yearValue = '',
		dayError = false,
		monthError = false,
		yearError = false
	}: Props = $props();

	const hasError = $derived(!!errorMessage);
</script>

<div class="govuk-form-group {hasError ? 'govuk-form-group--error' : ''}">
	<fieldset class="govuk-fieldset" role="group" aria-describedby={hint ? `${id}-hint` : undefined}>
		<legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
			<h1 class="govuk-fieldset__heading">
				{legend}
			</h1>
		</legend>
		{#if hint}
			<div id="{id}-hint" class="govuk-hint">
				{hint}
			</div>
		{/if}
		{#if errorMessage}
			<p id="{id}-error" class="govuk-error-message">
				<span class="govuk-visually-hidden">Error:</span> {errorMessage}
			</p>
		{/if}
		<div class="govuk-date-input" id={id}>
			<div class="govuk-date-input__item">
				<div class="govuk-form-group">
					<label class="govuk-label govuk-date-input__label" for="{id}-day">
						Day
					</label>
					<input
						class="govuk-input govuk-date-input__input govuk-input--width-2 {dayError ? 'govuk-input--error' : ''}"
						id="{id}-day"
						name="{name}-day"
						type="text"
						inputmode="numeric"
						value={dayValue}
					/>
				</div>
			</div>
			<div class="govuk-date-input__item">
				<div class="govuk-form-group">
					<label class="govuk-label govuk-date-input__label" for="{id}-month">
						Month
					</label>
					<input
						class="govuk-input govuk-date-input__input govuk-input--width-2 {monthError ? 'govuk-input--error' : ''}"
						id="{id}-month"
						name="{name}-month"
						type="text"
						inputmode="numeric"
						value={monthValue}
					/>
				</div>
			</div>
			<div class="govuk-date-input__item">
				<div class="govuk-form-group">
					<label class="govuk-label govuk-date-input__label" for="{id}-year">
						Year
					</label>
					<input
						class="govuk-input govuk-date-input__input govuk-input--width-4 {yearError ? 'govuk-input--error' : ''}"
						id="{id}-year"
						name="{name}-year"
						type="text"
						inputmode="numeric"
						value={yearValue}
					/>
				</div>
			</div>
		</div>
	</fieldset>
</div>
