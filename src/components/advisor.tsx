 "use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Bot, LoaderCircle, Send } from "lucide-react";

export function Advisor() {
  const [question, setQuestion] = useState("What should I check before running my borehole pump for longer?");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setAnswer("");
    setLoading(true);

    try {
      const response = await fetch("/api/energy-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload.error ?? "Request failed.");
      setAnswer(payload.answer ?? "No answer was returned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="advisor-card" id="advisor">
      <div className="advisor-header">
        <div className="advisor-avatar"><Bot size={21} /></div>
        <div><div className="section-kicker">META MODEL API · SERVER-SIDE</div><h2>Ask GridMind</h2></div>
        <span className="advisor-status"><span /> AI advisor</span>
      </div>
      <p className="advisor-description">Ask about the sample installation. GridMind will explain the assumptions and identify what needs to be verified.</p>
      <form onSubmit={submit} className="advisor-form">
        <label className="sr-only" htmlFor="question">Ask GridMind a question</label>
        <textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={800} rows={3} required />
        <div className="form-bottom"><span>{question.length}/800 characters</span><button type="submit" disabled={loading || !question.trim()}>{loading ? <LoaderCircle className="spin" size={16} /> : <Send size={16} />} {loading ? "Thinking…" : "Ask GridMind"} <ArrowUpRight size={15} /></button></div>
      </form>
      {answer && <div className="answer-box"><strong>GridMind's response</strong><p>{answer}</p></div>}
      {error && <p className="error-message" role="alert">{error}</p>}
    </section>
  );
}
