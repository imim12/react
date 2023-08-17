import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import {getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../firebase';

const NavBar = () => {

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const [show, setShow] = useState(false);

    const {pathname} = useLocation()  //useLocation hooks는 url정보를 가지고 있음. 

    const navigate = useNavigate();

    const [userData, setUserData] = useState({})

    useEffect(() => {
      
        const unsubscribe = onAuthStateChanged(auth, (user)=>{  //유저의 로그인 정보가 변할때 호출
            if(!user){  //user정보가 없으면
                navigate("/login");  //main페이지로
            }else if(user && pathname === "/login"){
                navigate("/");  //없으면 로그인 페이지로
            }
        })
      return () => {
        unsubscribe()  //더이상 사용하지 않을때 제거??
      }
    }, [pathname])
    

    const handleAuth = () => {
        signInWithPopup(auth, provider)   //signInWithPopup() 자체가 비동기 호출이라 .then사용
        .then(result =>{
            setUserData(result.user);
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
    
    const handleLogout = () =>{
        signOut(auth).then(() => {
            setUserData({});
        })
        .catch(error => {
            alert(error.message);
        })
    }


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
            ) : <SignOut>
                    <UserImg 
                        src={userData.photoURL} 
                        alt='userPhoto'
                    />
                    <Dropdown>
                        <span onClick = {handleLogout}>Sign out</span>
                    </Dropdown>
                </SignOut>
        }
        
    </NavWrapper>
  )
}


const UserImg = styled.img`
    border-radius: 50%;
    width: 100%;
    height: 100%;
`

const Dropdown = styled.div`
    position: absolute;
    top: 48px;
    right: 0px;
    background: rgb(19, 19, 19);
    border: 1px solid rgba(151, 151, 151, 0.34);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
    padding: 10px;
    font-size: 14px;
    letter-spacing: 3px;
    width: 100px;
    opacity: 0;
    color: #fff
`

const SignOut = styled.div`
    position: relative;
    height: 48px;
    width: 48px;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;

    &:hover  {
        ${Dropdown} {
            opacity: 1;
            transition-duration: 1s;
        }
    }
`

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