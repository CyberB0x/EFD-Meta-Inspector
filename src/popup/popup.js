
const scanButton = document.getElementById("scanButton");
const results = document.getElementById("results");

scanButton.addEventListener("click", async () => {
    results.textContent = "Scanning page...";

    try {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!tab || !tab.id) {
            throw new Error("Active tab not found.");
        }

        // Step 1: Load extractor.js into the page
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["src/scripts/extractor.js"]
        });

        // Step 2: Execute the extraction function
        const extractionResults = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => extractMetadata()
        });

        const metadata = extractionResults[0]?.result;

        if (!metadata || typeof metadata !== "object") {
            throw new Error("Metadata extraction returned no data.");
        }

        // Step 3: Display metadata safely
        results.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent = "Page Metadata";
        results.appendChild(heading);

        const fields = {
            URL: metadata.url,
            Title: metadata.title,
            Description: metadata.description,
            Keywords: metadata.keywords,
            Robots: metadata.robots,
            Canonical: metadata.canonical
        };

        for (const [label, value] of Object.entries(fields)) {
            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = `${label}: `;
            paragraph.appendChild(strong);
            paragraph.appendChild(
                document.createTextNode(value || "Not found")
            );

            results.appendChild(paragraph);
        }

    } catch (error) {
        results.textContent = `Scanning failed: ${error.message}`;
        console.error("EFD Meta Inspector:", error);
    }
});
