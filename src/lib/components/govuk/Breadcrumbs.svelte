<script lang="ts">
	interface BreadcrumbItem {
		text: string;
		href?: string;
	}

	interface Props {
		items: BreadcrumbItem[];
		collapseOnMobile?: boolean;
	}

	let { items, collapseOnMobile = false }: Props = $props();
</script>

<div class="govuk-breadcrumbs {collapseOnMobile ? 'govuk-breadcrumbs--collapse-on-mobile' : ''}">
	<ol class="govuk-breadcrumbs__list">
		{#each items as item, index}
			<li class="govuk-breadcrumbs__list-item">
				{#if item.href && index < items.length - 1}
					<a class="govuk-breadcrumbs__link" href={item.href}>
						{item.text}
					</a>
				{:else}
					{item.text}
				{/if}
			</li>
		{/each}
	</ol>
</div>
