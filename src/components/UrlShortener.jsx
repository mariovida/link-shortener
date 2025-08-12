"use client";

import { useState } from "react";
import styles from "../styles/UrlShortener.module.scss";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.formContainer}>
      <div className="wrapper">
        <h1>Shorten & share your links</h1>
        <h2>Fast. Clean. Reliable.</h2>
        <p className={styles.subtitle}>
          Turn long URLs into short links you can share anywhere - fast, simple
          and free.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="url"
            placeholder="Paste your URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        {shortUrl && (
          <div className={styles.resultContainer}>
            <p className={styles.result}>
              Your new URL:{" "}
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
