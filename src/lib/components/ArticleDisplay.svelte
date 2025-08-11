<script lang="ts">
    import type { Summary } from "$lib/schemas";

    // Prop received from the parent component (+page.svelte)
    export let category: Summary;
</script>

<div class="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 p-4">
{#each category.articles as article}
    <div class="custom-card">
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Pilnais raksts: ${article.title}`}
        >
        <div class="card-body">
            <h3 class="card-title text-wrap break-words">{article.title}</h3>
            <p class="prose text-wrap break-words">
                {article.ai_summary}
            </p>
        </div>
        </a>
    </div>
{/each}
</div>