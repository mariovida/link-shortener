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
      <div className="wrapper">
        <div className={styles.statsPageBlock}>
          <h1>Stats for {API_BASE_URL + "/" + stats.slug}</h1>
          <div className={styles.statsPageInfo}>
            <p>
              Original URL
              <span>
                <a href={stats.url} target="_blank" rel="noopener noreferrer">
                  {stats.url}
                </a>
              </span>
            </p>
            <p>
              Clicks
              <span>{stats.clicks}</span>
            </p>
            <p>
              Created at
              <span> {new Date(stats.created_at).toLocaleString()}</span>
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={loadingDelete}
            style={{
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
