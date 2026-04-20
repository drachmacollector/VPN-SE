import { useState } from 'react'
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Fingerprint } from 'lucide-react'

/*
 * LoginView – Handles user authentication
 * Maps to FR-1.1 through FR-1.4
 */
export default function LoginView({
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
  vpnState,
  errorMessage,
  isTestRunning,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isAuthenticating = vpnState === 'authenticating'
  const isDisabled = isTestRunning || isAuthenticating

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password || isDisabled) return
    onLogin(email, password)
  }

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      {/* Logo / Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-card-bright mb-4">
          <Shield className="w-8 h-8 text-accent-cyan" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Secure<span className="text-accent-cyan">Net</span> VPN
        </h1>
        <p className="text-sm text-text-dim mt-1 font-mono">Authenticate to access secure tunnel</p>
      </div>

      {/* Login Card */}
      <div className="glass-card-bright rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="email-input" className="text-xs font-mono font-semibold text-text-secondary tracking-wider uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isDisabled}
                placeholder="user@example.com"
                className="w-full h-11 pl-10 pr-4 bg-bg-input border border-border-dim rounded-lg text-sm text-text-primary font-mono placeholder:text-text-dim/50 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password-input" className="text-xs font-mono font-semibold text-text-secondary tracking-wider uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isDisabled}
                placeholder="••••••••••"
                className="w-full h-11 pl-10 pr-10 bg-bg-input border border-border-dim rounded-lg text-sm text-text-primary font-mono placeholder:text-text-dim/50 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-secondary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message Container (FR-1.3) */}
          {errorMessage && (
            <div id="error-message" className="flex items-start gap-2.5 p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 animate-fade-in-up">
              <AlertCircle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
              <span className="text-sm text-accent-red font-mono">{errorMessage}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            id="login-button"
            disabled={!email || !password || isDisabled}
            className="w-full h-11 rounded-lg font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 hover:bg-accent-cyan/20 hover:border-accent-cyan/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent-cyan/10 cursor-pointer"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4" />
                <span>Authenticate</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px bg-border-dim"></div>
          <span className="text-[10px] font-mono text-text-dim tracking-widest">SECURE PROTOCOL</span>
          <div className="flex-1 h-px bg-border-dim"></div>
        </div>

        {/* Info */}
        <div className="mt-4 text-center">
          <p className="text-[11px] font-mono text-text-dim">
            AES-256 encrypted • TLS 1.3 handshake
          </p>
        </div>
      </div>
    </div>
  )
}
