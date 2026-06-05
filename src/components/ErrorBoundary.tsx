import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (err: Error, reset: () => void) => ReactNode;
}

interface State {
  err: Error | null;
}

/**
 * 顶层错误边界：捕获子树渲染异常，显示回退 UI 而非整页崩溃
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { err: null };

  static getDerivedStateFromError(err: Error): State {
    return { err };
  }

  componentDidCatch(err: Error, info: { componentStack: string }) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', err.message, info.componentStack);
  }

  reset = () => this.setState({ err: null });

  render() {
    if (this.state.err) {
      if (this.props.fallback) return this.props.fallback(this.state.err, this.reset);
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full border-2 border-pink/60 bg-ink p-6 font-mono text-sm">
            <div className="text-pink font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-pink rounded-full animate-pulse" />
              SOMETHING BROKE / 子树渲染异常
            </div>
            <pre className="text-[10px] text-bone/70 overflow-auto max-h-40 whitespace-pre-wrap">
              {this.state.err.message}
            </pre>
            <button
              onClick={this.reset}
              className="mt-4 px-3 py-1.5 bg-volt text-ink border-2 border-volt font-bold text-xs hover:bg-bone hover:border-bone transition-colors"
            >
              ↻ RETRY / 重试
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
