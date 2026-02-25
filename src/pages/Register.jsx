import { useState } from "react";
import axios from "axios";

export default function Register({ setPage }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.password || !formData.confirmPassword) {
      setError("Semua field harus diisi!");
      return false;
    }
    
    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter!");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!");
      return false;
    }
    
    return true;
  };

  const register = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username: formData.username,
        password: formData.password,
      });

      // Success feedback
      setMessage("🎉 Registrasi berhasil! Mengarahkan ke login...");
      
      // Animate success
      const form = document.querySelector(".register-form");
      form.classList.add("animate-success");
      
      // AUTO PINDAH KE LOGIN SETELAH 2 DETIK
      setTimeout(() => {
        setPage("login");
      }, 2000);

    } catch (err) {
      setError("❌ Registrasi gagal! Username sudah digunakan atau server error");
      
      // Shake animation on error
      const form = document.querySelector(".register-form");
      form.classList.add("animate-shake");
      setTimeout(() => form.classList.remove("animate-shake"), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      register();
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 grid place-content-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 size-80 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 bg-gradient-to-tr from-teal-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-gradient-to-r from-green-100/20 to-cyan-100/20 rounded-full blur-3xl" />
      </div>

      <div className="register-form w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-500/10 border border-white/40 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12" />
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Buat Akun Baru</h1>
              </div>
              <p className="text-emerald-100/90 font-medium">
                Bergabunglah dan mulai kelola tugas Anda
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Success Message */}
            {message && (
              <div className="animate-fade-in">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 p-4 rounded-lg flex items-center gap-3">
                  <span className="i-heroicons-check-circle-20-solid size-6 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-700">Berhasil!</p>
                    <p className="text-emerald-600 text-sm">{message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="animate-fade-in">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
                  <span className="i-heroicons-exclamation-circle-20-solid size-6 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-700">Perhatian!</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                <span className="i-heroicons-user-circle-20-solid size-4 inline-block mr-2 align-middle" />
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 i-heroicons-at-symbol-20-solid size-5 text-gray-400 group-has-[input:focus]:text-emerald-500 transition-colors" />
                <input
                  name="username"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/20 outline-none transition-all duration-200 hover:border-gray-300 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="pilih username unik"
                  value={formData.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 pl-1">
                Gunakan kombinasi huruf dan angka
              </p>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                <span className="i-heroicons-lock-closed-20-solid size-4 inline-block mr-2 align-middle" />
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 i-heroicons-key-20-solid size-5 text-gray-400 group-has-[input:focus]:text-emerald-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/20 outline-none transition-all duration-200 hover:border-gray-300 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <span className={showPassword ? 
                    "i-heroicons-eye-slash-20-solid size-5 text-gray-400 hover:text-gray-600 transition-colors" : 
                    "i-heroicons-eye-20-solid size-5 text-gray-400 hover:text-gray-600 transition-colors"} 
                  />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 pl-1">
                <div className={`size-2 rounded-full ${formData.password.length >= 6 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <p className="text-xs text-gray-500">Minimal 6 karakter</p>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                <span className="i-heroicons-shield-check-20-solid size-4 inline-block mr-2 align-middle" />
                Konfirmasi Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 i-heroicons-check-circle-20-solid size-5 text-gray-400 group-has-[input:focus]:text-emerald-500 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/20 outline-none transition-all duration-200 hover:border-gray-300 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="ketik ulang password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  <span className={showConfirmPassword ? 
                    "i-heroicons-eye-slash-20-solid size-5 text-gray-400 hover:text-gray-600 transition-colors" : 
                    "i-heroicons-eye-20-solid size-5 text-gray-400 hover:text-gray-600 transition-colors"} 
                  />
                </button>
              </div>
              <div className={`flex items-center gap-2 mt-2 pl-1 ${formData.password && formData.confirmPassword ? 'animate-fade-in' : ''}`}>
                {formData.password && formData.confirmPassword && (
                  <>
                    <span className={`i-heroicons-${formData.password === formData.confirmPassword ? 'check' : 'x-mark'}-circle-20-solid size-4 ${formData.password === formData.confirmPassword ? 'text-emerald-500' : 'text-red-500'}`} />
                    <p className={`text-xs ${formData.password === formData.confirmPassword ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formData.password === formData.confirmPassword ? 'Password cocok!' : 'Password tidak cocok'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={register}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <span className="i-heroicons-arrow-path-20-solid size-5 animate-spin" />
                  <span>Membuat Akun...</span>
                </>
              ) : (
                <>
                  <span>Buat Akun Sekarang</span>
                  <span className="i-heroicons-arrow-right-20-solid size-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Sudah punya akun?</span>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={() => setPage("login")}
              className="w-full py-3 px-6 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span className="i-heroicons-arrow-left-on-rectangle-20-solid size-5" />
              <span>Masuk ke Akun</span>
              <span className="i-heroicons-arrow-right-20-solid size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-6 rounded-b-3xl">
            <p className="text-center text-xs text-gray-500">
              © {new Date().getFullYear()} TaskMaster. Mulai produktif hari ini! ✨
            </p>
          </div>
        </div>
      </div>

      {/* Floating decoration */}
      <div className="absolute bottom-10 right-10 animate-bounce hidden md:block">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg">
          Gratis selamanya
        </div>
      </div>
    </div>
  );
}