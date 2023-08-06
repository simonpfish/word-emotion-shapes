import { SimilarityScores } from "@/types";
import { ResponsiveRadar } from "@nivo/radar";
import * as d3 from "d3";
import { useMemo } from "react";
import AutoAdjustingText from "./AutoAdjustingText";
import { LegendProps } from "@nivo/legends";
import { EMOTIONS } from "@/constants";
import clsx from "clsx";

export default function ScoreRadar({
  scores,
  isLoading,
}: {
  scores?: SimilarityScores;
  isLoading?: boolean;
}) {
  const labels = Object.keys(EMOTIONS);
  const hasSingleTerm = useMemo(
    () => Object.keys(scores ?? {}).length <= 1,
    [scores]
  );

  const cleanScores = useMemo(() => {
    // if there are no scores, fill in with 0.33
    if (!scores)
      return {
        score: Object.fromEntries(labels.map((label) => [label, 1 / 3])),
      };

    // if there is only one term, use a standard label to animate
    // curve transitions
    return hasSingleTerm ? { score: Object.values(scores)[0] } : scores;
  }, [hasSingleTerm, labels, scores]);

  const data = useMemo(() => {
    const initData: SimilarityScores = labels.reduce((acc, label) => {
      acc[label] = {};
      return acc;
    }, {} as SimilarityScores);

    for (const key of Object.keys(cleanScores)) {
      const values = Object.values(cleanScores[key]);
      const [min, max] = [Math.min(...values), Math.max(...values)];

      // zoom into the min,max domain
      const scale = d3.scaleLinear().domain([min, max]).range([0.2, 1]);

      for (const label of Object.keys(cleanScores[key])) {
        if (!initData[label]) initData[label] = {};
        initData[label][key] = !scores
          ? cleanScores[key][label]
          : scale(cleanScores[key][label]);
      }
    }

    // data needs to be in the format that the nivo radar chart expects
    return Object.keys(initData).map((key) => ({ key, ...initData[key] }));
  }, [labels, cleanScores, scores]);

  const theme = {
    fontFamily: "inherit",
    fontSize: 20,
    legends: { text: { fontSize: 12 } },
    tooltip: { container: { fontSize: 12 } },
    labels: { text: { fontSize: 9, maxWidth: 9 } },
    grid: { line: { stroke: "gray", opacity: 0.1 } },
  };

  const margin = !hasSingleTerm
    ? { top: 80, right: 40, bottom: 40, left: 40 }
    : { top: 40, right: 40, bottom: 40, left: 40 };

  const legends: LegendProps[] = !hasSingleTerm
    ? [
        {
          anchor: "top-left",
          direction: "column",
          translateX: -60,
          translateY: -80,
          itemWidth: 80,
          itemHeight: 20,
          itemTextColor: "#999",
          symbolSize: 12,
          symbolShape: "circle",
          effects: [{ on: "hover", style: { itemTextColor: "#000" } }],
        },
      ]
    : [];

  return (
    <div className="relative h-full w-full" id="radar">
      <ResponsiveRadar
        theme={theme}
        data={data}
        keys={Object.keys(cleanScores)}
        indexBy="key"
        valueFormat=">-.2f"
        margin={margin}
        borderColor={{ from: "color" }}
        borderWidth={0}
        gridLabelOffset={16}
        enableDots={false}
        curve="catmullRomClosed"
        colors={["#bae6fd"]}
        fillOpacity={0.8}
        motionConfig="default"
        blendMode="normal"
        gridLevels={3}
        maxValue={1}
        legends={legends}
      />
      {hasSingleTerm && scores && (
        <div
          className={clsx(
            "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-1.5",
            "font-bold font-serif text-7xl text-gray-400 max-w-[250px] transition-opacity",
            isLoading && "animate-pulse"
          )}
        >
          <AutoAdjustingText>{Object.keys(scores)[0]}</AutoAdjustingText>
        </div>
      )}
    </div>
  );
}
