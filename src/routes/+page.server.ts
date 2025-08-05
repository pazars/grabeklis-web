import { GrabeklisAPISchema } from '$lib/schemas';
import { GRABEKLIS_API_URL } from '$env/static/private'

// --- Local KV Mock Implementation ---
// Define interfaces for the options commonly used with Cloudflare KV's get and put methods
interface MockKVGetOptions {
    type?: 'text' | 'json' | 'arrayBuffer' | 'stream';
}

interface MockKVPutOptions {
    expiration?: number;     // Unix timestamp (seconds since epoch)
    expirationTtl?: number;  // TTL in seconds
}

// This mock will store data in memory for local development
const localKvStore = new Map<string, { value: string; expiration: number; }>();

const createLocalKvMock = () => {
    console.warn("🚨 Using local Cloudflare KV mock. Data will NOT persist across server restarts or across multiple local processes. This is for local development only. 🚨");

    return {
        async get(key: string, options?: MockKVGetOptions) {
            const item = localKvStore.get(key);
            if (item) {
                // Check if the item has expired
                if (item.expiration && Date.now() >= item.expiration) {
                    localKvStore.delete(key); // Remove expired item
                    console.log(`[Local KV Mock] Key "${key}" expired and removed.`);
                    return null;
                }
                console.log(`[Local KV Mock] Retrieved key: "${key}"`);
                // Parse JSON if requested, otherwise return as string
                return options?.type === 'json' ? JSON.parse(item.value) : item.value;
            }
            console.log(`[Local KV Mock] Key "${key}" not found.`);
            return null;
        },
        async put(key: string, value: string, options?: MockKVPutOptions) {
            let expiration = Infinity; // Default to no expiration
            if (options?.expirationTtl) {
                expiration = Date.now() + options.expirationTtl * 1000; // Convert seconds to milliseconds
            } else if (options?.expiration) {
                // If expiration is provided as a Unix timestamp (in seconds)
                expiration = options.expiration * 1000; // Convert to milliseconds
            }
            localKvStore.set(key, { value, expiration });
            console.log(`[Local KV Mock] Stored key: "${key}" with expiration: ${expiration === Infinity ? 'never' : new Date(expiration).toLocaleString()}`);
        },
        // You might need to mock other KV methods if your code uses them (e.g., delete, list)
    };
};
// --- End Local KV Mock Implementation ---


/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, platform }) {
    // Should use Cloudflare's KVNamespace locally as well but added a mock just in case
    const KOPSAVILKUMS_DAILY_SUMMARY = platform?.env?.KOPSAVILKUMS_DAILY_SUMMARY || createLocalKvMock();        

    // Calculate the date for which data is being fetched (yesterday)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate() - 1).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`; // YYYYMMDD

    // Define a unique cache key for the data based on the formatted date
    const cacheKey = formattedDate;

    // Calculate the expiration TTL (Time-To-Live) in seconds until the end of the current day
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // Set to 23:59:59.999 of the current day
    const currentTimestamp = Date.now(); // Current time in milliseconds
    const ttlSeconds = Math.max(0, Math.floor((endOfToday.getTime() - currentTimestamp) / 1000));

    // --- 1. Attempt to retrieve data from cache (real KV or local mock) ---
    try {
        const cachedResponse = await KOPSAVILKUMS_DAILY_SUMMARY.get(cacheKey, { type: 'json' });
        const validatedData = GrabeklisAPISchema.parse(cachedResponse);
        
        if (validatedData) {
            console.log(`[Cache] Returning cached data for ${cacheKey}`);
            return { "grabeklisData": validatedData };
        }
    } catch (cacheError) {
        // Log any errors encountered during cache read but continue to fetch from API
        console.error(`[Cache] Error reading from cache for key "${cacheKey}":`, cacheError);
    }

    console.log(`[Cache] No valid cache found for ${formattedDate}. Fetching new data from API...`);

    // --- 2. Fetch data from the external API if not found in cache or cache read failed ---
    try {
        const apiUrl = `${GRABEKLIS_API_URL}/lsm/summary/daily?date=${formattedDate}`;
        console.log(`[API Fetch] Fetching from: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const rawData = await response.json();
        const validatedData = GrabeklisAPISchema.parse(rawData);

        // --- 3. Store the newly fetched and validated data in cache (real KV or local mock) ---
        try {
            await KOPSAVILKUMS_DAILY_SUMMARY.put(
                cacheKey,
                JSON.stringify(validatedData), // KV expects strings, so stringify JSON
                { expirationTtl: ttlSeconds }
            );
            console.log(`[Cache] Successfully fetched and cached data for ${formattedDate} with TTL ${ttlSeconds}s.`);
        } catch (cachePutError) {
            // Log any errors during cache write, but don't prevent returning the data
            console.error(`[Cache] Error writing to cache for key "${cacheKey}":`, cachePutError);
        }

        return { "grabeklisData": validatedData };

    } catch (error) {
        console.error("Server-side data loading/validation error:", error);
        if (error instanceof Error) {
            return {
                error: `Server error loading data from API: ${error.message}`
            };
        }
        return {
            error: "An unknown server error occurred while fetching data from API."
        };
    }
}