"use client";

import { useRef, useState, useCallback } from "react";
import clsx from "clsx";
import { ShuffleIcon } from "@radix-ui/react-icons";
import ScoreRadar from "@/components/ScoreRadar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EMOTIONS } from "@/constants";
import { SimilarityScores } from "@/types";

export default function Home() {
  const [text, setText] = useState("");
  const [scores, setScores] = useState<SimilarityScores>();
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchScores = useCallback(
    (inputs?: string[]) => {
      if (isLoading && abortControllerRef.current)
        abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      fetch("/api/scores", {
        method: "POST",
        body: JSON.stringify({ inputs }),
        signal: abortControllerRef.current.signal,
      })
        .then((res) => res.json())
        .then((res) => {
          setScores(res);
          if (!inputs) setText(Object.keys(res).join(", "));
        })
        .catch((error) => {
          if (error.name !== "AbortError") throw error;
        })
        .finally(() => setIsLoading(false));
    },
    [isLoading]
  );

  const onShuffle = useCallback(() => fetchScores(), [fetchScores]);
  const onSubmit = useCallback(
    () => text && fetchScores([text]),
    [fetchScores, text]
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-24 justify-center">
      <form className="flex flex-grow items-center">
        <div
          className={clsx(
            "flex flex-row space-x-2",
            isLoading && "animate-pulse"
          )}
        >
          <Input
            className="w-64"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" onClick={onSubmit} disabled={isLoading}>
            Calculate
          </Button>
          <Button type="button" onClick={onShuffle} disabled={isLoading}>
            <ShuffleIcon />
          </Button>
        </div>
      </form>
      <div className="flex flex-col items-center h-96 font-mono w-[500px]">
        <ScoreRadar scores={scores} labels={Object.keys(EMOTIONS)} />
      </div>

      <div className="flex flex-grow" />
    </main>
  );
}
