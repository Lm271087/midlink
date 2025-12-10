import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

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

            Task:
            1. Visit the page/video and analyze its main content comprehensively.
            2. EXTRACT AND TRANSLATE ALL CONTENT TO: ${languageName}.

            3. If it is a VIDEO (YouTube, Vimeo, etc.):
               - Title: Video title (Translate to ${languageName}).
               - Summary: Create an engaging, narrative 'story-style' summary (3-4 sentences) in ${languageName}. Tell the story of the video's content clearly and concisely.
               - Key Points: Extract exactly 3-5 of the MOST IMPORTANT facts, insights, or takeaways (in ${languageName}). Make them punchy and direct.
               - Author: Channel/Creator Name.
               - Published Date: Upload date.
               - Content Type: "Video" (or specific like "Video Tutorial", "Video Essay") - Translate label to ${languageName}.
               - Image: High-res thumbnail.
               - Source Name: Platform (e.g., "YouTube").

            4. If it is a WEB PAGE:
               - Title: Main headline (Translate to ${languageName}).
               - Summary: Create an engaging, narrative 'story-style' summary (3-4 sentences) in ${languageName}. Tell the story of what happened or what the article discusses as if explaining it to a friend.
               - Key Points: Extract exactly 3-5 of the MOST IMPORTANT facts or key takeaways (in ${languageName}). Make them punchy and direct.
               - Author: Article author or "Editorial Team".
               - Published Date: Date of publication.
               - Content Type: Classify as "News", "Technical Article", "Opinion", "Blog Post", "Paper", etc. - Translate label to ${languageName}.
               - Image: Main visual.
               - Source Name: Website Brand Name.

            Return ONLY a valid JSON object.
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
                    author: { type: "string" },
                    published_date: { type: "string" },
                    content_type: { type: "string" }
                },
                required: ["title", "summary", "key_points", "source_name"]
            }
        });

        // The integration returns a dict/object directly when json schema is used
        const analysis = llmResponse;

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