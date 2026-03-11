## 自建后端（Node + Express + Nodemailer + QQ SMTP）

目标：网页“联系表单”提交后，通过你自己的后端，用 QQ 邮箱 SMTP 把内容发到 `zhengyun_0629@qq.com`。

### 1. 开启 QQ 邮箱 SMTP 并获取授权码

1. 登录 QQ 邮箱网页版
2. 进入设置/账户相关页面，开启 SMTP（通常在 POP3/IMAP/SMTP 服务里）
3. 生成“授权码”（后端登录 SMTP 用它，不用 QQ 登录密码）

### 2. 安装后端依赖

后端代码在 `web-resume/contact-server/`：

```
cd contact-server
npm i
```

### 3. 配置后端环境变量

复制示例文件并填写（不要提交到仓库）：

```
copy .env.example .env
```

编辑 `contact-server/.env`：

```
PORT=3001
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=zhengyun_0629@qq.com
SMTP_PASS=你的QQ邮箱授权码
CONTACT_TO=zhengyun_0629@qq.com
CONTACT_FROM=网站联系表单 <zhengyun_0629@qq.com>
ALLOWED_ORIGINS=http://localhost:5173
```

说明：
- `ALLOWED_ORIGINS` 逗号分隔，可同时填本地与线上域名
- `CONTACT_FROM` 如果 QQ SMTP 不允许自定义发件人，可直接填 `zhengyun_0629@qq.com`
- `SMTP_PASS` 请填 QQ 邮箱生成的“授权码”，不要把授权码发送给任何人或提交到仓库

### 4. 启动后端服务

```
npm run dev
```

默认接口：
- 健康检查：`GET http://localhost:3001/health`
- 提交接口：`POST http://localhost:3001/api/contact`

### 5. 配置前端提交地址并联调

在 `web-resume/.env.local` 写入：

```
VITE_CONTACT_ENDPOINT=http://localhost:3001/api/contact
```

然后重启前端：

```
npm run dev
```

提交表单后：
- 后端收到请求 → 通过 QQ SMTP 发邮件 → 你在 `zhengyun_0629@qq.com` 收到

### 6. 上线部署建议

1. 把后端部署到一台有公网的服务器（或云函数/容器），并配置 HTTPS（Nginx/Caddy 反代）
2. 前端把 `VITE_CONTACT_ENDPOINT` 改为线上地址，例如：
   - `https://api.your-domain.com/api/contact`
3. 后端的 `ALLOWED_ORIGINS` 加上你的线上站点域名，例如：
   - `https://your-domain.com`

### 7. 常见问题

- 收不到邮件：先检查 QQ 邮箱 SMTP 是否开启、授权码是否正确、垃圾箱/订阅邮件是否拦截
- 频繁失败：QQ SMTP 可能触发风控/限流，建议降低提交频率或换企业邮箱 SMTP/邮件 API 服务
- 跨域报错：确认后端 `ALLOWED_ORIGINS` 包含你的前端域名（含协议与端口）
