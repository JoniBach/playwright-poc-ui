<script lang="ts">
	interface Props {
		title?: string;
		text?: string;
		html?: string;
		type?: 'neutral' | 'success';
		role?: 'region' | 'alert';
		titleId?: string;
		headingLevel?: 2 | 3;
	}

	let {
		title = 'Important',
		text,
		html,
		type = 'neutral',
		role = 'region',
		titleId = 'govuk-notification-banner-title',
		headingLevel = 2
	}: Props = $props();

	const isSuccess = $derived(type === 'success');
</script>

<div
	class="govuk-notification-banner {isSuccess ? 'govuk-notification-banner--success' : ''}"
	{role}
	aria-labelledby={titleId}
	data-module="govuk-notification-banner"
>
	<div class="govuk-notification-banner__header">
		{#if headingLevel === 2}
			<h2 class="govuk-notification-banner__title" id={titleId}>
				{title}
			</h2>
		{:else}
			<h3 class="govuk-notification-banner__title" id={titleId}>
				{title}
			</h3>
		{/if}
	</div>
	<div class="govuk-notification-banner__content">
		{#if html}
			{@html html}
		{:else if text}
			<p class="govuk-notification-banner__heading">
				{text}
			</p>
		{/if}
	</div>
</div>
