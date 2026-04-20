import { Shield, Wifi, WifiOff, AlertTriangle, Loader2, Lock } from 'lucide-react'

/*
 * StatusBar – Top bar showing system state, connection info
 */
export default function StatusBar({ vpnState, isAuthenticated }) {
  const stateConfig = {
    disconnected: { label: 'DISCONNECTED', color: 'text-text-dim', icon: WifiOff, dotClass: 'disconnected' },
    authenticating: { label: 'AUTHENTICATING', color: 'text-accent-cyan', icon: Loader2, dotClass: 'authenticating' },
    connecting: { label: 'ESTABLISHING TUNNEL', color: 'text-accent-amber', icon: Loader2, dotClass: 'connecting' },
    connected: { label: 'TUNNEL ACTIVE', color: 'text-accent-green', icon: Wifi, dotClass: 'connected' },
    error: { label: 'CONNECTION ERROR', color: 'text-accent-red', icon: AlertTriangle, dotClass: 'error' },
  }

  const config = stateConfig[vpnState] || stateConfig.disconnected
  const Icon = config.icon

  return (
    <header className="h-10 flex items-center justify-between px-5 border-b border-border-dim bg-bg-secondary/80 backdrop-blur-md shrink-0 z-50">
      {/* Left: Brand */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <Shield className="w-4 h-4 text-accent-cyan" strokeWidth={2} />
          {vpnState === 'connected' && (
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-green rounded-full animate-pulse-glow" />
          )}
        </div>
        <span className="font-mono text-xs font-semibold tracking-wider text-text-primary">
          SECURENET<span className="text-accent-cyan">VPN</span>
        </span>
        <span className="text-text-dim text-[10px] font-mono ml-1">v2.4.1</span>
      </div>

      {/* Center: State Indicator */}
      <div className="flex items-center gap-2.5">
        <div className={`status-dot ${config.dotClass}`} />
        <span className={`font-mono text-[11px] font-semibold tracking-widest ${config.color}`}>
          {config.label}
        </span>
        {(vpnState === 'authenticating' || vpnState === 'connecting') && (
          <Icon className={`w-3 h-3 ${config.color} animate-spin`} />
        )}
      </div>

      {/* Right: Session info */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-accent-green" />
            <span className="font-mono text-[10px] text-text-dim">SESSION ACTIVE</span>
          </div>
        )}
        <span className="font-mono text-[10px] text-text-dim">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </header>
  )
}
