import { 
  Users, 
  Activity, 
  Shield, 
  Bell, 
  Search, 
  Settings, 
  LayoutDashboard, 
  RefreshCw, 
  LogOut,
  Server,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  UserCheck,
  AlertCircle,
  FileText,
  BarChart3,
  CheckCircle2,
  XCircle,
  Terminal,
  Download
} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'

/*
 * AdminView – Global Operations Control
 * High-fidelity panel for network administrators
 * Features: Traffic Stats, Audit Logs, Infrastructure, User Control
 */

const MOCK_TRAFFIC_DATA = [
  { time: '00:00', connections: 45, throughput: 120 },
  { time: '04:00', connections: 32, throughput: 85 },
  { time: '08:00', connections: 78, throughput: 340 },
  { time: '12:00', connections: 124, throughput: 560 },
  { time: '16:00', connections: 156, throughput: 680 },
  { time: '20:00', connections: 110, throughput: 420 },
  { time: '23:59', connections: 92, throughput: 290 },
]

const MOCK_AUDIT_LOGS = [
  { id: 1, event: 'System Boot', user: 'SYSTEM', status: 'success', time: '2 hours ago' },
  { id: 2, event: 'Configuration Update', user: 'admin@vpn.com', status: 'success', time: '1 hour ago' },
  { id: 3, event: 'Alert: High Load (EU-West)', user: 'MONITOR', status: 'warning', time: '45 mins ago' },
  { id: 4, event: 'User Registration', user: 'user@test.com', status: 'success', time: '30 mins ago' },
  { id: 5, event: 'Tunnel Exception', user: 'SYSTEM', status: 'error', time: '10 mins ago' },
]

