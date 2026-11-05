
function extractMetadata() {
    return {
        url: window.location.href,
        title: document.title || null,

        description:
            document.querySelector('meta[name="description"]')
                ?.getAttribute("content") || null,

        keywords:
            document.querySelector('meta[name="keywords"]')
                ?.getAttribute("content") || null,

        robots:
            document.querySelector('meta[name="robots"]')
                ?.getAttribute("content") || null,

        canonical:
            document.querySelector('link[rel="canonical"]')
                ?.getAttribute("href") || null
    };
}
