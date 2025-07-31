<script lang="ts">
    import type { Summary } from '$lib/schemas';
    import { createEventDispatcher } from 'svelte';

    export let categories: Summary[];
    export let activeCategory: Summary | null;

    const dispatch = createEventDispatcher();

    // Function to handle the change event of the select dropdown
    function selectCategory(event: Event) {
        const selectedCategoryName = (event.target as HTMLSelectElement).value;
        const selectedCategory = categories.find(cat => cat.category === selectedCategoryName);
        if (selectedCategory) {
            dispatch('select', selectedCategory);
        }
    }
</script>

<div class="flex justify-center mb-8">
    <select
        class="category-dropdown"
        on:change={selectCategory}
    >
        {#each categories as categorySummary (categorySummary.category)}
            <option
                value={categorySummary.category}
                selected={activeCategory?.category === categorySummary.category}
            >
                {categorySummary.category}
            </option>
        {/each}
    </select>
</div>