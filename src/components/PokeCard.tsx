import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LazyImage from './LazyImage';
import { Link } from 'react-router-dom';
import { PokemonNameAndUrl } from '../types/PokemonData';
import { PokemonDetail } from '../types/PokemonDetail';

interface PokeData {
    id:number;
    type:string;
    name:string;
}

const PokeCard = ({url, name}:PokemonNameAndUrl) => {
 
    const [pokemon, setPokemon] = useState<PokeData>();

    useEffect(() => {
        fetchPokeDetailData()
    }, [])
    
    async function fetchPokeDetailData(){
        try {
            const response = await axios.get(url)
            //console.log(response.data)
            const pokemonData = formatPokemonData(response.data);
            setPokemon(pokemonData)
        } catch (error) {
            console.error(error)
        }
    }
 
    function formatPokemonData(params:PokemonDetail){
        //console.log("zzzzz",JSON.stringify(params))
        const {id, types, name} = params;
        const PokeData:PokeData = {
            id,
            name,
            type: types[0].type.name
        }
        return PokeData;
    }
    const bg = `bg-${pokemon?.type}`;   //?는 만약 pokemon이 데이터가 있으면 type을 가져오는것. 없어도 오류 안내고
    const border = `border-${pokemon?.type}`;
    const text = `text-${pokemon?.type}`;

    const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
    
  return (
    <>
    {pokemon &&  //pokemon && 는 if문처럼 사용하는 것으로 && 앞이 true일때(그냥 데이터도 true임) 그 뒤의 코드 실행. 또 이 안에서 pokemon 사용하려면 pokemon이 있어야함
        <Link     //a태그를 Link로 바꿈으로써 페이지 이동없이 화면 전환
            to={`/pokemon/${name}`}
            className={`box-border rounded-lg ${border} w-[8.5rem] h-[8.5rem] z-0 bg-slate-800 justify-between items-center`}
        >   
            <div className={`${text} h-[1.5rem] text-xs w-full pt-1 px-2  text-right rounded-t-lg`}>
                #{pokemon.id.toString().padStart(3,'00')}
            </div>
            <div className={`w-full f-6 flex items-center justify-center`}>
                <div className={`box-border relative flex w-full h-[5.5rem] basis justify-center items-center`}>
                    <LazyImage
                        url={img}
                        alt={name}
                    />
                </div>
            </div>
            <div className={`${bg} text-center text-xs text-zinc-100 h-[1.5rem] rounded-b-lg uppercase font-medium  pt-1`}>        
                {pokemon.name}
            </div>
        </Link>
    }
    </>
  )
}

export default PokeCard