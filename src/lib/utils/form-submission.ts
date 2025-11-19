/**
 * Form submission utility for journey forms
 * Handles client-side form submission to server endpoints
 */

export interface SubmissionResponse {
	success: boolean;
	complete?: boolean;
	referenceNumber?: string;
	nextPage?: string;
	currentPage?: string;
	errors?: Array<{ field: string; message: string }>;
	error?: string;
	message?: string;
	data?: Record<string, any>;
}

/**
 * Submit journey form data to server endpoint
 */
export async function submitJourneyForm(
	department: string,
	slug: string,
	currentPage: string,
	formData: FormData
): Promise<SubmissionResponse> {
	try {
		// Add current page to form data
		formData.append('_currentPage', currentPage);

		// Make POST request to server endpoint
		const response = await fetch(
			`/${department}/${slug}/apply?page=${currentPage}`,
			{
				method: 'POST',
				body: formData
			}
		);

		const data: SubmissionResponse = await response.json();

		return data;
	} catch (error) {
		console.error('[Form Submission Error]', error);
		return {
			success: false,
			error: 'Network error',
			message: error instanceof Error ? error.message : 'Failed to submit form'
		};
	}
}

/**
 * Handle form submission with validation and navigation
 */
export async function handleFormSubmit(
	event: SubmitEvent,
	department: string,
	slug: string,
	currentPage: string,
	onSuccess?: (response: SubmissionResponse) => void,
	onError?: (response: SubmissionResponse) => void
): Promise<SubmissionResponse> {
	event.preventDefault();

	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);

	const response = await submitJourneyForm(department, slug, currentPage, formData);

	if (response.success) {
		onSuccess?.(response);
	} else {
		onError?.(response);
	}

	return response;
}

/**
 * Display validation errors on the page (GOV.UK pattern)
 */
export function displayValidationErrors(
	errors: Array<{ field: string; message: string }>
): void {
	// Remove existing errors
	clearValidationErrors();

	// Create error summary
	const errorSummary = createErrorSummary(errors);
	const main = document.querySelector('main');
	if (main) {
		main.insertBefore(errorSummary, main.firstChild);
		errorSummary.focus();
	}

	// Add field-level errors
	errors.forEach(error => {
		const field = document.getElementById(error.field);
		if (field) {
			addFieldError(field, error.message);
		}
	});
}

/**
 * Clear all validation errors from the page
 */
export function clearValidationErrors(): void {
	// Remove error summary
	const errorSummary = document.querySelector('.govuk-error-summary');
	errorSummary?.remove();

	// Remove field-level errors
	document.querySelectorAll('.govuk-error-message').forEach(el => el.remove());
	document.querySelectorAll('.govuk-form-group--error').forEach(el => {
		el.classList.remove('govuk-form-group--error');
	});
	document.querySelectorAll('.govuk-input--error').forEach(el => {
		el.classList.remove('govuk-input--error');
	});
}

/**
 * Create GOV.UK error summary component
 */
function createErrorSummary(
	errors: Array<{ field: string; message: string }>
): HTMLElement {
	const div = document.createElement('div');
	div.className = 'govuk-error-summary';
	div.setAttribute('role', 'alert');
	div.setAttribute('aria-labelledby', 'error-summary-title');
	div.setAttribute('tabindex', '-1');
	div.setAttribute('data-module', 'govuk-error-summary');

	div.innerHTML = `
		<h2 class="govuk-error-summary__title" id="error-summary-title">
			There is a problem
		</h2>
		<div class="govuk-error-summary__body">
			<ul class="govuk-list govuk-error-summary__list">
				${errors.map(error => `
					<li>
						<a href="#${error.field}">${error.message}</a>
					</li>
				`).join('')}
			</ul>
		</div>
	`;

	return div;
}

/**
 * Add field-level error (GOV.UK pattern)
 */
function addFieldError(field: HTMLElement, message: string): void {
	// Add error class to form group
	const formGroup = field.closest('.govuk-form-group');
	if (formGroup) {
		formGroup.classList.add('govuk-form-group--error');
	}

	// Add error class to input
	field.classList.add('govuk-input--error');

	// Create error message element
	const errorMessage = document.createElement('p');
	errorMessage.className = 'govuk-error-message';
	errorMessage.id = `${field.id}-error`;
	errorMessage.innerHTML = `
		<span class="govuk-visually-hidden">Error:</span> ${message}
	`;

	// Insert error message before the input
	field.parentElement?.insertBefore(errorMessage, field);

	// Update aria-describedby
	const describedBy = field.getAttribute('aria-describedby') || '';
	field.setAttribute(
		'aria-describedby',
		`${describedBy} ${errorMessage.id}`.trim()
	);
}
