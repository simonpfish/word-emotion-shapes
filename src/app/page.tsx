"use client";

import ColorDots from "@/components/ColorDots";
import { Input } from "@/components/ui/input";
import { useRef, useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [colors, setColors] = useState<Record<string, number>>();
  const [isLoading, setIsLoading] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (isLoading && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!text) {
        setColors(undefined);
        return;
      }

      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      fetch("/api/colors", {
        method: "POST",
        body: text,
        signal: abortControllerRef.current.signal,
      })
        .then((res) => res.json())
        .then((res) => setColors(res))
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("Fetch request was aborted");
          } else {
            throw error;
          }
        })
        .finally(() => setIsLoading(false));
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

    // avoid infinite loop with isloading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 justify-center">
      <Input
        onChange={(e) => {
          setText(e.target.value);
        }}
        className="w-96"
        value={text}
      />

      <div className="flex flex-col items-center mt-8">
        {colors && <ColorDots colors={colors} />}
      </div>
    </main>
  );
}
