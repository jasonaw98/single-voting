import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { teamId, fingerprint } = body;

        if (!teamId || !fingerprint) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        // Check existing vote (only request id to reduce payload)
        const { data: existingVote } = await supabase
            .from("votes")
            .select("id")
            .eq("fingerprint", fingerprint)
            .single();

        if (existingVote) {
            return NextResponse.json(
                { error: "Already voted" },
                { status: 400 }
            );
        }

        // Get IP
        const forwardedFor =
            req.headers.get("x-forwarded-for");

        const ip =
            forwardedFor?.split(",")[0] ?? "unknown";

        // Insert vote
        const { error } = await supabase
            .from("votes")
            .insert({
                team_id: teamId,
                fingerprint,
                ip_address: ip,
            });

        if (error) {
            if (error.code === "23505") {
                return NextResponse.json(
                    { error: "Already voted" },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
        });
    } catch (_err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}