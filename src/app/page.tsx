"use client";

import { useState, useCallback, SyntheticEvent, useEffect } from "react";
import clsx from "clsx";
import { GitHubLogoIcon, ShuffleIcon } from "@radix-ui/react-icons";
import ScoreRadar from "@/components/ScoreRadar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimilarityScores } from "@/types";
import Signature from "@/components/Signature";

export default function Home() {
  const [text, setText] = useState("");
  const [scores, setScores] = useState<SimilarityScores>();
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    // fetch on first load
    fetchScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onShuffle = useCallback(() => fetchScores(), [fetchScores]);
  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      text && fetchScores([text]);
    },
    [fetchScores, text]
  );

  return (
    <main className="flex h-[90vh] flex-col items-center p-8 justify-center">
      <div className="flex flex-grow" />
      <div className="flex flex-col items-center h-[500px] w-[500px] max-w-[100vw] max-h-[100vh] font-mono p-4">
        <ScoreRadar scores={scores} isLoading={isLoading} />
      </div>
      <form className="flex flex-grow items-end w-full max-w-md">
        <div
          className={clsx(
            "flex flex-col md:flex-row md:space-x-2 space-y-4 md:space-y-0 w-full"
          )}
        >
          <Input
            className="flex-grow text-lg h-12 md:text-base md:h-10"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex flex-row space-x-2">
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={!text}
              className="text-lg flex-grow h-12 md:text-base md:h-10"
            >
              Calculate
            </Button>
            <Button type="button" onClick={onShuffle} className="h-12 md:h-10">
              <ShuffleIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </form>
      <Signature />
    </main>
  );
}
