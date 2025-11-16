<script lang="ts">
	interface SummaryListRow {
		key: string;
		value: string;
		actions?: {
			href: string;
			text: string;
			visuallyHiddenText?: string;
		}[];
	}

	interface Props {
		rows: SummaryListRow[];
		noBorder?: boolean;
	}

	let { rows, noBorder = false }: Props = $props();
</script>

<dl class="govuk-summary-list {noBorder ? 'govuk-summary-list--no-border' : ''}">
	{#each rows as row}
		<div class="govuk-summary-list__row">
			<dt class="govuk-summary-list__key">
				{row.key}
			</dt>
			<dd class="govuk-summary-list__value">
				{row.value}
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
