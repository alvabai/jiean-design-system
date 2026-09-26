# JIEAN Design System

**中文版** · [English version](README.md)

捷安高科 (JIEAN) 公司级视觉与交互设计系统。

本仓库是 JIEAN 软件外观与行为的权威依据。它不是组件库，也不绑定任何框架：它是一份规范，人、AI 编码代理与工具链都从它读取，任何前端技术栈都可以对照它实现。

## 可用的 style package



```
arcopro
brandcolor
```

`arcopro` 是企业级 style package，抽取自 Arco Design Pro 所体现的企业应用语言。

`brandcolor` 是同一个 package 换掉颜色层之后的版本：主色用捷安红 `#D7000F`，三个深色锚点用深灰 `#353535`，另有四个主色步进按"保持各步相对亮度不变"推导得出。几何、排版、间距、圆角与全部 61 个组件令牌都与 `arcopro` 相同，30 个颜色角色里也有 22 个相同——`npm run 8:package-diff` 在每次提交时都会验证这一点。

## 关系



```
JIEAN Design System
├── arcopro
└── brandcolor
```

公司级系统是名字，也是承诺：JIEAN 的视觉与交互决策都记录在这一处。一个 style package 是它的一种表达 —— 一组令牌、一套模式语言，以及面向特定产品族或密度的参考实现。

**第二个 package 已经这样落地了。** `brandcolor` 与 `arcopro` 并列，公司级名称、契约格式与评审流程都没有改动：它只换掉颜色层，而这个差异是被机器校验的，不是被描述的。再新增一个 package（`arcopro-compact`，或面向另一条产品线的 package）也走同一条路。

## 仓库里有什么



| 路径                                | 内容                       |
| --------------------------------- | ------------------------ |
| `<package>/DESIGN.md`             | 设计契约：机器可读的令牌，以及这些令牌背后的理由 |
| `<package>/docs/`                 | 14 篇模式文档 —— 企业应用语言的文字表述  |
| `<package>/tokens/`、`<package>/dist/` | 令牌产物：官方导出，以及无损的派生文件对     |
| `<package>/examples/`             | 参考实现：6 个不依赖框架的 HTML 页面   |
| `<package>/reports/`              | 证据：来源审计、工具链验证、视觉验证       |
| `<package>/README.md`             | 包手册 —— 需要动手细节时从这里开始      |
| `scripts/`                        | 校验、导出与比对工具               |
| `AGENTS.md`                       | 面向编码代理的指令文件              |

`<package>` 取 `arcopro` 或 `brandcolor`。两个目录结构相同，差别只在颜色层。

## 最短流程



```
git clone <this repository>
cd jiean-design-system
npm install
npm run check
```

`npm run check` 会校验两份契约、导出令牌、验证生成的产物、重新推导品牌色阶、证明两个 package 只差颜色层，并检查仓库卫生。它与 CI 运行的是同一条命令。它通过，说明仓库处于良好状态。

想直接看结果而不是跑校验，用浏览器分别打开 `arcopro/examples/dashboard.html` 与 `brandcolor/examples/dashboard.html` 对照。这些页面不需要构建步骤：它们由 HTML、一份样式表和派生的令牌文件构成。

## 第一次接触时，按这个顺序读



1. `arcopro/DESIGN.md`—— 契约。frontmatter 就是令牌集，正文说明这些令牌为什么存在。

2. `arcopro/docs/foundations.md`—— 底层模型：两棵树（workspace 与 rail）、密度规则，以及哪些内容可以用排版表达。

3. `arcopro/docs/application-shell.md`—— 页面如何组装；因为其余每个模式都是这个外壳中的一个区域。

4. `arcopro/examples/dashboard.html`—— 在浏览器里看这个外壳。

5. `arcopro/reports/source-audit.md`—— 每个数值来自哪里，哪些是推断而非实测。

6. `brandcolor/DESIGN.md` §Colors—— 同一个系统换成捷安品牌红：哪 8 个角色变了，四个推导步为什么保持亮度。它的 `reports/visual-validation.md` 说明这次改动有哪些证据、哪些没有。

## 构建于

`arcopro` 抽取自 **Arco Design Pro**（其仓库与主题包均为 MIT 许可），使用 Google 的 **DESIGN.md** 格式及其 `design.md` 工具链（Apache 2.0）。`brandcolor` 原样复用这次抽取，只把颜色层换成捷安品牌色；它的几何、排版与组件令牌都来自 `arcopro`。本仓库是 JIEAN 自己的成果，不是 Arco 官方产品，也不是 Google 官方产品。必需的通知与未主张的归属见 `THIRD_PARTY_NOTICES.md`。

## 许可

本仓库内容采用 MIT 许可，详见 `LICENSE`。