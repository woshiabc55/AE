import type { FacialControl } from "@/types";

export const FACIAL_PRESETS: Record<
  FacialControl,
  { label: string; group: string; icon: string }
> = {
  jaw: { label: "下颌", group: "下颌 / 嘴", icon: "jaw" },
  chin: { label: "下巴尖", group: "下颌 / 嘴", icon: "circle" },
  mouth_l: { label: "嘴角·左", group: "下颌 / 嘴", icon: "circle" },
  mouth_r: { label: "嘴角·右", group: "下颌 / 嘴", icon: "circle" },
  lip_top: { label: "上唇", group: "下颌 / 嘴", icon: "lip" },
  lip_bot: { label: "下唇", group: "下颌 / 嘴", icon: "lip" },
  lip_corner_l: { label: "唇角·左", group: "下颌 / 嘴", icon: "circle" },
  lip_corner_r: { label: "唇角·右", group: "下颌 / 嘴", icon: "circle" },
  tongue: { label: "舌头", group: "下颌 / 嘴", icon: "tongue" },
  brow_l: { label: "眉毛·左", group: "眉毛 / 眼", icon: "brow" },
  brow_r: { label: "眉毛·右", group: "眉毛 / 眼", icon: "brow" },
  brow_inner_l: { label: "眉心·左", group: "眉毛 / 眼", icon: "circle" },
  brow_inner_r: { label: "眉心·右", group: "眉毛 / 眼", icon: "circle" },
  eye_l: { label: "上眼睑·左", group: "眉毛 / 眼", icon: "eye" },
  eye_r: { label: "上眼睑·右", group: "眉毛 / 眼", icon: "eye" },
  pupil_l: { label: "瞳孔·左", group: "眉毛 / 眼", icon: "pupil" },
  pupil_r: { label: "瞳孔·右", group: "眉毛 / 眼", icon: "pupil" },
  nose_tip: { label: "鼻尖", group: "鼻 / 颊", icon: "nose" },
  cheek_l: { label: "脸颊·左", group: "鼻 / 颊", icon: "cheek" },
  cheek_r: { label: "脸颊·右", group: "鼻 / 颊", icon: "cheek" },
  ear_l: { label: "耳朵·左", group: "耳", icon: "ear" },
  ear_r: { label: "耳朵·右", group: "耳", icon: "ear" },
};

export const FACIAL_GROUPS = [
  "下颌 / 嘴",
  "眉毛 / 眼",
  "鼻 / 颊",
  "耳",
];
