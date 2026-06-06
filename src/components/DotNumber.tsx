interface DotNumberProps {
  num: number | string;
  size?: number;
  onColor?: string;
  className?: string;
}

// 5x7 像素字体定义 (类似旧 LED/LCD 显示器)
const FONT_5x7: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ":": ["00000", "00100", "00000", "00000", "00000", "00100", "00000"],
  "/": ["00001", "00010", "00010", "00100", "01000", "01000", "10000"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  "C": ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  "I": ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  "X": ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
};

interface DotCharProps {
  char: string;
  size: number;
  onColor: string;
}

function DotChar({ char, size, onColor }: DotCharProps) {
  const pattern = FONT_5x7[char.toUpperCase()] || FONT_5x7[" "];
  const gap = size * 0.15;
  const dotSize = size * 0.35;

  return (
    <div
      className="grid shrink-0"
      style={{
        gridTemplateRows: `repeat(7, ${dotSize}px)`,
        gridTemplateColumns: `repeat(5, ${dotSize}px)`,
        gap: `${gap}px`,
      }}
    >
      {pattern.flatMap((row, r) =>
        row.split("").map((bit, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background: bit === "1" ? onColor : "transparent",
              opacity: bit === "1" ? 1 : 0,
              boxShadow: bit === "1" ? `0 0 ${dotSize * 1.5}px ${onColor}` : "none",
              transition: "all 0.3s ease",
            }}
          />
        ))
      )}
    </div>
  );
}

export default function DotNumber({
  num,
  size = 8,
  onColor = "#E63946",
  className = "",
}: DotNumberProps) {
  const str = String(num);
  const charGap = size * 0.8;

  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ gap: `${charGap}px` }}
    >
      {str.split("").map((ch, i) => (
        <DotChar key={i} char={ch} size={size} onColor={onColor} />
      ))}
    </div>
  );
}
