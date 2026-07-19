import { useState } from 'react'
import LanguageSelector from '@components/LanguageSelector'
import TypeArea from '@components/TypeArea'
import Header from './components/Header';

const App = () => {
  const [language, setLanguage] = useState('c');

  return (
    <div className="flex justify-center">
      <div className="w-4/5">
        <Header />
        <LanguageSelector selected={language} onChange={setLanguage} />
        <TypeArea language={language} />
      </div>
    </div>
  )
}

export default App
