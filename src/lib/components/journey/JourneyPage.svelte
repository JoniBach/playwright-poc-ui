<script lang="ts">
	import { untrack } from 'svelte';
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { componentMap, Breadcrumbs } from '$lib/components/govuk';
	import { Button } from '$lib/components/govuk';
	import { journeyStore } from '$lib/stores/journey.svelte';
	import { generateTestData } from '$lib/utils/auto-fill';

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
		console.log('handleNext called');
		console.log('[snapshot] Current data:', untrack(() => journeyStore.currentState.data));
		const result = journeyStore.goToNextPage();
		console.log('goToNextPage result:', result);
		if (!result) {
			console.log('[snapshot] Validation failed. Errors:', untrack(() => journeyStore.currentState.errors));
		}
	}

	function handleBack() {
		journeyStore.goToPreviousPage();
	}

	function handleAutoFill() {
		if (!currentPage) return;
		
		// Generate test data for all fields on the current page
		const testData = generateTestData(currentPage);
		
		// Update the journey store with the test data
		Object.entries(testData).forEach(([fieldId, value]) => {
			journeyStore.updateData(fieldId, value);
		});
		
		console.log('Auto-filled page with test data:', testData);
	}

	function handleFormSubmit(e: Event) {
		e.preventDefault();
		handleNext();
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

	function createDateInputHandler(fieldId: string) {
		return (e: CustomEvent<{day: string, month: string, year: string}>) => {
			const { day, month, year } = e.detail;
			handleFieldChange(fieldId, { day, month, year });
		};
	}
</script>

{#if currentPage}
	<GovUKPage title={currentPage.title}>
		{#snippet children()}
			<!-- Breadcrumbs with auto-fill link -->
			{#if breadcrumbs().length > 0}
				<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
					<div style="flex: 1;">
						<Breadcrumbs items={breadcrumbs()} />
					</div>
					<a 
						href="javascript:void(0)" 
						onclick={handleAutoFill}
						style="font-size: 0.875rem; color: #505a5f; text-decoration: underline; white-space: nowrap; margin-left: 1rem;"
					>
						Auto-fill
					</a>
				</div>
			{:else}
				<!-- Auto-fill link when no breadcrumbs -->
				<div style="margin-bottom: 1rem; text-align: right;">
					<a 
						href="javascript:void(0)" 
						onclick={handleAutoFill}
						style="font-size: 0.875rem; color: #505a5f; text-decoration: underline;"
					>
						Auto-fill
					</a>
				</div>
			{/if}

			<form onsubmit={handleFormSubmit}>
				{#each currentPage.components as config}
					{@const Component = componentMap[config.type]}
					{@const fieldId = config.props.name || config.props.id}
					{@const currentValue = fieldId ? journeyStore.getValue(fieldId) : undefined}
					{@const currentError = fieldId ? journeyStore.getError(fieldId) : undefined}

					<div style="margin-bottom: 1.5rem;">
						{#if fieldId && (config.type === 'textInput' || config.type === 'textarea')}
							<Component
								{...config.props}
								value={currentValue || ''}
								error={currentError}
								oninput={createInputHandler(fieldId)}
							/>
						{:else if fieldId && config.type === 'select'}
							<Component
								{...config.props}
								value={currentValue || ''}
								error={currentError}
								onchange={createInputHandler(fieldId)}
							/>
						{:else if fieldId && config.type === 'dateInput'}
							<Component
								{...config.props}
								dayValue={currentValue?.day || ''}
								monthValue={currentValue?.month || ''}
								yearValue={currentValue?.year || ''}
								errorMessage={currentError}
								oninput={createDateInputHandler(fieldId)}
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
					<Button text="Continue" type="button" onclick={handleNext} />
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
