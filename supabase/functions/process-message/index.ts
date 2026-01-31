// supabase/functions/process-message/index.ts
// Seven Keys AI Concierge with Tool Calling

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS Configuration
const ALLOWED_ORIGINS = [
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "exp://localhost:8081",
  "exp://192.168.1.132:8081",
  // TODO: Add production domains here before launch
  // "https://your-production-domain.com",
];

const getCorsHeaders = (origin?: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// ============ TOOLS DEFINITION ============
const TOOLS = [
  {
    name: "get_venues",
    description: "Search and filter available venues. Use this to find restaurants, beach clubs, nightclubs, or events based on type, vibe, or name.",
    input_schema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["restaurant", "beach_club", "nightclub", "event"],
          description: "Filter by venue type"
        },
        vibe: {
          type: "string",
          description: "Filter by vibe tag (e.g., 'upscale', 'date_night', 'party', 'relaxed', 'family')"
        },
        name: {
          type: "string",
          description: "Search by venue name (partial match)"
        }
      },
      required: []
    }
  },
  {
    name: "get_venue_details",
    description: "Get detailed information about a specific venue including hours, minimum spend, and location.",
    input_schema: {
      type: "object",
      properties: {
        venue_id: {
          type: "string",
          description: "The venue ID"
        },
        venue_name: {
          type: "string",
          description: "The venue name (if ID not known)"
        }
      },
      required: []
    }
  },
  {
    name: "create_booking",
    description: "Create a new booking request. Only call this when you have collected: venue, date, time, and party size from the member.",
    input_schema: {
      type: "object",
      properties: {
        venue_id: {
          type: "string",
          description: "The venue ID to book"
        },
        venue_name: {
          type: "string",
          description: "The venue name (used to look up ID if not provided)"
        },
        booking_date: {
          type: "string",
          description: "Date in YYYY-MM-DD format"
        },
        booking_time: {
          type: "string",
          description: "Time in HH:MM format (24-hour)"
        },
        party_size: {
          type: "number",
          description: "Number of guests"
        },
        special_requests: {
          type: "string",
          description: "Any special requests (e.g., 'window table', 'birthday cake')"
        },
        table_preference: {
          type: "string",
          description: "Table preference if specified"
        }
      },
      required: ["booking_date", "booking_time", "party_size"]
    }
  },
  {
    name: "get_member_bookings",
    description: "Get the member's upcoming and recent bookings.",
    input_schema: {
      type: "object",
      properties: {
        include_past: {
          type: "boolean",
          description: "Include past bookings (default: false, only upcoming)"
        }
      },
      required: []
    }
  },
  {
    name: "modify_booking",
    description: "Modify an existing booking (change date, time, party size, or cancel).",
    input_schema: {
      type: "object",
      properties: {
        booking_id: {
          type: "string",
          description: "The booking ID to modify"
        },
        action: {
          type: "string",
          enum: ["change_date", "change_time", "change_party_size", "add_request", "cancel", "running_late"],
          description: "What to modify"
        },
        new_value: {
          type: "string",
          description: "The new value (date, time, party size, or request text)"
        }
      },
      required: ["booking_id", "action"]
    }
  },
  {
    name: "escalate_to_human",
    description: "Flag this conversation for human review. Use for: groups 10+, yacht bookings, nightclub tables, event tickets, corporate inquiries, complaints, or when uncertain.",
    input_schema: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          enum: ["large_group", "yacht", "nightclub", "event_tickets", "corporate", "complaint", "uncertain", "member_request"],
          description: "Reason for escalation"
        },
        summary: {
          type: "string",
          description: "Brief summary of what the member needs"
        },
        urgency: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "How urgent is this"
        }
      },
      required: ["reason", "summary"]
    }
  }
];

// ============ SYSTEM PROMPT ============
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
- Don't describe venues unless asked
- Don't over-explain
- Don't ask multiple questions at once
- Don't use emojis

=== TOOLS ===
You have tools to:
- Search venues (get_venues)
- Get venue details (get_venue_details)  
- Create bookings (create_booking)
- Get member's bookings (get_member_bookings)
- Modify bookings (modify_booking)
- Escalate to human (escalate_to_human)

USE TOOLS when you have enough info. Don't just say you'll do something - actually do it.

=== BOOKING FLOW ===
1. Get venue (ask or use get_venues to recommend)
2. Get date
3. Get time
4. Get party size
5. Ask for special requests (optional)
6. Call create_booking tool
7. Confirm: "Done - [Venue], [Date], [Time], [X] guests. I'll confirm shortly."

=== ESCALATE (use tool) ===
- Groups 10+ guests
- Yacht bookings
- Nightclub table bookings
- Event tickets
- Corporate inquiries
- Complaints
- When you're not sure

=== CONTEXT UNDERSTANDING ===
- "6" after asking guests = 6 guests
- "tomorrow" = calculate from today's date
- "Saturday" = next Saturday
- "8" or "8pm" after asking time = 20:00
- Remember the conversation - don't repeat questions`;

