## Vercel + Resend（无需常驻后端）联系表单部署

目标：把站点部署到 Vercel 后，访客提交“联系表单”，内容会发到 `zhengyun_0629@qq.com`。

### 1. Resend 准备工作

1. 在 Resend 创建 API Key
2. 验证一个你拥有的域名（Domains -> Add Domain -> 按提示加 DNS 记录）
3. 准备一个发件人地址（必须属于已验证域名），例如：
   - `网站联系表单 <no-reply@your-domain.com>`

### 2. 配置前端提交地址

本项目前端会读取 `VITE_CONTACT_ENDPOINT`（优先）或 `VITE_FORMSPREE_ENDPOINT` 作为提交地址。

部署到 Vercel 时，建议设置为同域 API：

```
VITE_CONTACT_ENDPOINT=/api/contact
```

### 3. 在 Vercel 配置环境变量

Vercel -> Project -> Settings -> Environment Variables 添加：

- `VITE_CONTACT_ENDPOINT`：`/api/contact`
- `RESEND_API_KEY`：Resend API Key
- `CONTACT_FROM`：如 `网站联系表单 <no-reply@your-domain.com>`
- `CONTACT_TO`：`zhengyun_0629@qq.com`
- `ALLOWED_ORIGINS`：可选，建议填你的线上域名（逗号分隔），例如：
  - `https://your-domain.vercel.app,https://your-domain.com`

### 4. 部署

1. 把代码推到 GitHub（不要提交任何 `.env` 文件与密钥）
2. 在 Vercel 导入该仓库
3. Framework 选择 Vite/Vue（Vercel 会自动识别）
4. 部署完成后打开线上站点提交表单测试

### 5. 常见问题

- 提交成功但收不到邮件：先检查 Resend Domain 是否 Verified、`CONTACT_FROM` 是否属于该域名、QQ 邮箱垃圾箱/订阅邮件
- 500：多半是 Vercel 环境变量没配齐（`RESEND_API_KEY/CONTACT_FROM/CONTACT_TO`）
- 502：Resend 返回非 2xx，通常是发件人域名未验证或 API Key 权限问题
