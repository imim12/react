import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const DetailPage = () => {

    const params = useParams();  
    //포켓몬 이미지를 눌렀을때 PokeCard.jsx에서 to={`/pokemon/${name}`} 부분으로인해 포켓몬 이름이 주소에 들어가게 되고
    //App.jsx에서  <Route path='/pokemon/:id' element={<DetailPage/>}/>  로 :id 부분에 name값이 들어가서 DetailPage에 넘겨줌. 그 넘겨받은 값을 useParam()으로 받음
    //console.log(params)
    //console.log(params.id)  //포켓몬 name값이 나옴
    const pokemonId = params.id;
    const baseUrl = `https://pokeapi.co/api/v2/pokemon/`

    useEffect(() => {
        fetchPokemonData();
    }, [])
    

    async function fetchPokemonData(){
        try {
            const url = `${baseUrl}${pokemonId}`  
            const {data: pokemonData} = await axios.get(url);  //{data} 디스트럭처링 : await axios.get(url)으로 가져온 객체 데이터에서 data 속성만 가져옴. 속성 이름을 pokemonData로 바꿔주기
            console.log(pokemonData);

            if(pokemonData){
                const { name, id, types, weight, height, state, abilities } = pokemonData;
                const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);
                console.log(nextAndPreviousPokemon)
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function getNextAndPreviousPokemon(id){ 
        const urlPokemon =`${baseUrl}?limit=1&offset=${id-1}`;  //limit은 몇 개 들고올건지, offset은 어디서부터 들고올건지. offset은 0부터 시작하기 때문에 -1해줌. 예를들어 id가 3인 포켓몬은 offset에 2로 들어가지만 0부터 시작하기 때문에 세번째가 맞게됨
        const {data:pokemonData} = await axios.get(urlPokemon);
        console.log("****",pokemonData)

        const nextResponse = pokemonData.next && (await axios.get(pokemonData.next))   //pokemonData.next에 이미 url 담겨져 있음
        const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous)) 

        console.log("nextResponse",nextResponse, "previousResponse", previousResponse)
        return {
            next :nextResponse?.data?.results?.[0]?.name,  //방어코드. 값이 없을때 에러 안 뜨도록
            previous : previousResponse?.data?.results?.[0]?.name
        }

    }


  return (
    <div>DetailPage</div>
  )
}

export default DetailPage