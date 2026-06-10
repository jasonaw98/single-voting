"use client";

import { useEffect, useState } from "react";
import { useVisitorData } from "@fingerprint/react";
import { toast } from "sonner";
import Image from "next/image";

const TEAMS = [
  {
    id: 1,
    name: "Shine Borneo",
    image_url: "/shine.jpeg",
  },
  {
    id: 2,
    name: "The Duet",
    image_url: "/duet.JPG",
  },
  {
    id: 3,
    name: "Phoenix",
    image_url: "/phoenix.jpeg",
  },
]

export default function VotePage() {
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);

  const { isLoading, error, data, getData } = useVisitorData({
    immediate: false,
  });
  useEffect(() => {
    getData();
  }, []);

  async function vote(teamId: string) {
    try {
      setLoading(true);

      if (isLoading) {
        alert("Loading...");
        return;
      }

      if (error) {
        toast.error(error.message);
        return;
      }
      const fingerprint = data?.visitor_id ?? "";

      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId,
          fingerprint,
        }),
      });

      const voteData = await res.json();

      if (voteData.error) {
        toast.error(voteData.error);
        return;
      }

      localStorage.setItem("voted", "true");
      setVoted(true);
      toast.success("Vote submitted!");
    } finally {
      setLoading(false);
    }
  }

  if (voted) {
    return (
      <main className="flex flex-col h-[95vh] items-center justify-center p-14 text-white gap-10">
        <h1 className="text-4xl font-bold text-center">Thanks for voting!</h1>
        <div className="bg-[url('/image.png')] bg-size-[160%] bg-center w-full h-[400px] rounded-2xl"></div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center p-10 text-white">
      <h1 className="text-4xl font-bold">Vote Your Team</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {TEAMS.map((team: any) => (
          <div
            key={team.id}
            className="flex flex-col justify-center items-center gap-5"
          >
            <Image src={team.image_url} alt={team.name} width={400} height={500} className="rounded-xl aspect-video object-cover shadow-lg shadow-zinc-600" />
            <button
              key={team.id}
              onClick={() => vote(team.id.toString())}
              disabled={loading}
              className="px-6 py-3 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:bg-[#21e065] transition-colors duration-200 cursor-pointer"
            >
              {loading ? "Voting..." : team.name}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
