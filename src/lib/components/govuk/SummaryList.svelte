<script lang="ts">
	import Tag from './Tag.svelte';

	interface SummaryListRow {
		key: string;
		value: string;
		tag?: {
			text: string;
			colour?: string;
		};
		html?: boolean; // If true, render value as HTML
		actions?: {
			href: string;
			text: string;
			visuallyHiddenText?: string;
		}[];
	}

	interface Props {
		rows: SummaryListRow[];
		noBorder?: boolean;
		card?: boolean; // Wrap in a card
		title?: string; // Card title
	}

	let { rows, noBorder = false, card = false, title }: Props = $props();
</script>

{#if card}
	<div class="govuk-summary-card">
		{#if title}
			<div class="govuk-summary-card__title-wrapper">
				<h2 class="govuk-summary-card__title">{title}</h2>
			</div>
		{/if}
		<div class="govuk-summary-card__content">
			<dl class="govuk-summary-list {noBorder ? 'govuk-summary-list--no-border' : ''}">
				{#each rows as row}
					<div class="govuk-summary-list__row">
						<dt class="govuk-summary-list__key">
							{row.key}
						</dt>
						<dd class="govuk-summary-list__value">
							{#if row.html}
								{@html row.value}
							{:else}
								{row.value}
							{/if}
							{#if row.tag}
								<Tag text={row.tag.text} colour={row.tag.colour} />
							{/if}
						</dd>
						{#if row.actions}
							<dd class="govuk-summary-list__actions">
								{#each row.actions as action, index}
									<a class="govuk-link" href={action.href}>
										{action.text}
										{#if action.visuallyHiddenText}
											<span class="govuk-visually-hidden">{action.visuallyHiddenText}</span>
										{/if}
									</a>
									{#if index < row.actions.length - 1}
										<br />
									{/if}
								{/each}
							</dd>
						{/if}
					</div>
				{/each}
			</dl>
		</div>
	</div>
{:else}
	<dl class="govuk-summary-list {noBorder ? 'govuk-summary-list--no-border' : ''}">
		{#each rows as row}
			<div class="govuk-summary-list__row">
				<dt class="govuk-summary-list__key">
					{row.key}
				</dt>
				<dd class="govuk-summary-list__value">
					{#if row.html}
						{@html row.value}
					{:else}
						{row.value}
					{/if}
					{#if row.tag}
						<Tag text={row.tag.text} colour={row.tag.colour} />
					{/if}
				</dd>
				{#if row.actions}
					<dd class="govuk-summary-list__actions">
						{#each row.actions as action, index}
							<a class="govuk-link" href={action.href}>
								{action.text}
								{#if action.visuallyHiddenText}
									<span class="govuk-visually-hidden">{action.visuallyHiddenText}</span>
								{/if}
							</a>
							{#if index < row.actions.length - 1}
								<br />
							{/if}
						{/each}
					</dd>
				{/if}
			</div>
		{/each}
	</dl>
{/if}
