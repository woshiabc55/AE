export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string; // 渐变背景（CSS 字符串）
  src: string; // 音频地址
  bpm: number;
  dur: string; // 备用展示
}

// 本项目不依赖外部音频文件，所有曲目占位。
// 若 src 不可访问，<audio> 仍会加载但 pause，UI 正常运作。
export const tracks: Track[] = [
  {
    id: "t1",
    title: "STEEL PULSE",
    artist: "NX-9 / 工业陷阱",
    cover:
      "linear-gradient(135deg,#1B1F26 0%,#FF2A2A 55%,#FF8A2A 100%)",
    src: "",
    bpm: 142,
    dur: "03:42",
  },
  {
    id: "t2",
    title: "WIRE & VENOM",
    artist: "NX-9 / 工业陷阱",
    cover:
      "linear-gradient(135deg,#0A0B0F 0%,#7CF6FF 50%,#3DD8E2 100%)",
    src: "",
    bpm: 150,
    dur: "04:08",
  },
  {
    id: "t3",
    title: "FACTORY SAINTS",
    artist: "NX-9 / 工业陷阱",
    cover:
      "linear-gradient(135deg,#262B33 0%,#FF8A2A 60%,#FF2A2A 100%)",
    src: "",
    bpm: 138,
    dur: "03:14",
  },
  {
    id: "t4",
    title: "COLD FORGE",
    artist: "NX-9 / 工业陷阱",
    cover:
      "linear-gradient(135deg,#0F1116 0%,#3DD8E2 50%,#7CF6FF 100%)",
    src: "",
    bpm: 145,
    dur: "03:55",
  },
  {
    id: "t5",
    title: "MACHINE BLESS",
    artist: "NX-9 / 工业陷阱",
    cover:
      "linear-gradient(135deg,#1B1F26 0%,#FF2A2A 50%,#7CF6FF 100%)",
    src: "",
    bpm: 160,
    dur: "04:22",
  },
];
