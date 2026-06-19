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
├── fanart_gallerydl.py     # gallery-dl 二创抓取适配器
├── build_data_index.py     # 扫描 assets/ 重建 data.json
├── generate_demo_fanart.py # 生成示例二创占位图
├── index.html              # 可视化画廊
└── README.md               # 本文件
```

## 二创（同人图）收录说明

本项目除了官方设定图，还提供了**二创图片抓取框架**，支持从 Pixiv、Twitter/X、Bilibili、LOFTER 等平台按游戏关键词自动搜索收录。

### 版权与合规提示

- 二创图片的版权归原画师/作者所有，本项目**不会**也无法自动获取任何授权。
- 所有二创资源默认标记为 `unknown`（授权状态未知），你需要**手动核实并更新授权状态**。
- 授权状态说明：
  - `official`：官方素材
  - `unknown`：未知授权，建议仅本地参考
  - `personal_only`：仅限个人本地参考，勿公开传播
  - `authorized`：已获作者授权，可按规定范围使用
  - `no_repost`：作者明确禁止转载，请勿使用
- **公开部署展示二创图片前，必须获得原作者授权**；否则存在著作权侵权风险。

### 启用二创抓取

1. 在 `games.json` 中：
   - 将目标游戏的 `fanartEnabled` 设为 `true`
   - 调整 `fanartKeywords` 为你想搜索的关键词
2. 在 `games.json` 的 `fanartSources` 中：
   - 将目标平台 `enabled` 设为 `true`
   - 根据平台要求配置 API、Cookie 或第三方实例（如 Nitter）
3. 运行抓取：

```bash
# 只抓取二创
python scraper.py --fanart

# 同时抓取官方+二创
python scraper.py

# 只抓取某游戏的二创
python scraper.py --fanart -g honor-of-kings
```

### 更新授权状态

抓取完成后，编辑 `assets/data.json` 中对应条目的 `authorizationStatus` 字段：

```json
{
  "artist": "画师名",
  "artistId": "画师平台ID",
  "sourceUrl": "https://...",
  "authorizationStatus": "authorized"
}
```

画廊界面会根据该字段显示授权标签、颜色标识，并支持按授权状态筛选。

### 使用 gallery-dl 抓取真实二创

项目额外提供 `fanart_gallerydl.py`，可直接调用 [gallery-dl](https://github.com/mikf/gallery-dl) 抓取 Pixiv、Twitter/X、Bilibili、LOFTER 等平台的真实二创图片，并自动转换为本项目索引格式。

```bash
# 安装 gallery-dl
pip install gallery-dl

# 在 games.json 中启用二创平台与游戏后执行
python fanart_gallerydl.py
```

各平台配置说明：

- **Pixiv**：需要在 `gallery-dl.conf` 中配置 `refresh-token`，或执行 `gallery-dl oauth:pixiv` 获取。
- **Twitter/X**：需要配置 cookies 或登录态。
- **Bilibili**：gallery-dl 不支持关键词搜索，仅支持具体专栏/动态 URL（`https://www.bilibili.com/opus/{id}`）。
- **LOFTER**：gallery-dl 不支持标签搜索，仅支持具体博客文章 URL（`https://{blog}.lofter.com/post/{post_id}`）。

> 由于当前环境无法提供平台登录凭证，且部分站点存在 SSL/反爬限制，真实二创抓取需要你本地配置好凭证后运行。

### 示例二创占位图

若只是想先预览二创展示效果，可运行：

```bash
pip install Pillow
python generate_demo_fanart.py
```

该命令会生成 36 张带有 "FANART DEMO" 水印的占位图，并写入 `assets/data.json`，用于验证授权筛选、画师展示、灯箱等功能。

### 重建索引

如果 `scraper.py` 运行中断或你手动往 `assets/` 放了图片，可以用以下命令重新扫描并生成 `data.json`：

```bash
python build_data_index.py
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
- **授权状态筛选**：独立的授权筛选栏，可快速区分官方/未知/已授权/禁转载等素材。
- **二创元数据展示**：二创卡片显示画师、来源链接、授权状态标签；灯箱与对比面板同步展示。
- **实时搜索**：按游戏名、角色名、皮肤名、画师名、标签搜索。
- **懒加载**：图片进入视口才加载，附带骨架屏。
- **灯箱预览**：点击卡片全屏查看，支持键盘左右切换与 ESC 关闭。
- **批量选择 & 对比**：按 `S` 进入选择模式，选择多张素材后一键对比。
- **统计看板**：实时统计素材总数、游戏分布、类型分布、授权状态分布。
- **响应式布局**：桌面、平板、手机自适应，支持网格/瀑布流/列表三种视图。

## 常见问题

**Q：抓取时返回 403 / 被反爬怎么办？**
A：尝试增大 `--delay` 间隔、更换 User-Agent、或添加正确的 `Referer`。

**Q：某些皮肤图片不存在怎么办？**
A：官方 CDN 中部分皮肤序号可能不存在，脚本会跳过下载失败项并继续。

**Q：我只想用界面，不想抓图，可以吗？**
A：可以。`index.html` 读取 `assets/data.json`，你可以手动编辑该 JSON 文件，把 `localPath` 指向本地图片或外链 URL。

## 许可证

本项目代码部分按 MIT 许可证开源。所抓取图片的版权归各自权利方所有，不在本许可证范围内。
