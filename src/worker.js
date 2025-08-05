import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", (event) => {
	event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
	try {
		// Serve static assets from KV
		return await getAssetFromKV(event, {
			mapRequestToAsset: serveSinglePageApp,
		});
	} catch (e) {
		// If no asset found, serve index.html for SPA routing
		if (e.status === 404) {
			try {
				const indexRequest = new Request(new URL("/index.html", event.request.url).toString(), event.request);
				return await getAssetFromKV({ ...event, request: indexRequest }, { mapRequestToAsset: serveSinglePageApp });
			} catch (err) {
				return new Response("Page not found", { status: 404 });
			}
		}

		// For other errors, return a 500
		return new Response("Internal Server Error", { status: 500 });
	}
}

// Serve single page app - always return index.html for navigation requests
function serveSinglePageApp(request) {
	const url = new URL(request.url);

	// Check if the request is for a file with an extension
	const hasExtension = url.pathname.includes(".") && !url.pathname.endsWith("/");

	// If it's a navigation request (no extension), serve index.html
	if (!hasExtension) {
		url.pathname = "/index.html";
	}

	return new Request(url.toString(), request);
}
