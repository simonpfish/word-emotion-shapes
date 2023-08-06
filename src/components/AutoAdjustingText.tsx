import clsx from "clsx";
import { useLayoutEffect, useRef } from "react";

export default function AutoAdjustingText({
  children,
  className,
}: {
  children?: string;
  className?: string;
}) {
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
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
      className={clsx("w-full text-center", className)}
      style={{ fontSize: 100 }}
    >
      {children}
    </div>
  );
}
