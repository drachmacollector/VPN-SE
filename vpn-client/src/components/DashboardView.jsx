import {
  Power,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  ArrowUpFromLine,
  ArrowDownToLine,
  Globe,
  Lock,
  Loader2,
  AlertTriangle,
  LogOut,
  X,
  Server,
  Clock,
} from 'lucide-react'
import { useState, useEffect } from 'react'

/*
 * DashboardView – Main VPN control panel
 * Handles Connect/Disconnect, data metrics, IP display
 * Maps to FR-2.x, FR-3.x, FR-4.x, FR-5.x
 */

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i]
}

export default function DashboardView({
  vpnState,
  onConnect,
  onDisconnect,
  onDismissError,
  onLogout,
  bytesUp,
  bytesDown,
  localIp,
  maskedIp,
  errorMessage,
  isTestRunning,
}) {
  const [sessionTime, setSessionTime] = useState(0)

  // Session timer
  useEffect(() => {
    let interval
    if (vpnState === 'connected') {
      interval = setInterval(() => setSessionTime(prev => prev + 1), 1000)
    } else {
      setSessionTime(0)
    }
    return () => clearInterval(interval)
  }, [vpnState])

  const formatTime = (s) => {
    const hrs = Math.floor(s / 3600).toString().padStart(2, '0')
    const mins = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
    const secs = (s % 60).toString().padStart(2, '0')
    return `${hrs}:${mins}:${secs}`
  }

  const isDisabled = isTestRunning

  const handleButtonClick = () => {
    if (isDisabled) return
    if (vpnState === 'connected') {
      onDisconnect()
    } else if (vpnState === 'disconnected') {
      onConnect()
    }
  }

  // Button state config
  const buttonConfig = {
    disconnected: { icon: Power, label: 'CONNECT', sublabel: 'Tap to establish tunnel' },
    connecting: { icon: Loader2, label: 'ESTABLISHING', sublabel: 'Creating secure tunnel...' },
    connected: { icon: ShieldCheck, label: 'SECURED', sublabel: 'Tap to disconnect' },
    error: { icon: ShieldAlert, label: 'ERROR', sublabel: 'Connection failed' },
    authenticating: { icon: Loader2, label: 'AUTH', sublabel: 'Verifying...' },
  }

  const config = buttonConfig[vpnState] || buttonConfig.disconnected
  const ButtonIcon = config.icon

  return (
    <div className="w-full max-w-lg animate-fade-in-up space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-xs font-mono text-text-dim mt-0.5">Tunnel Control Interface</p>
        </div>
        <button
          onClick={onLogout}
          disabled={isDisabled}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-text-dim hover:text-accent-red hover:bg-accent-red/10 border border-border-dim hover:border-accent-red/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          id="logout-button"
        >
          <LogOut className="w-3 h-3" />
          <span>Logout</span>
        </button>
      </div>

      {/* ── Error Banner (FR-5.2) ── */}
      {vpnState === 'error' && errorMessage && (
        <div id="error-banner" className="flex items-center justify-between p-4 rounded-xl bg-accent-red/10 border border-accent-red/20 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-accent-red" />
            <div>
              <p className="text-sm font-semibold text-accent-red">Connection Error</p>
              <p className="text-xs font-mono text-accent-red/80 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={onDismissError}
            disabled={isDisabled}
            className="p-1 rounded hover:bg-accent-red/20 transition-colors"
          >
            <X className="w-4 h-4 text-accent-red" />
          </button>
        </div>
      )}

      {/* ── VPN Connect/Disconnect Button ── */}
      <div className="flex flex-col items-center py-6">
        <button
          onClick={handleButtonClick}
          disabled={isDisabled || vpnState === 'connecting' || vpnState === 'error'}
          className={`vpn-button ${vpnState} disabled:cursor-not-allowed`}
          id="vpn-toggle-button"
        >
          <div className="ripple-ring" />
          <div className="ripple-ring" style={{ animationDelay: '1s' }} />
          <div className="flex flex-col items-center gap-1">
            <ButtonIcon
              className={`w-10 h-10 ${
                vpnState === 'connected' ? 'text-accent-green' :
                vpnState === 'connecting' ? 'text-accent-amber animate-spin-slow' :
                vpnState === 'error' ? 'text-accent-red' :
                'text-text-dim'
              }`}
              strokeWidth={1.5}
            />
          </div>
        </button>

        {/* Label */}
        <div className="text-center mt-5">
          <p className={`text-sm font-mono font-bold tracking-widest ${
            vpnState === 'connected' ? 'text-accent-green' :
            vpnState === 'connecting' ? 'text-accent-amber' :
            vpnState === 'error' ? 'text-accent-red' :
            'text-text-dim'
          }`}>
            {config.label}
          </p>
          <p className="text-xs text-text-dim mt-1 font-mono">{config.sublabel}</p>
        </div>
      </div>

      {/* ── Metrics Grid ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Upload Metric (FR-3.1 - Encrypted data) */}
        <div className="glass-card rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <ArrowUpFromLine className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-[10px] font-mono font-semibold text-text-dim tracking-wider uppercase">
              Bytes Up
            </span>
          </div>
          <p id="bytes-up-display" className="text-lg font-mono font-bold text-text-primary">
            {formatBytes(bytesUp)}
          </p>
          <div className="h-1 rounded-full bg-bg-primary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue transition-all duration-300"
              style={{ width: vpnState === 'connected' ? `${Math.min((bytesUp / 1048576) * 100, 100)}%` : '0%' }}
            />
          </div>
        </div>

        {/* Download Metric */}
        <div className="glass-card rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <ArrowDownToLine className="w-3.5 h-3.5 text-accent-green" />
            <span className="text-[10px] font-mono font-semibold text-text-dim tracking-wider uppercase">
              Bytes Down
            </span>
          </div>
          <p id="bytes-down-display" className="text-lg font-mono font-bold text-text-primary">
            {formatBytes(bytesDown)}
          </p>
          <div className="h-1 rounded-full bg-bg-primary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-cyan transition-all duration-300"
              style={{ width: vpnState === 'connected' ? `${Math.min((bytesDown / 1048576) * 100, 100)}%` : '0%' }}
            />
          </div>
        </div>

        {/* IP Address Display */}
        <div className="glass-card rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-accent-purple" />
            <span className="text-[10px] font-mono font-semibold text-text-dim tracking-wider uppercase">
              IP Address
            </span>
          </div>
          <p id="ip-display" className="text-sm font-mono font-bold text-text-primary">
            {vpnState === 'connected' ? maskedIp : localIp}
          </p>
          <div className="flex items-center gap-1.5">
            {vpnState === 'connected' ? (
              <>
                <Lock className="w-3 h-3 text-accent-green" />
                <span className="text-[10px] font-mono text-accent-green">Masked</span>
              </>
            ) : (
              <>
                <ShieldOff className="w-3 h-3 text-text-dim" />
                <span className="text-[10px] font-mono text-text-dim">Exposed</span>
              </>
            )}
          </div>
        </div>

        {/* Session Info */}
        <div className="glass-card rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-accent-amber" />
            <span className="text-[10px] font-mono font-semibold text-text-dim tracking-wider uppercase">
              Session
            </span>
          </div>
          <p className="text-sm font-mono font-bold text-text-primary">
            {vpnState === 'connected' ? formatTime(sessionTime) : '--:--:--'}
          </p>
          <div className="flex items-center gap-1.5">
            <Server className="w-3 h-3 text-text-dim" />
            <span className="text-[10px] font-mono text-text-dim">
              {vpnState === 'connected' ? 'us-east-1' : 'No server'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Encryption Status Bar ── */}
      <div className="glass-card rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 ${vpnState === 'connected' ? 'text-accent-green' : 'text-text-dim'}`} />
          <span className="text-xs font-mono text-text-secondary">
            {vpnState === 'connected' ? 'AES-256-GCM Active • TLS 1.3' : 'Encryption Inactive'}
          </span>
        </div>
        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
          vpnState === 'connected'
            ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
            : 'bg-bg-primary text-text-dim border border-border-dim'
        }`}>
          {vpnState === 'connected' ? 'ENCRYPTED' : 'PLAIN'}
        </span>
      </div>
    </div>
  )
}
