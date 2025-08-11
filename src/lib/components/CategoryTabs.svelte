<script lang="ts">
    import type { Summary } from '$lib/schemas';

    // Declare props using $props()
    // The `onselect` prop is the callback function from the parent.
    let { categories, activeCategory, onselect } = $props<{
        categories: Summary[];
        activeCategory: Summary | null;
        // The type for the callback function.
        onselect: (selectedCategory: Summary) => void;
    }>();

    // Function to handle the change event of the select dropdown
    function selectCategory(event: Event) {
        const selectedCategoryName = (event.target as HTMLSelectElement).value;
        const selectedCategory = categories.find(cat => cat.category === selectedCategoryName);
        if (selectedCategory) {
            // Call the callback prop directly with the data
            onselect(selectedCategory);
        }
    }
</script>

<select
    class="select"
    onchange={selectCategory}
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