export default function AdminView({ 
  onSwitchView, 
  userList, 
  setUserList, 
  servers,
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const handleForceDisconnect = (email) => {
    setUserList(prev => prev.map(u => u.email === email ? { ...u, status: 'offline' } : u))
  }

  const filteredUsers = useMemo(() => {
    return userList.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [userList, searchTerm])

  return (
    <div className="w-full max-w-6xl animate-fade-in-up flex flex-col gap-6 my-6">
      {/* ── Top Navigation Bar ── */}
      <div className="glass-card-bright rounded-2xl p-4 flex items-center justify-between border-accent-cyan/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center border border-accent-cyan/30">
            <Shield className="w-6 h-6 text-accent-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Admin Console</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="status-dot connected scale-75" />
              <span className="text-[10px] font-mono text-accent-green uppercase tracking-widest font-bold">Primary Ops Center</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className={`p-2 rounded-lg bg-bg-primary/40 border border-border-dim text-text-dim hover:text-text-primary transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="h-8 w-[1px] bg-border-dim mx-2" />
          <button
            onClick={() => onSwitchView('dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/20 transition-all text-xs font-bold font-mono"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Switch to Dashboard</span>
          </button>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red hover:bg-accent-red/20 transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-6 min-h-[600px]">
        {/* ── Sidebar Navigation ── */}
        <div className="w-64 flex flex-col gap-2">
          {[
            { id: 'overview', label: 'Network Overview', icon: Activity },
            { id: 'infrastructure', label: 'Infrastructure', icon: Globe },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'audit', label: 'Audit Logs', icon: Terminal },
            { id: 'alerts', label: 'Alerts & Config', icon: Bell },
            { id: 'diagnostics', label: 'Diagnostics', icon: BarChart3 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border text-left ${
                activeTab === tab.id
                  ? 'bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan ring-1 ring-accent-cyan/20'
                  : 'bg-bg-primary/40 border-transparent text-text-dim hover:text-text-secondary hover:border-border-dim'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-tight">{tab.label}</span>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
            </button>
          ))}
          
          <div className="mt-auto p-4 glass-card rounded-2xl border-accent-amber/20 bg-accent-amber/5">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-accent-amber" />
              <span className="text-[10px] font-bold text-accent-amber uppercase">Security Alert</span>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed font-mono">
              3 unusual login attempts detected from IP 185.22.XX.XX in the last hour.
            </p>
          </div>
        </div>

        {/* ── Main Content Display ── */}
        <div className="flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Active Connections', value: '156', trend: '+12%', icon: Users, color: 'text-accent-cyan' },
                  { label: 'Total Throughput', value: '1.2 GB/s', trend: '+5%', icon: Zap, color: 'text-accent-amber' },
                  { label: 'Avg Latency', value: '42ms', trend: '-8ms', icon: Activity, color: 'text-accent-green' },
                  { label: 'Uptime', value: '99.99%', trend: 'Stable', icon: Shield, color: 'text-accent-purple' },
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-4 rounded-2xl border-border-dim hover:border-accent-cyan/30 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-bg-primary border border-border-dim group-hover:border-accent-cyan/30 transition-all`}>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-accent-green' : stat.trend.startsWith('-') ? 'text-accent-cyan' : 'text-text-dim'}`}>
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-text-dim tracking-wider">{stat.label}</p>
                    <p className="text-xl font-bold text-text-primary mt-1 font-mono tracking-tight">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Traffic Analysis Chart */}
              <div className="glass-card p-6 rounded-2xl border-border-dim">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">Traffic Analysis</h3>
                    <p className="text-[10px] text-text-dim font-mono mt-1">Live Global Data Flow</p>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase">
                    <div className="flex items-center gap-1.5 text-accent-cyan">
                      <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                      <span>Connections</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-accent-amber">
                      <div className="w-2 h-2 rounded-full bg-accent-amber" />
                      <span>Throughput</span>
                    </div>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_TRAFFIC_DATA}>
                      <defs>
                        <linearGradient id="colorAdminUp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f1720', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="connections" stroke="#22d3ee" fill="url(#colorAdminUp)" strokeWidth={2} />
                      <Area type="monotone" dataKey="throughput" stroke="#f59e0b" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
              {servers.map(server => (
                <div key={server.id} className="glass-card p-4 rounded-2xl border-border-dim hover:bg-bg-secondary/40 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg-primary flex items-center justify-center border border-border-dim text-accent-cyan">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-text-primary uppercase tracking-tight">{server.name}</h4>
                        <p className="text-[10px] text-text-dim font-mono">{server.region} • IP: 45.33.XX.XX</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="status-dot connected" />
                      <span className="text-[9px] font-mono text-accent-green font-bold">OPERATIONAL</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between text-[9px] font-mono text-text-dim uppercase">
                        <span>CPU Load</span>
                        <span>{server.load}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-bg-primary overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${server.load > 70 ? 'bg-accent-red' : server.load > 40 ? 'bg-accent-amber' : 'bg-accent-green'}`} 
                          style={{ width: `${server.load}%` }} 
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between text-[9px] font-mono text-text-dim uppercase">
                        <span>Latency</span>
                        <span>{server.latency}ms</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-bg-primary overflow-hidden">
                        <div 
                          className="h-full bg-accent-cyan" 
                          style={{ width: `${(server.latency / 300) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border-dim grid grid-cols-3 gap-2">
                    <button className="text-[9px] font-bold py-1.5 rounded-lg bg-bg-primary border border-border-dim text-text-dim hover:text-text-primary transition-all">REBOOT</button>
                    <button className="text-[9px] font-bold py-1.5 rounded-lg bg-bg-primary border border-border-dim text-text-dim hover:text-text-primary transition-all">FLUSH DNS</button>
                    <button className="text-[9px] font-bold py-1.5 rounded-lg bg-bg-primary border border-border-dim text-text-dim hover:text-text-primary transition-all uppercase">LOGS</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                  <input 
                    type="text" 
                    placeholder="Search users by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-bg-primary border border-border-dim rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono focus:ring-1 focus:ring-accent-cyan outline-none text-text-primary placeholder:text-text-dim"
                  />
                </div>
                <button className="px-4 py-2.5 rounded-xl bg-accent-cyan border border-accent-cyan text-bg-primary text-xs font-bold uppercase tracking-tight hover:brightness-110 transition-all flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Add User
                </button>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden border-border-dim">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-bg-primary/60 border-b border-border-dim">
                      <th className="px-4 py-3 text-[10px] font-bold text-text-dim uppercase tracking-wider">User Account</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-text-dim uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-text-dim uppercase tracking-wider">Joined</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-text-dim uppercase tracking-wider">Current Status</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-text-dim uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-dim">
                    {filteredUsers.map((user, i) => (
                      <tr key={i} className="hover:bg-bg-secondary/40 transition-all">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${user.role === 'admin' ? 'bg-accent-purple/20 text-accent-purple' : 'bg-accent-cyan/20 text-accent-cyan'}`}>
                              {user.email[0].toUpperCase()}
                            </div>
                            <span className="text-xs font-mono font-bold text-text-primary">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${user.role === 'admin' ? 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple' : 'bg-bg-primary border-border-dim text-text-dim'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs font-mono text-text-dim">{user.joined}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-accent-green shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-text-dim'}`} />
                            <span className={`text-[10px] font-mono font-bold ${user.status === 'online' ? 'text-accent-green' : 'text-text-dim'}`}>
                              {user.status === 'online' ? 'CONNECTED' : 'DISCONNECTED'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {user.role !== 'admin' && (
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleForceDisconnect(user.email)}
                                disabled={user.status === 'offline'}
                                className="p-1.5 rounded-lg text-text-dim hover:text-accent-amber hover:bg-accent-amber/10 transition-all disabled:opacity-20" 
                                title="Kill Session"
                              >
                                <Zap className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 rounded-lg text-text-dim hover:text-accent-red hover:bg-accent-red/10 transition-all" title="Remove User">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="glass-card rounded-2xl border-border-dim p-4 font-mono text-[11px]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-dim">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-accent-cyan" />
                    <span className="text-text-primary font-bold uppercase tracking-widest">System Audit Stream</span>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-primary border border-border-dim text-text-dim hover:text-text-primary transition-all">
                    <Download className="w-3 h-3" />
                    EXPORT CSV
                  </button>
                </div>
                <div className="space-y-3">
                  {MOCK_AUDIT_LOGS.map(log => (
                    <div key={log.id} className="flex gap-4 p-2 rounded-lg hover:bg-bg-primary/40 transition-all border border-transparent hover:border-border-dim/40 group">
                      <span className="text-text-dim w-24 shrink-0">[{log.time}]</span>
                      <span className={`w-2 h-2 mt-1 rounded-full shrink-0 ${log.status === 'success' ? 'bg-accent-green' : log.status === 'warning' ? 'bg-accent-amber' : 'bg-accent-red'}`} />
                      <div className="flex-1 flex justify-between gap-4">
                        <span className="text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">{log.event}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-text-dim uppercase tracking-tighter">USER: {log.user}</span>
                          <span className={`px-1.5 rounded bg-bg-primary border border-${log.status === 'success' ? 'accent-green/20 text-accent-green' : log.status === 'warning' ? 'accent-amber/20 text-accent-amber' : 'accent-red/20 text-accent-red'}`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-center">
                    <button className="text-[10px] text-accent-cyan hover:underline uppercase tracking-widest font-bold">Load Historical Logs</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="grid grid-cols-2 gap-6 animate-fade-in-up">
              <div className="glass-card p-6 rounded-2xl border-border-dim space-y-6">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight flex items-center gap-2">
                  <Bell className="w-4 h-4 text-accent-amber" />
                  Performance Thresholds
                </h3>
                <div className="space-y-6">
                  {[
                    { label: 'Critical Server Load', value: 85, color: 'accent-red' },
                    { label: 'Latency Warning', value: 200, unit: 'ms', color: 'accent-amber' },
                    { label: 'Bandwidth Cap Alert', value: 90, color: 'accent-cyan' },
                  ].map((config, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-text-secondary">{config.label}</span>
                        <span className={`text-xs font-mono font-bold text-${config.color}`}>{config.value}{config.unit || '%'}</span>
                      </div>
                      <input 
                        type="range" 
                        className={`w-full h-1.5 bg-bg-primary rounded-lg appearance-none cursor-pointer accent-current text-${config.color}`} 
                        defaultValue={config.value}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border-border-dim space-y-6">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight flex items-center gap-2">
                  <Settings className="w-4 h-4 text-accent-purple" />
                  System Configuration
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Maintenance Mode', desc: 'Prevent new user connections', active: false },
                    { label: 'Detailed Debug Logging', desc: 'Capture full packet headers (high disk usage)', active: true },
                    { label: 'Auto-Scaling Infrastructure', desc: 'Spawn instances on high load', active: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-primary/40 border border-border-dim hover:border-border-bright transition-all">
                      <div>
                        <p className="text-xs font-bold text-text-primary">{item.label}</p>
                        <p className="text-[10px] text-text-dim mt-0.5">{item.desc}</p>
                      </div>
                      <button className={`w-10 h-5 rounded-full relative transition-all ${item.active ? 'bg-accent-cyan' : 'bg-border-dim'}`}>
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${item.active ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2.5 rounded-xl bg-accent-purple/10 border border-accent-purple/30 text-accent-purple text-[10px] font-bold uppercase tracking-widest hover:bg-accent-purple/20 transition-all">
                  Commit Global Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="space-y-6 animate-fade-in-up">
               <div className="glass-card p-8 rounded-2xl border-border-dim flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/20">
                    <BarChart3 className="w-8 h-8 text-accent-cyan" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary uppercase tracking-tight">System Health Analyzer</h3>
                    <p className="text-xs text-text-dim font-mono max-w-sm mt-2">
                      Run professional diagnostics across all endpoints, relay nodes, and database clusters.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button className="px-6 py-2.5 rounded-xl bg-accent-cyan text-bg-primary text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                      Start Deep Scan
                    </button>
                    <button className="px-6 py-2.5 rounded-xl bg-bg-primary border border-border-dim text-text-dim text-xs font-bold uppercase tracking-widest hover:text-text-primary transition-all">
                      Schedule Audit
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Security Report', type: 'PDF', date: 'Yesterday' },
                    { label: 'Traffic Summary', type: 'JSON', date: '3 hours ago' },
                    { label: 'Compliance Audit', type: 'PDF', date: 'Last Week' },
                  ].map((report, i) => (
                    <div key={i} className="glass-card p-4 rounded-xl border-border-dim flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-text-dim group-hover:text-accent-cyan transition-colors" />
                        <div>
                          <p className="text-xs font-bold text-text-primary">{report.label}</p>
                          <p className="text-[9px] text-text-dim font-mono uppercase">{report.date} • {report.type}</p>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-bg-primary transition-all text-text-dim hover:text-accent-cyan">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
