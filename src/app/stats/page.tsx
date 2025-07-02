"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchLink.module.scss";

export default function SearchLinkPage() {
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!slug.trim()) {
      setError("Please enter a slug.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/stats/${slug}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Link not found");
      }

      router.push(`/stats/${slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.SearchLinkPage}>
      <div className="wrapper">
        <h1>Search Link Stats</h1>
        <p>Enter your link slug to view its statistics.</p>

        <form onSubmit={handleSearch} className={styles.form}>
          <input
            type="text"
            placeholder="Enter link slug (e.g., abc123)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </section>
  );
}
