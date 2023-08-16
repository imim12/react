import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage'
import DetailPage from './pages/DatailPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage/>}/>   {/*element는 보여줄 페이지.  localhost:1111/  */}
        <Route path='/pokemon/:id' element={<DetailPage/>}/>   {/*포켓몬의 id를 넣어주면 해당 포켓몬 상세페이지로 이동*/}
      </Routes>
    </BrowserRouter>
  )
}

export default App