"use client";

import { useState } from "react";
import AvatarCanvas from "./components/AvatarCanvas";

export default function Home() {
  const [text, setText] = useState("");
  const [glossSequence, setGlossSequence] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");

  async function translateText(rawText: string) {
    const response = await fetch(
      "http://127.0.0.1:8000/translate-gloss",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw_text: rawText,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`NLP request failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("NLP response:", data);

    setGlossSequence(data.gloss_sequence ?? []);
  }

  async function handleTranslate() {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setSource("Manual text");

    try {
      await translateText(text);
    } catch (err) {
      console.error(err);
      setError("Failed to translate text.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTranscript() {
    setLoading(true);
    setError("");
    setSource("Audio service");

    try {
      // 1. Get transcript from Krithik's audio service
      const transcriptResponse = await fetch(
        "http://127.0.0.1:8001/get-transcript"
      );

      if (!transcriptResponse.ok) {
        throw new Error(
          `Audio service failed: ${transcriptResponse.status}`
        );
      }

      const transcriptData = await transcriptResponse.json();

      console.log("Audio service response:", transcriptData);

      const rawText = transcriptData.raw_text;

      if (!rawText) {
        throw new Error("Audio service returned no transcript");
      }

      // Show transcript in the input
      setText(rawText);

      // 2. Send transcript to Aadhi's NLP service
      await translateText(rawText);
    } catch (err) {
      console.error(err);
      setError("Failed to get transcript or translate it.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#111",
        color: "white",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <h1>SignX</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          maxWidth: "900px",
          flexWrap: "wrap",
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          style={{
            flex: 1,
            minWidth: "300px",
            padding: "12px",
            fontSize: "16px",
          }}
        />

        <button
          onClick={handleTranslate}
          disabled={loading}
          style={{
            padding: "12px 20px",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Translate"}
        </button>

        <button
          onClick={handleTranscript}
          disabled={loading}
          style={{
            padding: "12px 20px",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Get Transcript"}
        </button>
      </div>

      {source && (
        <p>
          <strong>Source:</strong> {source}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <p>
        <strong>Transcript:</strong>{" "}
        {text || "Waiting..."}
      </p>

      <p>
        <strong>Gloss:</strong>{" "}
        {glossSequence.length
          ? glossSequence.join(" → ")
          : "Waiting..."}
      </p>

      <div
        style={{
          width: "100%",
          height: "75vh",
        }}
      >
        <AvatarCanvas glossSequence={glossSequence} />
      </div>
    </main>
  );
}