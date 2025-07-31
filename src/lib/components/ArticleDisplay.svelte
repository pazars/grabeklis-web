<script lang="ts">
    import type { Summary } from "$lib/schemas";

    // Prop received from the parent component (+page.svelte)
    export let category: Summary;
</script>

<div class="category-card">
    <div class="article-list">
        {#each category.articles as article}
            <div class="article-item">
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="article-link"
                    aria-label={`Read more about ${article.title}`}
                >
                    <h3 class="article-title">
                        {article.title}
                    </h3>
                    <p class="article-summary">
                        {article.ai_summary}
                    </p>
                </a>
            </div>
        {/each}
    </div>
</div>
