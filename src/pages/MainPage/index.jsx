import { useEffect, useState } from 'react'
import '../../App.css'
import axios from 'axios'
import PokeCard from '../../components/PokeCard'
import AutoComplete from '../../components/AutoComplete'

function MainPage() {
 
  //모든 포켓몬 데이터를 가지고 있는 State
  const [allPokemons, setAllPokemons] = useState([])
  //실제로 리스트를 보여주는 포켓몬 데이터를 가지고 있는 state
  const [displayedPokemons, setDisplayedPokemons] = useState([])
  //한번에 보여주는 포켓몬 수
  const limitNum = 20;
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`; //처음 가져올땐 0~19, 더보기 누르면 20~39 이런식으로 가져옴

useEffect(() => {
  fetchPokeData(true);
}, [])

// useEffect(() => {
//  handleSearchInput(debouncedSearchTerm)
// }, [debouncedSearchTerm])

const filterDisplayedPokemonData = (allPokemonsData, displayedPokemons=[]) =>{
  const limit = displayedPokemons.length+limitNum;
  //모든 포켓몬 데이터에서 limitNum만큼 더 가져오기
  const array = allPokemonsData.filter((pokemon, index)=>index+1<=limit)  //모든 포켓몬 데이터에 인덱스를 붙여 limit값만큼 가져오기. +1은 인덱스는 0부터 시작하기 때문에 20개씩 가져올때 +1을 하지 않으면 21개를 가져옴
  return array;
}


const fetchPokeData = async () =>{
  try {
    //1008개 포켓몬 데이터 받아오기
    const response = await axios.get(url);
    //console.log(response.data.results);
    //console.log(pokemons);
    setAllPokemons(response.data.results);
    //실제로 화면에 보여줄 포켓몬 리스트 기억하는 state
    setDisplayedPokemons(filterDisplayedPokemonData(response.data.results))
  } catch (error) {
    console.error(error)
  }
}

  return (
    <article className='pt-6'>
        <header className='flex flex-col gap-2 w-full px-4 z-50'>
          <AutoComplete
            allPokemons={allPokemons}
            setDisplayedPokemons={setDisplayedPokemons}
          />
        </header>
        <section className='pt-6 flex flex-col justify-content items-center overflow-auto z-0'>
          <div className='flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl'>
            {displayedPokemons.length > 0 ? 
            ( 
              displayedPokemons.map(({url, name},index)=>
                  <PokeCard key={name} url={url} name={name}/>
               )
            ):
            (
              <h2 className='font-medium text-lg text-slate-900 mb-1'>
                포켓몬이 없습니다
              </h2>
            )}
          </div>
        </section>
        <div className='text-center'>
            {(allPokemons.length> displayedPokemons.length)&&(displayedPokemons.length !== 1)&&  //보여주는 포켓몬의 수가 전체 포켓몬보다 작거나 보여주는 포켓몬의 수가 1이 아니면(검색결과가 없을때) 더보기 버튼 보여주기
            (
              <button 
              onClick={()=>setDisplayedPokemons(filterDisplayedPokemonData(allPokemons, displayedPokemons))}
              className='bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white'>
                더보기  
              </button> 
            ) 
            }
               
        </div>
    </article>
  )
}

export default MainPage
