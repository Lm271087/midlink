import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { url } = await req.json();

        if (!url) {
            return Response.json({ error: 'URL is required' }, { status: 400 });
        }

        // 1. Invoke LLM to analyze the URL
        // We ask the LLM to browse the URL (add_context_from_internet: true) and extract details
        const llmResponse = await base44.integrations.Core.InvokeLLM({
            prompt: `
            Analyze the following URL: ${url}
            
            Task:
            1. Visit the page and read its main content.
            2. Extract the main Title.
            3. Write a concise Summary (max 2 sentences, engaging).
            4. Identify 3 to 5 Key Points (bullet points).
            5. Find the most relevant Image URL (og:image or main article image). If none found, return null.
            6. Identify the Source Name (e.g., "CNN", "TechCrunch", "Blog do Fulano").

            Return ONLY a valid JSON object with this structure:
            {
                "title": "string",
                "summary": "string",
                "key_points": ["string", "string", ...],
                "image_url": "string or null",
                "source_name": "string"
            }
            `,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    summary: { type: "string" },
                    key_points: { type: "array", items: { type: "string" } },
                    image_url: { type: "string" },
                    source_name: { type: "string" }
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