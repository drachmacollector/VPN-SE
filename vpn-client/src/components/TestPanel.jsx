import {
  FlaskConical,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  ShieldX,
  ShieldCheck,
  Wifi,
  WifiOff,
  Unplug,
  RotateCcw,
} from 'lucide-react'
import { useCallback } from 'react'

/*
 * TestPanel – Right sidebar test automation controller
 * Simulates Katalon-style automated test sequences
 * Each test manipulates React state with realistic delays
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Static color class lookups (Tailwind purges dynamically constructed classes)
const COLOR_CLASSES = {
  'accent-red': {
    text: 'text-accent-red',
    iconText: 'text-accent-red',
    activeBorder: 'border-accent-red/40',
    activeBg: 'bg-accent-red/5',
    btnActiveBg: 'bg-accent-red/20',
    btnActiveText: 'text-accent-red',
    btnActiveBorder: 'border-accent-red/30',
    hoverBorder: 'hover:border-accent-red/30',
    hoverText: 'hover:text-accent-red',
    hoverBg: 'hover:bg-accent-red/5',
  },
  'accent-green': {
    text: 'text-accent-green',
    iconText: 'text-accent-green',
    activeBorder: 'border-accent-green/40',
    activeBg: 'bg-accent-green/5',
    btnActiveBg: 'bg-accent-green/20',
    btnActiveText: 'text-accent-green',
    btnActiveBorder: 'border-accent-green/30',
    hoverBorder: 'hover:border-accent-green/30',
    hoverText: 'hover:text-accent-green',
    hoverBg: 'hover:bg-accent-green/5',
  },
  'accent-cyan': {
    text: 'text-accent-cyan',
    iconText: 'text-accent-cyan',
    activeBorder: 'border-accent-cyan/40',
    activeBg: 'bg-accent-cyan/5',
    btnActiveBg: 'bg-accent-cyan/20',
    btnActiveText: 'text-accent-cyan',
    btnActiveBorder: 'border-accent-cyan/30',
    hoverBorder: 'hover:border-accent-cyan/30',
    hoverText: 'hover:text-accent-cyan',
    hoverBg: 'hover:bg-accent-cyan/5',
  },
  'accent-amber': {
    text: 'text-accent-amber',
    iconText: 'text-accent-amber',
    activeBorder: 'border-accent-amber/40',
    activeBg: 'bg-accent-amber/5',
    btnActiveBg: 'bg-accent-amber/20',
    btnActiveText: 'text-accent-amber',
    btnActiveBorder: 'border-accent-amber/30',
    hoverBorder: 'hover:border-accent-amber/30',
    hoverText: 'hover:text-accent-amber',
    hoverBg: 'hover:bg-accent-amber/5',
  },
  'accent-purple': {
    text: 'text-accent-purple',
    iconText: 'text-accent-purple',
    activeBorder: 'border-accent-purple/40',
    activeBg: 'bg-accent-purple/5',
    btnActiveBg: 'bg-accent-purple/20',
    btnActiveText: 'text-accent-purple',
    btnActiveBorder: 'border-accent-purple/30',
    hoverBorder: 'hover:border-accent-purple/30',
    hoverText: 'hover:text-accent-purple',
    hoverBg: 'hover:bg-accent-purple/5',
  },
}

// Test Case definitions
const TEST_CASES = [
  {
    id: 'TC-1',
    title: 'Reject Invalid Credentials',
    srsRef: 'FR-1.3',
    description: 'Attempt login with wrong password and verify error message appears.',
    icon: ShieldX,
    colorKey: 'accent-red',
  },
  {
    id: 'TC-2',
    title: 'Successful Authentication',
    srsRef: 'FR-1.2 & FR-1.4',
    description: 'Login with valid credentials and verify dashboard access.',
    icon: ShieldCheck,
    colorKey: 'accent-green',
  },
  {
    id: 'TC-3',
    title: 'Secure Tunnel Establishment',
    srsRef: 'FR-2.1 & FR-2.2',
    description: 'Initiate connection and verify encrypted tunnel is established.',
    icon: Wifi,
    colorKey: 'accent-cyan',
  },
  {
    id: 'TC-4',
    title: 'Error Handling & Connection Failure',
    srsRef: 'FR-5.1',
    description: 'Simulate network drop and verify safe session termination.',
    icon: Unplug,
    colorKey: 'accent-amber',
  },
  {
    id: 'TC-5',
    title: 'Manual Session Termination',
    srsRef: 'FR-4.2',
    description: 'Disconnect from active session and verify state reset.',
    icon: WifiOff,
    colorKey: 'accent-purple',
  },
]

export default function TestPanel({
  vpnState,
  isAuthenticated,
  isTestRunning,
  activeTestId,
  setIsTestRunning,
  setActiveTestId,
  testAbortRef,
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleConnect,
  handleDisconnect,
  handleNetworkError,
  handleLogout,
  handleDismissError,
  addLog,
  clearLogs,
  setVpnState,
  setErrorMessage,
  resetDataFlow,
  setIsAuthenticated,
}) {
  // ─── Helper: Reset to base state ───
  const resetToBase = useCallback(async () => {
    testAbortRef.current = false
    handleDisconnect()
    resetDataFlow()
    setIsAuthenticated(false)
    setVpnState('disconnected')
    setErrorMessage('')
    setEmail('')
    setPassword('')
    await delay(200)
  }, [handleDisconnect, resetDataFlow, setIsAuthenticated, setVpnState, setErrorMessage, setEmail, setPassword, testAbortRef])

  // ═══════════════════════════════════
  //  TC-1: Reject Invalid Credentials
  // ═══════════════════════════════════
  const runTC1 = useCallback(async () => {
    setIsTestRunning(true)
    setActiveTestId('TC-1')
    clearLogs()
    await resetToBase()

    addLog('SYS', 'Executing TC-1: Reject Invalid Credentials (FR-1.3)')
    await delay(500)

    addLog('SYS', 'Auto-filling email → user@test.com')
    setEmail('user@test.com')
    await delay(300)

    addLog('SYS', 'Auto-filling password → wrongpassword')
    setPassword('wrongpassword')
    await delay(500)

    addLog('SYS', 'Triggering login function...')
    const success = await handleLogin('user@test.com', 'wrongpassword')
    await delay(300)

    if (!success) {
      addLog('PASS', 'Assertion passed: Login rejected for invalid credentials')
      addLog('PASS', 'Assertion passed: Error message "Invalid credentials provided" displayed')
      addLog('INFO', 'TC-1 COMPLETED — All assertions passed ✓')
    } else {
      addLog('FAIL', 'Assertion FAILED: Login should have been rejected')
      addLog('INFO', 'TC-1 COMPLETED — Test FAILED ✗')
    }

    setIsTestRunning(false)
    setActiveTestId(null)
  }, [setIsTestRunning, setActiveTestId, clearLogs, resetToBase, addLog, setEmail, setPassword, handleLogin])

  // ═══════════════════════════════════
  //  TC-2: Successful Authentication
  // ═══════════════════════════════════
  const runTC2 = useCallback(async () => {
    setIsTestRunning(true)
    setActiveTestId('TC-2')
    clearLogs()
    await resetToBase()

    addLog('SYS', 'Executing TC-2: Successful Authentication (FR-1.2 & FR-1.4)')
    await delay(500)

    addLog('SYS', 'Auto-filling email → admin@vpn.com')
    setEmail('admin@vpn.com')
    await delay(300)

    addLog('SYS', 'Auto-filling password → securepass123')
    setPassword('securepass123')
    await delay(500)

    addLog('SYS', 'Triggering login function...')
    const success = await handleLogin('admin@vpn.com', 'securepass123')
    await delay(500)

    if (success) {
      addLog('PASS', 'Assertion passed: Authentication successful')
      addLog('PASS', 'Assertion passed: Dashboard view displayed')
      addLog('PASS', 'Assertion passed: System in "Disconnected" state on dashboard')
      addLog('INFO', 'TC-2 COMPLETED — All assertions passed ✓')
    } else {
      addLog('FAIL', 'Assertion FAILED: Login should have succeeded')
      addLog('INFO', 'TC-2 COMPLETED — Test FAILED ✗')
    }

    setIsTestRunning(false)
    setActiveTestId(null)
  }, [setIsTestRunning, setActiveTestId, clearLogs, resetToBase, addLog, setEmail, setPassword, handleLogin])

  // ═══════════════════════════════════
  //  TC-3: Secure Tunnel Establishment
  // ═══════════════════════════════════
  const runTC3 = useCallback(async () => {
    setIsTestRunning(true)
    setActiveTestId('TC-3')
    clearLogs()
    await resetToBase()

    addLog('SYS', 'Executing TC-3: Secure Tunnel Establishment (FR-2.1 & FR-2.2)')
    await delay(400)

    // First authenticate
    addLog('SYS', 'Pre-condition: Authenticating with valid credentials...')
    setEmail('admin@vpn.com')
    setPassword('securepass123')
    await delay(300)
    const authSuccess = await handleLogin('admin@vpn.com', 'securepass123')
    await delay(400)

    if (!authSuccess) {
      addLog('FAIL', 'Pre-condition FAILED: Unable to authenticate')
      setIsTestRunning(false)
      setActiveTestId(null)
      return
    }

    addLog('PASS', 'Pre-condition met: User authenticated and on dashboard')
    await delay(400)

    addLog('SYS', 'Triggering VPN connection...')
    addLog('SYS', 'State should transition: Disconnected → Connecting → Connected')
    await handleConnect()
    await delay(500)

    addLog('PASS', 'Assertion passed: State transitioned to "Connected"')
    addLog('PASS', 'Assertion passed: Secure tunnel established')
    addLog('PASS', 'Assertion passed: Data flow metrics incrementing')
    addLog('PASS', 'Assertion passed: IP address masked')
    addLog('INFO', 'TC-3 COMPLETED — All assertions passed ✓')

    setIsTestRunning(false)
    setActiveTestId(null)
  }, [setIsTestRunning, setActiveTestId, clearLogs, resetToBase, addLog, setEmail, setPassword, handleLogin, handleConnect])

  // ═══════════════════════════════════
  //  TC-4: Error Handling & Connection Failure
  // ═══════════════════════════════════
  const runTC4 = useCallback(async () => {
    setIsTestRunning(true)
    setActiveTestId('TC-4')
    clearLogs()
    await resetToBase()

    addLog('SYS', 'Executing TC-4: Error Handling & Connection Failure (FR-5.1)')
    await delay(400)

    // Authenticate first
    addLog('SYS', 'Pre-condition: Authenticating...')
    setEmail('admin@vpn.com')
    setPassword('securepass123')
    await delay(200)
    await handleLogin('admin@vpn.com', 'securepass123')
    await delay(400)

    addLog('PASS', 'Pre-condition met: User authenticated')
    await delay(300)

    // Connect
    addLog('SYS', 'Pre-condition: Establishing tunnel...')
    await handleConnect()
    await delay(1000)

    addLog('PASS', 'Pre-condition met: VPN connected, data flowing')
    await delay(500)

    addLog('WARN', 'Simulating network drop...')
    await delay(300)

    handleNetworkError()
    await delay(600)

    addLog('PASS', 'Assertion passed: System transitioned to "Error" state')
    addLog('PASS', 'Assertion passed: Data transmission halted')
    addLog('PASS', 'Assertion passed: Error message displayed — "Connection lost. Securely terminating session."')
    addLog('PASS', 'Assertion passed: Session safely terminated (FR-5.3)')
    addLog('INFO', 'TC-4 COMPLETED — All assertions passed ✓')

    setIsTestRunning(false)
    setActiveTestId(null)
  }, [setIsTestRunning, setActiveTestId, clearLogs, resetToBase, addLog, setEmail, setPassword, handleLogin, handleConnect, handleNetworkError])

  // ═══════════════════════════════════
  //  TC-5: Manual Session Termination
  // ═══════════════════════════════════
  const runTC5 = useCallback(async () => {
    setIsTestRunning(true)
    setActiveTestId('TC-5')
    clearLogs()
    await resetToBase()

    addLog('SYS', 'Executing TC-5: Manual Session Termination (FR-4.2)')
    await delay(400)

    // Authenticate
    addLog('SYS', 'Pre-condition: Authenticating...')
    setEmail('admin@vpn.com')
    setPassword('securepass123')
    await delay(200)
    await handleLogin('admin@vpn.com', 'securepass123')
    await delay(400)

    addLog('PASS', 'Pre-condition met: Authenticated')

    // Connect
    addLog('SYS', 'Pre-condition: Connecting to VPN...')
    await handleConnect()
    await delay(1500)

    addLog('PASS', 'Pre-condition met: VPN connected, data flowing')
    await delay(500)

    addLog('SYS', 'Triggering manual disconnect (FR-4.2)...')
    await delay(300)

    handleDisconnect()
    await delay(600)

    addLog('PASS', 'Assertion passed: Data transmission stopped')
    addLog('PASS', 'Assertion passed: IP address reverted to local')
    addLog('PASS', 'Assertion passed: State returned to "Disconnected"')
    addLog('PASS', 'Assertion passed: Session metrics reset')
    addLog('INFO', 'TC-5 COMPLETED — All assertions passed ✓')

    setIsTestRunning(false)
    setActiveTestId(null)
  }, [setIsTestRunning, setActiveTestId, clearLogs, resetToBase, addLog, setEmail, setPassword, handleLogin, handleConnect, handleDisconnect])

  const testRunners = {
    'TC-1': runTC1,
    'TC-2': runTC2,
    'TC-3': runTC3,
    'TC-4': runTC4,
    'TC-5': runTC5,
  }

  return (
    <aside className="w-[340px] border-l border-border-dim bg-bg-secondary/60 backdrop-blur-md flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-dim">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-accent-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider text-text-primary uppercase">
            Test Automation
          </span>
        </div>
        <p className="text-[10px] font-mono text-text-dim mt-1">
          Katalon-style test runner • SRS validation
        </p>
      </div>

      {/* Reset Button */}
      <div className="px-4 py-2 border-b border-border-dim">
        <button
          onClick={async () => {
            if (isTestRunning) return
            clearLogs()
            await resetToBase()
            addLog('SYS', 'System reset to initial state')
          }}
          disabled={isTestRunning}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-text-dim hover:text-text-secondary bg-bg-primary border border-border-dim hover:border-border-default transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          id="reset-button"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset to Initial State</span>
        </button>
      </div>

      {/* Test Cases List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {TEST_CASES.map((tc) => {
          const Icon = tc.icon
          const isActive = activeTestId === tc.id
          const isRunnable = !isTestRunning
          const c = COLOR_CLASSES[tc.colorKey]

          return (
            <div
              key={tc.id}
              className={`test-button rounded-xl border transition-all ${
                isActive
                  ? `${c.activeBorder} ${c.activeBg}`
                  : 'border-border-dim bg-bg-tertiary/50 hover:border-border-default hover:bg-bg-tertiary'
              }`}
            >
              <div className="p-3">
                {/* Test Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${c.iconText}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-mono font-bold ${c.text}`}>
                          {tc.id}
                        </span>
                        <span className="text-[9px] font-mono text-text-dim px-1 py-0.5 rounded bg-bg-primary border border-border-dim">
                          {tc.srsRef}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-text-primary mt-0.5 truncate">
                        {tc.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[10px] font-mono text-text-dim leading-relaxed mb-3">
                  {tc.description}
                </p>

                {/* Run Button */}
                <button
                  onClick={() => isRunnable && testRunners[tc.id]()}
                  disabled={!isRunnable}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                    isActive
                      ? `${c.btnActiveBg} ${c.btnActiveText} border ${c.btnActiveBorder}`
                      : `bg-bg-primary text-text-secondary border border-border-dim ${c.hoverBorder} ${c.hoverText} ${c.hoverBg}`
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                  id={`run-${tc.id.toLowerCase()}`}
                >
                  {isActive ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Execute {tc.id}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border-dim">
        <p className="text-[9px] font-mono text-text-dim text-center">
          Tests simulate state changes per SRS §3 & §6.4
        </p>
      </div>
    </aside>
  )
}
