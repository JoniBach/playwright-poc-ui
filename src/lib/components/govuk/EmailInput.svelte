<script lang="ts">
	interface Props {
		id: string;
		name: string;
		label: string;
		hint?: string;
		error?: string;
		value?: string;
		width?: '20' | '10' | '5' | '4' | '3' | '2';
		autocomplete?: string;
		spellcheck?: boolean;
		oninput?: (e: Event) => void;
	}

	let {
		id,
		name,
		label,
		hint,
		error,
		value = '',
		width,
		autocomplete = 'email',
		spellcheck = false,
		oninput
	}: Props = $props();

	const inputClass = $derived(() => {
		const base = 'govuk-input';
		const widthClass = width ? `govuk-input--width-${width}` : '';
		const errorClass = error ? 'govuk-input--error' : '';
		return [base, widthClass, errorClass].filter(Boolean).join(' ');
	});
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
	<input
		class={inputClass()}
		{id}
		{name}
		type="email"
		{value}
		{oninput}
		aria-describedby={[hint ? `${id}-hint` : '', error ? `${id}-error` : '']
			.filter(Boolean)
			.join(' ') || undefined}
		autocomplete={autocomplete as any}
		{spellcheck}
	/>
</div>
