// 全局错误边界
import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/store/toast";

interface Props {
  children: ReactNode;
}
interface State {
  err: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { err: null };

  static getDerivedStateFromError(err: Error): State {
    return { err };
  }

  componentDidCatch(err: Error, info: any) {
    // 上报到控制台，可在此处接入 Sentry 等
    // eslint-disable-next-line no-console
    console.error("[Lumiere] ErrorBoundary caught:", err, info);
    toast.error("页面出错了", err.message);
  }

  reset = () => this.setState({ err: null });

  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-12">
        <div className="panel max-w-lg w-full p-8 border-reel/40">
          <div className="flex items-center gap-2 text-reel">
            <AlertTriangle size={20} />
            <span className="label-overline">CRASH · TAKE 99</span>
          </div>
          <h2 className="mt-4 font-display text-[32px] text-paper-50">
            镜头穿帮了。
          </h2>
          <p className="mt-3 font-serif text-paper-200 leading-relaxed">
            渲染过程中出现了一个未捕获的异常。你可以选择刷新当前镜头，或回到首场。
          </p>
          {this.state.err.message && (
            <pre className="mt-4 panel p-3 font-mono text-[11px] text-reel whitespace-pre-wrap break-all max-h-40 overflow-auto">
              {this.state.err.message}
            </pre>
          )}
          <div className="mt-6 flex items-center gap-3">
            <button onClick={this.reset} className="reel-button">
              <RotateCcw size={12} /> 再来一条
            </button>
            <Link to="/" className="ghost-button">
              <Home size={12} /> 回到 Discover
            </Link>
            <button
              onClick={() => location.reload()}
              className="ghost-button ml-auto"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
