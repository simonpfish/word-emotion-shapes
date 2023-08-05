"use client";

import ScoreRadar from "@/components/ScoreRadar";
import { Input } from "@/components/ui/input";
import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { SimilarityScores } from "@/types";
import { ShuffleIcon } from "@radix-ui/react-icons";
import { EMOTIONS } from "@/constants";

export default function Home() {
  const [text, setText] = useState("");
  const [scores, setScores] = useState<SimilarityScores>();
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const onShuffle = useCallback(() => {
    const getRandom = () => {
      setIsLoading(true);

      fetch("/api/scores", {
        method: "POST",
      })
        .then((res) => res.json())
        .then((res) => {
          setScores(res);
          setText(Object.keys(res).join(", "));
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    getRandom();
  }, []);

  const onSubmit = useCallback(() => {
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!text) {
      setScores(undefined);
      return;
    }

    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    fetch("/api/scores", {
      method: "POST",
      body: JSON.stringify({
        inputs: text
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
      signal: abortControllerRef.current.signal,
    })
      .then((res) => res.json())
      .then((res) => setScores(res))
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Fetch request was aborted");
        } else {
          throw error;
        }
      })
      .finally(() => setIsLoading(false));
  }, [isLoading, text]);

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
            onChange={(e) => {
              setText(e.target.value);
            }}
            className="w-64"
            value={text}
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
