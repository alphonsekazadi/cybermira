import { BookOpen, CheckCircle2, Copy } from 'lucide-react'

const pathLabels: Record<string, string> = {
  access_control: 'Access Control',
  attack_patterns: 'Attack Patterns',
  'authentication/hardening_and_detection': 'Authentication Hardening',
  'authentication/vulnerabilities': 'Authentication Vulnerabilities',
  detection: 'Detection',
  frameworks: 'Frameworks',
  injection: 'Injection',
  mitigation: 'Mitigation',
  owasp_top_10: 'OWASP Top 10',
}

type EvidenceCardProps = {
  paths?: string[]
  copied: boolean
  onCopy: () => void
}

export function EvidenceCard({
  paths,
  copied,
  onCopy,
}: EvidenceCardProps) {
  return (
    <div className="evidence-card">
      <div className="evidence-header">
        <div className="evidence-title">
          <BookOpen size={16} />
          <span>Evidence used</span>
        </div>

        <button className="copy-button" onClick={onCopy}>
          {copied ? (
            <>
              <CheckCircle2 size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="evidence-paths">
        {paths?.map((path) => (
          <span className="evidence-tag" key={path}>
            <span className="tag-dot" />
            {pathLabels[path] ?? path}
          </span>
        ))}
      </div>
    </div>
  )
}