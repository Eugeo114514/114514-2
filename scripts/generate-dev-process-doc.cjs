/**
 * scripts/generate-dev-process-doc.cjs
 * 生成《AI协同开发流程与典型问题解决路径》Word 文件
 * 运行：node scripts/generate-dev-process-doc.cjs
 */

const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ShadingType, Table, TableRow, TableCell, WidthType } = require('docx')
const fs = require('fs')
const path = require('path')

const doc = new Document({
  styles: { default: { document: { run: { font: 'Microsoft YaHei', size: 22 } } } },
  sections: [{
    children: [
      // ===== 封面 =====
      new Paragraph({ text: '飞猪「100种不可思议旅行」', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
      new Paragraph({ text: 'AI 协同开发流程与典型问题解决路径', heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
      new Paragraph({ children: [new TextRun({ text: '多范式融合架构 · React + TypeScript + Vite', size: 24, color: '888888' })], alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
      new Paragraph({ children: [new TextRun({ text: '日期：2026-06-09', bold: true })], spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: 'AI 模型：Claude Code (DeepSeek V4 Pro)', bold: true })], spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: '开发模式：Superpowers 插件 + 多范式融合工程化', bold: true })], spacing: { after: 400 } }),

      // ===== 目录 =====
      new Paragraph({ text: '目录', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Paragraph({ text: '一、开发流程全景图', bold: true, spacing: { after: 60 } }),
      new Paragraph({ text: '二、典型问题一：视觉方案的迭代式收敛', bold: true, spacing: { after: 60 } }),
      new Paragraph({ text: '三、典型问题二：多范式架构的选择与落地', bold: true, spacing: { after: 60 } }),
      new Paragraph({ text: '四、典型问题三：Git 分层历史的工程化重建', bold: true, spacing: { after: 60 } }),

      new Paragraph({ text: '', pageBreakBefore: true }),

      // ===== 一、开发流程全景图 =====
      new Paragraph({ text: '一、开发流程全景图', heading: HeadingLevel.HEADING_1, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: '2a5a9e' } }, spacing: { after: 200 } }),

      new Paragraph({
        text: '本项目的开发不是传统的"需求→设计→编码→测试"瀑布流程，而是 AI-Supervised Multi-Pass 迭代模式：人类设定方向与约束，AI 提出方案，人类反馈纠偏，AI 重新执行。整个过程中人始终在回路中（Human-in-the-Loop），AI 负责执行层面的广度与速度，人类负责决策层面的深度与判断。',
        spacing: { after: 200 },
      }),

      new Paragraph({ text: '1.1 开发阶段总览', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: '阶段', bold: true, size: 20 })] })], shading: { type: ShadingType.SOLID, color: '1a1a2e', fill: '1a1a2e' } }),
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: '范式', bold: true, size: 20 })] })], shading: { type: ShadingType.SOLID, color: '1a1a2e', fill: '1a1a2e' } }),
              new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'AI 角色', bold: true, size: 20 })] })], shading: { type: ShadingType.SOLID, color: '1a1a2e', fill: '1a1a2e' } }),
              new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: '关键产出', bold: true, size: 20 })] })], shading: { type: ShadingType.SOLID, color: '1a1a2e', fill: '1a1a2e' } }),
            ],
          }),
          ...([
            ['Brainstorming', '创意发散', '引导者：逐一提问收敛需求', '设计规格说明书（Spec Doc）'],
            ['SDD-1', '数据建模', '架构师：定义实体 + 接口契约', 'Travel 类型、Filter 谓词、ITravelDataSource'],
            ['SDD-2', '组件生成', '工匠：生成 Compound Components', 'TravelCard 族、FilterBar、FlowCarousel'],
            ['TDD', '测试驱动', '质检员：先写测试再验证实现', '19 个单元测试（filterTravels 等）'],
            ['E2E', '质量闭环', '审核员：五维质量验证', '文档+数据+测试+构建+Git 历史'],
            ['Polish', '视觉打磨', '设计师：多次迭代动画效果', 'Blob→蜂窝→Carousel 三版视觉'],
          ]).map(([phase, paradigm, role, output]) =>
            new TableRow({
              children: [
                new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: phase, bold: true, size: 20 })] })] }),
                new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: paradigm, size: 20 })] })] }),
                new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: role, size: 20 })] })] }),
                new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: output, size: 20 })] })] }),
              ],
            })
          ),
        ],
      }),

      new Paragraph({ text: '', spacing: { after: 200 } }),

      new Paragraph({ text: '1.2 协同工作流', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
      new Paragraph({
        children: [
          new TextRun({ text: '人类决策节点：\n', bold: true }),
          new TextRun({ text: '① 方向设定 → ② 方案审核 → ③ 视觉反馈 → ④ 功能追加 → ⑤ 质量验收\n\n' }),
          new TextRun({ text: 'AI 执行节点：\n', bold: true }),
          new TextRun({ text: '① 需求澄清（brainstorming）→ ② 架构设计（writing-plans）→ ③ 代码生成（16 tasks）→ ④ 测试编写（vitest）→ ⑤ 文档生成（mermaid）→ ⑥ 历史重建（git layered commits）\n\n' }),
          new TextRun({ text: '关键原则：', bold: true }),
          new TextRun({ text: '"严禁一键生成"贯穿始终。AI 在每个阶段必须等待人类反馈后才能进入下一阶段。这不仅是一种约束，更是一种质量保证机制——确保 AI 不会在错误的方向上狂奔。' }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({ text: '', pageBreakBefore: true }),

      // ===== 二、典型问题一 =====
      new Paragraph({ text: '二、典型问题一：视觉方案的迭代式收敛', heading: HeadingLevel.HEADING_1, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'e94560' } }, spacing: { after: 200 } }),

      new Paragraph({ text: '2.1 问题描述', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
      new Paragraph({
        text: '项目经历了四次重大的视觉方向调整：CSS 瀑布流 → 六边形蜂窝网格 → 有机 blob 形态卡片 → BanG Dream 风格水平轮播。每一次调整都涉及底层布局容器的替换，但上层的卡片动画逻辑（blob morph + drift wave）始终保持不变。',
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: 'AI 的初始方案（MasonryLayout）被反馈"视觉效果过于冗杂"后，AI 用 CSS clip-path 创建了六边形蜂窝网格。但用户再次反馈需要"更灵动，浪花泡沫雪花式流动"，AI 又替换为有机 blob border-radius 动画 + drift 漂移路径。最终用户要求参考 bang-dream.com 的"全屏幕流动"体验，AI 通过 curl 逆向分析其 Embla carousel 设计，将布局从全屏静态网格改为水平 scroll-snap 轮播。',
        spacing: { after: 200 },
      }),

      new Paragraph({ text: '2.2 问题根因', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
      new Paragraph({
        children: [
          new TextRun({ text: '根因一：视觉偏好的主观性与不可预知性。', bold: true }),
          new TextRun({ text: '用户对"好看"的定义是动态形成的——在看到 AI 的第一个方案后才意识到"这不是我想要的"。这不是需求不清晰，而是视觉设计天然需要在"看到-反馈-修正"的循环中收敛。\n\n' }),
          new TextRun({ text: '根因二：参考网站无法直接访问。', bold: true }),
          new TextRun({ text: '用户指定的 bang-dream.com 在首次访问时返回 404（缺少 User-Agent），后续访问返回大量 JavaScript 渲染内容。AI 需要从 minified CSS 和 HTML 结构中逆向提取设计模式（Embla carousel、Montserrat 字体、body opacity fade-in），而非简单地"照抄"。' }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({ text: '2.3 解决路径', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
      new Paragraph({
        children: [
          new TextRun({ text: '路径一：分层架构保障快速替换。\n', bold: true }),
          new TextRun({ text: '因为采用了多范式分层架构，每一次视觉调整只触及 features/travel-grid/ 中的布局容器（MasonryLayout → HoneycombGrid → FlowCarousel）和 features/travel-card/ 中的 CSS 动画，core/ 领域层和 state/ 状态层完全不受影响。如果使用传统的"组件内混杂业务逻辑"写法，每次视觉变更都需要重写整个组件。\n\n' }),
          new TextRun({ text: '路径二：CSS-only 动画策略。\n', bold: true }),
          new TextRun({ text: '所有动画均使用 CSS @keyframes + GPU 合成层（will-change, translate3d），零 JavaScript 动画。这意味着动画参数（持续时间、缓动曲线、漂移路径）可以在不修改组件逻辑的情况下独立调整，设计师可以直接在 DevTools 中调试。\n\n' }),
          new TextRun({ text: '路径三：迭代保留机制。\n', bold: true }),
          new TextRun({ text: '每次视觉迭代并不删除旧代码，而是新增组件文件（MasonryLayout.tsx、HoneycombGrid.tsx、FlowCarousel.tsx 均保留在代码库中），Git 历史清晰记录了每次演进。后期如果需要回退或做 A/B 测试，三个布局方案都可立即切换。' }),
        ],
        spacing: { after: 300 },
      }),

      new Paragraph({ text: '', pageBreakBefore: true }),

      // ===== 三、典型问题二 =====
      new Paragraph({ text: '三、典型问题二：多范式架构的选择与落地', heading: HeadingLevel.HEADING_1, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: '7ab8e0' } }, spacing: { after: 200 } }),

      new Paragraph({ text: '3.1 问题描述', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
      new Paragraph({
        text: '用户明确要求"使用多范式融合的工程化架构模式"，但这是一个高度抽象的概念。市面上没有现成的"多范式融合 React 项目模板"。AI 需要将"多范式融合"这个指导思想，具体化为可落地的文件结构、接口设计和范式边界。\n\nAI 提出了三种候选方案：\nA) 传统分层架构（纯组件化 + Custom Hooks）—— 简单但缺乏架构质感\nB) Feature-Sliced Design（领域驱动 + 功能隔离）—— 模块清晰但 MVP 阶段过度工程\nC) 多范式融合架构（FP domain + OOP components + Reactive state + AOP cross-cutting）\n\n用户选择了方案 C，但当时的"C"只是一个概念——AI 需要在接下来的 16 个实现 Task 中，把每一行代码都对号入座到正确的范式层中。',
        spacing: { after: 200 },
      }),

      new Paragraph({ text: '3.2 问题根因', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
      new Paragraph({
        children: [
          new TextRun({ text: '根因：范式边界模糊带来的"代码归属"难题。', bold: true }),
          new TextRun({ text: '以下问题在实现过程中反复出现：\n\n' }),
          new TextRun({ text: '· filterTravels 应该放在 core/ 还是 state/？\n', italics: true }),
          new TextRun({ text: '  答案：core/（纯函数，零副作用，与 Zustand 无关）。state/ 中的 store 调用 applyFilter 作为派生逻辑，但函数本身属于领域层。\n\n' }),
          new TextRun({ text: '· TravelCard 的 mood 标签应该放在 features/ 还是 shared/？\n', italics: true }),
          new TextRun({ text: '  答案：MoodTag 组件在 shared/（通用 UI Kit），TravelCard.Mood 在 features/（业务组合逻辑）。前者不依赖 Travel 类型，后者通过 Context 消费 Travel 数据。\n\n' }),
          new TextRun({ text: '· 点赞逻辑应该放在 state/ 还是 features/？\n', italics: true }),
          new TextRun({ text: '  答案：state/social.ts（Zustand store，跨组件共享），features/ 中的 LikeButton 只消费 store selector。localStorage 持久化逻辑封装在 store 内部，UI 层无感知。' }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({ text: '3.3 解决路径', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
      new Paragraph({
        children: [
          new TextRun({ text: '路径一：以"副作用"为判据的范式分界法。\n', bold: true }),
          new TextRun({ text: '有副作用（setState、API 调用、localStorage）→ state/ 或 features/；无副作用（纯计算、数据转换）→ core/。这是整个架构的"宪法级"原则。filterTravels 不产生副作用 → 放 core/；useAppStore 产生 set() 副作用 → 放 state/。\n\n' }),
          new TextRun({ text: '路径二：端口-适配器模式预留 API 替换空间。\n', bold: true }),
          new TextRun({ text: 'core/ports/ITravelDataSource 定义了数据源接口，当前实现是 JSON + localStorage（静态适配器），未来替换为飞猪 API 时，只需新增 FliggyApiDataSource 适配器，core/、state/、features/ 三层代码零修改。这是"多范式"架构的第一个实际收益。\n\n' }),
          new TextRun({ text: '路径三：TypeScript strict mode 作为架构守卫。\n', bold: true }),
          new TextRun({ text: 'noUnusedLocals 和 noUnusedParameters 在编译期阻止了范式泄漏——如果 core/ 中的函数试图 import useState，编译器会报错。这相当于用类型系统强制执行架构边界。' }),
        ],
        spacing: { after: 300 },
      }),

      new Paragraph({ text: '', pageBreakBefore: true }),

      // ===== 四、典型问题三 =====
      new Paragraph({ text: '四、典型问题三：Git 分层历史的工程化重建', heading: HeadingLevel.HEADING_1, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'd4a06a' } }, spacing: { after: 200 } }),

      new Paragraph({ text: '4.1 问题描述', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
      new Paragraph({
        text: '用户要求 Git 提交历史"呈现出清晰的层级（如 docs/schema → ui-components → tests → feat: logic）"。但实际开发过程中，代码是随着用户反馈逐步演进的——先有完整的功能，后有文档、测试和 Git 整理。原始的 6 个 commit 是扁平的功能堆叠，没有分层。\n\nAI 需要将已经存在的 74 个源文件，按"先写文档、再建模型、再搭组件、最后测试"的逻辑顺序，重新编排为 15 个分层 commit——同时确保每次 commit 后项目仍然可以编译运行（这在实际中并不可行，因为早期 commit 缺少依赖）。',
        spacing: { after: 200 },
      }),

      new Paragraph({ text: '4.2 问题根因', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
      new Paragraph({
        children: [
          new TextRun({ text: '根因一：开发顺序 ≠ 提交顺序。', bold: true }),
          new TextRun({ text: '真实的开发是探索性的——组件和样式经常同时修改，筛选逻辑和 UI 同步调整。但 Git 历史需要呈现一种"教科书式"的线性演进，这对于 AI 协同开发来说尤其具有挑战性：AI 在几小时内产出了人类团队几周的工作量，没有自然的"等待编译→等待 review→等待合并"节奏。\n\n' }),
          new TextRun({ text: '根因二：git checkout --orphan 的 HEAD 状态陷阱。', bold: true }),
          new TextRun({ text: '在使用 git checkout --orphan 创建全新分支后，HEAD 处于 unborn 状态。此时 git reset HEAD~1 会失败（fatal: ambiguous argument），git revert 也无法使用。AI 尝试了 git update-ref -d HEAD 和 git reset --soft 均报错后，最终采用 rm -rf .git + git init 的全量重建方案。\n\n' }),
          new TextRun({ text: '根因三：git add 的意外全量暂存。', bold: true }),
          new TextRun({ text: '第一次尝试分层提交时，git add docs/ README.md 本应只添加 7 个文档文件，但因 orphan 分支的前置状态导致 84 个文件被一并暂存。AI 需要通过 rm -rf .git 完全重置后，仔细按路径逐批 git add，确保每个 commit 只包含目标层的文件。' }),
        ],
        spacing: { after: 200 },
      }),

      new Paragraph({ text: '4.3 解决路径', heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }),
      new Paragraph({
        children: [
          new TextRun({ text: '路径一：完全重建策略。\n', bold: true }),
          new TextRun({ text: '放弃在原分支上 git rebase -i（可能引入冲突且历史不可靠），采用 git checkout --orphan + 逐层 git add <精确路径> 的方式，从零构建 15 个 commit。git branch backup-main 保留了原始历史作为安全网。\n\n' }),
          new TextRun({ text: '路径二：以文档为第一层的提交逻辑。\n', bold: true }),
          new TextRun({ text: '提交顺序并非按"编译依赖"排列（如果按编译依赖，chore 脚手架必须在最前面），而是按"人的理解路径"排列：先读文档理解项目 → 再看数据模型 → 再看样式和组件 → 再看功能逻辑 → 最后看测试。这保证了任何一个新加入的开发者，按 commit 顺序阅读都能逐层理解项目。\n\n' }),
          new TextRun({ text: '最终形成的 15 层 commit 顺序：\n', bold: true }),
          new TextRun({ text: 'docs → chore → schema → core → styles → ui-components → state → feat×6 → tests → chore\n\n', font: 'Consolas', size: 20 }),
          new TextRun({ text: '路径三：commit message 规范化。\n', bold: true }),
          new TextRun({ text: '每个 commit message 遵循 <type>: <description> 格式，type 精确反映所属层：docs（文档）、schema（数据模型）、core（领域逻辑）、styles（样式）、ui-components（共享组件）、state（状态管理）、feat（功能模块）、tests（测试）、chore（工程配置）。' }),
        ],
        spacing: { after: 300 },
      }),

      // ===== 结尾 =====
      new Paragraph({ text: '', pageBreakBefore: true }),
      new Paragraph({ text: '总结：AI 协同开发的核心经验', heading: HeadingLevel.HEADING_1, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: '8ce0a0' } }, spacing: { after: 200 } }),

      new Paragraph({ text: '1. Human-in-the-Loop 不是口号，是架构。', bold: true, spacing: { after: 60 } }),
      new Paragraph({ text: 'brainstorming → writing-plans → subagent-driven-development 的三段式流程，确保了人在每个关键节点都有决策权。AI 负责"怎么做"，人负责"做什么"和"好不好"。', spacing: { after: 150 } }),

      new Paragraph({ text: '2. 分层架构不是过度工程，是迭代保护。', bold: true, spacing: { after: 60 } }),
      new Paragraph({ text: '四层范式隔离（core / features / state / lib）让视觉方案的 4 次大调整只波及 features/ 层。如果没有这种隔离，每次"推倒重来"的成本会成倍增加。', spacing: { after: 150 } }),

      new Paragraph({ text: '3. Git 历史是工程质量的一部分。', bold: true, spacing: { after: 60 } }),
      new Paragraph({ text: '15 个分层 commit 不仅是"好看"，更是后来的开发者理解项目的导航图。docs → schema → core → styles → ui-components → state → feat → tests 的顺序，就是项目的"阅读路径"。', spacing: { after: 150 } }),

      new Paragraph({ text: '4. AI 的"试错速度"是核心竞争力。', bold: true, spacing: { after: 60 } }),
      new Paragraph({ text: '人类团队可能需要数天来尝试 4 种视觉方案并做 A/B 测试，AI 在数小时内完成了从 MasonryLayout → HoneycombGrid → FlowCarousel 的全量切换。关键是人类需要给出清晰的反馈信号（"太冗杂""要更灵动""全屏流动"），AI 才能精准收敛。', spacing: { after: 150 } }),

      new Paragraph({ text: '5. 测试不是事后补的，是架构的锚点。', bold: true, spacing: { after: 60 } }),
      new Paragraph({ text: 'core/ 层的 19 个测试覆盖了所有纯函数的边界情况。这些测试不仅验证了正确性，更作为"架构锚点"——如果未来的开发者修改了 filterTravels 的行为，测试会立即失败，迫使他们思考和确认。', spacing: { after: 200 } }),

      new Paragraph({ text: '— 文档结束 —', alignment: AlignmentType.CENTER, spacing: { before: 400 } }),
    ],
  }],
})

const outPath = path.join(__dirname, '..', 'AI协同开发流程与典型问题解决路径.docx')
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer)
  console.log(`✅ 生成成功：${outPath}`)
  console.log(`   包含：开发流程全景 + 3 个典型问题（视觉迭代/架构落地/Git重建）`)
})
