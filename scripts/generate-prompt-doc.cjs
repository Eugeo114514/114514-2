/**
 * scripts/generate-prompt-doc.cjs
 * 生成《核心 Prompt 记录文档》Word 文件
 * 运行：node scripts/generate-prompt-doc.cjs
 * 输出：核心Prompt记录文档.docx
 */

const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx')
const fs = require('fs')
const path = require('path')

// ============ 文档内容定义 ============

const PROMPT_RECORDS = [
  {
    phase: '【SDD阶段】数据建模与API契约生成',
    paradigm: 'Specification-Driven Development — 规格驱动开发',
    date: '2026-06-08',
    prompts: [
      {
        role: '用户',
        content: `#产品背景："飞猪旅行"推出的"100种不可思议旅行"子品牌
#用户画像：-95后至00后Z世代-追求小众且喜欢反常规生活方式的追求者-视觉内容消费者
#用户需求：-追求个性表达，想寻找能凸显个性的独特旅行方式-拒绝千篇一律，想发现有深度、有意义的旅行体验-注重审美表达，想获得视觉体验
#背景现状-同质化严重-发现效率低-情绪共鸣缺失-筛选维度单一
#任务目标：为追求个性化、差异化旅行方式的用户提供灵感与发现渠道。
#输出要求-必须使用**Superpowers**插件-使用多范式融合的工程化架构模式来构建此项目-内容需要我的审核-严禁一键生成`,
        aiResponse: `AI 首先调用 brainstorming 技能进行需求澄清，随后定义了数据模型：

1. Travel 实体（ADT 代数数据类型）：TravelCategory（5种）、MoodTag（10种情绪标签）、Budget（三档）
2. Travel 接口：id, title, subtitle, unbelievableIndex, indexBreakdown, primaryMood, secondaryMood, heroImage, cardImage, colorPalette, narrative, destination, duration, bestSeason, budget
3. Filter 谓词系统：FilterState（categories[], mood, budget, unbelievableIndexMin）、Predicate<T> 泛型、组合子模式（and/or）
4. ITravelDataSource 接口：getAll()、getById(id) — 端口-适配器模式预留 API 替换空间`,
        intent: '意图：通过 brainstorming 渐进式澄清需求，而非一步到位生成代码。将用户"反常规旅行"的模糊需求收敛为 5 类 x 10 情绪的领域模型，用 ADT 确保类型安全。',
        challenge: '挑战：用户同时要求"极简"和"生产级质感"，容易陷入过度工程。通过 questioning 将 MVP 范围锁定在 C 级（浏览+详情），排除了用户系统、收藏、后端等 7 项。',
        correction: '引导修正：AI 提议三种架构方案（传统分层/FSD/多范式融合），用户选择方案 C 后，AI 将架构进一步细化为 core/features/state/shared/lib 五层，明确每层对应的编程范式。',
      },
    ],
  },
  {
    phase: '【SDD阶段】前端组件与页面生成',
    paradigm: 'Specification-Driven Development — Compound Components 组合模式',
    date: '2026-06-08',
    prompts: [
      {
        role: '用户',
        content: `视觉效果过于冗杂，可以换成蜂窝式呈现
可以参考网页：http://bang-dream.com/来设计
要求内容可全屏幕流动
1.可以增加一个投稿栏方便用户补充小众景点
2.增加点赞评论功能，增加互动性
3.隐藏分类筛选栏，光标移动到对应区域再可视化`,
        aiResponse: `AI 经历了三次重大视觉迭代：

1. 瀑布流 (MasonryLayout) → 蜂窝六边形 (HoneycombGrid, clip-path: polygon 50% 0% 100% 25%)
   → 有机 blob 流动卡片 (CSS @keyframes blobMorph + driftWave + float)

2. BanG Dream 风格水平轮播 (FlowCarousel)：Embla 式 scroll-snap，左右箭头 + 边缘渐变消隐，页面 opacity 淡入入场

3. 全屏流动：cards 在 100vw×100vh 画布上沿 5 种漂移路径持续移动，hover 暂停动画浮到最上层

4. 交互层：Starfield 60粒子系统、AmbientAudio 五声音阶、ContributeModal 投稿弹窗、LikeButton + CommentSection localStorage 持久化、FilterBar 光标顶部 60px 区域感应显隐`,
        intent: '意图：视觉风格经历了"瀑布流→六边形→有机 blob→全屏轮播流动"四次迭代，每次迭代都在上一次的基础上保留核心动画机制（blob morph + drift），仅改变布局容器。',
        challenge: '挑战：BanG Dream 网站无法直接访问（404），AI 通过 curl + User-Agent 成功获取页面源码，分析出 Embla carousel、Montserrat 字体、body opacity fade-in 等核心设计元素，精准复刻而非盲目模仿。',
        correction: '引导修正：用户反馈"视觉效果过于冗杂"后，AI 从静态蜂窝网格转向水平流动轮播；"全屏幕流动"指令后，AI 将页面改为 position:fixed + overflow:hidden 的无滚动全屏画布模式。',
      },
    ],
  },
  {
    phase: '【TDD阶段】核心逻辑的测试用例编写与业务实现',
    paradigm: 'Test-Driven Development — 测试驱动开发',
    date: '2026-06-08',
    prompts: [
      {
        role: '用户',
        content: `分类筛选支持多选
确保文件夹里有完整项目源码：GitHub/Gitee链接。包含：代码、数据库初始化脚本、至少5条高质量样例数据、开发文档（如PRD他，ER图等等，均要求使用md格式，mermaid图）\api文档、测试代码、README(包含运行指南、技术选型说明、后台账号）。Git Commit的演进历史必须呈现出清晰的层级`,
        aiResponse: `AI 将单选的 FilterState.category 改为多选的 FilterState.categories[]，同步修改：

1. Filter.ts: category: TravelCategory | 'all' → categories: TravelCategory[] （空数组 = 全部）
2. filterTravels.ts: byCategory 谓词从 === 比较改为 includes() 匹配
3. FilterBar.tsx: 单选 radio → 多选 toggle pills（aria-pressed）
4. DEFAULT_FILTER 和 resetFilter 同步更新

随后编写 19 个单元测试（vitest），覆盖 3 个纯函数模块：
- filterTravels.test.ts (11 tests): 单选/多选/组合筛选/空结果/不可变性/排序
- sortByIndex.test.ts (5 tests): 降序/不变性/空数组/单元素/相同索引
- groupByCategory.test.ts (3 tests): 分组/空输入/5类key完整性`,
        intent: '意图：将 TDD 严格应用于 core/ 领域的纯函数——先写测试描述预期行为，再确保实现通过。filterTravels 的 11 个测试覆盖了所有谓词组合子（and/compose）的边界情况。',
        challenge: '挑战：筛选从单选变为多选时，需确保上下游同步：FilterState 类型 → filterTravels 谓词 → FilterBar UI → store.resetFilter，4 处改动缺一不可，TypeScript strict mode 帮助在编译期捕获了遗漏的引用。',
        correction: '引导修正：用户要求"清晰的 Git 层级"后，AI 使用 git checkout --orphan 重建了 15 个分层 commit（docs → chore → schema → core → styles → ui-components → state → feat×6 → tests → chore），确保提交历史可追溯。',
      },
    ],
  },
  {
    phase: '【E2E阶段】系统级端到端测试与质量闭环',
    paradigm: 'End-to-End Verification — 端到端质量验证',
    date: '2026-06-08',
    prompts: [
      {
        role: '用户',
        content: `下一步
都需要（A:粒子系统 B:详情页增强 C:动效打磨 D:响应式适配）
确保文件夹里有完整项目源码...包含：代码、数据库初始化脚本、至少5条高质量样例数据、开发文档...测试代码、README...Git Commit的演进历史必须呈现出清晰的层级`,
        aiResponse: `AI 执行了系统级质量闭环：

1. 构建验证：npm run build（TypeScript strict + Vite bundle）102 modules，CSS 30KB / JS 230KB gzipped
2. 测试验证：npm test — 3 test files, 19 tests passed, 290ms
3. 文档完整性：PRD.md（用户画像 mermaid pie + 用户旅程 journey）、ER-Diagram.md（实体关系图 erDiagram）、Architecture.md（组件树 graph TD + 数据流 sequenceDiagram）、API.md（接口规范 + Filter 谓词系统）
4. 数据质量：scripts/init-data.cjs 生成 50 条手工精选数据（30 条人文/7 冒险/5 治愈/4 极限/4 秘境），每条的 title 和 destination 均为真实地名
5. Git 历史：15 个分层 commit，清晰展示 docs → schema → core → styles → ui-components → state → feat → tests 的演进路径`,
        intent: '意图：E2E 阶段不追求 Selenium/Playwright 等浏览器自动化，而是聚焦"文档-数据-测试-构建-历史"五维质量闭环——确保任何一个新加入的开发者都能从 README 出发，沿着 docs → schema → core → tests 的路径理解整个项目。',
        challenge: '挑战：重建 Git 历史时，git checkout --orphan 后 HEAD 处于 unborn 状态，无法使用 HEAD~1 回退。通过 git update-ref -d HEAD + rm -rf .git + git init 三板斧清理后，严格按路径分批 git add + commit，确保每个 commit 只包含单一层次的文件。',
        correction: '引导修正：用户要求"后台账号"时，AI 在 README 中诚实标注"本 MVP 为纯前端项目，无后台管理系统"，而非虚构不存在的功能。互动数据存储在 localStorage，后续接入飞猪 API 时仅需替换 adapter。',
      },
    ],
  },
  {
    phase: '【综合阶段】多范式融合架构的工程化落地',
    paradigm: 'Multi-Paradigm Fusion — 函数式+OOP+响应式+AOP 四范式协同',
    date: '2026-06-08',
    prompts: [
      {
        role: '用户',
        content: `#输出要求-必须使用**Superpowers**插件-使用多范式融合的工程化架构模式来构建此项目
#限制-严禁一键生成
1.100种并不是明确的100种，而是一个广泛大概的数量
2.视觉效果过于冗杂，可以换成蜂窝式呈现
3.可以添加一些灵动的纯音乐作为背景音乐（如钢琴曲等）
4.图片可以类似浪花、泡沫、雪花等方式流动呈现
5.分类筛选支持多选
6.人文景观大于自然景观，可以新增内容而不是拘泥于100种质感固定的数量`,
        aiResponse: `AI 在整个开发过程中持续贯彻多范式融合架构，最终落地为四层协同：

┌──────────────────────────────────────────────┐
│ core/ — 函数式编程 (FP)                       │
│ · Travel 实体 ADT（代数数据类型）              │
│ · Filter 谓词组合子 (and/or/byCategory)       │
│ · applyFilter 纯函数，零副作用，可测试         │
│ · ITravelDataSource 端口-适配器接口           │
├──────────────────────────────────────────────┤
│ features/ — OOP Compound Components          │
│ · TravelCard 组件族 (Context + 子组件)        │
│ · <TravelCard.Image /> <TravelCard.Mood />   │
│ · FilterBar.Dimension 泛型组件                │
│ · FlowCarousel 独立容器组件                   │
├──────────────────────────────────────────────┤
│ state/ — 响应式 Event-driven                 │
│ · Zustand store + derived selectors          │
│ · useFilteredTravels() 自动派生              │
│ · Social store: likes/comments localStorage   │
├──────────────────────────────────────────────┤
│ lib/ — AOP 横切关注点                         │
│ · ErrorBoundary 装饰器模式                    │
│ · analytics 埋点注入（不侵入业务代码）         │
│ · logger 统一日志（DEV 环境实时输出）          │
└──────────────────────────────────────────────┘`,
        intent: '意图：这个综合 Prompt 体现了用户对"非精确数量（100种是泛指）""视觉流动感（浪花泡沫雪花）""人文优先（>60%）""多选筛选""背景音乐"的完整产品愿景。AI 将这些需求映射到四个范式中：FP 处理数据变换、OOP 封装 UI 组件、响应式管理状态、AOP 处理横切关注点。',
        challenge: '挑战：用户多次在迭代中"推翻"之前的视觉方案（瀑布流→蜂窝→有机blob→水平轮播），每次都需要在不破坏底层数据模型和状态管理的前提下，仅替换 features/ 层的布局容器。这恰好验证了多范式分层架构的优势——每一层独立演进，互不污染。',
        correction: '引导修正：用户要求"严禁一键生成"和"内容需要我的审核"贯穿始终。AI 在 brainstorming 阶段逐一提问（技术栈/数据来源/功能范围/视觉风格），在设计阶段逐章节确认（架构/数据模型/组件树/视觉系统），在实现阶段按 Task 提交并等待反馈——而非一次性输出所有代码。',
      },
    ],
  },
]