// ============ TOOL HANDLERS ============
async function handleToolCall(
  toolName: string,
  toolInput: any,
  supabase: any,
  userId: string,
  conversationId: string,
  today: string
): Promise<string> {
  console.log(`🔧 Executing tool: ${toolName}`, toolInput);

  switch (toolName) {
    case "get_venues": {
      let query = supabase
        .from("venues")
        .select("id, name, type, vibe_tags, location, minimum_spend, family_friendly")
        .eq("status", "active");

      if (toolInput.type) {
        query = query.eq("type", toolInput.type);
      }
      if (toolInput.vibe) {
        query = query.contains("vibe_tags", [toolInput.vibe]);
      }
      if (toolInput.name) {
        query = query.ilike("name", `%${toolInput.name}%`);
      }

      const { data, error } = await query.limit(10);
      if (error) return `Error fetching venues: ${error.message}`;
      if (!data || data.length === 0) return "No venues found matching that criteria.";
      
      return JSON.stringify(data.map((v: any) => ({
        id: v.id,
        name: v.name,
        type: v.type,
        vibes: v.vibe_tags,
        location: v.location,
        min_spend: v.minimum_spend
      })));
    }

    case "get_venue_details": {
      let query = supabase
        .from("venues")
        .select("*");

      if (toolInput.venue_id) {
        query = query.eq("id", toolInput.venue_id);
      } else if (toolInput.venue_name) {
        query = query.ilike("name", `%${toolInput.venue_name}%`);
      } else {
        return "Please provide venue_id or venue_name";
      }

      const { data, error } = await query.single();
      if (error) return `Venue not found: ${error.message}`;
      
      return JSON.stringify({
        id: data.id,
        name: data.name,
        type: data.type,
        location: data.location,
        hours: data.operating_hours,
        minimum_spend: data.minimum_spend,
        requires_deposit: data.requires_deposit,
        family_friendly: data.family_friendly,
        vibes: data.vibe_tags
      });
    }

    case "create_booking": {
      // Look up venue ID if only name provided
      let venueId = toolInput.venue_id;
      let venueName = toolInput.venue_name;
      
      if (!venueId && venueName) {
        const { data: venue } = await supabase
          .from("venues")
          .select("id, name")
          .ilike("name", `%${venueName}%`)
          .single();
        
        if (venue) {
          venueId = venue.id;
          venueName = venue.name;
        } else {
          return `Could not find venue: ${venueName}`;
        }
      }

      if (!venueId) {
        return "Please specify which venue to book.";
      }

      // Create the booking
      const { data: booking, error } = await supabase
        .from("bookings")
        .insert({
          user_id: userId,
          venue_id: venueId,
          booking_date: toolInput.booking_date,
          booking_time: toolInput.booking_time,
          party_size: toolInput.party_size,
          special_requests: toolInput.special_requests || null,
          table_preference: toolInput.table_preference || null,
          status: "pending",
          deposit_required: false,
          deposit_confirmed: false,
          points_earned: 0,
          no_show: false,
          is_urgent: false
        })
        .select("id, booking_date, booking_time, party_size")
        .single();

      if (error) {
        console.error("Booking creation error:", error);
        return `Error creating booking: ${error.message}`;
      }

      // Get venue name for confirmation
      if (!venueName) {
        const { data: venue } = await supabase
          .from("venues")
          .select("name")
          .eq("id", venueId)
          .single();
        venueName = venue?.name || "the venue";
      }

      return JSON.stringify({
        success: true,
        booking_id: booking.id,
        venue: venueName,
        date: booking.booking_date,
        time: booking.booking_time,
        guests: booking.party_size,
        status: "pending"
      });
    }

    case "get_member_bookings": {
      let query = supabase
        .from("bookings")
        .select(`
          id,
          booking_date,
          booking_time,
          party_size,
          status,
          special_requests,
          venues (name, location)
        `)
        .eq("user_id", userId)
        .order("booking_date", { ascending: true });

      if (!toolInput.include_past) {
        query = query.gte("booking_date", today);
      }

      const { data, error } = await query.limit(10);
      if (error) return `Error fetching bookings: ${error.message}`;
      if (!data || data.length === 0) return "No upcoming bookings found.";

      return JSON.stringify(data.map((b: any) => ({
        id: b.id,
        venue: b.venues?.name,
        date: b.booking_date,
        time: b.booking_time,
        guests: b.party_size,
        status: b.status
      })));
    }

    case "modify_booking": {
      const { booking_id, action, new_value } = toolInput;

      // Verify booking belongs to user
      const { data: existing } = await supabase
        .from("bookings")
        .select("id, user_id, status")
        .eq("id", booking_id)
        .eq("user_id", userId)
        .single();

      if (!existing) {
        return "Booking not found or doesn't belong to this member.";
      }

      let updateData: any = {};
      let message = "";

      switch (action) {
        case "change_date":
          updateData.booking_date = new_value;
          updateData.status = "pending"; // Reset to pending for re-confirmation
          message = `Date changed to ${new_value}. I'll reconfirm with the venue.`;
          break;
        case "change_time":
          updateData.booking_time = new_value;
          updateData.status = "pending";
          message = `Time changed to ${new_value}. I'll reconfirm with the venue.`;
          break;
        case "change_party_size":
          updateData.party_size = parseInt(new_value);
          updateData.status = "pending";
          message = `Party size changed to ${new_value}. I'll reconfirm with the venue.`;
          break;
        case "add_request":
          updateData.special_requests = new_value;
          message = `Added request: "${new_value}"`;
          break;
        case "cancel":
          updateData.status = "cancelled";
          message = "Booking cancelled.";
          break;
        case "running_late":
          // Could trigger notification to venue
          message = "Got it - I'll let them know you're running late.";
          break;
      }

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from("bookings")
          .update(updateData)
          .eq("id", booking_id);

        if (error) return `Error updating booking: ${error.message}`;
      }

      return JSON.stringify({ success: true, message });
    }

    case "escalate_to_human": {
      // Update conversation status to escalated
      await supabase
        .from("conversations")
        .update({ status: "escalated" })
        .eq("id", conversationId);

      // Create escalation record
      const { error: escalationError } = await supabase
        .from("escalations")
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          reason: toolInput.reason,
          priority: toolInput.urgency || "normal",
          status: "pending",
          notes: toolInput.summary,
        });

      if (escalationError) {
        console.error("Failed to create escalation record:", escalationError);
      }

      console.log(`🚨 ESCALATION: ${toolInput.reason} - ${toolInput.summary}`);

      return JSON.stringify({
        success: true,
        message: "Conversation flagged for human review.",
        reason: toolInput.reason,
        urgency: toolInput.urgency || "medium"
      });
    }

    default:
      return `Unknown tool: ${toolName}`;
  }
}

