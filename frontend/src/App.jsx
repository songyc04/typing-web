import { useState } from 'react'
import LanguageSelector from '@components/LanguageSelector'
import TypeArea from '@components/TypeArea'

const App = () => {
  const [language, setLanguage] = useState('c');

  return (
    <div>
      <LanguageSelector selected={language} onChange={setLanguage} />
      <TypeArea language={language} />
    </div>
  )
}

export default App
