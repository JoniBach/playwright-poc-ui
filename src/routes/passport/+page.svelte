<script lang="ts">
	import GovUKPage from '$lib/components/GovUKPage.svelte';
	import { Button, Heading, Paragraph, InsetText, WarningText, Details } from '$lib/components/govuk';
</script>

<GovUKPage title="Apply online for a UK passport">
	{#snippet children()}
		<Paragraph
			text="Use this service to apply for, renew, replace or update your passport and pay for it online."
			lead={true}
		/>

		<p class="govuk-body">
			This service is also available <a href="#" class="govuk-link">in Welsh (Cymraeg)</a>.
		</p>

		<Heading text="How long it takes" level="m" tag="h2" />
		<p class="govuk-body">
			It should take around 3 weeks to get your first UK adult passport, but it can take longer.
		</p>
		<p class="govuk-body">
			All other application types (for example, renewing a passport or getting a child passport) should take 3 weeks. It can take longer if more information is needed or your application hasn't been filled out correctly.
		</p>
		<p class="govuk-body">
			You should use a different service if you <a href="#" class="govuk-link">need your passport urgently</a>.
		</p>

		<Heading text="Cost" level="m" tag="h2" />
		<p class="govuk-body">
			It costs:
		</p>
		<ul class="govuk-list govuk-list--bullet">
			<li>£88.50 for an adult passport (or £100 for a 50 page frequent traveller passport)</li>
			<li>£57.50 for a child passport (or £69 for a 50 page frequent traveller passport)</li>
		</ul>

		<Heading text="Before you start" level="m" tag="h2" />
		<p class="govuk-body">
			You'll need a debit or credit card to use this service.
		</p>
		<p class="govuk-body">
			It's £9.50 cheaper to apply for a passport online than by paper form.
		</p>

		<InsetText text="You must be aged 16 or over to get an adult passport. There's a different service to get a passport for a child." />

		<WarningText text="There are different rules if you're applying from the Channel Islands or Isle of Man." />

		<Details 
			summary="What you'll need to do" 
			text="You'll need to provide 2 identical digital photos and your supporting documents. You'll also need to pay the fee and confirm your identity online or at a Post Office." 
		/>

		<Heading text="Apply online" level="m" tag="h2" />
		<p class="govuk-body">
			You can apply for a new passport or renew your passport online.
		</p>

		<Button text="Start now" href="/journey" startButton={true} />

		<Heading text="Other ways to apply" level="m" tag="h2" />

		<Heading text="Help applying online" level="s" tag="h3" />
		<p class="govuk-body">
			You can get help applying online from <a href="#" class="govuk-link">an assisted digital service</a> if you:
		</p>
		<ul class="govuk-list govuk-list--bullet">
			<li>do not feel confident using a computer or mobile device</li>
			<li>do not have internet access</li>
		</ul>
		<p class="govuk-body">
			You can only use this service if you're applying in the UK.
		</p>

		<Heading text="Paper forms" level="s" tag="h3" />
		<p class="govuk-body">
			You can also <a href="#" class="govuk-link">apply using a paper form</a>. It costs £9.50 more than applying online.
		</p>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

		<Heading text="Related content" level="m" tag="h2" />
		<ul class="govuk-list">
			<li><a href="#" class="govuk-link">Passport fees</a></li>
			<li><a href="#" class="govuk-link">Get a passport photo</a></li>
			<li><a href="#" class="govuk-link">Passport interview</a></li>
			<li><a href="#" class="govuk-link">Track your passport application</a></li>
		</ul>
	{/snippet}
</GovUKPage>