// ============ MAIN HANDLER ============
serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase credentials are not set");

    const { message, user_id, conversation_id } = await req.json();

    if (!message || !user_id) {
      return new Response(
        JSON.stringify({ error: "message and user_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Rate limiting: max 20 messages per minute per user
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    const { count, error: countError } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id)
      .eq("sender", "member")
      .gte("created_at", oneMinuteAgo);

    if (!countError && count !== null && count >= 20) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please wait a moment before sending more messages." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get or create conversation
    let finalConversationId = conversation_id;
    if (!finalConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from("conversations")
        .insert({ member_id: user_id, status: "active", metadata: {} })
        .select("id")
        .single();

      if (convError) throw new Error("Failed to create conversation");
      finalConversationId = newConversation.id;
    }

    // Get conversation history
    const { data: historyMessages } = await supabase
      .from("messages")
      .select("sender, text, created_at")
      .eq("conversation_id", finalConversationId)
      .order("created_at", { ascending: true })
      .limit(20);

    const conversationHistory = (historyMessages || []).map((msg: any) => ({
      role: msg.sender === "member" ? "user" : "assistant",
      content: msg.text,
    }));

    // Today's date for context
    const today = new Date().toISOString().split("T")[0];

    // Build messages array with date context
    const messages = [
      ...conversationHistory,
      { role: "user", content: message },
    ];

    // Add today's date to system prompt
    const systemWithDate = `${SYSTEM_PROMPT}\n\nToday's date: ${today}`;

    // Call Claude with tools
    let anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemWithDate,
        messages: messages,
        tools: TOOLS,
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error("Anthropic API error:", errorText);
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    let anthropicData = await anthropicResponse.json();
    let aiResponse = "";

    // Handle tool calls in a loop (max 5 iterations)
    let iterations = 0;
    const maxIterations = 5;

    while (anthropicData.stop_reason === "tool_use" && iterations < maxIterations) {
      iterations++;
      console.log(`🔄 Tool use iteration ${iterations}`);

      // Process all tool calls
      const toolResults: any[] = [];
      
      for (const block of anthropicData.content) {
        if (block.type === "tool_use") {
          const result = await handleToolCall(
            block.name,
            block.input,
            supabase,
            user_id,
            finalConversationId,
            today
          );
          
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        }
      }

      // Continue conversation with tool results
      messages.push({ role: "assistant", content: anthropicData.content });
      messages.push({ role: "user", content: toolResults });

      anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: systemWithDate,
          messages: messages,
          tools: TOOLS,
        }),
      });

      if (!anthropicResponse.ok) {
        throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
      }

      anthropicData = await anthropicResponse.json();
    }

    // Extract final text response
    for (const block of anthropicData.content) {
      if (block.type === "text") {
        aiResponse = block.text;
        break;
      }
    }

    if (!aiResponse) {
      aiResponse = "I'm sorry, I couldn't process that request.";
    }

    // Save AI response
    await supabase.from("messages").insert({
      conversation_id: finalConversationId,
      user_id,
      sender: "concierge",
      text: aiResponse,
    });

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
