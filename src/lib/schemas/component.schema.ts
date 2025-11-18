import { z } from 'zod';

/**
 * Comprehensive Zod schemas for all journey component types.
 * These provide strict validation for component props and enable AI-ready structured output.
 */

// Common shared schemas
const BaseComponentProps = z.object({
	id: z.string().optional(),
	classes: z.string().optional()
});

// Form Input Components
export const TextInputSchema = z.object({
	type: z.literal('textInput'),
	props: BaseComponentProps.extend({
		id: z.string(),
		name: z.string(),
		label: z.string(),
		hint: z.string().optional(),
		value: z.string().optional(),
		width: z.enum(['5', '10', '20', '30', 'full']).optional(),
		autocomplete: z.string().optional(),
		spellcheck: z.boolean().optional(),
		disabled: z.boolean().optional(),
		readonly: z.boolean().optional()
	})
});

export const EmailInputSchema = z.object({
	type: z.literal('email'),
	props: BaseComponentProps.extend({
		id: z.string(),
		name: z.string(),
		label: z.string(),
		hint: z.string().optional(),
		value: z.string().optional(),
		width: z.enum(['5', '10', '20', '30', 'full']).optional(),
		autocomplete: z.string().optional(),
		spellcheck: z.boolean().optional()
	})
});

export const TelInputSchema = z.object({
	type: z.literal('tel'),
	props: BaseComponentProps.extend({
		id: z.string(),
		name: z.string(),
		label: z.string(),
		hint: z.string().optional(),
		value: z.string().optional(),
		width: z.enum(['5', '10', '20', '30', 'full']).optional(),
		autocomplete: z.string().optional()
	})
});

export const TextareaSchema = z.object({
	type: z.literal('textarea'),
	props: BaseComponentProps.extend({
		id: z.string(),
		name: z.string(),
		label: z.string(),
		hint: z.string().optional(),
		value: z.string().optional(),
		rows: z.number().min(1).max(20).optional(),
		maxlength: z.number().optional(),
		spellcheck: z.boolean().optional()
	})
});

export const DateInputSchema = z.object({
	type: z.literal('dateInput'),
	props: BaseComponentProps.extend({
		id: z.string(),
		name: z.string(),
		legend: z.string(),
		hint: z.string().optional(),
		items: z.array(z.object({
			id: z.string(),
			name: z.string(),
			label: z.string(),
			value: z.string().optional(),
			classes: z.string().optional()
		})).optional()
	})
});

export const RadiosSchema = z.object({
	type: z.literal('radios'),
	props: BaseComponentProps.extend({
		id: z.string(),
		name: z.string(),
		legend: z.string(),
		hint: z.string().optional(),
		items: z.array(z.object({
			value: z.string(),
			text: z.string(),
			hint: z.string().optional(),
			checked: z.boolean().optional(),
			disabled: z.boolean().optional(),
			conditional: z.object({
				html: z.string()
			}).optional()
		}))
	})
});

export const CheckboxesSchema = z.object({
	type: z.literal('checkboxes'),
	props: BaseComponentProps.extend({
		id: z.string(),
		name: z.string(),
		legend: z.string(),
		hint: z.string().optional(),
		items: z.array(z.object({
			value: z.string(),
			text: z.string(),
			hint: z.string().optional(),
			checked: z.boolean().optional(),
			disabled: z.boolean().optional()
		}))
	})
});

export const SelectSchema = z.object({
	type: z.literal('select'),
	props: BaseComponentProps.extend({
		id: z.string(),
		name: z.string(),
		label: z.string(),
		hint: z.string().optional(),
		items: z.array(z.object({
			value: z.string(),
			text: z.string(),
			selected: z.boolean().optional(),
			disabled: z.boolean().optional()
		}))
	})
});

// Content Components
export const HeadingSchema = z.object({
	type: z.literal('heading'),
	props: BaseComponentProps.extend({
		text: z.string(),
		content: z.string().optional(), // Alternative to text
		level: z.enum(['s', 'm', 'l', 'xl']).optional(),
		size: z.enum(['s', 'm', 'l', 'xl']).optional(),
		tag: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).optional(),
		caption: z.string().optional()
	})
});

export const ParagraphSchema = z.object({
	type: z.literal('paragraph'),
	props: BaseComponentProps.extend({
		text: z.string(),
		content: z.string().optional(), // Alternative to text
		lead: z.boolean().optional()
	})
});

export const ListSchema = z.object({
	type: z.literal('list'),
	props: BaseComponentProps.extend({
		// Support both content and items for list data
		content: z.array(z.string()).optional(),
		items: z.array(z.string()).optional(),
		listType: z.enum(['bullet', 'number']).optional(),
		spaced: z.boolean().optional()
	}).refine(data => data.content || data.items, {
		message: "List must have either 'content' or 'items' property"
	})
});

export const InsetTextSchema = z.object({
	type: z.literal('insetText'),
	props: BaseComponentProps.extend({
		// Support both text and content properties
		text: z.string().optional(),
		content: z.string().optional()
	}).refine(data => data.text || data.content, {
		message: "InsetText must have either 'text' or 'content' property"
	})
});

export const WarningTextSchema = z.object({
	type: z.literal('warningText'),
	props: BaseComponentProps.extend({
		content: z.string(),
		iconFallbackText: z.string().optional()
	})
});

export const DetailsSchema = z.object({
	type: z.literal('details'),
	props: BaseComponentProps.extend({
		summary: z.string(),
		content: z.string(),
		open: z.boolean().optional()
	})
});

