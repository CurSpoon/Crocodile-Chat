export default {
  async fetch(request, env) {
    // 处理 OPTIONS 请求（预检请求）
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

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
      const after = url.searchParams.get("after");

      let query;
      let params;

      if (after) {
        query = "SELECT * FROM messages WHERE id > ? ORDER BY id ASC LIMIT ?";
        params = [after, limit];
      } else {
        query = "SELECT * FROM messages ORDER BY id DESC LIMIT ? OFFSET ?";
        params = [limit, offset];
      }

      const result = await env.DB.prepare(query).bind(...params).all();

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    };

    const handleDelete = async () => {
      const { adminPassword } = await request.json();
      const ADMIN_PASSWORD = env.ADMIN_PASSWORD || "admin12345";
      if (adminPassword !== ADMIN_PASSWORD) {
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

    // 使用 Promise.all 来并行处理 POST 和 GET 请求，提高并发性
    const handlers = {
      "POST": handlePost,
      "GET": handleGet,
      "DELETE": handleDelete
    };

    // 使用 Promise.race 来处理并发请求，确保在高并发环境下快速响应
    const handler = handlers[request.method];
    if (handler) {
      return Promise.race([
        handler(),
        new Promise((resolve) => setTimeout(() => resolve(new Response("Request timeout", { status: 504 })), 5000))
      ]);
    } else {
      // 对不允许的方法返回405错误
      return new Response("Method not allowed", {
        status: 405,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};