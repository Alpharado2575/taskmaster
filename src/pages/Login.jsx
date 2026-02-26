import { useState } from "react";
import axios from "axios";

export default function Login({ setToken, setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    if (!username || !password) {
      setError("Harap isi semua bidang!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("https://be-taskmaster.vercel.app/", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      
      // Success feedback
      const btn = document.getElementById("loginBtn");
      btn.classList.add("animate-success");
      setTimeout(() => btn.classList.remove("animate-success"), 1000);

    } catch (err) {
      setError("Login gagal! Username atau password salah");
      const form = document.querySelector(".login-form");
      form.classList.add("animate-shake");
      setTimeout(() => form.classList.remove("animate-shake"), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-blue-50 via-95% via-indigo-50 to-purple-50 grid place-content-center p-4 relative overflow-hidden">
      {/* Background elements - Tailwind v4 simplified syntax */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 size-80 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 bg-gradient-to-tr from-purple-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-gradient-to-r from-indigo-100/10 to-blue-100/10 rounded-full blur-3xl" />
      </div>

      <div className="login-form w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/40 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Welcome Back! 👋</h1>
              </div>
              <p className="text-blue-100/90 font-medium">Masuk untuk melanjutkan petualanganmu</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="animate-fade-in">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
                  <span className="i-heroicons-exclamation-circle-20-solid size-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 font-medium text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                <span className="i-heroicons-user-20-solid size-4 inline-block mr-2 align-middle" />
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 i-heroicons-user-circle-20-solid size-5 text-gray-400 group-has-[input:focus]:text-blue-500 transition-colors" />
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 outline-none transition-all duration-200 hover:border-gray-300 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="username@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                <span className="i-heroicons-lock-closed-20-solid size-4 inline-block mr-2 align-middle" />
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 i-heroicons-key-20-solid size-5 text-gray-400 group-has-[input:focus]:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 outline-none transition-all duration-200 hover:border-gray-300 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <span className={showPassword ? "i-heroicons-eye-slash-20-solid size-5 text-gray-400 hover:text-gray-600 transition-colors" : "i-heroicons-eye-20-solid size-5 text-gray-400 hover:text-gray-600 transition-colors"} />
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              id="loginBtn"
              onClick={login}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <span className="i-heroicons-arrow-path-20-solid size-5 animate-spin" />
                  <span>Sedang masuk...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <span className="i-heroicons-arrow-right-20-solid size-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Belum punya akun?{" "}
                <button
                  onClick={() => setPage("register")}
                  className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
                >
                  Daftar gratis
                  <span className="i-heroicons-arrow-right-20-solid size-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6 rounded-b-3xl">
            <p className="text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Taskmaster. Dilindungi dengan ❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}