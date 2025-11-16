<script lang="ts">
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import {
		Button,
		Heading,
		Paragraph,
		TextInput,
		Textarea,
		Radios,
		Checkboxes,
		Select,
		Panel,
		WarningText,
		InsetText,
		Details,
		Table,
		Tag,
		SummaryList
	} from '$lib/components/govuk';

	let textValue = $state('');
	let textareaValue = $state('');
	let radioValue = $state('');
	let checkboxValues = $state<string[]>([]);
	let selectValue = $state('');
</script>

<GovUKPage title="GOV.UK Components Showcase">
	{#snippet children()}
		<Paragraph text="This page demonstrates all available GOV.UK Design System components." />

		<!-- Buttons -->
		<Heading text="Buttons" level="l" tag="h2" />
		<div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
			<Button text="Default button" />
			<Button text="Secondary" variant="secondary" />
			<Button text="Warning" variant="warning" />
			<Button text="Start now" startButton={true} href="#" />
		</div>

		<!-- Panel -->
		<Panel title="Application complete" body="Your reference number is HDJ2123F" />

		<!-- Tags -->
		<Heading text="Tags" level="l" tag="h2" />
		<div style="display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap;">
			<Tag text="Completed" colour="green" />
			<Tag text="In progress" colour="blue" />
			<Tag text="Delayed" colour="red" />
			<Tag text="New" colour="turquoise" />
		</div>

		<!-- Warning Text -->
		<WarningText text="You can be fined up to £5,000 if you do not register." />

		<!-- Inset Text -->
		<InsetText
			text="It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application."
		/>

		<!-- Form Elements -->
		<Heading text="Form Elements" level="l" tag="h2" />

		<TextInput
			id="name"
			name="name"
			label="Full name"
			hint="Enter your full name as it appears on your passport"
			bind:value={textValue}
			autocomplete="name"
		/>

		<Textarea
			id="description"
			name="description"
			label="Can you provide more detail?"
			hint="Do not include personal or financial information"
			bind:value={textareaValue}
		/>

		<Radios
			id="contact"
			name="contact"
			legend="How would you prefer to be contacted?"
			hint="Select one option"
			bind:value={radioValue}
			options={[
				{ value: 'email', text: 'Email', hint: 'We will send you an email' },
				{ value: 'phone', text: 'Phone', hint: 'We will call you' },
				{ value: 'text', text: 'Text message' }
			]}
		/>

		<Checkboxes
			id="nationality"
			name="nationality"
			legend="What is your nationality?"
			hint="Select all that apply"
			bind:values={checkboxValues}
			options={[
				{ value: 'british', text: 'British' },
				{ value: 'irish', text: 'Irish' },
				{ value: 'other', text: 'Citizen of another country' }
			]}
		/>

		<Select
			id="sort"
			name="sort"
			label="Sort by"
			bind:value={selectValue}
			options={[
				{ value: 'published', text: 'Recently published' },
				{ value: 'updated', text: 'Recently updated', selected: true },
				{ value: 'views', text: 'Most views' },
				{ value: 'comments', text: 'Most comments' }
			]}
		/>

		<!-- Details -->
		<Details summary="Help with nationality" text="We need to know your nationality so we can work out which elections you're entitled to vote in. If you cannot provide your nationality, you'll have to send copies of identity documents through the post." />

		<!-- Table -->
		<Heading text="Table" level="l" tag="h2" />
		<Table
			caption="Dates and amounts"
			headers={['Date', 'Amount', 'Status']}
			rows={[
				{ date: '1 January 2024', amount: '£85.00', status: 'Paid' },
				{ date: '1 February 2024', amount: '£85.00', status: 'Paid' },
				{ date: '1 March 2024', amount: '£85.00', status: 'Pending' }
			]}
			firstCellIsHeader={true}
		/>

		<!-- Summary List -->
		<Heading text="Summary List" level="l" tag="h2" />
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
				}
			]}
		/>
	{/snippet}
</GovUKPage>
