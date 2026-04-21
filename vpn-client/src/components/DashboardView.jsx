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
  Activity,
  ChevronDown,
  BarChart2,
} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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
  selectedServer,
  setSelectedServer,
  servers,
  userRole,
  onSwitchView,
}) {
  const [sessionTime, setSessionTime] = useState(0)
  const [showGraph, setShowGraph] = useState(false)
  const [dataHistory, setDataHistory] = useState([])
  const [lastBytes, setLastBytes] = useState({ up: 0, down: 0 })

  // Capture metrics for graph
  useEffect(() => {
    if (vpnState !== 'connected') {
      setDataHistory([])
      return
    }

    const interval = setInterval(() => {
      setDataHistory(prev => {
        // Calculate throughput (bytes per second)
        const up = Math.max(0, bytesUp - lastBytes.up)
        const down = Math.max(0, bytesDown - lastBytes.down)
        
        const newData = [...prev, {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          up: up / 1024, // KB/s
          down: down / 1024, // KB/s
        }].slice(-20) // Keep last 20 points
        
        return newData
      })
      setLastBytes({ up: bytesUp, down: bytesDown })
    }, 1000)

    return () => clearInterval(interval)
  }, [vpnState, bytesUp, bytesDown, lastBytes])

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
    <div className="w-full max-w-2xl animate-fade-in-up flex gap-6">
      {/* ── Left Sidebar: Server Selection ── */}
      <div className="w-64 glass-card rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <Globe className="w-4 h-4 text-accent-cyan" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-tight">Location</h2>
        </div>
        
        <div className="space-y-2">
          {servers.map((srv) => (
            <button
              key={srv.id}
              onClick={() => setSelectedServer(srv)}
              disabled={vpnState !== 'disconnected'}
              className={`w-full flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                selectedServer.id === srv.id
                  ? 'bg-accent-cyan/10 border-accent-cyan/40 scale-[1.02]'
                  : 'bg-bg-primary/40 border-border-dim hover:bg-bg-secondary/60 opacity-60 hover:opacity-100'
              } ${vpnState !== 'disconnected' && 'cursor-not-allowed'}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[11px] font-bold ${selectedServer.id === srv.id ? 'text-accent-cyan' : 'text-text-primary'}`}>
                  {srv.name}
                </span>
                <span className="text-[9px] font-mono text-text-dim">{srv.latency}ms</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 w-full">
                <div className="flex-1 h-1 rounded-full bg-border-dim overflow-hidden">
                  <div 
                    className="h-full bg-accent-cyan/60" 
                    style={{ width: `${srv.load}%` }} 
                  />
                </div>
                <span className="text-[9px] font-mono text-text-dim">{srv.load}% load</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-border-dim">
          <div className="p-3 rounded-xl bg-accent-cyan/5 border border-accent-cyan/10">
            <p className="text-[10px] font-mono text-accent-cyan font-bold uppercase">Performance Info</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-text-dim">Sim. Latency</span>
                <span className="text-text-primary">{selectedServer.latency} ms</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-text-dim">Region</span>
                <span className="text-text-primary">{selectedServer.region}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Content ── */}
      <div className="flex-1 space-y-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-primary tracking-tight">Dashboard</h1>
            <p className="text-xs font-mono text-text-dim mt-0.5">Tunnel Control Interface</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGraph(!showGraph)}
              className={`p-2 rounded-lg border transition-all ${
                showGraph 
                  ? 'bg-accent-cyan/20 border-accent-cyan/40 text-accent-cyan' 
                  : 'bg-bg-primary/40 border-border-dim text-text-dim hover:text-text-primary'
              }`}
              title="Toggle Traffic Graph"
            >
              <Activity className="w-4 h-4" />
            </button>
            
            {userRole === 'admin' && (
              <button
                onClick={() => onSwitchView('admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 hover:bg-accent-cyan/20 transition-all"
                title="Open Admin Console"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

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
              className="h-full rounded-full bg-linear-to-r from-accent-cyan to-accent-blue transition-all duration-300"
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
              className="h-full rounded-full bg-linear-to-r from-accent-green to-accent-cyan transition-all duration-300"
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
              {vpnState === 'connected' ? selectedServer.name : 'No server'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Traffic Graph Overlay (FR-3.2 Visualisation) ── */}
      {showGraph && vpnState === 'connected' && (
        <div className="glass-card rounded-xl p-4 animate-fade-in-up h-64">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5 text-accent-cyan" />
              <span className="text-[10px] font-mono font-semibold text-text-dim tracking-wider uppercase">
                Real-time Throughput (KB/s)
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                <span className="text-text-dim">Up</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-accent-green" />
                <span className="text-text-dim">Down</span>
              </div>
            </div>
          </div>
          
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataHistory}>
                <defs>
                  <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  hide={true}
                />
                <YAxis 
                  hide={true} 
                  domain={['dataMin', 'dataMax + 10']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="up" 
                  stroke="#22d3ee" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorUp)" 
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="down" 
                  stroke="#4ade80" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorDown)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
    </div>
  )
}
