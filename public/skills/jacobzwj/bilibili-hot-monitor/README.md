# B站热门视频监控 Skill

自动获取B站热门视频，使用字幕+LLM生成AI总结，生成包含数据分析的日报，支持邮件发送。

## 📦 版本历史

### v1.0.11 (2025-02-05)

**重大更新：改用字幕+LLM方案替代B站官方AI总结API**

- ✨ **新功能**
  - 使用视频字幕 + OpenRouter LLM 生成 AI 视频总结
  - 支持多种 LLM 模型：Claude、Gemini、GPT、DeepSeek
  - 实时进度条显示，用户可看到处理进度
  - 预估耗时提示

- 🔧 **优化**
  - 禁用所有模型的 thinking/reasoning 模式，避免输出被截断
  - 添加网络重试机制（最多3次），提高稳定性
  - 优化 JSON 解析，增加 fallback 提取逻辑
  - 改进 SKILL.md 中的 Cookie 获取说明（使用 Network 选项卡方法）

- 🐛 **修复**
  - 修复字幕获取兼容性问题
  - 修复 URL 链接被括号破坏的问题

### v1.0.10

- 初始版本，使用 B站官方 AI 总结 API

## ✨ 功能特点

- 📊 获取B站热门视频Top 10/20/30
- 🤖 字幕提取 + LLM 生成 AI 视频总结
- 📝 自动生成结构化Markdown报告
- 💡 支持 OpenRouter AI 智能点评（Claude/Gemini/GPT/DeepSeek）
- 📧 HTML邮件发送（支持多收件人）
- 🎨 精美的邮件排版（蓝色主题）

## 🚀 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 创建配置文件

复制示例配置并填写：

```bash
cp bilibili-monitor.example.json bilibili-monitor.json
```

编辑 `bilibili-monitor.json`：

```json
{
  "bilibili": {
    "cookies": "你的完整B站cookies字符串"
  },
  "ai": {
    "openrouter_key": "你的OpenRouter API Key（可选）",
    "model": "google/gemini-3-flash-preview"
  },
  "email": {
    "smtp_email": "your-email@gmail.com",
    "smtp_password": "xxxx xxxx xxxx xxxx",
    "recipients": ["recipient@example.com"]
  },
  "report": {
    "num_videos": 10
  }
}
```

### 3. 获取B站Cookies

1. 登录 [bilibili.com](https://www.bilibili.com)
2. 按 `F12` → `Application` → `Cookies`
3. 全选复制所有cookies

### 4. 生成报告并发送邮件

```bash
# 生成报告
python generate_report.py --config bilibili-monitor.json --output report.md

# 发送邮件
python send_email.py --config bilibili-monitor.json --body-file report.md --html
```

## 📋 报告内容

生成的报告包含：

```
📋 本期热门视频（摘要表格）
├── 排名、标题、播放量、亮点、链接

🌟 本期亮点
├── 播放量冠军
├── 点赞数冠军
├── 硬币数冠军
└── 分享数冠军

📹 详细报告（每个视频）
├── 基本信息（UP主、时长、发布时间）
├── 📊 数据统计
├── 📝 视频简介
├── 🤖 AI视频总结 + 内容大纲（LLM生成）
├── 💡 AI点评
├── 📈 运营爆款分析
└── 🔗 视频链接
```

## 🤖 作为AI Skill使用

本项目可作为 OpenClaw 等 AI Agent 的 Skill 使用。

触发词：
- "B站热门"
- "bilibili日报"
- "视频日报"
- "热门视频"

## 📁 文件结构

```
bilibili-monitor/
├── SKILL.md                    # AI Skill 说明文件
├── README.md                   # 本文件
├── requirements.txt            # Python 依赖
├── generate_report.py          # 报告生成脚本
├── send_email.py               # 邮件发送脚本
├── bilibili-monitor.example.json  # 配置文件示例
└── example_report.md           # 报告示例
```

## ⚙️ 配置说明

### OpenRouter 模型选择

| 模型 | model 值 | 特点 |
|------|---------|------|
| Gemini | google/gemini-3-flash-preview | 便宜快速，推荐 |
| Claude | anthropic/claude-sonnet-4.5 | 高质量 |
| GPT | openai/gpt-5.2-chat | OpenAI |
| DeepSeek | deepseek/deepseek-chat-v3-0324 | 性价比 |

### Gmail配置

需要使用应用专用密码（非登录密码）：
1. 访问 https://myaccount.google.com/apppasswords
2. 生成16位应用密码

## ⚠️ 注意事项

1. **Cookie有效期**：SESSDATA 约 1-3 个月，过期需重新获取
2. **API频率限制**：请求间隔建议 >= 1 秒
3. **字幕可用性**：部分视频可能无字幕，会跳过 AI 总结生成

## 📄 License

MIT License
