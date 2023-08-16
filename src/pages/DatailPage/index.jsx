import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const DetailPage = () => {

    const [pokemon, setPokemon] = useState();
    const [isLoading, setIsLoading] = useState(true);


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
                const { name, id, types, weight, height, stats, abilities } = pokemonData;
                const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

                //포켓몬이 가지고 있는 타입별로 적이 공격하는 속성별 데미지 관계 데이터 가공
                const DamageRelations = await Promise.all(  //()의 비동기 작업을 한꺼번에 처리를 다 하고 반환
                    types.map(async (i)=>{
                        console.log('i', i)
                        const type = await axios.get(i.type.url);
                        console.log('type', type);
                        return type.data.damage_relations
                    })
                )
                const formattedPokemonData = {   //필요한 데이터 가공해서 넣기
                    id,
                    name,
                    weight : weight /10,
                    height : height /10,
                    previous : nextAndPreviousPokemon.previous,
                    next : nextAndPreviousPokemon.next,
                    abilities : formatPokemonAbilities(abilities),
                    stats : formatPokemonStats(stats),
                    DamageRelations
                }
                setPokemon(formattedPokemonData)  //useState에 가공한 데이터 넣어주기
                setIsLoading(false)  //로딩이 끝났음을 알려줌
                console.log(formattedPokemonData);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const formatPokemonStats = ([  //배열 구조분해 할당
        statHP,
        statATK,
        statDEP,
        statSATK,
        statSDEP,
        statSPD
    ]) => [
        { name: 'Hit Points', baseStat: statHP.base_stat },
        { name: 'Attack', baseStat: statATK.base_stat },
        { name: 'Defense', baseStat: statDEP.base_stat },
        { name: 'Special Attack', baseStat: statSATK.base_stat },
        { name: 'Special Defense', baseStat: statSDEP.base_stat },
        { name: 'Speed', baseStat: statSPD.base_stat }
    ]

    const formatPokemonAbilities = (abilities) =>{
        return abilities.filter((_, index) => index <=1) //_는 안의 객체는 사용 안 할거라서 오류 뜨지말라고 줌. 가지고 있는 어빌리티 중에 0~1까지만 필터링해서 가져옴. 더 많이 안 띄우기 위해?
                        .map((obj)=>obj.ability.name.replaceAll('-',' '))  //name에 -들어있으면 공백으로 치환                       
    }

    async function getNextAndPreviousPokemon(id){ 
        const urlPokemon =`${baseUrl}?limit=1&offset=${id-1}`;  //limit은 몇 개 들고올건지, offset은 어디서부터 들고올건지. offset은 0부터 시작하기 때문에 -1해줌. 예를들어 id가 3인 포켓몬은 offset에 2로 들어가지만 0부터 시작하기 때문에 세번째가 맞게됨
        const {data:pokemonData} = await axios.get(urlPokemon);

        const nextResponse = pokemonData.next && (await axios.get(pokemonData.next))   //pokemonData.next에 이미 url 담겨져 있음
        const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous)) 
        return {
            next :nextResponse?.data?.results?.[0]?.name,  //방어코드. 값이 없을때 에러 안 뜨도록
            previous : previousResponse?.data?.results?.[0]?.name
        }

    }

    if(isLoading) return <div>...loading</div>

  return (
    <div>DetailPage</div>
  )
}

export default DetailPage