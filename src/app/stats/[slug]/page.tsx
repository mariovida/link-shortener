"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface LinkStats {
  slug: string;
  url: string;
  clicks: number;
  createdAt: string;
}

export default function StatsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [stats, setStats] = useState<LinkStats | null>(null);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/stats/${slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      }
    }

    if (slug) fetchStats();
  }, [slug]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!stats) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        Stats for <code>{stats.slug}</code>
      </h1>
      <p>
        <strong>Original URL:</strong>{" "}
        <a href={stats.url} target="_blank" rel="noopener noreferrer">
          {stats.url}
        </a>
      </p>
      <p>
        <strong>Clicks:</strong> {stats.clicks}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(stats.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
