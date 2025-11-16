<script lang="ts">
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { componentMap, Breadcrumbs } from '$lib/components/govuk';
	import { Button } from '$lib/components/govuk';
	import { journeyStore } from '$lib/stores/journey.svelte';

	const currentPage = $derived(journeyStore.currentPage);
	const canGoBack = $derived(journeyStore.canGoBack);
	const state = $derived(journeyStore.currentState);
	const journey = $derived(journeyStore.currentJourney);

	// Build breadcrumbs from journey metadata
	const breadcrumbs = $derived(() => {
		if (!journey) return [];
		return [
			{ text: 'Home', href: '/' },
			{ text: journey.name }
		];
	});

	function handleNext() {
		journeyStore.goToNextPage();
	}

	function handleBack() {
		journeyStore.goToPreviousPage();
	}

	function handleFieldChange(fieldId: string, value: any) {
		journeyStore.updateData(fieldId, value);
	}

	function createInputHandler(fieldId: string) {
		return (e: Event) => {
			const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
			handleFieldChange(fieldId, target.value);
		};
	}

	function createRadioHandler(fieldId: string) {
		return (e: Event) => {
			const target = e.target as HTMLInputElement;
			if (target.checked) {
				handleFieldChange(fieldId, target.value);
			}
		};
	}

	function createCheckboxHandler(fieldId: string) {
		return (e: Event) => {
			const target = e.target as HTMLInputElement;
			const currentValues = (journeyStore.getValue(fieldId) as string[]) || [];
			if (target.checked) {
				handleFieldChange(fieldId, [...currentValues, target.value]);
			} else {
				handleFieldChange(fieldId, currentValues.filter((v: string) => v !== target.value));
			}
		};
	}
</script>

{#if currentPage}
	<GovUKPage title={currentPage.title}>
		{#snippet children()}
			{#if breadcrumbs().length > 0}
				<Breadcrumbs items={breadcrumbs()} />
			{/if}
			<form on:submit|preventDefault={handleNext}>
				{#each currentPage.components as config}
					{@const Component = componentMap[config.type]}
					{@const fieldId = config.props.id || config.props.name}
					{@const currentValue = fieldId ? journeyStore.getValue(fieldId) : undefined}
					{@const currentError = fieldId ? journeyStore.getError(fieldId) : undefined}

					<div style="margin-bottom: 1.5rem;">
						{#if fieldId && (config.type === 'textInput' || config.type === 'textarea' || config.type === 'select')}
							<Component
								{...config.props}
								value={currentValue || ''}
								error={currentError}
								oninput={createInputHandler(fieldId)}
							/>
						{:else if fieldId && config.type === 'radios'}
							<Component
								{...config.props}
								value={currentValue || ''}
								error={currentError}
								onchange={createRadioHandler(fieldId)}
							/>
						{:else if fieldId && config.type === 'checkboxes'}
							<Component
								{...config.props}
								values={currentValue || []}
								error={currentError}
								onchange={createCheckboxHandler(fieldId)}
							/>
						{:else}
							<Component {...config.props} />
						{/if}
					</div>
				{/each}

				<div style="display: flex; gap: 1rem; margin-top: 2rem;">
					<Button text="Continue" type="submit" />
					{#if canGoBack}
						<Button text="Back" variant="secondary" type="button" onclick={handleBack} />
					{/if}
				</div>
			</form>
		{/snippet}
	</GovUKPage>
{:else}
	<GovUKPage title="Loading...">
		{#snippet children()}
			<p class="govuk-body">Loading journey...</p>
		{/snippet}
	</GovUKPage>
{/if}
