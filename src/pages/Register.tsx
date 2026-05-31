import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Globe, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const TARGET_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
];

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const validate = (): boolean => {
    if (!username.trim()) {
      setValidationError("请输入用户名");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("请输入有效的邮箱地址");
      return false;
    }
    if (password.length < 6) {
      setValidationError("密码至少需要6个字符");
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError("两次输入的密码不一致");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(email, password, username);
      navigate("/");
    } catch {
      /* handled by store */
    }
  };

  const displayError = validationError || error;

  const clearErrors = () => {
    setValidationError("");
    clearError();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-surface to-mint px-4 py-8">
      <div className="w-full max-w-md animate-slideUp">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-primary">
              LinguaVerse
            </h1>
            <p className="mt-1 font-body text-sm text-gray-500">创建你的账号</p>
          </div>

          {displayError && (
            <div className="mt-4 rounded-md bg-red-50 px-4 py-3 font-body text-sm text-red-600">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-body text-sm font-medium text-gray-700">
                用户名
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    clearErrors();
                  }}
                  placeholder="你的用户名"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 font-body text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

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
                    clearErrors();
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
                    clearErrors();
                  }}
                  placeholder="至少6个字符"
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

            <div>
              <label className="mb-1.5 block font-body text-sm font-medium text-gray-700">
                确认密码
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearErrors();
                  }}
                  placeholder="再次输入密码"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 font-body text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-body text-sm font-medium text-gray-700">
                目标语言
              </label>
              <div className="relative">
                <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 font-body text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {TARGET_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-pill bg-primary py-2.5 font-body font-semibold text-white transition-all duration-200 hover:bg-primary-600 hover:text-accent disabled:opacity-50"
            >
              {isLoading ? "注册中..." : "注册"}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-gray-500">
            已有账号？
            <Link
              to="/login"
              className="ml-1 font-medium text-accent transition-colors hover:text-accent-600"
            >
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
