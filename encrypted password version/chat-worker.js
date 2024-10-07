export default {
  // 环境变量设置
  ADMIN_PASSWORD: "",
  ENCRYPTION_PASSWORD: "",

  async fetch(request, env) {
    // 在fetch函数开始时初始化环境变量
    // 在此处设置重置清除聊天记录的管理员密码"default_admin_password"
    this.ADMIN_PASSWORD = env.ADMIN_PASSWORD || "admin12345";
    // 在此处设置登录密码"default_encryption_password"
    this.ENCRYPTION_PASSWORD = env.ENCRYPTION_PASSWORD || "admin12345";

    // 设置通用的 CORS 头部
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 处理 OPTIONS 请求（预检请求）
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 定义一个函数来添加 CORS 头部到响应中
    const addCorsHeaders = (response) => {
      Object.keys(corsHeaders).forEach(key => {
        response.headers.set(key, corsHeaders[key]);
      });
      return response;
    };

    // 定义请求处理函数
    const handlePost = async () => {
      const { username, message } = await request.json();
      if (!username || !message) {
        return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
      }
      
      // 获取当前时间并转换为上海时区
      const now = new Date();
      const shanghaiTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Shanghai"}));
      const timestamp = shanghaiTime.toISOString().slice(0, 19).replace('T', ' ');
      
      const stmt = env.DB.prepare("INSERT INTO messages (username, message, timestamp) VALUES (?, ?, ?)");
      await stmt.bind(username, message, timestamp).run();
      
      return new Response(JSON.stringify({ success: true, message: "Message sent" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    };

    const handleGet = async () => {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const limit = 30; // 每页显示的消息数量
      const offset = (page - 1) * limit;

      const result = await env.DB.prepare("SELECT * FROM messages ORDER BY timestamp DESC LIMIT ? OFFSET ?")
        .bind(limit, offset)
        .all();

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    };

    const handleDelete = async () => {
      const { adminPassword } = await request.json();
      if (adminPassword !== this.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
      await env.DB.prepare("DELETE FROM messages").run();
      return new Response(JSON.stringify({ success: true, message: "All messages deleted" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    };

    const handleLogin = async () => {
      try {
        const { password } = await request.json();
        if (password !== this.ENCRYPTION_PASSWORD) {
          return new Response(JSON.stringify({ success: false, message: "Invalid password" }), {
            status: 401,
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders
            },
          });
        }

        return new Response(JSON.stringify({ success: true, message: "Login successful" }), {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: "Invalid request" }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
        });
      }
    };

    const handlers = {
      "POST": async () => {
        const url = new URL(request.url);
        if (url.pathname === "/login") {
          return handleLogin();
        } else {
          return handlePost();
        }
      },
      "GET": handleGet,
      "DELETE": handleDelete
    };

    // 使用 Promise.race 来并行处理请求，提高并发性
    const handler = handlers[request.method];
    if (handler) {
      return Promise.race([
        handler().then(addCorsHeaders),
        new Promise((resolve) => setTimeout(() => resolve(new Response("Request timeout", { 
          status: 504,
          headers: corsHeaders
        })), 5000))
      ]);
    } else {
      // 对不允许的方法返回405错误
      return new Response("Method not allowed", { 
        status: 405,
        headers: corsHeaders
      });
    }
  },
};
