import type { ComponentConfig } from '$lib/components/govuk';

export interface JourneyPage {
	id: string;
	title: string;
	components: ComponentConfig[];
	nextPage?: string | ((data: Record<string, any>) => string);
	previousPage?: string;
	validation?: (data: Record<string, any>) => Record<string, string> | null;
}

export interface LandingPageSection {
	type: 'paragraph' | 'heading' | 'list' | 'insetText' | 'warningText' | 'details';
	content: string | string[];
	level?: 's' | 'm' | 'l' | 'xl';
	summary?: string; // For details component
	listType?: 'bullet' | 'number';
}

export interface LandingPage {
	title: string;
	lead: string;
	sections: LandingPageSection[];
	startButtonText?: string;
	startButtonHref: string;
}

export interface Journey {
	id: string;
	name: string;
	landingPage?: LandingPage;
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
