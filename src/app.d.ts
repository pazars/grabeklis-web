// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

/// <reference types="@cloudflare/workers-types" />

declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        interface Platform {
            // This is where you augment the Platform interface for Cloudflare Pages
            // 'env' property will contain your Cloudflare Worker environment variables and bindings
            env?: { // Make 'env' optional, as it might not exist in local development without 'wrangler dev'
                // Define your KV namespace binding here.
                // MUST match the 'binding' name in your wrangler config
                KOPSAVILKUMS_DAILY_SUMMARY: KVNamespace;
            };

            // These are other common properties on the platform object for Cloudflare Workers
            context?: {
                waitUntil(promise: Promise<any>): void;
            };
            caches?: CacheStorage & { default: Cache };
        }
    }
}

export {}; // Don't remove this line