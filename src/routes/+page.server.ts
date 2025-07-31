import { GrabeklisAPISchema } from '$lib/schemas';
import { GRABEKLIS_API_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) { // Destructure 'fetch' from the load context
    try {
        // Construct the full API URL for the daily summary endpoint
        // You'll need to dynamically get the current date for the 'date' query parameter.
        // For demonstration, let's use a fixed date or generate today's date.
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate() - 1).padStart(2, '0');  // Yesterday
        const formattedDate = `${year}${month}${day}`; // YYYYMMDD format

        const apiUrl = `${GRABEKLIS_API_URL}/lsm/summary/daily?date=${formattedDate}`;

        console.log(`Fetching data from API: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            // If the response is not OK (e.g., 404, 500), throw an error
            const errorText = await response.text(); // Get the error message from the API
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const rawData = await response.json();

        // Validate the raw data against your Zod schema
        const validatedData = GrabeklisAPISchema.parse(rawData);

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