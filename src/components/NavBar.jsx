import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const NavBar = () => {

    const [show, setShow] = useState(false);

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
    //show라는 props를 NavWrapper컴포넌트에 내려주기. show값이 true면 navBar가 검정 색상으로 변화
    <NavWrapper show={show}>   
        <Logo>
            <Image
                alt="Poke logo"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                onClick={()=>(window.location.href="/")}
            />    
        </Logo>
    </NavWrapper>
  )
}

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
top:0;
left:0;
height:70px;
display:flex;
background-color: ${props => props.show ? "#090b13" : "transparent"}
justify-content:space-between;
align-items:center;
padding : 0 36px;
letter-spacing:16px;
z-index:100;
`

export default NavBar