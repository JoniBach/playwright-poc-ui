<script lang="ts">
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import {
		Button,
		Heading,
		Paragraph,
		TextInput,
		EmailInput,
		TelInput,
		Textarea,
		DateInput,
		Radios,
		Checkboxes,
		Select,
		Panel,
		WarningText,
		InsetText,
		Details,
		Table,
		Tag,
		SummaryList,
		NotificationBanner,
		List
	} from '$lib/components/govuk';

	// State for form inputs
	let textValue = $state('');
	let emailValue = $state('');
	let telValue = $state('');
	let textareaValue = $state('');
	let radioValue = $state('');
	let checkboxValues = $state<string[]>([]);
	let selectValue = $state('');
	let dateDay = $state('');
	let dateMonth = $state('');
	let dateYear = $state('');
</script>

<GovUKPage title="GOV.UK Components Test Page">
	{#snippet children()}
		<Paragraph 
			text="This comprehensive test page demonstrates ALL 17+ GOV.UK Design System component types from the Zod schema system." 
			lead={true}
		/>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

		<!-- CONTENT COMPONENTS -->
		<Heading text="Content Components" level="xl" tag="h2" />

		<!-- Heading Variations -->
		<Heading text="1. Heading Component" level="l" tag="h2" />
		<Heading text="Extra Large Heading (XL)" level="xl" tag="h1" />
		<Heading text="Large Heading (L)" level="l" tag="h2" />
		<Heading text="Medium Heading (M)" level="m" tag="h3" />
		<Heading text="Small Heading (S)" level="s" tag="h4" />
		<Heading text="Heading with Caption" level="l" tag="h2" caption="Application details" />

		<!-- Paragraph -->
		<Heading text="2. Paragraph Component" level="l" tag="h2" />
		<Paragraph text="This is a standard paragraph component demonstrating regular body text." />
		<Paragraph text="This is a lead paragraph with larger text for introductions." lead={true} />

		<!-- List -->
		<Heading text="3. List Component" level="l" tag="h2" />
		<Paragraph text="Unordered (bullet) list:" />
		<List 
			type="bullet"
			items={[
				'First bullet point item',
				'Second bullet point item',
				'Third bullet point item with more detail'
			]}
		/>
		<Paragraph text="Ordered (numbered) list:" />
		<List 
			type="number"
			items={[
				'First step in the process',
				'Second step in the process',
				'Third and final step'
			]}
		/>

		<!-- Inset Text -->
		<Heading text="4. Inset Text Component" level="l" tag="h2" />
		<InsetText
			text="It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application."
		/>

		<!-- Warning Text -->
		<Heading text="5. Warning Text Component" level="l" tag="h2" />
		<WarningText text="You can be fined up to £5,000 if you do not register." />

		<!-- Details (Accordion) -->
		<Heading text="6. Details Component" level="l" tag="h2" />
		<Details 
			summary="Help with nationality" 
			text="We need to know your nationality so we can work out which elections you're entitled to vote in. If you cannot provide your nationality, you'll have to send copies of identity documents through the post." 
		/>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

		<!-- FORM INPUT COMPONENTS -->
		<Heading text="Form Input Components" level="xl" tag="h2" />

		<!-- Text Input -->
		<Heading text="7. Text Input Component" level="l" tag="h2" />
		<TextInput
			id="full-name"
			name="full-name"
			label="Full name"
			hint="Enter your full name as it appears on your passport"
			value={textValue}
			oninput={(e) => textValue = (e.target as HTMLInputElement).value}
			autocomplete="name"
			width="20"
		/>

		<!-- Email Input -->
		<Heading text="8. Email Input Component" level="l" tag="h2" />
		<EmailInput
			id="email-address"
			name="email"
			label="Email address"
			hint="We'll only use this to send you a receipt"
			value={emailValue}
			oninput={(e) => emailValue = (e.target as HTMLInputElement).value}
			autocomplete="email"
			width="20"
		/>

		<!-- Tel Input -->
		<Heading text="9. Telephone Input Component" level="l" tag="h2" />
		<TelInput
			id="phone-number"
			name="phone"
			label="UK telephone number"
			hint="For international numbers include the country code"
			value={telValue}
			oninput={(e) => telValue = (e.target as HTMLInputElement).value}
			autocomplete="tel"
			width="20"
		/>

		<!-- Textarea -->
		<Heading text="10. Textarea Component" level="l" tag="h2" />
		<Textarea
			id="more-detail"
			name="more-detail"
			label="Can you provide more detail?"
			hint="Do not include personal or financial information, like your National Insurance number or credit card details."
			bind:value={textareaValue}
			rows={5}
		/>

		<!-- Date Input -->
		<Heading text="11. Date Input Component" level="l" tag="h2" />
		<DateInput
			id="date-of-birth"
			name="date-of-birth"
			legend="What is your date of birth?"
			hint="For example, 31 3 1980"
			dayValue={dateDay}
			monthValue={dateMonth}
			yearValue={dateYear}
		/>

		<!-- Radios -->
		<Heading text="12. Radios Component" level="l" tag="h2" />
		<Radios
			id="contact-preference"
			name="contact"
			legend="How would you prefer to be contacted?"
			hint="Select one option"
			value={radioValue}
			onchange={(e) => radioValue = (e.target as HTMLInputElement).value}
			items={[
				{ value: 'email', text: 'Email', hint: 'We will send you an email confirmation' },
				{ value: 'phone', text: 'Phone', hint: 'We will call you between 9am and 5pm' },
				{ value: 'text', text: 'Text message' }
			]}
		/>

		<!-- Checkboxes -->
		<Heading text="13. Checkboxes Component" level="l" tag="h2" />
		<Checkboxes
			id="nationality"
			name="nationality"
			legend="What is your nationality?"
			hint="Select all options that are relevant to you"
			values={checkboxValues}
			options={[
				{ value: 'british', text: 'British', hint: 'Including English, Scottish, Welsh and Northern Irish' },
				{ value: 'irish', text: 'Irish' },
				{ value: 'other', text: 'Citizen of another country' }
			]}
		/>

		<!-- Select -->
		<Heading text="14. Select Component" level="l" tag="h2" />
		<Select
			id="sort-by"
			name="sort"
			label="Sort by"
			hint="Choose how to sort the results"
			value={selectValue}
			onchange={(e) => selectValue = (e.target as HTMLSelectElement).value}
			options={[
				{ value: '', text: 'Please select' },
				{ value: 'published', text: 'Recently published' },
				{ value: 'updated', text: 'Recently updated' },
				{ value: 'views', text: 'Most views' },
				{ value: 'comments', text: 'Most comments' }
			]}
		/>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

		<!-- DISPLAY COMPONENTS -->
		<Heading text="Display Components" level="xl" tag="h2" />

		<!-- Panel -->
		<Heading text="15. Panel Component" level="l" tag="h2" />
		<Panel 
			title="Application complete" 
			body="Your reference number is HDJ2123F. We have sent you a confirmation email."
		/>

		<!-- Notification Banner -->
		<Heading text="16. Notification Banner Component" level="l" tag="h2" />
		<NotificationBanner
			title="Important"
			text="You have 7 days left to send your application. Set a reminder to complete this application."
		/>
		<NotificationBanner
			title="Success"
			text="Your application has been submitted successfully."
			type="success"
		/>

		<!-- Summary List -->
		<Heading text="17. Summary List Component" level="l" tag="h2" />
		<SummaryList
			rows={[
				{
					key: 'Name',
					value: 'Sarah Philips',
					actions: [
						{
							href: '#',
							text: 'Change',
							visuallyHiddenText: 'name'
						}
					]
				},
				{
					key: 'Date of birth',
					value: '5 January 1978',
					actions: [
						{
							href: '#',
							text: 'Change',
							visuallyHiddenText: 'date of birth'
						}
					]
				},
				{
					key: 'Contact information',
					value: '72 Guild Street, London, SE23 6FH',
					actions: [
						{
							href: '#',
							text: 'Change',
							visuallyHiddenText: 'contact information'
						}
					]
				},
				{
					key: 'Contact details',
					value: '07700 900457 or sarah.philips@example.com'
				}
			]}
		/>

		<!-- Table -->
		<Heading text="18. Table Component" level="l" tag="h2" />
		<Table
			caption="Monthly expenses for 2024"
			headers={['Month', 'Amount', 'Status', 'Category']}
			rows={[
				{ month: 'January 2024', amount: '£850.00', status: 'Paid', category: 'Rent' },
				{ month: 'February 2024', amount: '£850.00', status: 'Paid', category: 'Rent' },
				{ month: 'March 2024', amount: '£850.00', status: 'Pending', category: 'Rent' },
				{ month: 'April 2024', amount: '£850.00', status: 'Due', category: 'Rent' }
			]}
			firstCellIsHeader={true}
		/>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

		<!-- INTERACTIVE COMPONENTS -->
		<Heading text="Interactive Components" level="xl" tag="h2" />

		<!-- Buttons -->
		<Heading text="19. Button Component" level="l" tag="h2" />
		<Paragraph text="Button variations:" />
		<div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
			<Button text="Default button" />
			<Button text="Secondary button" variant="secondary" />
			<Button text="Warning button" variant="warning" />
			<Button text="Disabled button" disabled={true} />
			<Button text="Start now" startButton={true} href="#" />
		</div>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

		<!-- ADDITIONAL COMPONENTS -->
		<Heading text="Additional Components" level="xl" tag="h2" />

		<!-- Tags -->
		<Heading text="20. Tag Component" level="l" tag="h2" />
		<Paragraph text="Status tags with different colours:" />
		<div style="display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap;">
			<Tag text="Completed" colour="green" />
			<Tag text="In progress" colour="blue" />
			<Tag text="Delayed" colour="red" />
			<Tag text="New" colour="turquoise" />
			<Tag text="Inactive" colour="grey" />
			<Tag text="Pending" colour="yellow" />
			<Tag text="Rejected" colour="orange" />
			<Tag text="Sent" colour="purple" />
			<Tag text="Draft" colour="pink" />
		</div>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

		<!-- Summary -->
		<Heading text="Component Test Summary" level="l" tag="h2" />
		<Paragraph text="This page includes all component types defined in the Zod schema system:" />
		<List 
			type="bullet"
			items={[
				'Form Inputs: TextInput, EmailInput, TelInput, Textarea, DateInput, Radios, Checkboxes, Select (8 types)',
				'Content: Heading, Paragraph, List, InsetText, WarningText, Details (6 types)',
				'Display: Panel, NotificationBanner, SummaryList, Table (4 types)',
				'Interactive: Button (1 type)',
				'Additional: Tag (1 type)',
				'Total: 20+ component variations'
			]}
		/>

		<InsetText text="All components are validated against strict Zod schemas and ready for AI-driven journey generation." />

		<Button text="Back to home" href="/" variant="secondary" />
	{/snippet}
</GovUKPage>
