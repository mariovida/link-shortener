"use client";

import { useState } from "react";
import styles from "../styles/UrlShortener.module.scss";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  function formatUrl(input) {
    let formatted = input.trim();
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = "https://" + formatted;
    }
    return formatted;
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setShortUrl("");

    const formattedUrl = formatUrl(url);

    if (!isValidUrl(formattedUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    if (expiresAt && new Date(expiresAt) <= new Date()) {
      setError("Expiration date must be in the future");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: formattedUrl,
          expiresAt: expiresAt || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setExpiresAt("");
      setShowOptions(false);
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
          Turn long URLs into short links you can share anywhere — fast, simple
          and free.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
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
          </div>

          <div className={styles.formGroup}>
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className={styles.optionsToggle}
            >
              {showOptions ? "Additional options" : "Additional options"}
            </button>
          </div>

          <div
            className={`${styles.accordionContent} ${
              showOptions ? styles.open : ""
            }`}
          >
            <label>Expiration date</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className={styles.input}
            />
          </div>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        {shortUrl && (
          <div className={styles.resultContainer}>
            <div className={styles.result}>
              <p>Your URL is ready!</p>
              <button
                className={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(shortUrl).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                  });
                }}
              >
                {shortUrl}
              </button>
            </div>
          </div>
        )}
      </div>

      {copied && <span className={styles.tooltip}>Copied!</span>}
    </section>
  );
}
