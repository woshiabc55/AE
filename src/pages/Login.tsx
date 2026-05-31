import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch {
      /* handled by store */
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-surface to-mint px-4">
      <div className="w-full max-w-md animate-slideUp">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-primary">
              LinguaVerse
            </h1>
            <p className="mt-1 font-body text-sm text-gray-500">欢迎回来</p>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 px-4 py-3 font-body text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1.5 block font-body text-sm font-medium text-gray-700">
                邮箱
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 font-body text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-body text-sm font-medium text-gray-700">
                密码
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError();
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 font-body text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-pill bg-primary py-2.5 font-body font-semibold text-white transition-all duration-200 hover:bg-primary-600 hover:text-accent disabled:opacity-50"
            >
              {isLoading ? "登录中..." : "登录"}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-gray-500">
            还没有账号？
            <Link
              to="/register"
              className="ml-1 font-medium text-accent transition-colors hover:text-accent-600"
            >
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
