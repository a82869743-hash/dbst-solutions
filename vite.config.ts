import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import adminAuthHandler, { checkRateLimit, recordAttempt } from "./api/admin-auth";
import { handleCredentialsUpdate } from "./api/admin-credentials";
import capabilityAdvisorHandler from "./api/capability-advisor";

function parseBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: any) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

function apiDevServerPlugin(env: Record<string, string>) {
  return {
    name: "dbst-api-dev-server",
    configureServer(server: any) {
      if (env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
        process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
      }

      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || "";

        if ((url.startsWith("/api/admin-auth") || url.startsWith("/api/admin-otp")) && req.method === "POST") {
          try {
            await adminAuthHandler(req, res);
            return;
          } catch (err: any) {
            console.error("Vite Dev Server API Error (/api/admin-auth):", err?.message || err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Failed to process admin auth action." }));
            return;
          }
        }

        if (url.startsWith("/api/admin-credentials") && req.method === "POST") {
          try {
            const authHeader = req.headers["authorization"] || req.headers["Authorization"];
            const body = await parseBody(req);
            const result = await handleCredentialsUpdate(authHeader, body || {});
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
            return;
          } catch (err: any) {
            console.error("Vite Dev Server API Error (/api/admin-credentials):", err?.message || err);
            const status = err.message?.includes("Forbidden")
              ? 403
              : err.message?.includes("Unauthorized")
              ? 401
              : 500;
            res.statusCode = status;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: err.message || "Failed to update credentials." }));
            return;
          }
        }

        if (url.startsWith("/api/capability-advisor")) {
          try {
            const body = await parseBody(req);
            const webReq = new Request("http://localhost:8080/api/capability-advisor", {
              method: req.method,
              headers: req.headers as any,
              body: req.method === "POST" ? JSON.stringify(body) : undefined,
            });
            const webRes = await capabilityAdvisorHandler(webReq);
            res.statusCode = webRes.status;
            webRes.headers.forEach((val, key) => {
              res.setHeader(key, val);
            });
            const text = await webRes.text();
            res.end(text);
            return;
          } catch (err: any) {
            console.error("Vite Dev Server API Error (/api/capability-advisor):", err?.message || err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Capability advisor failed." }));
            return;
          }
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "0.0.0.0",
      port: 8080,
      strictPort: false,
      hmr: {
        overlay: true,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      apiDevServerPlugin(env),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
