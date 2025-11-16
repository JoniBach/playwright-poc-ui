import type { ComponentConfig } from '$lib/components/govuk';

export interface JourneyPage {
	id: string;
	title: string;
	components: ComponentConfig[];
	nextPage?: string | ((data: Record<string, any>) => string);
	previousPage?: string;
	validation?: (data: Record<string, any>) => Record<string, string> | null;
}

export interface Journey {
	id: string;
	name: string;
	startPage: string;
	pages: Record<string, JourneyPage>;
	checkYourAnswersPage?: string;
	completionPage?: string;
}

export interface JourneyState {
	currentPageId: string;
	data: Record<string, any>;
	errors: Record<string, string>;
	visitedPages: string[];
	completed: boolean;
}
