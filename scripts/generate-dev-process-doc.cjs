/**
 * 精简版：AI协同开发流程与典型问题解决路径（1-1.5页，保留全部理解内容）
 */
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ShadingType, Table, TableRow, TableCell, WidthType } = require('docx')
const fs = require('fs'), path = require('path')

const doc = new Document({
  styles: { default: { document: { run: { font: 'Microsoft YaHei', size: 19 } } } },
  sections: [{
    properties: { page: { margin: { top: 600, bottom: 600, left: 700, right: 700 } } },
    children: [

      // ===== 标题 =====
      new Paragraph({ text: 'AI 协同开发流程与典型问题解决路径', heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: '飞猪「100种不可思议旅行」· 多范式融合架构 · 2026-06-09', size: 18, color: '888888' })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),

      // ===== 一、开发流程 =====
      new Paragraph({ text: '一、开发流程', heading: HeadingLevel.HEADING_2, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '2a5a9e' } }, spacing: { after: 80 } }),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [
            new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: '阶段', bold: true, size: 17 })] })], shading: { type: ShadingType.SOLID, color: '1a1a2e', fill: '1a1a2e' } }),
            new TableCell({ width: { size: 16, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: '范式', bold: true, size: 17 })] })], shading: { type: ShadingType.SOLID, color: '1a1a2e', fill: '1a1a2e' } }),
            new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'AI 角色', bold: true, size: 17 })] })], shading: { type: ShadingType.SOLID, color: '1a1a2e', fill: '1a1a2e' } }),
            new TableCell({ width: { size: 48, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: '关键产出', bold: true, size: 17 })] })], shading: { type: ShadingType.SOLID, color: '1a1a2e', fill: '1a1a2e' } }),
          ] }),
          ...[
            ['Brainstorming', '创意收敛', '引导者：逐一提问', 'Spec Doc（PRD + 用户画像 + 功能范围）'],
            ['SDD-1 数据建模', '规格驱动', '架构师：实体+契约', 'Travel ADT、Filter 谓词、ITravelDataSource 接口'],
            ['SDD-2 组件生成', 'Compound', '工匠：组件族实现', 'TravelCard 族、FilterBar、FlowCarousel 等 7 模块'],
            ['TDD', '测试驱动', '质检员：先测后写', '19 个单元测试（3 suite, vitest）'],
            ['E2E 质量闭环', '五维验证', '审核员：全覆盖检查', '文档+数据+测试+构建+Git 历史'],
          ].map(([a, b, c, d]) => new TableRow({ children: [
            new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: a, bold: true, size: 17 })] })] }),
            new TableCell({ width: { size: 16, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: b, size: 17 })] })] }),
            new TableCell({ width: { size: 22, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: c, size: 17 })] })] }),
            new TableCell({ width: { size: 48, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: d, size: 17 })] })] }),
          ] })),
        ],
      }),

      new Paragraph({ text: '协同模式：人类负责方向设定→方案审核→视觉反馈→功能追加→质量验收；AI 负责需求澄清→架构设计→代码生成→测试编写→文档生成→历史重建。"严禁一键生成"原则确保关键节点必须等待人类反馈。', size: 18, spacing: { before: 80, after: 120 } }),

      // ===== 二、典型问题一 =====
      new Paragraph({ text: '二、问题一：视觉方案的迭代式收敛', heading: HeadingLevel.HEADING_2, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'e94560' } }, spacing: { after: 80 } }),
      new Paragraph({ children: [new TextRun({ text: '现象：', bold: true }), new TextRun({ text: '项目经历 4 次视觉大调整（瀑布流 → 六边形蜂窝 → 有机 blob → BanG Dream 水平轮播）。每次 AI 的初始方案都被反馈"不够灵动"，最终通过逆向分析 bang-dream.com 的 Embla carousel 设计才收敛。', size: 18 })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: '根因：', bold: true }), new TextRun({ text: '视觉偏好是动态形成的——用户在看到第一个方案后才意识到"这不是我想要的"。参考网站返回 404 + JS 渲染内容，AI 需从 minified CSS 中逆向提取设计模式。', size: 18 })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: '解决：', bold: true }), new TextRun({ text: '① 分层架构确保每次调整只触及 features/travel-grid/ 布局容器，core/ 和 state/ 零改动 ② CSS-only 动画（@keyframes + GPU 合成层），不依赖 JS，可在 DevTools 中独立调试 ③ 旧布局文件保留在代码库中（MasonryLayout/HoneycombGrid/FlowCarousel），支持随时回退或 A/B 测试。', size: 18 })], spacing: { after: 120 } }),

      // ===== 三、典型问题二 =====
      new Paragraph({ text: '三、问题二：多范式架构的"代码归属"难题', heading: HeadingLevel.HEADING_2, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '7ab8e0' } }, spacing: { after: 80 } }),
      new Paragraph({ children: [new TextRun({ text: '现象：', bold: true }), new TextRun({ text: '用户要求"多范式融合"，但具体到每个文件应该放在 core/、state/ 还是 features/，边界模糊。filterTravels 是纯函数还是 store 逻辑？MoodTag 是共享组件还是业务组件？', size: 18 })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: '解决：', bold: true }), new TextRun({ text: '以"副作用"为判据的分界法——有副作用（setState、localStorage）→ state/features；无副作用（纯计算/数据转换）→ core。filterTravels 无副作用 → core/transforms；useAppStore 有 set() → state/store。这个原则被 TypeScript strict mode 在编译期强制执行（core/ 中的文件 import useState 会报错）。端口-适配器模式（ITravelDataSource）预留了 API 替换空间——未来换飞猪 API 只需新增适配器，三层代码零修改。', size: 18 })], spacing: { after: 120 } }),

      // ===== 四、典型问题三 =====
      new Paragraph({ text: '四、问题三：Git 分层历史的工程化重建', heading: HeadingLevel.HEADING_2, border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'd4a06a' } }, spacing: { after: 80 } }),
      new Paragraph({ children: [new TextRun({ text: '现象：', bold: true }), new TextRun({ text: '真实的 AI 协同开发是探索性的，6 个扁平 commit 无法呈现"docs → schema → core → styles → ui-components → state → feat → tests"的分层演进。git checkout --orphan 后 HEAD 处于 unborn 状态，git add 意外全量暂存。', size: 18 })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: '解决：', bold: true }), new TextRun({ text: 'rm -rf .git + git init 完全重建后，按 15 层逐批 git add <精确路径> + commit。提交顺序按"人的理解路径"而非"编译依赖"排列——新开发者按 commit 顺序阅读即可逐层理解项目。每个 commit message 严格遵循 <type>: <description> 格式。', size: 18 })], spacing: { after: 160 } }),

      // ===== 五、核心经验（全部保留） =====
      new Paragraph({ text: '五、AI 协同开发的核心经验', heading: HeadingLevel.HEADING_1, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: '8ce0a0' } }, spacing: { before: 80, after: 120 } }),

      new Paragraph({ children: [new TextRun({ text: '1. Human-in-the-Loop 不是口号，是架构。', bold: true }), new TextRun({ text: 'brainstorming → writing-plans → subagent-driven-development 三段式流程，确保人在每个关键节点有决策权。AI 负责"怎么做"，人负责"做什么"和"好不好"。' })], spacing: { after: 80 } }),
      new Paragraph({ children: [new TextRun({ text: '2. 分层架构不是过度工程，是迭代保护。', bold: true }), new TextRun({ text: '四层范式隔离让 4 次视觉大调整只波及 features/ 层。如果没有这种隔离，每次"推倒重来"的成本会成倍增加。' })], spacing: { after: 80 } }),
      new Paragraph({ children: [new TextRun({ text: '3. Git 历史是工程质量的一部分。', bold: true }), new TextRun({ text: '15 个分层 commit 不仅是"好看"，更是后来开发者理解项目的导航图。提交顺序就是项目的"阅读路径"。' })], spacing: { after: 80 } }),
      new Paragraph({ children: [new TextRun({ text: '4. AI 的"试错速度"是核心竞争力。', bold: true }), new TextRun({ text: '人类团队可能需要数天尝试 4 种视觉方案，AI 在数小时内完成全量切换。关键是人类给出清晰的反馈信号（"太冗杂""要更灵动""全屏流动"），AI 才能精准收敛。' })], spacing: { after: 80 } }),
      new Paragraph({ children: [new TextRun({ text: '5. 测试不是事后补的，是架构的锚点。', bold: true }), new TextRun({ text: 'core/ 层的 19 个测试覆盖所有纯函数的边界情况。它们不仅验证正确性，更作为"架构锚点"——修改 filterTravels 行为时测试立即失败，迫使开发者思考确认。' })], spacing: { after: 80 } }),

      new Paragraph({ text: '— 文档结束 —', alignment: AlignmentType.CENTER, spacing: { before: 160 } }),
    ],
  }],
})

const outPath = path.join(__dirname, '..', 'AI协同开发流程与典型问题解决路径_精简版.docx')
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf)
  console.log('✅ 精简版已生成（1-1.5页，理解内容全部保留）')
})
