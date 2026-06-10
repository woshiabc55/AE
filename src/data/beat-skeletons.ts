// 萤幕 v1 — 节拍模型骨架（结构树画布的默认布局）
import type { BeatModel } from "@/types";

export interface BeatSkeletonNode {
  label: string;
  hint?: string;
  // 默认绑定的字段 key
  fieldKey?: string;
  children?: BeatSkeletonNode[];
}

export const BEAT_SKELETONS: Record<BeatModel, BeatSkeletonNode[]> = {
  "three-act": [
    {
      label: "第一幕 · 建立",
      children: [
        { label: "开场画面", fieldKey: "logline", hint: "用一句话定调" },
        { label: "触发事件", fieldKey: "hook", hint: "打破日常的事件" },
        { label: "第一情节点", fieldKey: "turn", hint: "主角接受召唤" },
      ],
    },
    {
      label: "第二幕 · 对抗",
      children: [
        { label: "上升动作", fieldKey: "beats" },
        { label: "中点反转", fieldKey: "twist" },
        { label: "低谷时刻", hint: "主角最低谷" },
        { label: "第二情节点", fieldKey: "hook" },
      ],
    },
    {
      label: "第三幕 · 解决",
      children: [
        { label: "高潮", fieldKey: "scene" },
        { label: "收束", fieldKey: "ending" },
      ],
    },
  ],
  "hero-journey": [
    {
      label: "启程",
      children: [
        { label: "平凡世界" },
        { label: "召唤冒险" },
        { label: "拒绝召唤" },
        { label: "遇见导师" },
      ],
    },
    {
      label: "试炼",
      children: [
        { label: "跨越门槛" },
        { label: "试炼盟友与敌人" },
        { label: "深渊逼近" },
        { label: "最大考验" },
      ],
    },
    {
      label: "归来",
      children: [
        { label: "奖赏" },
        { label: "归途" },
        { label: "复活" },
        { label: "携宝归来" },
      ],
    },
  ],
  "save-the-cat": [
    {
      label: "开场画面 + 主题陈述",
    },
    { label: "铺垫" },
    { label: "触发事件" },
    { label: "辩论" },
    { label: "第二幕开始" },
    { label: "游戏阶段" },
    { label: "中点" },
    { label: "坏事接踵而来" },
    { label: "一无所有" },
    { label: "灵魂的黑夜" },
    { label: "第三幕开始" },
    { label: "终局" },
    { label: "终场画面" },
  ],
  "short-form": [
    { label: "钩子（3 秒）", fieldKey: "hook" },
    { label: "痛点", fieldKey: "world" },
    { label: "案例 / 故事" },
    { label: "转折 / 反转", fieldKey: "twist" },
    { label: "落点 / 金句" },
    { label: "行动号召", fieldKey: "ending" },
  ],
  interactive: [
    {
      label: "世界观",
      children: [
        { label: "前置背景" },
        { label: "时间压力 / 风险" },
      ],
    },
    {
      label: "节点分支",
      children: [
        { label: "节点 A", fieldKey: "branches" },
        { label: "节点 B", fieldKey: "branches" },
        { label: "节点 C", fieldKey: "branches" },
      ],
    },
    {
      label: "结局",
      children: [
        { label: "结局 1" },
        { label: "结局 2" },
        { label: "结局 3" },
      ],
    },
  ],
};

export const BEAT_SKELETON_LABEL: Record<BeatModel, string> = {
  "three-act": "三幕结构",
  "hero-journey": "英雄之旅",
  "save-the-cat": "救猫咪",
  "short-form": "短视频",
  interactive: "互动分支",
};
