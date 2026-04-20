import { useState, useCallback, useRef } from 'react'
import LoginView from './components/LoginView'
import DashboardView from './components/DashboardView'
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

export default function App() {
  // ─── Core State Machine ───
  const [vpnState, setVpnState] = useState('disconnected') // disconnected | authenticating | connecting | connected | error
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // ─── Form State ───
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
    dataIntervalRef.current = setInterval(() => {
      setBytesUp(prev => prev + Math.floor(Math.random() * 2048) + 256)
      setBytesDown(prev => prev + Math.floor(Math.random() * 4096) + 512)
    }, 300)
  }, [])

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

  // ─── Authentication Logic (FR-1.1 through FR-1.4) ───
  const handleLogin = useCallback((emailVal, passwordVal) => {
    return new Promise((resolve) => {
      setVpnState('authenticating')
      setErrorMessage('')

      setTimeout(() => {
        if (emailVal === VALID_CREDENTIALS.email && passwordVal === VALID_CREDENTIALS.password) {
          // FR-1.2: Grant access with valid credentials
          // FR-1.4: Establish session after successful auth
          setIsAuthenticated(true)
          setVpnState('disconnected')
          setEmail('')
          setPassword('')
          resolve(true)
        } else {
          // FR-1.3: Reject invalid credentials
          setVpnState('disconnected')
          setErrorMessage('Invalid credentials provided')
          resolve(false)
        }
      }, 1200)
    })
  }, [])

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
        <main className="flex-1 flex items-center justify-center p-6 min-w-0">
          {!isAuthenticated ? (
            <LoginView
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onLogin={handleLogin}
              vpnState={vpnState}
              errorMessage={errorMessage}
              isTestRunning={isTestRunning}
            />
          ) : (
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
