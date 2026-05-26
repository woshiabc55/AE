import gradio as gr


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

demo.launch(server_name="0.0.0.0", server_port=7860)
