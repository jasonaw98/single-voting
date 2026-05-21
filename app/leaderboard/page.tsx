"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LeaderboardPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel("votes-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchLeaderboard() {
    const res = await fetch("/api/leaderboard");

    const data = await res.json();

    setTeams(data);
  }

  return (
    <main className="p-10 text-white flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-10">
        Live Leaderboard
      </h1>

      <div className="space-y-4 flex flex-col items-center w-full max-w-md">
        {teams.map((team: any, index) => (
          <div
            key={team.id}
            className="border rounded-xl p-6 flex justify-between items-center w-full"
          >
            <div>
              #{index + 1} {team.name}
            </div>

            <div>
              {team.votes} votes
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}