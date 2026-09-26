# JIEAN Design System

**中文版** · [English version](README.md)

捷安高科 (JIEAN) 公司级视觉与交互设计系统。

本仓库是 JIEAN 软件外观与行为的权威依据。它不是组件库，也不绑定任何框架：它是一份规范，人、AI 编码代理与工具链都从它读取，任何前端技术栈都可以对照它实现。

## 可用的 style package



```
arcopro
```

`arcopro` 是企业级 style package，抽取自 Arco Design Pro 所体现的企业应用语言。

## 关系



```
JIEAN Design System
└── arcopro
```

公司级系统是名字，也是承诺：JIEAN 的视觉与交互决策都记录在这一处。一个 style package 是它的一种表达 —— 一组令牌、一套模式语言，以及面向特定产品族或密度的参考实现。

**未来新增 style package 不必改动公司级系统的名字。** 第二个 package（`arcopro-compact`，或面向另一条产品线的 package）会像 `arcopro` 现在这样与它并列，公司级名称、评审流程与契约格式都保持不变。

## 仓库里有什么



| 路径                                | 内容                       |
| --------------------------------- | ------------------------ |
| `arcopro/DESIGN.md`               | 设计契约：机器可读的令牌，以及这些令牌背后的理由 |
| `arcopro/docs/`                   | 14 篇模式文档 —— 企业应用语言的文字表述  |
| `arcopro/tokens/`、`arcopro/dist/` | 令牌产物：官方导出，以及无损的派生文件对     |
| `arcopro/examples/`               | 参考实现：6 个不依赖框架的 HTML 页面   |
| `arcopro/reports/`                | 证据：来源审计、工具链验证、视觉验证       |
| `scripts/`                        | 校验、导出与比对工具               |
| `AGENTS.md`                       | 面向编码代理的指令文件              |
| `arcopro/README.md`               | 包手册 —— 需要动手细节时从这里开始      |

## 最短流程



```
git clone <this repository>
cd jiean-design-system
npm install
npm run check
```

`npm run check` 会校验契约、导出令牌、验证生成的产物，并检查仓库卫生。它与 CI 运行的是同一条命令。它通过，说明仓库处于良好状态。

想直接看结果而不是跑校验，用浏览器打开 `arcopro/examples/dashboard.html`。这些页面不需要构建步骤：它们由 HTML、一份样式表和派生的令牌文件构成。

## 第一次接触时，按这个顺序读



1. `arcopro/DESIGN.md`—— 契约。frontmatter 就是令牌集，正文说明这些令牌为什么存在。

2. `arcopro/docs/foundations.md`—— 底层模型：两棵树（workspace 与 rail）、密度规则，以及哪些内容可以用排版表达。

3. `arcopro/docs/application-shell.md`—— 页面如何组装；因为其余每个模式都是这个外壳中的一个区域。

4. `arcopro/examples/dashboard.html`—— 在浏览器里看这个外壳。

5. `arcopro/reports/source-audit.md`—— 每个数值来自哪里，哪些是推断而非实测。

## 构建于

`arcopro` 抽取自 **Arco Design Pro**（其仓库与主题包均为 MIT 许可），使用 Google 的 **DESIGN.md** 格式及其 `design.md` 工具链（Apache 2.0）。本仓库是 JIEAN 自己的成果，不是 Arco 官方产品，也不是 Google 官方产品。必需的通知与未主张的归属见 `THIRD_PARTY_NOTICES.md`。

## 许可

本仓库内容采用 MIT 许可，详见 `LICENSE`。