<script lang="ts">
	interface Props {
		text: string;
		iconFallbackText?: string;
	}

	let { text, iconFallbackText = 'Warning' }: Props = $props();
</script>

<div class="govuk-warning-text">
	<span class="govuk-warning-text__icon" aria-hidden="true">!</span>
	<strong class="govuk-warning-text__text">
		<span class="govuk-visually-hidden">{iconFallbackText}</span>
		{text}
	</strong>
</div>
