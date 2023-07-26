import { memo, use, useCallback, useEffect, useState } from "react";

import Particles from "react-particles";
import type { Engine } from "tsparticles-engine";
import { loadLinksPreset } from "tsparticles-preset-links";
import { loadColorUpdater } from "tsparticles-updater-color";

type ColorDotProps = {
  colors?: Record<string, number>;
};

const COLOR_TO_HEX: Record<string, string> = {
  // primary
  red: "#FF0000",
  yellow: "#FFFF00",
  blue: "#0000FF",
  // secondary
  green: "#008000",
  purple: "#800080",
  orange: "#FFA500",
  // neutrals
  black: "#000000",
  white: "#FFFFFF",
  gray: "#808080",
  // other common ones
  pink: "#FFC0CB",
  brown: "#A52A2A",
};

function ColorDots({ colors }: ColorDotProps) {
  const [colorArray, setColorArray] = useState<string[]>([]);

  useEffect(() => {
    if (colors) {
      const values = Object.values(colors);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      // range scores
      const normalizedColors: any = {};
      for (let color in colors) {
        normalizedColors[color] =
          (colors[color] - minValue) / (maxValue - minValue);
      }

      let calculatedColors: string[] = [];
      let totalSlots = 10;
      for (let color in normalizedColors) {
        const slotsForThisColor = Math.round(
          normalizedColors[color] * totalSlots
        );
        for (let i = 0; i < slotsForThisColor; i++) {
          calculatedColors.push(color);
        }
      }

      console.log("colors", colors);
      console.log("normalized", normalizedColors);

      console.log("calculatedColors", calculatedColors);

      // Convert colors to hex
      calculatedColors = calculatedColors.map((color) => COLOR_TO_HEX[color]);

      setColorArray(calculatedColors);
    }
  }, [colors]);

  return (
    <div className="absolute w-screen h-screen top-0 bottom-0 -z-10">
      <Particles
        id="tsparticles"
        options={{
          preset: "links",
          particles: {
            number: {
              value: 300,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: {
              value: colorArray,
            },
            links: {
              enable: true,
              distance: 100,
              color: "random",
              opacity: 1,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.5,
              direction: "none",
              random: true,
              straight: false,
              outMode: "bounce",
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          background: {
            color: "#fff",
          },
        }}
        init={async (e) => {
          await loadLinksPreset(e);
          await loadColorUpdater(e);
        }}
      />
    </div>
  );
}

export default memo(ColorDots);
