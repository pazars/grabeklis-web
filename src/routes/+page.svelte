<script lang="ts">
    import type { GrabeklisAPISchemaType, Summary } from '$lib/schemas';

    import ErrorMessage from '$lib/components/ErrorMessage.svelte';
    import NoDataMessage from '$lib/components/NoDataMessage.svelte';
    import CategoryTabs from '$lib/components/CategoryTabs.svelte';
    import ArticleDisplay from '$lib/components/ArticleDisplay.svelte';
    import { formatLatvianDate } from '$lib/utils'

    // The data prop will contain what's returned from +page.server.ts
    export let data: { grabeklisData: GrabeklisAPISchemaType | null; error?: string };

    // Destructure for easier access in the template
    $: ({ grabeklisData, error } = data);

    // State to hold the currently selected category
    let activeCategory: Summary | null = null;
    let dateString: string;

    $: activeCategory = (grabeklisData?.summaries && grabeklisData.summaries.length > 0)
        ? grabeklisData.summaries[0]
        : null; // Ensure a null fallback if no summaries

    // Initialize dateString reactively: it will be set whenever grabeklisData.date changes
    $: dateString = grabeklisData?.date
        ? formatLatvianDate(grabeklisData.date)
        : ''; // Provide an empty string fallback

    function handleCategorySelect(selectedCategory: Summary) {
        activeCategory = selectedCategory;
    }
</script>

<style lang="postcss">
  @reference "tailwindcss";
</style>

<div class="w-full mx-auto flex flex-wrap justify-center">
    {#if error}
        <ErrorMessage message={error} />
    {:else if grabeklisData && grabeklisData.summaries && grabeklisData.summaries.length > 0}
        <div class="w-full prose items-center flex flex-col justify-center mb-3">
                <h1 class="mb-1 mt-3">
                    Kopsavilkums
                </h1>
                <p class="mt-1"> {dateString}
                </p>
        </div>
        <div class="w-full items-center flex flex-wrap justify-center mb-3">
            <CategoryTabs
                categories={grabeklisData.summaries}
                activeCategory={activeCategory}
                onselect={handleCategorySelect}
            />
        </div>

        {#if activeCategory}
            <ArticleDisplay category={activeCategory} />
        {:else}
            <NoDataMessage message="Select a category to view articles." />
        {/if}

    {:else}
        <NoDataMessage message="No data available or still loading." />
    {/if}
</div>