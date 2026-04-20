import { useEffect, useRef, useState } from 'react'
import { Terminal, Trash2, ChevronDown, ChevronRight, Minimize2, Maximize2 } from 'lucide-react'

/*
 * TestLog – Bottom panel showing real-time test execution logs
 * Prints step-by-step test runner actions with timestamps
 */
export default function TestLog({ logs, clearLogs }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const scrollRef = useRef(null)

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current && isExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, isExpanded])

  const getTagClass = (tag) => {
    switch (tag) {
      case 'SYS': return 'tag-sys'
      case 'PASS': return 'tag-pass'
      case 'FAIL': return 'tag-fail'
      case 'WARN': return 'tag-warn'
      case 'INFO': return 'tag-info'
      default: return 'tag-sys'
    }
  }

  return (
    <div 
      className={`border-t border-border-dim bg-bg-secondary/80 backdrop-blur-md flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
        isExpanded ? 'h-[160px]' : 'h-[32px]'
      }`}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 h-[32px] border-b border-border-dim shrink-0 cursor-pointer hover:bg-bg-tertiary/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-text-dim" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-text-dim" />
          )}
          <Terminal className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-text-secondary uppercase">
            Test Log
          </span>
          <span className="text-[10px] font-mono text-text-dim ml-1">
            ({logs.length} entries)
          </span>
        </div>
        
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={clearLogs}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-text-dim hover:text-accent-red hover:bg-accent-red/10 transition-all cursor-pointer"
            id="clear-logs-button"
            title="Clear Logs"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-text-dim hover:text-text-primary hover:bg-bg-tertiary transition-all cursor-pointer"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Log Content */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto px-4 py-2 font-mono circuit-dots transition-opacity duration-200 ${
          isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        id="log-container"
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs font-mono text-text-dim/50">
              {'>'} Awaiting test execution...
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="log-line animate-fade-in-up">
              <span className="timestamp">[{log.timestamp}]</span>{' '}
              <span className={getTagClass(log.tag)}>[{log.tag}]</span>{' '}
              <span className="text-text-secondary">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
