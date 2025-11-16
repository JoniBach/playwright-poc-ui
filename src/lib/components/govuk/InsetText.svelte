<script lang="ts">
	interface Props {
		text: string;
	}

	let { text }: Props = $props();
</script>

<div class="govuk-inset-text">
	{text}
</div>
