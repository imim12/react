import React, { useState } from 'react'

const AutoComplete = ({allPokemons, setDisplayedPokemons}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();  //submit 기본 동작인 현재 화면 리로딩 막기. submit은 실행됨(submit ->현재 화면 리로딩) 
        let text = searchTerm.trim() //공백 제거
        setDisplayedPokemons(filterNames(text))  //검색 결과에 맞는 포켓몬 넣어줌
    }

    const filterNames= (input) =>{
        const value = input.toLowerCase();
        return value ? allPokemons.filter((e)=> e.name.includes(value)) : []   //value값이 있으면 검색한 텍스트값이 이름에 있는지 찾아서 필터링
    }

    const checkEqualName = (input) =>{
        const filteredArray = filterNames(input);  //검색한 텍스트값이 포함된 이름이 있으면 그 객체를 담음
        return filteredArray[0]?.name === input ? [] : filteredArray;  //값과 완전히 같은 포켓몬 이름이 있으면 오토컴플리트를 띄우지 않기 위해 빈 배열 할당, 없으면 값이 포함된 포켓몬 이름들  띄워줌
        //?. 는 객체에 접근할때 속성값이 혹시 없을수도 있는데 그 때 이걸 붙이지 않으면 에러를 띄움. ?를 붙이면 에러는 띄우지 않고 undefined를 띄움
    }

  return (
    <div className='relative z-50'>
        <form 
            className='relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto'
            onSubmit={handleSubmit}
        >
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                className='text-xs w-[20.5rem] h-6 px-2 py-1 bg-[hsl(214,13%,47%)] rounded-lg text-gray-300 text-center'/>    
            <button 
                type='submit' 
                className='text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700'
            >   
                검색
            </button>
        </form>
        {checkEqualName(searchTerm).length>0 && (
            <div
                className={`w-full flex bottom-0 h-0 flex-col absolute justify-center items-center translate-y-2`}
            >
                <div
                    className={`w-0 h-0 bottom-0 border-x-transparent border-x-8 border-b-[8px] border-gray-700 -translate-y-1/2`}
                >
                </div>
                <ul
                    className={`w-40 max-h-[134px] py-1 bg-gray-700 rounded-lg absolute top-0 overflow-auto scrollbar-none`}
                >
                    {checkEqualName(searchTerm).map((e,i)=>(
                        <li key={`button-${i}`}>
                            <button onClick={()=>setSearchTerm(e.name)} //검색창에 이름 넣어줌
                                className='text-base w-full hover:bg-gray-600 p-[2px] text-gray-100'>
                                {e.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}
  </div>
  )
}

export default AutoComplete