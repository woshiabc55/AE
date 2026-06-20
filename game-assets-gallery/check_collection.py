#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
检查收录完整性：核对 data.json 与本地文件，统计分布并报告异常。
"""

import json
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parent
DATA_JSON = ROOT / "assets" / "data.json"


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def check():
    data = load_json(DATA_JSON)
    total = len(data)

    # 基础统计
    type_counts = Counter(item.get("type", "unknown") for item in data)
    game_counts = Counter(item.get("gameName", "未知") for item in data)
    auth_counts = Counter(item.get("authorizationStatus", "unknown") for item in data)
    platform_counts = Counter(
        item.get("tags", ["官方"])[1] if item.get("type") == "fanart" else "官方"
        for item in data
    )

    # 异常检查
    duplicate_ids = [k for k, v in Counter(item.get("id") for item in data).items() if v > 1]
    missing_files = []
    zero_size = []
    invalid_auth = []

    for item in data:
        local = ROOT / item.get("localPath", "")
        if not local.exists():
            missing_files.append(item["id"])
        elif local.stat().st_size == 0:
            zero_size.append(item["id"])

        auth = item.get("authorizationStatus")
        if auth not in ("official", "unknown", "personal_only", "authorized", "no_repost"):
            invalid_auth.append((item["id"], auth))

    # 输出报告
    print("=" * 50)
    print("收录检查报告")
    print("=" * 50)
    print(f"总记录数: {total}")
    print(f"\n按类型分布:")
    for t, c in type_counts.most_common():
        print(f"  {t}: {c}")
    print(f"\n按游戏分布 (前 10):")
    for g, c in game_counts.most_common(10):
        print(f"  {g}: {c}")
    print(f"\n按授权状态分布:")
    for a, c in auth_counts.most_common():
        print(f"  {a}: {c}")
    print(f"\n按来源平台分布:")
    for p, c in platform_counts.most_common():
        print(f"  {p}: {c}")

    print(f"\n异常检查:")
    print(f"  重复 ID: {len(duplicate_ids)}")
    if duplicate_ids:
        print(f"    {duplicate_ids[:5]}{' ...' if len(duplicate_ids) > 5 else ''}")
    print(f"  缺失文件: {len(missing_files)}")
    if missing_files:
        print(f"    {missing_files[:5]}{' ...' if len(missing_files) > 5 else ''}")
    print(f"  零字节文件: {len(zero_size)}")
    print(f"  无效授权状态: {len(invalid_auth)}")
    if invalid_auth:
        print(f"    {invalid_auth[:5]}{' ...' if len(invalid_auth) > 5 else ''}")

    if not duplicate_ids and not missing_files and not zero_size and not invalid_auth:
        print("\n结果: 收录检查通过，无异常。")
    else:
        print("\n结果: 发现异常，请查看上方详情。")


if __name__ == "__main__":
    check()
