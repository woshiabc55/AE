import re
import uvicorn
import gradio as gr
from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


def greet(name):
    return f"你好，{name}！"


with gr.Blocks(title="空白应用") as demo:
    gr.Markdown("# 🖥️ 浏览器工件 - 空白模板")
    gr.Markdown("这是一个基于 Gradio 的独立浏览器应用空白起点，你可以在此基础上自由扩展。")

    with gr.Row():
        name_input = gr.Textbox(label="输入名称", placeholder="请输入你的名字")
        output = gr.Textbox(label="输出")

    greet_btn = gr.Button("提交")
    greet_btn.click(fn=greet, inputs=name_input, outputs=output)

    gr.Markdown("---\n*基于 Gradio 构建 · 浏览器独立运行*")

demo.queue()


class ProxyRootMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        ct = response.headers.get("content-type", "")
        if "text/html" in ct:
            body = b""
            async for chunk in response.body_iterator:
                body += chunk
            html = body.decode("utf-8")
            html = re.sub(
                r'"root"\s*:\s*"http://localhost:\d+"',
                '"root":location.origin',
                html,
            )
            html = html.replace(
                'http://localhost:7860/gradio_api/',
                '/gradio_api/',
            )
            new_body = html.encode("utf-8")
            headers = dict(response.headers)
            headers["content-length"] = str(len(new_body))
            return Response(
                content=new_body,
                status_code=response.status_code,
                headers=headers,
                media_type="text/html",
            )
        return response


app = FastAPI()
app.add_middleware(ProxyRootMiddleware)
gr.mount_gradio_app(app, demo, path="/")

uvicorn.Server(
    uvicorn.Config(app, host="0.0.0.0", port=7860, log_level="info")
).run()
