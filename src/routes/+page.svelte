<script lang="ts">
    // Import the type for the schema to correctly type the data prop
    // Assuming GrabeklisAPISchemaType is derived from z.infer<typeof GrabeklisAPISchema>
    import type { GrabeklisAPISchemaType, Summary } from '$lib/schemas';
    import { onMount } from 'svelte';

    import ErrorMessage from '$lib/components/ErrorMessage.svelte';
    import NoDataMessage from '$lib/components/NoDataMessage.svelte';
    import CategoryTabs from '$lib/components/CategoryTabs.svelte';
    import ArticleDisplay from '$lib/components/ArticleDisplay.svelte';
    import { formatLatvianDate } from '$lib/utils'

    // The data prop will contain what's returned from +page.server.ts
    // It will be { grabeklisData: GrabeklisAPISchemaType | null; error?: string }
    export let data: { grabeklisData: GrabeklisAPISchemaType | null; error?: string };

    // Destructure for easier access in the template
    $: ({ grabeklisData, error } = data);

    // State to hold the currently selected category
    let activeCategory: Summary | null = null;
    let dateString: string;

    // Set the first category as active on mount if data is available
    onMount(() => {
        if (grabeklisData && grabeklisData.summaries && grabeklisData.summaries.length > 0) {
            activeCategory = grabeklisData.summaries[0];
        }
        
        if (grabeklisData && grabeklisData.date)
            dateString = formatLatvianDate(grabeklisData.date);
        
    });

    // Function to set the active category when a tab is clicked
    function handleCategorySelect(event: CustomEvent<Summary>) {
        activeCategory = event.detail;
    }
</script>

<style lang="postcss">
  @reference "tailwindcss";
</style>

<div class="container">
    {#if error}
        <ErrorMessage message={error} />
    {:else if grabeklisData && grabeklisData.summaries && grabeklisData.summaries.length > 0}
        <h1 class="text-5xl font-extrabold text-center text-gray-900 mb-3">
            Kopsavilkums
        </h1>
        <p class="text-small text-center mb-5">
            {dateString}
        </p>

        <CategoryTabs
            categories={grabeklisData.summaries}
            activeCategory={activeCategory}
            on:select={handleCategorySelect}
        />

        {#if activeCategory}
            <ArticleDisplay category={activeCategory} />
        {:else}
            <NoDataMessage message="Select a category to view articles." />
        {/if}

    {:else}
        <NoDataMessage message="No data available or still loading. Please ensure 'example_response.json' is correctly configured." />
    {/if}
</div>