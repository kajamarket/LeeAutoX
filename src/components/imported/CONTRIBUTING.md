# 参与贡献

欢迎提交错误修复、交互改进和新示例。反馈问题时请附上图鉴详情的分享链接、浏览器和复现步骤。新增示例或接入新组件库之前，可以先在 [GitHub Issues](https://github.com/guanmo-ai/ui-moments/issues) 说明想法和来源。

## 本地复现和验证

按 [README 的本地运行步骤](README.zh-CN.md#本地运行) 安装依赖、构建并启动站点。`npm run package:site` 从 Git 索引取得发布文件清单，将新增文件加入索引后再运行该命令。在 `_site/` 里验证修改过的预览、详情直达链接和导出功能。

提交前，按 [README 的浏览器测试步骤](README.zh-CN.md#浏览器测试) 运行测试。改动控件时，在宽屏和手机尺寸下试用，检查键盘操作、深浅主题和减少动态效果设置。若示例提供独立 HTML，将它另存后离线打开并完成主要操作。

## 登记和署名

- 原创控件在 [`gallery/originals/`](gallery/originals/) 实现，在 [`gallery/works.js`](gallery/works.js) 登记详情 ID 与演示路径。原创加载动画登记在 [`gallery/loaders/originals.mjs`](gallery/loaders/originals.mjs) 或 [`gallery/loaders/motifs.mjs`](gallery/loaders/motifs.mjs)。
- 上游集成要记录作者、原始链接、锁定版本与对应许可证，并在 [CREDITS.md](CREDITS.md) 说明本项目做过的适配。提交之前检查详情链接能定位到用于预览的具体代码。
- 借鉴交互时，注明参考对象和自行实现的部分。提交的代码和素材须允许按本项目的分发方式使用，保留原有版权和许可证。

提交 PR 时说明改动、验证结果及使用的示例。交互或外观有变化时，请附截图或短录屏。

## 组件收录条件

集成代码只接受由组织维护、过去 12 个月内有发布、采用 [OSI 批准的许可证](https://opensource.org/licenses)，并在锁文件中固定版本和完整性的库。受某个具体作品启发时，须重新设计为明显不同的造型，或在 `gallery/works.js` 的 `credit` 字段注明来源。通用交互模式无需标注。

## Contributing

Bug reports are welcome. Include the share link for the example, your browser, and steps to reproduce the issue. Discuss new examples or library integrations in [GitHub Issues](https://github.com/guanmo-ai/ui-moments/issues).

Follow the [local setup and browser testing instructions](README.md#run-locally). Test changed components at desktop and phone widths, in both themes, with the keyboard, and with reduced motion. If an example offers standalone HTML, save it and verify its main interactions offline. Stage new files before packaging a Git checkout.

Add original controls in `gallery/originals/` and register them in `gallery/works.js`. Add original loaders in `gallery/loaders/originals.mjs` or `gallery/loaders/motifs.mjs`. For an integration, record the upstream author, source, locked version, license, and project adaptations in [CREDITS.md](CREDITS.md). Include validation results and screenshots or a short recording with changes to the UI.

Code integrations must be maintained by an organization, have a release within the past 12 months, use an [OSI-approved license](https://opensource.org/licenses), and have their version and integrity pinned in a lockfile. If a design takes inspiration from a specific work, give it a visibly distinct design or record the source in the `credit` field in `gallery/works.js`. Common interaction patterns do not need attribution.
