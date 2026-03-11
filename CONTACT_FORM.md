## 联系表单接入（Formspree）

目标：访客在网页提交“联系表单”后，Formspree 将内容转发到你的邮箱：`zhengyun_0629@qq.com`。

如果你想改成自建后端（Node + SMTP）方式，可参考：[SMTP_CONTACT_SERVER.md](file:///d:/个人网站（简历版）/web-resume/SMTP_CONTACT_SERVER.md)

如果你计划部署到 Vercel，推荐使用 Vercel Serverless + Resend（无需常驻后端）：[VERCEL_RESEND_CONTACT.md](file:///d:/个人网站（简历版）/web-resume/VERCEL_RESEND_CONTACT.md)

### 1. 创建表单

1. 打开 https://formspree.io/
2. 登录后创建一个 Form
3. 在表单设置里确认收件邮箱为 `zhengyun_0629@qq.com`（通常会要求验证邮箱）
4. 拿到表单 Endpoint（类似 `https://formspree.io/f/xxxxxx`）

### 2. 配置环境变量

在项目根目录（`web-resume/`）创建 `.env.local`：

```
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxx
```

注意：
- 不要把 `.env.local` 提交到仓库
- 只需要替换成你自己的 endpoint（不要保留 `xxxxxx` 或 `yourFormId`）

### 3. 本地验证

启动开发服务后填写表单并提交：

```
npm run dev
```

如果没配置 endpoint，页面会提示“未配置表单服务，暂时无法提交”并禁用提交按钮。

### 4. 上线验证（重要）

部署到线上后，Formspree 可能会基于来源域名做风控。建议在 Formspree 后台把你的网站域名添加到允许来源/集成配置里，然后再做一次线上提交测试。
