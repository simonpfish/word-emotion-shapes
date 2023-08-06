"use client";

import { useState, useCallback, SyntheticEvent, useMemo } from "react";
import clsx from "clsx";
import ScoreRadar from "@/components/ScoreRadar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimilarityScores } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import Signature from "@/components/Signature";

export default function Home() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [scores, setScores] = useState<SimilarityScores>();
  const [isLoading, setIsLoading] = useState(false);

  const retitledScores = useMemo(
    () => scores && { [title]: Object.values(scores)[0] },
    [scores, title]
  );

  const fetchScores = useCallback(
    (inputs?: string[]) => {
      if (isLoading) return;

      setIsLoading(true);
      fetch("/api/scores", {
        method: "POST",
        body: JSON.stringify({ inputs }),
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

  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      text && fetchScores([text]);
    },
    [fetchScores, text]
  );

  return (
    <main className="flex h-[90vh] md:h-[95vh] flex-col items-center p-8 justify-center">
      <div className="flex flex-grow" />

      <div className="flex flex-col items-center h-[500px] w-[500px] max-w-[100vw] max-h-[100vh] font-mono p-4">
        <ScoreRadar scores={retitledScores} isLoading={isLoading} />
      </div>

      <form className="flex flex-grow items-end w-full max-w-md">
        <div className={clsx("flex flex-col space-y-4 w-full")}>
          <Input
            className="flex-grow text-base h-12"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title..."
          />

          <Textarea
            value={text}
            className="flex-grow text-base h-32"
            onChange={(e) => setText(e.target.value)}
            placeholder="Content..."
          />

          <div className="flex flex-row space-x-2">
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={!text}
              className="text-lg flex-grow h-12"
            >
              Calculate
            </Button>
          </div>
        </div>
      </form>

      <Signature />
    </main>
  );
}
