import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactHandler from './api/contact.js';
import { createChatRouter } from './api/chat.js';

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 配置 CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));

// 解析 JSON 请求体
app.use(express.json());

// 处理 API 路由
app.post('/api/contact', contactHandler);

// 使用聊天路由
const chatRouter = createChatRouter();
app.use('/api', chatRouter);

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
