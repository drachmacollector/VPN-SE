import { useState, useCallback, useRef } from 'react'
import LoginView from './components/LoginView'
import DashboardView from './components/DashboardView'
import AdminView from './components/AdminView'
import TestPanel from './components/TestPanel'
import TestLog from './components/TestLog'
import StatusBar from './components/StatusBar'

/*
 * ═══════════════════════════════════════════════════════
 *  SecureNet VPN Client – Main Application
 *  State Machine: Disconnected → Authenticating → Connecting → Connected → Error
 *  Per SRS Section 6.4 State Diagram
 * ═══════════════════════════════════════════════════════
 */

// Valid credentials for simulation
const VALID_CREDENTIALS = {
  email: 'admin@vpn.com',
  password: 'securepass123',
}

const SERVER_LOCATIONS = [
  { id: 'us-east', name: 'US-East (Virginia)', latency: 24, load: 45, region: 'NA' },
  { id: 'us-west', name: 'US-West (Oregon)', latency: 68, load: 32, region: 'NA' },
  { id: 'eu-west', name: 'EU-West (Ireland)', latency: 110, load: 78, region: 'EU' },
  { id: 'eu-central', name: 'EU-Central (Frankfurt)', latency: 125, load: 61, region: 'EU' },
  { id: 'ap-south', name: 'Asia Pacific (Mumbai)', latency: 240, load: 15, region: 'AS' },
  { id: 'sa-east', name: 'South America (São Paulo)', latency: 185, load: 22, region: 'SA' },
]

