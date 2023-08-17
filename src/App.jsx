import React from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage'
import DetailPage from './pages/DatailPage'
import LoginPage from './pages/LoginPage'
import NavBar from './components/NavBar'

const Layout=()=>{
  return(
    <>
      <NavBar/>
      <br/>
      <br/>
      <br/>
      <Outlet/>
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ='/' element={<Layout/>}>   {/*중첩 라우터를 만들기위해 감싸줌  */}
          <Route index element={<MainPage/>}/>   {/*원래 path ='/'자리에 index를 넣으면   localhost:1111/  */}
          <Route path='login' element={<LoginPage/>}/>
          <Route path='/pokemon/:id' element={<DetailPage/>}/>   {/*포켓몬의 id를 넣어주면 해당 포켓몬 상세페이지로 이동*/}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App