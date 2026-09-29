import { ShieldCheck } from 'lucide-react'

export function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="/">
        <div className="brand-mark">
          <ShieldCheck size={21} strokeWidth={2.2} />
        </div>

        <div>
          <div className="brand-name">CyberMira</div>
          <div className="brand-tagline">
            Security intelligence for developers
          </div>
        </div>
      </a>

      <div className="status-pill">
        <span className="status-dot" />
        <span>Knowledge base online</span>
      </div>
    </header>
  )
}