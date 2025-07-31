<script lang="ts">
    export let message: string;
</script>

<div class="error-message" role="alert">
    <strong class="font-bold">Oops! An error occurred:</strong>
    <p class="mt-2">{message}</p>
    <p class="mt-4 text-sm">Please check the server logs for more details or try again later.</p>
</div>