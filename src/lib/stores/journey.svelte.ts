import type { Journey, JourneyState, JourneyPage } from '$lib/types/journey';

class JourneyStore {
	private journey = $state<Journey | null>(null);
	private state = $state<JourneyState>({
		currentPageId: '',
		data: {},
		errors: {},
		visitedPages: [],
		completed: false
	});

	// Getters
	get currentJourney() {
		return this.journey;
	}

	get currentState() {
		return this.state;
	}

	get currentPage(): JourneyPage | null {
		if (!this.journey || !this.state.currentPageId) return null;
		return this.journey.pages[this.state.currentPageId] || null;
	}

	get canGoBack(): boolean {
		return !!this.currentPage?.previousPage;
	}

	get progress(): number {
		if (!this.journey) return 0;
		const totalPages = Object.keys(this.journey.pages).length;
		const visitedPages = this.state.visitedPages.length;
		return Math.round((visitedPages / totalPages) * 100);
	}

	// Initialize journey
	initJourney(journey: Journey) {
		this.journey = journey;
		this.state = {
			currentPageId: journey.startPage,
			data: {},
			errors: {},
			visitedPages: [journey.startPage],
			completed: false
		};
	}

	// Update form data
	updateData(key: string, value: any) {
		this.state.data[key] = value;
		// Clear error for this field if it exists
		if (this.state.errors[key]) {
			delete this.state.errors[key];
		}
	}

	// Validate current page
	validateCurrentPage(): boolean {
		if (!this.currentPage?.validation) return true;

		const errors = this.currentPage.validation(this.state.data);
		if (errors) {
			this.state.errors = errors;
			return false;
		}

		this.state.errors = {};
		return true;
	}

	// Navigate to next page
	goToNextPage(): boolean {
		if (!this.currentPage) return false;

		// Validate before proceeding
		if (!this.validateCurrentPage()) {
			return false;
		}

		let nextPageId: string | undefined;

		if (typeof this.currentPage.nextPage === 'function') {
			nextPageId = this.currentPage.nextPage(this.state.data);
		} else {
			nextPageId = this.currentPage.nextPage;
		}

		if (!nextPageId) {
			// No next page, might be end of journey
			this.state.completed = true;
			return true;
		}

		this.state.currentPageId = nextPageId;

		// Track visited pages
		if (!this.state.visitedPages.includes(nextPageId)) {
			this.state.visitedPages.push(nextPageId);
		}

		return true;
	}

	// Navigate to previous page
	goToPreviousPage(): boolean {
		if (!this.currentPage?.previousPage) return false;

		this.state.currentPageId = this.currentPage.previousPage;
		this.state.errors = {};
		return true;
	}

	// Navigate to specific page
	goToPage(pageId: string): boolean {
		if (!this.journey?.pages[pageId]) return false;

		this.state.currentPageId = pageId;
		this.state.errors = {};

		if (!this.state.visitedPages.includes(pageId)) {
			this.state.visitedPages.push(pageId);
		}

		return true;
	}

	// Get all collected data as summary
	getSummary(): Array<{ key: string; value: any; changeLink?: string }> {
		return Object.entries(this.state.data).map(([key, value]) => ({
			key,
			value,
			changeLink: this.findPageForField(key)
		}));
	}

	// Find which page contains a specific field
	private findPageForField(fieldKey: string): string | undefined {
		if (!this.journey) return undefined;

		for (const [pageId, page] of Object.entries(this.journey.pages)) {
			const hasField = page.components.some((component) => {
				return (
					component.props.id === fieldKey ||
					component.props.name === fieldKey
				);
			});

			if (hasField) return pageId;
		}

		return undefined;
	}

	// Reset journey
	reset() {
		if (this.journey) {
			this.state = {
				currentPageId: this.journey.startPage,
				data: {},
				errors: {},
				visitedPages: [this.journey.startPage],
				completed: false
			};
		}
	}

	// Get error for a field
	getError(fieldKey: string): string | undefined {
		return this.state.errors[fieldKey];
	}

	// Get value for a field
	getValue(fieldKey: string): any {
		return this.state.data[fieldKey];
	}
}

// Export singleton instance
export const journeyStore = new JourneyStore();
