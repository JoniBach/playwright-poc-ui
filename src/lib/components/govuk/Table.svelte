<script lang="ts">
	import Tag from './Tag.svelte';

	interface TableCell {
		text?: string | number;
		html?: string;
		tag?: {
			text: string;
			colour?: string;
		};
		link?: {
			href: string;
			text: string;
		};
	}

	interface TableRow {
		[key: string]: string | number | TableCell;
	}

	interface Props {
		caption?: string;
		headers: string[];
		rows: TableRow[];
		firstCellIsHeader?: boolean;
		emptyMessage?: string;
	}

	let { caption, headers, rows, firstCellIsHeader = false, emptyMessage = 'No results found' }: Props = $props();

	function isCellObject(cell: any): cell is TableCell {
		return typeof cell === 'object' && cell !== null && ('text' in cell || 'html' in cell || 'tag' in cell || 'link' in cell);
	}
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
		{#if rows.length === 0}
			<tr class="govuk-table__row">
				<td class="govuk-table__cell" colspan={headers.length}>
					{emptyMessage}
				</td>
			</tr>
		{:else}
			{#each rows as row}
				<tr class="govuk-table__row">
					{#each Object.values(row) as cell, index}
						{#if firstCellIsHeader && index === 0}
							<th scope="row" class="govuk-table__header">
								{#if isCellObject(cell)}
									{#if cell.html}
										{@html cell.html}
									{:else if cell.link}
										<a href={cell.link.href} class="govuk-link">{cell.link.text}</a>
									{:else if cell.tag}
										<Tag text={cell.tag.text} colour={cell.tag.colour} />
									{:else}
										{cell.text}
									{/if}
								{:else}
									{cell}
								{/if}
							</th>
						{:else}
							<td class="govuk-table__cell">
								{#if isCellObject(cell)}
									{#if cell.html}
										{@html cell.html}
									{:else if cell.link}
										<a href={cell.link.href} class="govuk-link">{cell.link.text}</a>
									{:else if cell.tag}
										<Tag text={cell.tag.text} colour={cell.tag.colour} />
									{:else}
										{cell.text}
									{/if}
								{:else}
									{cell}
								{/if}
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		{/if}
	</tbody>
</table>
