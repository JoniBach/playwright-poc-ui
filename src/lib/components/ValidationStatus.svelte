<script lang="ts">
	import { onMount } from 'svelte';
	import { Details } from '$lib/components/govuk';
	import type { ValidationResult, ValidationError } from '$lib/utils/journey-validator';
	import { validateAllJourneys } from '$lib/utils/journey-validator';

	let validationResult = $state<ValidationResult | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			// Load all journey files
			const journeyFiles = [
				'passport-apply',
				'passport-status',
				'self-assessment',
				'tax-summary',
				'universal-credit',
				'state-pension-forecast',
				'register-gp',
				'nhs-medical-records',
				'join-armed-forces',
				'service-records',
				'student-finance',
				'student-loan-balance',
				'visa-apply',
				'visa-status',
				'probate-apply',
				'probate-search',
				'driving-licence-apply',
				'mot-history',
				'money-claim',
				'track-court-case'
			];

			const journeys: Record<string, unknown> = {};

			// Load each journey file
			await Promise.all(
				journeyFiles.map(async (slug) => {
					try {
						const response = await fetch(`/journeys/${slug}.json`);
						if (response.ok) {
							journeys[slug] = await response.json();
						}
					} catch (e) {
						console.error(`Failed to load ${slug}:`, e);
					}
				})
			);

			// Load journey index
			let journeyIndex: unknown = null;
			try {
				const response = await fetch('/journeys/index.json');
				if (response.ok) {
					journeyIndex = await response.json();
				}
			} catch (e) {
				console.error('Failed to load journey index:', e);
			}

			// Validate all journeys
			validationResult = validateAllJourneys(journeys, journeyIndex);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unknown error occurred';
			console.error('Validation error:', e);
		} finally {
			loading = false;
		}
	});

	function getStatusIcon(isValid: boolean): string {
		return isValid ? '✅' : '❌';
	}

	function getStatusText(isValid: boolean): string {
		return isValid ? 'All journeys valid' : 'Validation errors found';
	}

	function getStatusClass(isValid: boolean): string {
		return isValid ? 'validation-status--success' : 'validation-status--error';
	}

	function groupErrorsByJourney(errors: ValidationError[]): Map<string, ValidationError[]> {
		const grouped = new Map<string, ValidationError[]>();
		errors.forEach((error) => {
			const key = error.journeyId || 'general';
			if (!grouped.has(key)) {
				grouped.set(key, []);
			}
			grouped.get(key)!.push(error);
		});
		return grouped;
	}
</script>

