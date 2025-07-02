"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./Stats.module.scss";

interface LinkStats {
  slug: string;
  url: string;
  clicks: number;
  created_at: string;
}

export default function StatsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [stats, setStats] = useState<LinkStats | null>(null);
  const [error, setError] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
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

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this URL?")) return;

    setLoadingDelete(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/links/${slug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingDelete(false);
    }
  }

  if (error)
    return (
      <div className="wrapper">
        <div className={styles.errorBlock}>
          <p>{error}</p>
        </div>
      </div>
    );
  if (!stats)
    return (
      <div className="wrapper">
        <div className={styles.errorBlock}>
          <p>Loading...</p>
        </div>
      </div>
    );

  return (
    <section className={styles.statsPage}>
      <div className="wrapper" style={{ maxWidth: "480px" }}>
        <div className={styles.statsPageBlock}>
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
            {new Date(stats.created_at).toLocaleString()}
          </p>

          <button
            onClick={handleDelete}
            disabled={loadingDelete}
            style={{
              marginTop: "20px",
              backgroundColor: "#e53e3e",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: loadingDelete ? "not-allowed" : "pointer",
            }}
          >
            {loadingDelete ? "Deleting..." : "Delete URL"}
          </button>

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
      </div>
    </section>
  );
}