// Display Components
export const PanelSchema = z.object({
	type: z.literal('panel'),
	props: BaseComponentProps.extend({
		title: z.string(),
		content: z.string().optional(),
		headingLevel: z.enum(['1', '2', '3', '4', '5', '6']).optional()
	})
});

export const SummaryListSchema = z.object({
	type: z.literal('summaryList'),
	props: BaseComponentProps.extend({
		rows: z.array(z.object({
			// Support both simple string format and complex object format
			key: z.union([
				z.string(), // Simple format: "Tuition Fee Loan"
				z.object({
					text: z.string(),
					classes: z.string().optional()
				})
			]),
			value: z.union([
				z.string(), // Simple format: "£9,250 per year"
				z.object({
					text: z.string(),
					html: z.string().optional(),
					classes: z.string().optional()
				})
			]),
			actions: z.object({
				items: z.array(z.object({
					href: z.string(),
					text: z.string(),
					visuallyHiddenText: z.string().optional()
				}))
			}).optional()
		})),
		card: z.object({
			title: z.object({
				text: z.string()
			}).optional(),
			actions: z.object({
				items: z.array(z.object({
					href: z.string(),
					text: z.string()
				}))
			}).optional()
		}).optional()
	})
});

export const TableSchema = z.object({
	type: z.literal('table'),
	props: BaseComponentProps.extend({
		caption: z.string().optional(),
		captionClasses: z.string().optional(),
		firstCellIsHeader: z.boolean().optional(),
		head: z.array(z.object({
			text: z.string(),
			classes: z.string().optional(),
			colspan: z.number().optional(),
			rowspan: z.number().optional()
		})).optional(),
		rows: z.array(z.array(z.object({
			text: z.string(),
			html: z.string().optional(),
			classes: z.string().optional(),
			colspan: z.number().optional(),
			rowspan: z.number().optional()
		})))
	})
});

export const NotificationBannerSchema = z.object({
	type: z.literal('notificationBanner'),
	props: BaseComponentProps.extend({
		title: z.string(),
		content: z.string(),
		type: z.enum(['success', 'important']).optional(),
		role: z.string().optional(),
		titleHeadingLevel: z.enum(['1', '2', '3', '4', '5', '6']).optional()
	})
});

// Interactive Components
export const ButtonSchema = z.object({
	type: z.literal('button'),
	props: BaseComponentProps.extend({
		text: z.string(),
		href: z.string().optional(),
		element: z.enum(['a', 'button', 'input']).optional(),
		name: z.string().optional(),
		type: z.enum(['button', 'submit', 'reset']).optional(),
		value: z.string().optional(),
		disabled: z.boolean().optional(),
		preventDoubleClick: z.boolean().optional(),
		isStartButton: z.boolean().optional()
	})
});

// Journey Type Components (for metadata)
export const DataEntrySchema = z.object({
	type: z.literal('data-entry')
});

export const DataLookupSchema = z.object({
	type: z.literal('data-lookup')
});

export const SuccessSchema = z.object({
	type: z.literal('success')
});

// Union of all component types using discriminated union for better type safety
export const ComponentSchema = z.discriminatedUnion('type', [
	// Form inputs
	TextInputSchema,
	EmailInputSchema,
	TelInputSchema,
	TextareaSchema,
	DateInputSchema,
	RadiosSchema,
	CheckboxesSchema,
	SelectSchema,
	
	// Content
	HeadingSchema,
	ParagraphSchema,
	ListSchema,
	InsetTextSchema,
	WarningTextSchema,
	DetailsSchema,
	
	// Display
	PanelSchema,
	SummaryListSchema,
	TableSchema,
	NotificationBannerSchema,
	
	// Interactive
	ButtonSchema,
	
	// Journey types
	DataEntrySchema,
	DataLookupSchema,
	SuccessSchema
]);

// Export inferred types
export type TextInputComponent = z.infer<typeof TextInputSchema>;
export type EmailInputComponent = z.infer<typeof EmailInputSchema>;
export type TelInputComponent = z.infer<typeof TelInputSchema>;
export type TextareaComponent = z.infer<typeof TextareaSchema>;
export type DateInputComponent = z.infer<typeof DateInputSchema>;
export type RadiosComponent = z.infer<typeof RadiosSchema>;
export type CheckboxesComponent = z.infer<typeof CheckboxesSchema>;
export type SelectComponent = z.infer<typeof SelectSchema>;

export type HeadingComponent = z.infer<typeof HeadingSchema>;
export type ParagraphComponent = z.infer<typeof ParagraphSchema>;
export type ListComponent = z.infer<typeof ListSchema>;
export type InsetTextComponent = z.infer<typeof InsetTextSchema>;
export type WarningTextComponent = z.infer<typeof WarningTextSchema>;
export type DetailsComponent = z.infer<typeof DetailsSchema>;

export type PanelComponent = z.infer<typeof PanelSchema>;
export type SummaryListComponent = z.infer<typeof SummaryListSchema>;
export type TableComponent = z.infer<typeof TableSchema>;
export type NotificationBannerComponent = z.infer<typeof NotificationBannerSchema>;

export type ButtonComponent = z.infer<typeof ButtonSchema>;

export type Component = z.infer<typeof ComponentSchema>;

/**
 * Validate a component configuration against its schema
 */
export function validateComponent(component: unknown): Component {
	const result = ComponentSchema.safeParse(component);
	if (!result.success) {
		throw new Error(`Invalid component configuration: ${result.error.message}`);
	}
	return result.data;
}

/**
 * Type guard to check if a component is of a specific type
 */
export function isComponentOfType<T extends Component['type']>(
	component: Component,
	type: T
): component is Extract<Component, { type: T }> {
	return component.type === type;
}
