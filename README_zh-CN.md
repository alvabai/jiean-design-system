# JIEAN Design System

**中文版** · [English version](README.md)

捷安高科 (JIEAN) 公司级视觉与交互设计系统。

本仓库是 JIEAN 软件外观与行为的权威依据。它不是组件库，也不绑定任何框架：它是一份规范，人、AI 编码代理与工具链都从它读取，任何前端技术栈都可以对照它实现。

## 可用的 style package



```
arcopro
brandcolor
industrial-steel-blue
```

`arcopro` 是企业级 style package，抽取自 Arco Design Pro 所体现的企业应用语言。

`brandcolor` 是同一个 package 换掉颜色层之后的版本：主色用捷安红 `#D7000F`，三个深色锚点用深灰 `#353535`，另有四个主色步进按"保持各步相对亮度不变"推导得出。几何、排版、间距、圆角与全部 61 个组件令牌都与 `arcopro` 相同，30 个颜色角色里也有 22 个相同——`npm run 8:package-diff` 在每次提交时都会验证这一点。

`industrial-steel-blue`（工业钢蓝）是工业风格 package：沿用同一套非颜色层，把主色族换成由 `arcopro` 自身色阶推导出的十阶钢蓝 —— 色相统一为 210°、饱和度 ×0.38，第 5~7 阶亮度 ×0.78，好让三个交互阶仍能承住白字。它的定位是**带白名单的超集，而不是换色**：34 个颜色角色里有 25 个、11 个字体角色里有 10 个、全部 13 个间距、全部圆角、75 个组件令牌里有 61 个都来自 `arcopro`，而且每一处改动或新增都先在脚本里登记，之后才允许存在。它另外多出的三道严谨性 —— 机器校验层、钢蓝色阶推导、以及深入到像素的预览校验 —— 只作用在这个包上。

## 关系



```
JIEAN Design System
├── arcopro
├── brandcolor
└── industrial-steel-blue
```

公司级系统是名字，也是承诺：JIEAN 的视觉与交互决策都记录在这一处。一个 style package 是它的一种表达 —— 一组令牌、一套模式语言，以及面向特定产品族或密度的参考实现。

**另外两个 package 已经这样落地了。** `brandcolor` 与 `arcopro` 并列，公司级名称、契约格式与评审流程都没有改动：它只换掉颜色层，而这个差异是被机器校验的，不是被描述的。`industrial-steel-blue` 面向另一条产品线做同样的事，并且多走一步：它补上了前两个包没有的结构 —— 官方 linter 之外的机器校验层、调色板的推导脚本，以及一直校验到像素的渲染预览。这两组关系在每次提交时都会被证明，再新增一个 package（`arcopro-compact`，或面向其它产品线的 package）也走同一条路。

## 仓库里有什么



| 路径                                | 内容                       |
| --------------------------------- | ------------------------ |
| `<package>/DESIGN.md`             | 设计契约：机器可读的令牌，以及这些令牌背后的理由 |
| `<package>/docs/`                 | 14 篇模式文档 —— 企业应用语言的文字表述  |
| `<package>/tokens/`、`<package>/dist/` | 令牌产物：官方导出，以及无损的派生文件对     |
| `<package>/examples/`             | 参考实现：不依赖框架的 HTML 页面，每个页面旁边有对应的渲染预览 |
| `<package>/reports/`              | 证据：来源审计、工具链验证、视觉验证       |
| `<package>/README.md`             | 包手册 —— 需要动手细节时从这里开始      |
| `scripts/`                        | 校验、导出与比对工具               |
| `AGENTS.md`                       | 面向编码代理的指令文件              |

`<package>` 取 `arcopro`、`brandcolor` 或 `industrial-steel-blue`。三个目录结构相同。前两个只差颜色层；第三个在登记过的白名单内调整颜色层，并额外带有 `reports/machine-validation.json`、`reports/evidence/palette-derivation.json` 与 `reports/evidence/package-diff.json`。它的 `examples/` 是「4 个页面 + 4 张预览图」的平铺目录，每个页面自包含，而不是「页面集 + 共享样式表目录」的形态。

## 最短流程



```
git clone <this repository>
cd jiean-design-system
npm install
npm run check
```

`npm run check` 会校验并结构校验三份契约、导出令牌、验证生成的产物、重新推导品牌色阶与钢蓝色阶、证明两组跨包关系、校验四张预览（含像素上的配色），并检查仓库卫生。它与 CI 运行的是同一条命令。它通过，说明仓库处于良好状态。

想直接看结果而不是跑校验，用浏览器分别打开 `arcopro/examples/dashboard.html`、`brandcolor/examples/dashboard.html` 与 `industrial-steel-blue/examples/dashboard.html` 对照。这些页面不需要构建步骤：它们由 HTML 与派生的令牌文件构成，其中第三个包的页面把样式内联在页内，以便 `examples/` 保持平铺。

## 第一次接触时，按这个顺序读



1. `arcopro/DESIGN.md`—— 契约。frontmatter 就是令牌集，正文说明这些令牌为什么存在。

2. `arcopro/docs/foundations.md`—— 底层模型：两棵树（workspace 与 rail）、密度规则，以及哪些内容可以用排版表达。

3. `arcopro/docs/application-shell.md`—— 页面如何组装；因为其余每个模式都是这个外壳中的一个区域。

4. `arcopro/examples/dashboard.html`—— 在浏览器里看这个外壳。

5. `arcopro/reports/source-audit.md`—— 每个数值来自哪里，哪些是推断而非实测。

6. `brandcolor/DESIGN.md` §Colors—— 同一个系统换成捷安品牌红：哪 8 个角色变了，四个推导步为什么保持亮度。它的 `reports/visual-validation.md` 说明这次改动有哪些证据、哪些没有。

7. `industrial-steel-blue/DESIGN.md`—— 工业包。系统里的动效取值、响应式行为、迭代规则，以及一份明确的自述缺口清单都在这里。它的 `reports/source-audit.md` 记录了每件事所依据的精确版本，`reports/evidence/package-diff.json` 证明了哪些动了、哪些没动。

## 构建于

`arcopro` 抽取自 **Arco Design Pro**（其仓库与主题包均为 MIT 许可），使用 Google 的 **DESIGN.md** 格式及其 `design.md` 工具链（Apache 2.0）。`brandcolor` 原样复用这次抽取，只把颜色层换成捷安品牌色；它的几何、排版与组件令牌都来自 `arcopro`。`industrial-steel-blue` 研究的是同一套基线 —— Arco Design `2.66.16` 与 Arco Design Pro `bb6aebcceca6`，两个都在它的来源审计里按提交记录 —— 它的交互主色是从那条色阶推导出来的，而不是直接采用的。本仓库是 JIEAN 自己的成果，不是 Arco 官方产品，也不是 Google 官方产品。必需的通知与未主张的归属见 `THIRD_PARTY_NOTICES.md`。

## 许可

本仓库内容采用 MIT 许可，详见 `LICENSE`。