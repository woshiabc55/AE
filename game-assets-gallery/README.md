# 游戏官方设定图鉴 · Game Assets Gallery

> 可本地运行的游戏官方美术资源收录框架，包含通用抓取脚本与现代化可视化画廊。

## ⚠️ 版权与合规声明

- 本项目**仅输出代码框架**，不内置任何受版权保护的官方美术资源。
- 运行 `scraper.py` 抓取到的图片版权归各游戏公司所有。
- **公开部署展示官方图片前，必须获得权利方授权**；否则存在著作权侵权风险。
- 建议仅用于本地个人参考、学习、二次创作素材整理，或替换为自有/授权素材后再公开。

## 目录结构

```
game-assets-gallery/
├── assets/                 # 下载的图片（运行时生成）
│   ├── data.json           # 资源索引
│   └── <game-id>/          # 按游戏分目录
├── games.json              # 游戏分类与抓取配置
├── scraper.py              # 通用抓取脚本
├── index.html              # 可视化画廊
└── README.md               # 本文件
```

## 快速开始

### 1. 安装依赖

```bash
pip install requests beautifulsoup4 lxml
```

### 2. 配置要抓取的游戏

编辑 [games.json](games.json)：

- 将目标游戏的 `enabled` 设为 `true`。
- 如果该游戏已有解析器，把 `parser` 改为对应名称。
- 目前没有解析器的游戏会提示你自行实现。

### 3. 运行抓取脚本

```bash
# 抓取所有 enabled=true 的游戏
python scraper.py

# 只抓取王者荣耀
python scraper.py -g honor-of-kings

# 调整请求间隔（秒）
python scraper.py --delay 1.0 2.0
```

抓取完成后会生成 `assets/data.json` 索引文件。

### 4. 查看画廊

直接用浏览器打开 [index.html](index.html) 即可，无需任何构建步骤。

```bash
# 或者启动一个本地服务器
python -m http.server 8080
```

然后在浏览器访问 `http://localhost:8080`。

## 内置示例：王者荣耀

`scraper.py` 内置了 `HonorOfKingsParser`，使用公开的英雄列表 JSON 与官方 CDN 皮肤图地址模式：

- 英雄列表：`https://pvp.qq.com/web201605/js/herolist.json`
- 皮肤图片：`https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/{ename}/{ename}-bigskin-{idx}.jpg`

> 注意：官方站点或 CDN 地址结构可能随时变化，如无法抓取请检查实际 URL 与页面结构并调整解析器。

## 如何扩展更多游戏

1. 在 `games.json` 的 `games` 数组中追加游戏信息：

```json
{
  "id": "my-game",
  "name": "我的游戏",
  "category": "MOBA",
  "brandColor": "#ff4655",
  "sources": ["https://example.com/"],
  "enabled": true,
  "parser": "my_game"
}
```

2. 在 `scraper.py` 中新建解析器类：

```python
class MyGameParser(BaseParser):
    def parse(self) -> List[Dict]:
        # 1. 抓索引页/接口，拿到角色/皮肤列表
        # 2. 下载图片到 self._make_local_path(type, name, filename)
        # 3. 返回资源字典列表
        return []
```

3. 在 `GameRegistry` 中注册：

```python
GameRegistry.register("my_game", MyGameParser)
```

4. 重新运行 `python scraper.py`。

## 界面功能

- **分类筛选**：顶部横向分类按钮，一键过滤 MOBA/RPG/射击等类别。
- **实时搜索**：按游戏名、角色名、皮肤名搜索。
- **懒加载**：图片进入视口才加载，附带骨架屏。
- **灯箱预览**：点击卡片全屏查看，支持键盘左右切换与 ESC 关闭。
- **响应式布局**：桌面、平板、手机自适应。

## 常见问题

**Q：抓取时返回 403 / 被反爬怎么办？**
A：尝试增大 `--delay` 间隔、更换 User-Agent、或添加正确的 `Referer`。

**Q：某些皮肤图片不存在怎么办？**
A：官方 CDN 中部分皮肤序号可能不存在，脚本会跳过下载失败项并继续。

**Q：我只想用界面，不想抓图，可以吗？**
A：可以。`index.html` 读取 `assets/data.json`，你可以手动编辑该 JSON 文件，把 `localPath` 指向本地图片或外链 URL。

## 许可证

本项目代码部分按 MIT 许可证开源。所抓取图片的版权归各自权利方所有，不在本许可证范围内。