// ============ 生成 Word 文档 ============

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Microsoft YaHei', size: 22 },
      },
    },
  },
  sections: [
    {
      children: [
        // 封面标题
        new Paragraph({
          text: '飞猪「100种不可思议旅行」',
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '核心 Prompt 记录文档',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '多范式融合工程化架构 · 四阶段开发范式记录', size: 26, color: '888888' }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: '项目：', bold: true }),
            new TextRun({ text: '飞猪旅行「100种不可思议旅行」内容展示 MVP' }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '架构：', bold: true }),
            new TextRun({ text: '多范式融合（FP + OOP Compound + Reactive + AOP）' }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '技术栈：', bold: true }),
            new TextRun({ text: 'React 18 + TypeScript 5.5 (strict) + Vite 5.4 + Zustand 4.5 + Vitest 4.1' }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '开发周期：', bold: true }),
            new TextRun({ text: '2026-06-08（单日全流程）' }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '范式阶段：', bold: true }),
            new TextRun({ text: 'SDD（规格驱动）→ SDD（组件生成）→ TDD（测试驱动）→ E2E（端到端验证）' }),
          ],
          spacing: { after: 400 },
        }),

        // 目录标题
        new Paragraph({
          text: '目录',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),
        ...PROMPT_RECORDS.map((rec, i) =>
          new Paragraph({
            children: [
              new TextRun({ text: `${i + 1}. ${rec.phase}`, bold: true }),
            ],
            spacing: { after: 60 },
          })
        ),

        // 分页
        new Paragraph({ text: '', pageBreakBefore: true }),

        // 每一段 Prompt 记录
        ...PROMPT_RECORDS.flatMap((record, recordIdx) => [
          // 阶段标题
          new Paragraph({
            text: record.phase,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '2a5a9e' } },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '开发范式：', bold: true, size: 22 }),
              new TextRun({ text: record.paradigm, italics: true, size: 22, color: '2a5a9e' }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '日期：', bold: true }),
              new TextRun({ text: record.date }),
            ],
            spacing: { after: 200 },
          }),

          // 每段 Prompt
          ...record.prompts.flatMap((prompt, promptIdx) => {
            // 截断过长的 prompt 用于显示
            const displayPrompt = prompt.content.length > 800
              ? prompt.content.slice(0, 800) + '…[后续内容省略]'
              : prompt.content

            return [
              // 原始 Prompt
              new Paragraph({
                children: [
                  new TextRun({ text: '━━━ 原始 Prompt ━━━', bold: true, size: 20, color: 'e94560' }),
                ],
                spacing: { before: 300, after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: displayPrompt,
                    size: 20,
                    font: 'Consolas',
                  }),
                ],
                spacing: { after: 100 },
                indent: { left: 400 },
                shading: { type: ShadingType.SOLID, color: '1a1a26', fill: '1a1a26' },
              }),

              // AI 回应
              new Paragraph({
                children: [
                  new TextRun({ text: '━━━ AI 实现概要 ━━━', bold: true, size: 20, color: '7ab8e0' }),
                ],
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: prompt.aiResponse,
                    size: 20,
                  }),
                ],
                spacing: { after: 100 },
                indent: { left: 400 },
              }),

              // 意图说明
              new Paragraph({
                children: [
                  new TextRun({ text: '💡 意图说明：', bold: true, size: 20, color: '8ce0a0' }),
                ],
                spacing: { before: 200, after: 60 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: prompt.intent, size: 20 }),
                ],
                spacing: { after: 100 },
                indent: { left: 200 },
              }),

              // 挑战说明
              new Paragraph({
                children: [
                  new TextRun({ text: '⚠ 遭遇的挑战：', bold: true, size: 20, color: 'f0a060' }),
                ],
                spacing: { before: 200, after: 60 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: prompt.challenge, size: 20 }),
                ],
                spacing: { after: 100 },
                indent: { left: 200 },
              }),

              // 引导修正
              new Paragraph({
                children: [
                  new TextRun({ text: '🔧 如何引导 AI 修正：', bold: true, size: 20, color: 'd4a06a' }),
                ],
                spacing: { before: 200, after: 60 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: prompt.correction, size: 20 }),
                ],
                spacing: { after: 200 },
                indent: { left: 200 },
              }),
            ]
          }),

          // 阶段之间加分页
          ...(recordIdx < PROMPT_RECORDS.length - 1
            ? [new Paragraph({ text: '', pageBreakBefore: true })]
            : []),
        ]),

        // 附录
        new Paragraph({ text: '', pageBreakBefore: true }),
        new Paragraph({
          text: '附录：项目文件清单',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '源文件：74 个 | 测试文件：3 个 | 测试用例：19 个 | 文档：5 个 MD | Git Commits：15 个' }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '范式覆盖：', bold: true }),
            new TextRun({ text: 'FP（core/domain + core/transforms）→ OOP Compound（features/）→ Reactive（state/）→ AOP（lib/）' }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'npm run dev', bold: true, font: 'Consolas' }),
            new TextRun({ text: '  — 启动开发服务器 → http://localhost:5173' }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'npm test', bold: true, font: 'Consolas' }),
            new TextRun({ text: '     — 运行 19 个单元测试（3 test files）' }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'npm run build', bold: true, font: 'Consolas' }),
            new TextRun({ text: ' — 生产构建（102 modules, ~72KB gzipped）' }),
          ],
          spacing: { after: 60 },
        }),
      ],
    },
  ],
})

// 输出
const outPath = path.join(__dirname, '..', '核心Prompt记录文档.docx')
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer)
  console.log(`✅ 生成成功：${outPath}`)
  console.log(`   包含 ${PROMPT_RECORDS.length} 个范式阶段`)
  console.log(`   涵盖 SDD → TDD → E2E 全流程`)
})
