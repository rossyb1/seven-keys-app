// supabase/functions/process-message/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const SYSTEM_PROMPT = `You are the Seven Keys concierge - a premium, personal assistant for an exclusive members club in Dubai.

TONE:
- Short and direct - like texting a friend who gets things done
- No fluff, no explanations, no descriptions
- 1 sentence responses when possible
- Never say you're an AI

STYLE EXAMPLES:
- "Got it. What date?" 
- "Perfect. How many guests?"
- "Done - I'll confirm shortly."
- "Carbone, Zuma, or LPM - any preference?"

DON'T:
- Don't describe venues
- Don't over-explain
- Don't ask multiple questions at once
- Don't use emojis

=== BUTTON TRIGGERS ===
Users press buttons that send these exact messages. Skip greetings and go straight to the first question:

"I'd like to make a reservation" → "Which venue?"
"I'd like to book an experience" → "Yacht, beach club, nightclub, or event tickets?"
"I need help with my bookings" → "Here's what you have coming up..." [list bookings]
"I'd like to book for a large group" → "How many guests?"
"Can you recommend something for me?" → "Dinner, drinks, or beach club?"
"I'd like to arrange a corporate booking" → "What type of event?"

=== FLOWS ===

RESERVATION:
1. "Which venue?" (or "Want me to recommend somewhere?")
2. "What date?"
3. "What time?"
4. "How many guests?"
5. "Any special requests?"
6. "Done - [Venue], [Date], [Time], [X] guests. I'll confirm shortly."

EXPERIENCE:
1. "Yacht, beach club, nightclub, or event tickets?"
- Yacht/Nightclub/Events → "Got it. Let me get options and pricing - I'll message shortly."
- Beach club → Treat like reservation

MY BOOKINGS:
1. List their bookings
2. "Which one?"
3. Handle: change, add guests, running late, cancel

GROUP (10+):
1. "How many?"
2. "What's the occasion?"
3. "Venue preference?"
4. "Date and time?"
5. "I'll coordinate with the venue and get back to you."

RECOMMENDATIONS:
1. "Dinner, drinks, or beach club?"
- Dinner → "Cuisine?" → "Vibe?" → 2-3 names only
- Drinks → "What vibe?" → 2-3 names only
- Beach club → List available ones

CORPORATE:
1. "What type of event?"
2. "How many people?"
3. "Date?"
4. "I'll have our team reach out with options."

=== CONTEXT ===
- "6" after asking guests = 6 guests
- "tomorrow" = calculate date
- "8" after asking time = 8pm
- Remember the conversation - don't repeat questions

Escalate silently: Groups 10+, yacht, nightclub tables, event tickets, corporate, complaints.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials are not set");
    }

    // Parse request body
    const { message, user_id, conversation_id } = await req.json();

    if (!message || !user_id) {
      return new Response(
        JSON.stringify({ error: "message and user_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get or create conversation first (needed for history lookup)
    let finalConversationId = conversation_id;
    
    if (!finalConversationId) {
      // Create new conversation if one doesn't exist
      const { data: newConversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          member_id: user_id,
          status: "active",
          metadata: {},
        })
        .select("id")
        .single();

      if (convError) {
        console.error("Error creating conversation:", convError);
        throw new Error("Failed to create conversation");
      }

      finalConversationId = newConversation.id;
      console.log("✅ Created new conversation:", finalConversationId);
    } else {
      console.log("✅ Using existing conversation:", finalConversationId);
    }

    // Get conversation history (last 20 messages for context)
    console.log("📥 Fetching conversation history for:", finalConversationId);
    let conversationHistory = [];
    
    const { data: historyMessages, error: historyError } = await supabase
      .from("messages")
      .select("sender, text, created_at")
      .eq("conversation_id", finalConversationId)
      .order("created_at", { ascending: true })
      .limit(20);

    if (historyError) {
      console.error("❌ Error fetching conversation history:", historyError);
    } else if (historyMessages && historyMessages.length > 0) {
      console.log(`✅ Fetched ${historyMessages.length} history messages`);
      conversationHistory = historyMessages.map((msg) => ({
        role: msg.sender === "member" ? "user" : "assistant",
        content: msg.text,
      }));
      console.log("📋 History messages:", conversationHistory.map(m => `${m.role}: ${m.content.substring(0, 50)}...`));
    } else {
      console.log("ℹ️ No conversation history found");
    }

    // User message is already saved by the app before calling this function
    // No need to save it again here

    // Prepare messages for Anthropic API (include all history + current message)
    const messages = [
      ...conversationHistory,
      { role: "user", content: message },
    ];

    console.log(`📤 Sending ${messages.length} messages to Claude (${conversationHistory.length} history + 1 current)`);
    console.log("📋 Messages array:", JSON.stringify(messages.map(m => ({ role: m.role, content: m.content.substring(0, 100) + (m.content.length > 100 ? '...' : '') })), null, 2));

    // Call Anthropic API
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error("Anthropic API error:", errorText);
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    const anthropicData = await anthropicResponse.json();
    const aiResponse = anthropicData.content[0]?.text || "I'm sorry, I couldn't process that request.";

    // Save AI response to database
    const { error: aiMessageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: finalConversationId,
        user_id,
        sender: "concierge",
        text: aiResponse,
      });

    if (aiMessageError) {
      console.error("Error saving AI message:", aiMessageError);
    }

    // Return response
    return new Response(
      JSON.stringify({
        response: aiResponse,
        conversation_id: finalConversationId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing message:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
