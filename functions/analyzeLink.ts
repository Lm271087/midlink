import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { url, language } = await req.json();

        if (!url) {
            return Response.json({ error: 'URL is required' }, { status: 400 });
        }

        const targetLanguage = language || 'pt-BR';
        const languageName = {
            'pt-BR': 'Portuguese (Brazil)',
            'es-419': 'Spanish (Latin America)',
            'en-US': 'English (US)'
        }[targetLanguage] || 'Portuguese';

        // 1. Invoke LLM to analyze the URL
        // We ask the LLM to browse the URL (add_context_from_internet: true) and extract details
        const llmResponse = await base44.integrations.Core.InvokeLLM({
            prompt: `
            Analyze the following URL: ${url}

            Analyze the URL and extract the following information in ${languageName}.

            **Instructions:**
            1. **Title**: Extract the exact title (og:title, video title). Do NOT add prefixes like "Analysis of:" or "Summary of:".
            2. **Summary**: Write a concise interpretation of the content (MAXIMUM 45 words). It MUST fit within 5 lines and end with a period. Do NOT end with "...". Do NOT start with "The video is about...". Focus on the main insight.
            3. **Key Points**: Provide 3-4 distinct, complete bullet points of the most important takeaways.
            4. **Image**: Find the highest resolution image available (og:image, maxresdefault for YouTube).
            5. **Meta**: Extract Author/Channel, Date, Source Name, and Content Type (Video, Article, etc.).

            Ensure all text fields are in ${languageName} and the JSON structure is valid.
            `,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    summary: { type: "string" },
                    key_points: { type: "array", items: { type: "string" } },
                    image_url: { type: "string" },
                    source_name: { type: "string" },
                    channel_name: { type: "string" },
                    author: { type: "string" },
                    published_date: { type: "string" },
                    content_type: { type: "string" }
                },
                required: ["title", "summary", "key_points", "source_name"]
            }
        });

        // The integration returns a dict/object directly when json schema is used
        const analysis = llmResponse;

        // Ensure summary ends with a period
        if (analysis && analysis.summary && !analysis.summary.endsWith('.')) {
            analysis.summary += '.';
        }

        if (!analysis || !analysis.title) {
            throw new Error("Failed to generate valid analysis data");
        }

        // Save to database (optional, but good for history)
        // We use service role if user is not logged in, or just standard entity creation
        // Since this might be a public tool, we'll try to save it. 
        // If the user is not logged in, we might need service role or public permissions.
        // For now, we'll just return the data to the frontend to keep it fast and simple.
        // The prompt implies "generate" not necessarily "persist forever", but let's persist if we can.
        
        let savedRecord = null;
        try {
             // We'll try to save using the current auth context. 
             // If it fails (e.g. public user on protected entity), we just ignore saving.
             savedRecord = await base44.entities.LinkAnalysis.create({
                original_url: url,
                ...analysis,
                status: 'completed'
             });
        } catch (e) {
            console.log("Could not save record:", e.message);
        }

        return Response.json({ 
            data: analysis,
            id: savedRecord?.id 
        });

    } catch (error) {
        console.error("Analysis failed:", error);
        return Response.json({ error: error.message || "Failed to analyze link" }, { status: 500 });
    }
});