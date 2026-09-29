export function MarkdownText({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/)

  return (
    <div className="markdown-content">
      {blocks.map((block, index) => {
        const lines = block.split('\n')

        if (lines.every((line) => line.trim().startsWith('- '))) {
          return (
            <ul key={index}>
              {lines.map((line, lineIndex) => (
                <li key={`${index}-${lineIndex}`}>
                  {formatInline(line.replace(/^- /, ''))}
                </li>
              ))}
            </ul>
          )
        }

        if (block.startsWith('### ')) {
          return (
            <h3 key={index}>
              {formatInline(block.replace(/^### /, ''))}
            </h3>
          )
        }

        if (block.startsWith('## ')) {
          return (
            <h3 key={index}>
              {formatInline(block.replace(/^## /, ''))}
            </h3>
          )
        }

        return (
          <p key={index}>
            {lines.map((line, lineIndex) => (
              <span key={`${index}-${lineIndex}`}>
                {formatInline(line)}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

function formatInline(text: string) {
  const pieces = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)

  return pieces.map((piece, index) => {
    if (piece.startsWith('**') && piece.endsWith('**')) {
      return <strong key={index}>{piece.slice(2, -2)}</strong>
    }

    if (piece.startsWith('`') && piece.endsWith('`')) {
      return <code key={index}>{piece.slice(1, -1)}</code>
    }

    return piece
  })
}