export default function App() {
  // ─── Core State Machine ───
  const [vpnState, setVpnState] = useState('disconnected') // disconnected | authenticating | connecting | connected | error
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userRole, setUserRole] = useState('user') // user | admin
  const [currentView, setCurrentView] = useState('dashboard') // dashboard | admin
  const [userList, setUserList] = useState([
    { email: 'admin@vpn.com', password: 'securepass123', role: 'admin', joined: '2026-04-20', status: 'offline' }
  ])

  // ─── Form State ───
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // ─── Server Location ───
  const [selectedServer, setSelectedServer] = useState(SERVER_LOCATIONS[0])

  // ─── Network Simulation ───
  const [bytesUp, setBytesUp] = useState(0)
  const [bytesDown, setBytesDown] = useState(0)
  const [localIp] = useState('192.168.1.' + Math.floor(Math.random() * 254 + 1))
  const [maskedIp] = useState('10.8.0.' + Math.floor(Math.random() * 254 + 1))
  const dataIntervalRef = useRef(null)

  // ─── Test Automation ───
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [activeTestId, setActiveTestId] = useState(null)
  const [logs, setLogs] = useState([])
  const testAbortRef = useRef(false)

  // ─── Logger ───
  const addLog = useCallback((tag, message) => {
    const now = new Date()
    const ts = now.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0')
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), timestamp: ts, tag, message }])
  }, [])

  const clearLogs = useCallback(() => setLogs([]), [])

  // ─── Data Flow Simulation ───
  const startDataFlow = useCallback(() => {
    if (dataIntervalRef.current) clearInterval(dataIntervalRef.current)
    // Speed multiplier based on server load (simulated)
    const multiplier = 1 + (100 - selectedServer.load) / 100 
    
    dataIntervalRef.current = setInterval(() => {
      setBytesUp(prev => prev + Math.floor((Math.random() * 2048 + 256) * multiplier))
      setBytesDown(prev => prev + Math.floor((Math.random() * 4096 + 512) * multiplier))
    }, 300)
  }, [selectedServer])

  const stopDataFlow = useCallback(() => {
    if (dataIntervalRef.current) {
      clearInterval(dataIntervalRef.current)
      dataIntervalRef.current = null
    }
  }, [])

  const resetDataFlow = useCallback(() => {
    stopDataFlow()
    setBytesUp(0)
    setBytesDown(0)
  }, [stopDataFlow])

  // ─── Authentication Logic ───
  const handleLogin = useCallback((emailVal, passwordVal) => {
    return new Promise((resolve) => {
      setVpnState('authenticating')
      setErrorMessage('')

      setTimeout(() => {
        // Find user in userList
        const user = userList.find(u => u.email === emailVal && u.password === passwordVal)

        if (user) {
          setIsAuthenticated(true)
          setUserRole(user.role)
          setVpnState('disconnected')
          setCurrentView('dashboard')
          
          // Update status for user in list
          setUserList(prev => prev.map(u => u.email === emailVal ? { ...u, status: 'offline' } : u))

          setEmail('')
          setPassword('')
          resolve(true)
        } else {
          setVpnState('disconnected')
          setErrorMessage('Invalid credentials provided')
          resolve(false)
        }
      }, 1200)
    })
  }, [userList])

  const handleRegister = useCallback((emailVal, passwordVal) => {
    return new Promise((resolve) => {
      setVpnState('authenticating')
      setErrorMessage('')

      setTimeout(() => {
        const existingUser = userList.find(u => u.email === emailVal)
        
        if (existingUser) {
          setVpnState('disconnected')
          setErrorMessage('An account with this email already exists')
          resolve(false)
          return
        }

        if (emailVal.includes('@') && passwordVal.length >= 6) {
          const newUser = {
            email: emailVal,
            password: passwordVal,
            role: 'user',
            joined: new Date().toISOString().split('T')[0],
            status: 'offline'
          }
          
          setUserList(prev => [...prev, newUser])
          setIsAuthenticated(true)
          setUserRole('user')
          setVpnState('disconnected')
          setCurrentView('dashboard')
          
          setEmail('')
          setPassword('')
          resolve(true)
        } else {
          setVpnState('disconnected')
          setErrorMessage('Email must be valid and password at least 6 characters')
          resolve(false)
        }
      }, 1200)
    })
  }, [userList])

  // ─── Connection Logic (FR-2.1, FR-2.2) ───
  const handleConnect = useCallback(() => {
    return new Promise((resolve) => {
      setVpnState('connecting')
      setErrorMessage('')

      setTimeout(() => {
        if (testAbortRef.current) {
          resolve(false)
          return
        }
        // FR-2.1 & FR-2.2: Tunnel established after auth
        setVpnState('connected')
        startDataFlow()
        resolve(true)
      }, 2000)
    })
  }, [startDataFlow])

  // ─── Disconnect Logic (FR-4.2) ───
  const handleDisconnect = useCallback(() => {
    stopDataFlow()
    resetDataFlow()
    setVpnState('disconnected')
    setErrorMessage('')
  }, [stopDataFlow, resetDataFlow])

  // ─── Error Simulation (FR-5.1) ───
  const handleNetworkError = useCallback(() => {
    stopDataFlow()
    setVpnState('error')
    setErrorMessage('Connection lost. Securely terminating session.')
  }, [stopDataFlow])

  // ─── Logout ───
  const handleLogout = useCallback(() => {
    stopDataFlow()
    resetDataFlow()
    setIsAuthenticated(false)
    setVpnState('disconnected')
    setErrorMessage('')
    setEmail('')
    setPassword('')
  }, [stopDataFlow, resetDataFlow])

  // ─── Reset from Error ───
  const handleDismissError = useCallback(() => {
    setVpnState('disconnected')
    setErrorMessage('')
    resetDataFlow()
  }, [resetDataFlow])

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-bg-primary schematic-grid">
      {/* ── Top Status Bar ── */}
      {/* <StatusBar vpnState={vpnState} isAuthenticated={isAuthenticated} /> */}

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 min-h-0">
        {/* ── VPN Client Interface (Center/Left) ── */}
        <main className="flex-1 flex items-center justify-center p-6 min-w-0 overflow-y-auto">
          {!isAuthenticated ? (
            <LoginView
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onLogin={handleLogin}
              onRegister={handleRegister}
              vpnState={vpnState}
              errorMessage={errorMessage}
              isTestRunning={isTestRunning}
            />
          ) : currentView === 'dashboard' ? (
            <DashboardView
              vpnState={vpnState}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onDismissError={handleDismissError}
              onLogout={handleLogout}
              bytesUp={bytesUp}
              bytesDown={bytesDown}
              localIp={localIp}
              maskedIp={maskedIp}
              errorMessage={errorMessage}
              isTestRunning={isTestRunning}
              selectedServer={selectedServer}
              setSelectedServer={setSelectedServer}
              servers={SERVER_LOCATIONS}
              userRole={userRole}
              onSwitchView={setCurrentView}
            />
          ) : (
            <AdminView 
              onSwitchView={setCurrentView}
              userList={userList}
              setUserList={setUserList}
              servers={SERVER_LOCATIONS}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* ── Test Automation Panel (Right Sidebar) ── */}
        <TestPanel
          vpnState={vpnState}
          isAuthenticated={isAuthenticated}
          isTestRunning={isTestRunning}
          activeTestId={activeTestId}
          setIsTestRunning={setIsTestRunning}
          setActiveTestId={setActiveTestId}
          testAbortRef={testAbortRef}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleConnect={handleConnect}
          handleDisconnect={handleDisconnect}
          handleNetworkError={handleNetworkError}
          handleLogout={handleLogout}
          handleDismissError={handleDismissError}
          addLog={addLog}
          clearLogs={clearLogs}
          setVpnState={setVpnState}
          setErrorMessage={setErrorMessage}
          resetDataFlow={resetDataFlow}
          setIsAuthenticated={setIsAuthenticated}
        />
      </div>

      {/* ── Test Log Footer ── */}
      <TestLog logs={logs} clearLogs={clearLogs} />
    </div>
  )
}
