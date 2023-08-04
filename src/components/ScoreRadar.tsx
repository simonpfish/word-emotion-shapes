import { SimilarityScores } from "@/types";
import { ResponsiveRadar } from "@nivo/radar";
import clsx from "clsx";
import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";

export default function ScoreRadar(props: {
  scores?: SimilarityScores;
  labels: string[];
}) {
  const hasSingleTerm = useMemo(() => {
    return Object.keys(props.scores ?? {}).length <= 1;
  }, [props.scores]);

  const scores: SimilarityScores = useMemo(() => {
    if (props.scores == null) {
      // object composed of labels, each with a score of 0
      return {};
    }

    if (hasSingleTerm) {
      return { score: Object.values(props.scores)[0] };
    }

    return props.scores;
  }, [hasSingleTerm, props.scores]);

  let data = useMemo(() => {
    const data: SimilarityScores = props.labels.reduce((acc, label) => {
      acc[label] = {};
      return acc;
    }, {} as SimilarityScores);

    // const allValues = Object.keys(scores).flatMap((key) =>
    //   Object.keys(scores[key]).map((label) => scores[key][label])
    // );
    // const max = Math.max(...allValues);
    // const min = Math.min(...allValues);

    Object.keys(scores).forEach((key) => {
      const values = Object.values(scores[key]);
      const max = Math.max(...values);
      const min = Math.min(...values);
      Object.keys(scores[key]).forEach((label) => {
        if (!data[label]) data[label] = {};
        data[label][key] = d3.scaleLinear().domain([min, max]).range([0.2, 1])(
          scores[key][label]
        );
      });
    });

    console.log("data", data);

    return Object.keys(data).map((key) => ({
      key,
      ...data[key],
    }));
  }, [props.labels, scores]);

  return (
    <div className="relative h-full w-full" id="radar">
      <ResponsiveRadar
        theme={{
          fontFamily: "inherit",
          fontSize: 20,
          legends: {
            text: {
              fontSize: 12,
            },
          },
          tooltip: {
            container: {
              fontSize: 12,
            },
          },
          labels: {
            text: {
              fontSize: 9,
              maxWidth: 9,
            },
          },
          grid: {
            line: {
              stroke: "gray",
              opacity: 0.5,
            },
          },
        }}
        data={data}
        keys={Object.keys(scores ?? {})}
        indexBy="key"
        valueFormat=">-.2f"
        margin={
          !hasSingleTerm
            ? { top: 80, right: 60, bottom: 35, left: 60 }
            : { top: 40, right: 40, bottom: 40, left: 40 }
        }
        borderColor={{ from: "color" }}
        borderWidth={0}
        gridLabelOffset={16}
        enableDots={false}
        curve="catmullRomClosed"
        colors={{ scheme: "accent" }}
        fillOpacity={0.3}
        motionConfig="default"
        blendMode="multiply"
        gridLevels={1}
        layers={[
          "grid",
          ({ centerX, centerY }) => (
            <circle cx={centerX} cy={centerY} r={151} fill="white" />
          ),
          "layers",
          "slices",
          "dots",
          "legends",
        ]}
        legends={
          !hasSingleTerm
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
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemTextColor: "#000",
                      },
                    },
                  ],
                },
              ]
            : []
        }
      />
      {hasSingleTerm && props.scores && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-1.5 font-bold font-serif text-7xl text-gray-400 max-w-[270px]">
          <AutoAdjustingText>{Object.keys(props.scores)[0]}</AutoAdjustingText>
        </div>
      )}
    </div>
  );
}

const AutoAdjustingText = ({ children }: { children: string }) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const initialFontSize = 100;
    let fontSize = initialFontSize;

    textRef.current.style.fontSize = fontSize + "px";
    textRef.current.style.whiteSpace = "nowrap";

    while (
      textRef.current.scrollWidth > textRef.current.offsetWidth &&
      fontSize > 30
    ) {
      fontSize--;
      textRef.current.style.fontSize = fontSize + "px";
    }

    if (textRef.current.scrollWidth > textRef.current.offsetWidth) {
      textRef.current.style.whiteSpace = "normal";
    }
  }, [children]);

  return (
    <div
      ref={textRef}
      className={clsx("w-full text-center")}
      style={{ fontSize: 100 }}
    >
      {children}
    </div>
  );
};
