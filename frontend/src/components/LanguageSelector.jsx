const LANGUAGES = [
  { id: 'c', label: 'C' },
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' },
]

const LanguageSelector = ({ selected, onChange }) => {
  return (
    <div className="flex gap-2 p-4">
      {LANGUAGES.map((lang) => {
        const isActive = selected === lang.id
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => onChange(lang.id)}
            className={
              isActive
                ? 'px-4 py-2 rounded bg-blue-500 text-white'
                : 'px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300'
            }
          >
            {lang.label}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSelector
