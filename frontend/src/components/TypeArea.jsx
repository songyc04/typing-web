import cSnippets from '@data/c.json'
import javaSnippets from '@data/java.json'
import pythonSnippets from '@data/python.json'

const SNIPPETS = {
  c: cSnippets,
  java: javaSnippets,
  python: pythonSnippets,
}

const TypeArea = ({ language }) => {
  const snippet = SNIPPETS[language]?.[0]

  if (!snippet) {
    return <div className="p-4">No snippet available.</div>
  }

  const lines = snippet.code.split('\n')

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{snippet.title}</h2>
      <div className="font-ibm-plex-mono bg-gray-100 p-4 rounded">
        {lines.map((line, idx) => (
          <div key={idx} className="flex">
            <span className="w-8 text-right pr-3 text-gray-500 select-none">
              {idx + 1}
            </span>
            <span className="whitespace-pre">{line || ' '}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TypeArea
