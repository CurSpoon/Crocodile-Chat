# 鳄鱼聊天室（Crocodile Chat）

## 项目简介

**鳄鱼聊天室**是一个简单有趣的在线聊天客户端。用户可以在这里畅所欲言！该应用采用基础的 HTML、CSS 和 JavaScript 技术，具备用户登录、消息收发、聊天记录滚动加载等功能。此外，它还支持管理员权限操作，允许删除所有聊天记录。

## 界面预览

### PC 端

<img src="https://i.pstorage.space/i/dbPAXV4xN/original_image.png" alt="image" width="50%" />

### 安卓端

<img src="https://i.pstorage.space/i/OD0ZxwYzO/original_image_1.png" alt="image" width="20%" />

## 功能特性

1. **实时聊天功能**：用户可即时输入并发送消息给其他聊天参与者，聊天记录实时更新。
2. **用户身份管理**：用户首次访问时输入用户名，系统将其保存在浏览器中。下次访问时自动恢复身份。不同用户的聊天内容以不同颜色显示。
3. **自适应布局**：为桌面、平板和手机等不同设备提供优化的响应式布局。
4. **管理员权限**：管理员可通过密码验证删除所有聊天记录。（默认密码为：`admin12345`，在 `chat-worker.js` 第 52 行设置）

## 使用说明

### D1 数据库配置

1. 在 Cloudflare 面板中选择"Workers 和 Pages"选项
2. 选择"D1 SQL 数据库"
3. 创建数据库，输入名称 `chat-db`（可根据需要自定义）
4. 在控制台中输入 `chat-db.sql` 文件的代码并执行，完成数据库创建

### Workers 配置

1. 在 Cloudflare 面板中选择"Workers 和 Pages"选项
2. 选择"概述"
3. 创建 Worker，输入名称 chat-worker（可自定义），并保存 Worker 链接
   
   <img src="https://i.pstorage.space/i/3dv29X7g6/original_image_2.png" alt="image" width="50%" />
    
5. 部署 Worker
6. 编辑代码，输入 `chat-worker.js` 文件中的代码，点击部署，并保存预览链接
7. 返回"Workers 和 Pages"选项的概述界面
8. 选择刚创建的 Worker
9. 依次选择：设置 → 绑定 → 添加 → D1 数据库，将变量名设为 `DB`，选择刚才创建的数据库

### HTML 配置

1. 打开 HTML 源代码
2. 在第 131 行，将 `const API_URL = "[https://xxxxxxxxxxxxxxx](https://xxxxxxxxxxxxxxx/)";` 中的链接替换为 Worker 链接（注意：链接末尾不要加 `/`）
3. 直接用浏览器打开 HTML 文件即可运行

## 未来改进方向

- 支持自定义用户头像
- 增加表情符号、文件发送等功能
- 支持私聊和分组聊天
- 提供消息加密传输功能

## 许可证

本项目采用 MIT 许可证，欢迎自由使用和修改。
