# 鳄鱼聊天室（Crocodile Chat）

## 项目简介

**鳄鱼聊天室**是一款简洁有趣的在线聊天客户端，让用户畅所欲言！该应用基于 HTML、CSS 和 JavaScript 技术，提供用户登录、实时消息收发、聊天记录滚动加载等功能。此外，它还支持管理员权限，可删除所有聊天记录。

## 界面预览

### PC 端

<img src="https://i.pstorage.space/i/dbPAXV4xN/original_image.png" alt="image" width="50%" />

### 安卓端

<img src="https://i.pstorage.space/i/OD0ZxwYzO/original_image_1.png" alt="image" width="20%" />

## 功能特性

1. **实时聊天**：用户可即时发送消息，聊天记录实时更新。
2. **用户身份管理**：首次访问时输入用户名，系统保存在浏览器中。下次访问自动恢复身份。不同用户的聊天内容以不同颜色显示。
3. **响应式布局**：为桌面、平板和手机等设备提供优化的自适应界面。
4. **管理员权限**：管理员可通过密码验证删除所有聊天记录。

    - 不加密版本默认密码：`admin12345`（在 `unencrypted password version/chat-worker.js` 第 59 行设置）
    - 加密版本默认密码：`admin12345`（在 `encrypted password version/chat-worker.js` 第 9 行设置）
5. **加密登录**：密码保护，防止陌生人进入聊天室（仅加密版本）

    - 默认密码：`admin12345`（在 `encrypted password version/chat-worker.js` 第 11 行设置）

## 试用方法

- 直接点击[Demo](https://plat-sh-community-prod-upload-ugc.oss-cn-shanghai.aliyuncs.com/upload/2024/10/08/431907881/0e26dd89c830a986873c3173b31c0c51_4591352145027447256.jpg?response-content-type=text/html)即可直接试用

## 使用说明

### 版本选择
- 加密版本搞出来了！不过，软件的核心还是能简单就简单。也留着不加密的版本，大家看着需求自己挑吧。
1. **不加密版本**：使用 unencrypted password version 文件夹下的代码
2. **加密版本**：使用 encrypted password version 文件夹下的代码

### D1 数据库配置

1. 在 Cloudflare 面板中选择"Workers 和 Pages"
2. 选择"D1 SQL 数据库"
3. 创建数据库，命名为 `chat-db`（可自定义）
4. 在控制台中输入并执行 `chat-db.sql` 文件的代码

### Workers 配置

1. 在 Cloudflare 面板中选择"Workers 和 Pages"
2. 选择"概述"
3. 创建 Worker，命名为 chat-worker（可自定义），并保存链接

   <img src="https://i.pstorage.space/i/3dv29X7g6/original_image_2.png" alt="image" width="50%" />
   
5. 部署 Worker
6. 编辑代码，输入 `chat-worker.js` 文件内容，部署并保存预览链接
7. 返回"Workers 和 Pages"概述
8. 选择新创建的 Worker
9. 依次选择：设置 → 绑定 → 添加 → D1 数据库，变量名设为 `DB`，选择刚创建的数据库

### HTML 配置

1. 打开 HTML 源代码
2. 第 131 行，将 `const API_URL = "<https://xxxxxxxxxxxxxxx>";` 中的链接替换为 Worker 链接（注意：链接末尾不加 `/`）
3. 用浏览器直接打开 HTML 文件即可运行

## 未来改进方向

- 自定义用户头像
- 增加表情符号、文件发送功能
- 支持私聊和分组聊天
- 提供消息加密传输

## 许可证

本项目采用 MIT 许可证，欢迎自由使用和修改。