<div class="validation-status govuk-!-margin-top-9">
	<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

	<h2 class="govuk-heading-m">Journey Validation Status</h2>

	{#if loading}
		<p class="govuk-body">
			<span class="validation-status__spinner">⏳</span> Validating journey configurations...
		</p>
	{:else if error}
		<div class="govuk-error-summary" data-module="govuk-error-summary">
			<div role="alert">
				<h2 class="govuk-error-summary__title">Validation Error</h2>
				<div class="govuk-error-summary__body">
					<p class="govuk-body">{error}</p>
				</div>
			</div>
		</div>
	{:else if validationResult}
		<div class="validation-status__summary {getStatusClass(validationResult.isValid)}">
			<p class="govuk-body govuk-!-margin-bottom-2">
				<strong>{getStatusIcon(validationResult.isValid)} {getStatusText(validationResult.isValid)}</strong>
			</p>
			<p class="govuk-body-s govuk-!-margin-bottom-0">
				{validationResult.summary.validJourneys}/{validationResult.summary.totalJourneys} journeys
				valid • {validationResult.summary.totalPages} pages • {validationResult.summary.totalComponents}
				components
			</p>
		</div>

		<Details summary="View detailed validation results" open={!validationResult.isValid}>
			{#snippet children()}
				<div class="validation-status__details">
					<!-- Summary Statistics -->
					<h3 class="govuk-heading-s">Summary</h3>
					<dl class="govuk-summary-list govuk-summary-list--no-border">
						<div class="govuk-summary-list__row">
							<dt class="govuk-summary-list__key">Total Journeys</dt>
							<dd class="govuk-summary-list__value">{validationResult.summary.totalJourneys}</dd>
						</div>
						<div class="govuk-summary-list__row">
							<dt class="govuk-summary-list__key">Valid Journeys</dt>
							<dd class="govuk-summary-list__value">{validationResult.summary.validJourneys}</dd>
						</div>
						<div class="govuk-summary-list__row">
							<dt class="govuk-summary-list__key">Total Pages</dt>
							<dd class="govuk-summary-list__value">{validationResult.summary.totalPages}</dd>
						</div>
						<div class="govuk-summary-list__row">
							<dt class="govuk-summary-list__key">Total Components</dt>
							<dd class="govuk-summary-list__value">{validationResult.summary.totalComponents}</dd>
						</div>
					</dl>

					<!-- Component Types -->
					{#if Object.keys(validationResult.summary.componentTypes).length > 0}
						<h3 class="govuk-heading-s govuk-!-margin-top-6">Component Types</h3>
						<ul class="govuk-list govuk-list--bullet">
							{#each Object.entries(validationResult.summary.componentTypes).sort(([, a], [, b]) => b - a) as [type, count]}
								<li>
									<code>{type}</code>: {count}
								</li>
							{/each}
						</ul>
					{/if}

					<!-- Errors -->
					{#if validationResult.errors.length > 0}
						<h3 class="govuk-heading-s govuk-!-margin-top-6">
							❌ Errors ({validationResult.errors.length})
						</h3>
						{#each Array.from(groupErrorsByJourney(validationResult.errors).entries()) as [journeyId, errors]}
							<div class="validation-status__error-group govuk-!-margin-bottom-4">
								<h4 class="govuk-heading-xs govuk-!-margin-bottom-2">
									Journey: <code>{journeyId}</code>
								</h4>
								{#each errors as error, index}
									<div class="validation-status__error govuk-!-margin-bottom-3">
										<p class="govuk-body-s govuk-!-margin-bottom-1">
											<strong>{index + 1}.</strong>
											{error.message}
										</p>
										{#if error.pageId}
											<p class="govuk-body-xs govuk-!-margin-bottom-1">
												📄 Page: <code>{error.pageId}</code>
											</p>
										{/if}
										{#if error.componentIndex !== undefined}
											<p class="govuk-body-xs govuk-!-margin-bottom-1">
												🧩 Component: {error.componentIndex}
											</p>
										{/if}
										{#if error.suggestion}
											<p class="govuk-body-xs govuk-hint">💡 {error.suggestion}</p>
										{/if}
									</div>
								{/each}
							</div>
						{/each}
					{/if}

					<!-- Warnings -->
					{#if validationResult.warnings.length > 0}
						<h3 class="govuk-heading-s govuk-!-margin-top-6">
							⚠️ Warnings ({validationResult.warnings.length})
						</h3>
						{#each Array.from(groupErrorsByJourney(validationResult.warnings).entries()) as [journeyId, warnings]}
							<div class="validation-status__warning-group govuk-!-margin-bottom-4">
								<h4 class="govuk-heading-xs govuk-!-margin-bottom-2">
									Journey: <code>{journeyId}</code>
								</h4>
								{#each warnings as warning, index}
									<div class="validation-status__warning govuk-!-margin-bottom-3">
										<p class="govuk-body-s govuk-!-margin-bottom-1">
											<strong>{index + 1}.</strong>
											{warning.message}
										</p>
										{#if warning.pageId}
											<p class="govuk-body-xs govuk-!-margin-bottom-1">
												📄 Page: <code>{warning.pageId}</code>
											</p>
										{/if}
										{#if warning.componentIndex !== undefined}
											<p class="govuk-body-xs govuk-!-margin-bottom-1">
												🧩 Component: {warning.componentIndex}
											</p>
										{/if}
										{#if warning.suggestion}
											<p class="govuk-body-xs govuk-hint">💡 {warning.suggestion}</p>
										{/if}
									</div>
								{/each}
							</div>
						{/each}
					{/if}

					{#if validationResult.isValid}
						<p class="govuk-body govuk-!-margin-top-6">
							<strong>✅ All journeys passed validation!</strong>
						</p>
					{/if}
				</div>
			{/snippet}
		</Details>
	{/if}
</div>

<style>
	.validation-status {
		border-top: 1px solid #b1b4b6;
		padding-top: 30px;
	}

	.validation-status__summary {
		padding: 15px 20px;
		border-left: 5px solid;
		margin-bottom: 20px;
	}

	.validation-status--success {
		background-color: #f3f9f3;
		border-left-color: #00703c;
	}

	.validation-status--error {
		background-color: #fff5f5;
		border-left-color: #d4351c;
	}

	.validation-status__details code {
		background-color: #f3f2f1;
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 0.9em;
	}

	.validation-status__error-group,
	.validation-status__warning-group {
		padding: 15px;
		background-color: #f8f8f8;
		border-radius: 4px;
	}

	.validation-status__error {
		padding-left: 15px;
		border-left: 3px solid #d4351c;
	}

	.validation-status__warning {
		padding-left: 15px;
		border-left: 3px solid #f47738;
	}

	.validation-status__spinner {
		display: inline-block;
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
