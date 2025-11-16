<script>
	import GovUKPage from '$lib/components/GovUKPage.svelte';
</script>

<GovUKPage title="Welcome to GOV.UK">
	{#snippet children()}
		<p class="govuk-body">
			This is a SvelteKit application using the GOV.UK Design System.
		</p>

		<h2 class="govuk-heading-l">Getting started</h2>
		<p class="govuk-body">
			You can now use GOV.UK Frontend components in your Svelte application.
		</p>

		<button class="govuk-button" data-module="govuk-button">
			Example button
		</button>
	{/snippet}
</GovUKPage>
