// GOV.UK Design System Components for Dynamic Mapping
import ButtonComponent from './Button.svelte';
import HeadingComponent from './Heading.svelte';
import ParagraphComponent from './Paragraph.svelte';
import TextInputComponent from './TextInput.svelte';
import TextareaComponent from './Textarea.svelte';
import RadiosComponent from './Radios.svelte';
import CheckboxesComponent from './Checkboxes.svelte';
import SelectComponent from './Select.svelte';
import DateInputComponent from './DateInput.svelte';
import PanelComponent from './Panel.svelte';
import WarningTextComponent from './WarningText.svelte';
import InsetTextComponent from './InsetText.svelte';
import DetailsComponent from './Details.svelte';
import TableComponent from './Table.svelte';
import TagComponent from './Tag.svelte';
import SummaryListComponent from './SummaryList.svelte';
import BreadcrumbsComponent from './Breadcrumbs.svelte';
import NotificationBannerComponent from './NotificationBanner.svelte';

// Re-export with cleaner names
export { ButtonComponent as Button };
export { HeadingComponent as Heading };
export { ParagraphComponent as Paragraph };
export { TextInputComponent as TextInput };
export { TextareaComponent as Textarea };
export { RadiosComponent as Radios };
export { CheckboxesComponent as Checkboxes };
export { SelectComponent as Select };
export { DateInputComponent as DateInput };
export { PanelComponent as Panel };
export { WarningTextComponent as WarningText };
export { InsetTextComponent as InsetText };
export { DetailsComponent as Details };
export { TableComponent as Table };
export { TagComponent as Tag };
export { SummaryListComponent as SummaryList };
export { BreadcrumbsComponent as Breadcrumbs };
export { NotificationBannerComponent as NotificationBanner };

// Component type mapping for dynamic rendering
export const componentMap = {
	button: ButtonComponent,
	heading: HeadingComponent,
	paragraph: ParagraphComponent,
	textInput: TextInputComponent,
	textarea: TextareaComponent,
	radios: RadiosComponent,
	checkboxes: CheckboxesComponent,
	select: SelectComponent,
	dateInput: DateInputComponent,
	panel: PanelComponent,
	warningText: WarningTextComponent,
	insetText: InsetTextComponent,
	details: DetailsComponent,
	table: TableComponent,
	tag: TagComponent,
	summaryList: SummaryListComponent,
	breadcrumbs: BreadcrumbsComponent,
	notificationBanner: NotificationBannerComponent
} as const;

export type ComponentType = keyof typeof componentMap;

// Type definitions for component props
export interface ComponentConfig {
	type: ComponentType;
	props: Record<string, any>;
}
