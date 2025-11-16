<script lang="ts">
	interface Props {
		id: string;
		name: string;
		label: string;
		hint?: string;
		error?: string;
		value?: string;
		rows?: number;
	}

	let { id, name, label, hint, error, value = $bindable(''), rows = 5 }: Props = $props();
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
	<textarea
		class="govuk-textarea {error ? 'govuk-textarea--error' : ''}"
		{id}
		{name}
		{rows}
		bind:value
		aria-describedby={[hint ? `${id}-hint` : '', error ? `${id}-error` : '']
			.filter(Boolean)
			.join(' ') || undefined}
	></textarea>
</div>
