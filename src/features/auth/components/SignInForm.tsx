import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "@/shared/ui/icons";
import Label from "@/shared/components/forms/Label";
import Input from "@/shared/components/forms/InputField";
import Checkbox from "@/shared/components/forms/Checkbox";
import Button from "@/shared/components/ui/button/Button";
import { login } from "@/shared/services/authService";
import { tokenStorage } from "@/shared/utils/tokenStorage";
import { useAppStore } from "@/shared/stores/useAppStore";

export default function SignInForm() {
  const navigate = useNavigate();
  const { bootstrap } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login({
        username: formData.username,
        password: formData.password,
        deviceId: crypto.randomUUID(),
        deviceType: "web",
        deviceToken: "",
        deviceName: navigator.userAgent,
        deviceModel: navigator.platform,
        timestamp: Date.now(),
      });

      console.log('[SignInForm] login response:', response);

      const token = response?.data?.token;

      if (token) {
        console.log('[SignInForm] token received, storing...');
        tokenStorage.set(token);
        console.log('[SignInForm] token stored, calling bootstrap...');
        
        // Ensure bootstrap runs and completes BEFORE navigation
        // This populates the store so ProtectedRoute/AppLayout don't show loading
        const result = await bootstrap();
        console.log('[SignInForm] bootstrap result:', result, 'authStatus:', useAppStore.getState().authStatus);
        
        if (result === 'ok') {
          console.log('[SignInForm] navigating to /');
          navigate("/", { replace: true });
        } else if (result === 'no-store') {
          // User exists but has no stores - redirect to create store
          console.log('[SignInForm] navigating to /store/create-store');
          navigate("/store/create-store", { replace: true });
        } else if (result === 'error') {
          // Network error but token might be valid - let AppLayout handle retry
          console.log('[SignInForm] navigating to / (error case)');
          navigate("/", { replace: true });
        } else {
          // no-token, unauthorized - token was invalid
          console.log('[SignInForm] bootstrap failed, removing token');
          tokenStorage.remove();
          setError("Session verification failed. Please try again.");
        }
      } else {
        console.log('[SignInForm] no token in response');
        setError("Login succeeded but no token received.");
      }
    } catch (err: any) {
      console.error('[SignInForm] error:', err);
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>

          <div>
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-error-50 dark:bg-error-500/10 text-error-600 dark:text-error-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">

                <div>
                  <Label>Username <span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Password <span className="text-error-500">*</span></Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div>
                  <Button className="w-full" size="sm" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}