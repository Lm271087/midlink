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

            **CRITICAL RULES:**
            1. Visit and extract the EXACT page/video title from metadata (og:title, page title, video title).
            2. **ABSOLUTELY FORBIDDEN**: NEVER use phrases like "Análise do vídeo:", "Video Analysis:", "Análisis del video:" or ANY variation in the title field.
            3. The title MUST be the EXACT original title from the page/video, translated to ${languageName} if needed.

            **FOR VIDEOS (YouTube, etc.):**
            - **Title**: EXACT video title (translated to ${languageName})
            - **Channel Name**: Extract the channel/creator name
            - **Summary**: Engaging and detailed overview (6-8 sentences) highlighting main value, context, and key details to fill a paragraph.
            - **Key Points**: 3 SPECIFIC takeaways or topics covered
            - **Published Date**: Extract publication date
            - **Content Type**: "Vídeo" or "Tutorial" (in ${languageName})
            - **Image**: Extract the HIGHEST QUALITY thumbnail from og:image, twitter:image, or YouTube maxresdefault thumbnail (prefer maxresdefault.jpg over other qualities)
            - **Source Name**: "YouTube"

            **FOR ARTICLES/NEWS:**
            - **Title**: EXACT article headline (translated to ${languageName})
            - **Author**: Article author name
            - **Summary**: Engaging and detailed summary (6-8 sentences) covering the main points and context to fill a paragraph.
            - **Key Points**: 3 SPECIFIC facts or main ideas
            - **Published Date**: Publication date
            - **Content Type**: "Notícia", "Artigo", "Opinião", "Blog" (in ${languageName})
            - **Image**: Extract the MAIN/FEATURED image from og:image, twitter:image:src, or article:image metadata (prefer high resolution)
            - **Source Name**: Website/publication name

            **NEVER leave fields empty** - infer from available metadata if needed.

            Return ONLY a valid JSON object with ALL fields in ${languageName}.
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