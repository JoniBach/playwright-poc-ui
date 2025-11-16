<script lang="ts">
	interface TableRow {
		[key: string]: string | number;
	}

	interface Props {
		caption?: string;
		headers: string[];
		rows: TableRow[];
		firstCellIsHeader?: boolean;
	}

	let { caption, headers, rows, firstCellIsHeader = false }: Props = $props();
</script>

<table class="govuk-table">
	{#if caption}
		<caption class="govuk-table__caption govuk-table__caption--m">
			{caption}
		</caption>
	{/if}
	<thead class="govuk-table__head">
		<tr class="govuk-table__row">
			{#each headers as header}
				<th scope="col" class="govuk-table__header">{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody class="govuk-table__body">
		{#each rows as row}
			<tr class="govuk-table__row">
				{#each Object.values(row) as cell, index}
					{#if firstCellIsHeader && index === 0}
						<th scope="row" class="govuk-table__header">{cell}</th>
					{:else}
						<td class="govuk-table__cell">{cell}</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
