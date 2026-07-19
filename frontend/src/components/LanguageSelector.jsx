const LANGUAGES = [
  { id: 'c', label: 'C' },
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' },
  { id: 'cpp', label: 'C++' },
  { id: 'javascript', label: 'Javascript' },
  { id: 'typescript', label: 'Typescript' },
  { id: 'sql', label: 'SQL' }
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
                ? 'active-lanSelector'
                : 'lanSelector'
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
