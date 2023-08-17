import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import styled from 'styled-components'
import {getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import app from '../firebase';

const NavBar = () => {

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const [show, setShow] = useState(false);

    const {pathname} = useLocation()  //useLocation hooks는 url정보를 가지고 있음. 

    const handleAuth = () => {
        signInWithPopup(auth, provider)   //signInWithPopup() 자체가 비동기 호출이라 .then사용
        .then(result =>{
            console.log(result)
        })
        .catch(error =>{
            console.log(error)
        })
    }

    const listener = () => {
        if(window.scrollY>50){  //스크롤 위치가 50을 넘으면(밑으로 50)
            setShow(true);      //navBar 색상을 변하게 하기 위한 state값을 ture로 줌
        }else{
            setShow(false);
        }

    }

    useEffect(() => {
        window.addEventListener('scroll', listener);

        return () =>{  //화면이 언마운트 될 때 리스너 등록한것 제거하기
        window.removeEventListener('scroll', listener);
      }
    }, [])
    

  return (
    //show라는 props를 NavWrapper컴포넌트에 내려주기. show값이 true면 navBar가 검정 색상으로 변화.  $show는 props로 boolean값 넘기면 경고가 떠서 저렇게 $를 붙이면 경고 안 남
    <NavWrapper $show={show}>   
        <Logo>
            <Image
                alt="Poke logo"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                onClick={()=>(window.location.href="/")}
            />    
        </Logo>
        {pathname === '/login' ?   //현재 url이 /login 일때만 login 버튼 보여주기
            (
                <Login onClick={handleAuth}>
                    Login
                </Login>
            ) : null
        }
        
    </NavWrapper>
  )
}

const Login = styled.a`
background-color:rgba(0,0,0,0.6);
padding : 8px 16px;
text-transform : uppercase;
letter-spacing : 1.55px;
border : 1px solid #f9f9f9;
border-radius : 4px;
transition : all 0.2s ease 0s;
color : white;
cursor: pointer;
&:hover{
    background-color : #f9f9f9;
    color : #000;
    border-color: transparent
}
`

const Image= styled.img`
    cursor: pointer;
    width:100%
`;

const Logo=styled.a`
    padding : 0;
    width:50px;
    margin-top:4px;
`

const NavWrapper = styled.nav`
position: fixed;
top: 0;
left: 0;
right: 0;
height: 70px;
display: flex;
background-color: ${props => props.show ? "#090b13" : "transparent"};
justify-content: space-between;
align-items: center;
padding: 0 36px;
letter-spacing: 16px;
z-index: 100;
`

export default NavBar