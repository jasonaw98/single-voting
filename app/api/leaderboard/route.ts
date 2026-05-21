import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("teams")
    .select(`
      id,
      name,
      image_url,
      votes (
        id
      )
    `);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const leaderboard = data.map((team) => ({
    id: team.id,
    name: team.name,
    image_url: team.image_url,
    votes: team.votes.length,
  }));

  leaderboard.sort((a, b) => b.votes - a.votes);

  return NextResponse.json(leaderboard);
}