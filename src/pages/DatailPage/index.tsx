import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loading } from '../../assets/Loading';
import { LessThan } from '../../assets/LessThan';
import { GreaterThan } from '../../assets/GreaterThan';
import { ArrowLeft } from '../../assets/ArrowLeft';
import { Balance } from '../../assets/Balance';
import { Vector } from '../../assets/Vector';
import Type from '../../components/Type';
import BaseStat from '../../components/BaseStat';
import DamageRelations from '../../components/DamageRelations';
import DamageModal from '../../components/DamageModal';
import { FormattedPokemonData } from '../../types/FormattedPokemonData';
import { Ability, PokemonDetail, Sprites, Stat } from '../../types/PokemonDetail';
import { DamageRelationOfPokemonTypes } from '../../types/DamageRelationOfPokemonTypes';
import { FlavorTextEntry, PokemonDescription } from '../../types/PokemonDescription';
import { PokemonData } from '../../types/PokemonData';

interface nextAndPreviousPokemon{
    next: string | undefined;
    previous: string | undefined;
}

const DetailPage = () => {

    const [pokemon, setPokemon] = useState<FormattedPokemonData>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)


    const params = useParams() as {id:string};  
    //포켓몬 이미지를 눌렀을때 PokeCard.jsx에서 to={`/pokemon/${name}`} 부분으로인해 포켓몬 이름이 주소에 들어가게 되고
    //App.jsx에서  <Route path='/pokemon/:id' element={<DetailPage/>}/>  로 :id 부분에 name값이 들어가서 DetailPage에 넘겨줌. 그 넘겨받은 값을 useParam()으로 받음
    //console.log(params)
    //console.log(params.id)  //포켓몬 name값이 나옴

    const pokemonId = params.id;
    const baseUrl = `https://pokeapi.co/api/v2/pokemon/`

    useEffect(() => {
        setIsLoading(true);
        fetchPokemonData(pokemonId);
    }, [])
    

    async function fetchPokemonData(id:string){
        try {
            const url = `${baseUrl}${id}`  
            const {data: pokemonData} = await axios.get<PokemonDetail>(url);  //{data} 디스트럭처링 : await axios.get(url)으로 가져온 객체 데이터에서 data 속성만 가져옴. 속성 이름을 pokemonData로 바꿔주기
            //console.log(pokemonData);

            if(pokemonData){
                const { name, id, types, weight, height, stats, abilities, sprites } = pokemonData;
                const nextAndPreviousPokemon: nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

                //포켓몬이 가지고 있는 타입별로 적이 공격하는 속성별 데미지 관계 데이터 가공
                const DamageRelations = await Promise.all(  //()의 비동기 작업을 한꺼번에 처리를 다 하고 반환
                    types.map(async (i)=>{
                        //console.log('i', i)
                        const type = await axios.get<DamageRelationOfPokemonTypes>(i.type.url);
                        //console.log("asd",JSON.stringify(type.data));
                        return type.data.damage_relations
                    })
                )
                const formattedPokemonData:FormattedPokemonData = {   //필요한 데이터 가공해서 넣기
                        id,
                        name,
                        weight: weight / 10,
                        height: height / 10,
                        previous: nextAndPreviousPokemon.previous,
                        next: nextAndPreviousPokemon.next,
                        abilities: formatPokemonAbilities(abilities),
                        stats: formatPokemonStats(stats),
                        DamageRelations,
                        types: types.map(type => type.type.name),
                        sprites: formatPokemonSprites(sprites),
                        description: await getPokemonDescription(id)        
                }
                setPokemon(formattedPokemonData)  //useState에 가공한 데이터 넣어주기
                setIsLoading(false)  //로딩이 끝났음을 알려줌
                //console.log("formattedPokemonData",JSON.stringify(formattedPokemonData));
            }

        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const filterAndFormatDescription = (flavortext:FlavorTextEntry[]): string[] =>{  //포켓몬 설명 중 한국어로 되어있는것만 가져옴
        const koreaDescriptions =flavortext
            ?.filter((text:FlavorTextEntry)=>text.language.name ==="ko")
            .map((text:FlavorTextEntry)=>text.flavor_text.replace(/\r|\n|f/g, ' ')) //text.flavor_text에 줄바꿈 문자가 들어가 있어서 이걸 ' '로 바꿔줌
        return koreaDescriptions
    }
    //console.log("~!",pokemon?.DamageRelations)  //처음에 마운트 될 때 pokemon은 undefined여서 ?로 값이 있을때만 나타나게 함. 렌더링 되면서 이 곳에서 출력 할게 생김

    const getPokemonDescription =async (id:number) =>{
        const url=`https://pokeapi.co/api/v2/pokemon-species/${id}/`

        const { data: pokemonSpecies } = await axios.get<PokemonDescription>(url)
        //console.log("~!~!",JSON.stringify(pokemonSpecies));
        const descriptions: string[] = filterAndFormatDescription(pokemonSpecies.flavor_text_entries)  //flavor_text_entries : 포켓몬 설명
        
        //배열 안에 있는 것 중 랜덤으로 하나 뽑기
        return  descriptions[Math.floor(Math.random()*descriptions.length)]
    }

    const formatPokemonSprites = (sprites: Sprites) => {
        const newSprites = { ...sprites };  //sprites 복사
        (Object.keys(newSprites) as (keyof typeof newSprites)[]).forEach(key =>{   //(keyof typeof newSprites)[] = 현재 key값만 가져오는 거라서 keyof를 사용하면 되는데 newSprites는 타입이 아니기때문에 typeof를 통해 타입으로 바꿔줌
            if(typeof newSprites[key] !== 'string'){  //키의 값이 url(string)이 아닌 null인 경우
                delete  newSprites[key];  //그 키는 없앰
            }
        })
            return Object.values(newSprites) as string[];  //객체의 value만 모아 객체로 반환하는것이기 때문에 as string[]으로 해줌
    }


    const formatPokemonStats = ([  //배열 구조분해 할당
        statHP,
        statATK,
        statDEP,
        statSATK,
        statSDEP,
        statSPD
    ]:Stat[]) => [
        { name: 'Hit Points', baseStat: statHP.base_stat },
        { name: 'Attack', baseStat: statATK.base_stat },
        { name: 'Defense', baseStat: statDEP.base_stat },
        { name: 'Special Attack', baseStat: statSATK.base_stat },
        { name: 'Special Defense', baseStat: statSDEP.base_stat },
        { name: 'Speed', baseStat: statSPD.base_stat }
    ]

    const formatPokemonAbilities = (abilities: Ability[]) =>{
        return abilities.filter((_, index) => index <=1) //_는 안의 객체는 사용 안 할거라서 오류 뜨지말라고 줌. 가지고 있는 어빌리티 중에 0~1까지만 필터링해서 가져옴. 더 많이 안 띄우기 위해?
                        .map((obj:Ability)=>obj.ability.name.replaceAll('-',' '))  //name에 -들어있으면 공백으로 치환                       
    }

    async function getNextAndPreviousPokemon(id:number){ 
        const urlPokemon =`${baseUrl}?limit=1&offset=${id-1}`;  //limit은 몇 개 들고올건지, offset은 어디서부터 들고올건지. offset은 0부터 시작하기 때문에 -1해줌. 예를들어 id가 3인 포켓몬은 offset에 2로 들어가지만 0부터 시작하기 때문에 세번째가 맞게됨
        const {data:pokemonData} = await axios.get(urlPokemon);

        const nextResponse = pokemonData.next && (await axios.get<PokemonData>(pokemonData.next))   //pokemonData.next에 이미 url 담겨져 있음
        const previousResponse = pokemonData.previous && (await axios.get<PokemonData>(pokemonData.previous)) 
        return {
            next :nextResponse?.data?.results?.[0]?.name,  //방어코드. 값이 없을때 에러 안 뜨도록
            previous : previousResponse?.data?.results?.[0]?.name
        }

    }

    if(isLoading)
    return (
        <div className={
            `absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50`
        }>
            <Loading className='w-12 h-12 z-50 animate-spin text-slate-900'/>
        </div>
    )

    if(!isLoading && !pokemon){
        return (
            <div>...NOT FOUND</div>
        )
    }

    const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`
    const bg = `bg-${pokemon?.types?.[0]}`;
    const text= `text-${pokemon?.types?.[0]}`;
    
    if(!isLoading && pokemon){
        return (
            //article 안에 section으로 공간을 나눠줌
            <article className='flex items-center gap-1 flex-col w-full'>  
                <div 
                    className={
                        `${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`
                    }
                >
                    {pokemon.previous &&(
                        <Link
                            className='absolute top-[40%] -translate-y-1/2 z-50 left-1'
                            to={`/pokemon/${pokemon.previous}`}
                            >   
                            <LessThan className='w-5 h-8 p-1'/>
                        </Link>
                    )}
        
                    {pokemon.next &&(
                        <Link
                            className='absolute top-[40%] -translate-y-1/2 z-50 right-1'
                            to={`/pokemon/${pokemon.next}`}
                            >   
                            <GreaterThan className='w-5 h-8 p-1'/>
                        </Link>
                    )}
                        <section className='w-full flex flex-col z-20 items-center justify-end relative h-full'>
                            <div className='absolute z-30 top-6 flex items-center w-full justify-between px-2'>
                                <div className='flex items-center gap-1'>
                                    <Link to="/">  {/* 루트로 감 */}
                                        <ArrowLeft className='w-6 h-8 text-zinc-200' />
                                    </Link>
                                    <h1 className='text-zinc-200 font-bold text-xl capitalize'>
                                         {pokemon.name}
                                    </h1>
                                </div>
                                <div className='text-zinc-200 font-bold text-md'>
                                    #{pokemon.id.toString().padStart(3, '00')}
                                </div>
                            </div>
                            <div className='relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16'>
                                <img
                                    src={img}
                                    width="100%"
                                    height="auto"
                                    loading="lazy"
                                    alt={pokemon.name}
                                    className={`object-contain h-full cursor-pointer`}
                                    onClick={()=>setIsModalOpen(true)}
                                />
                            </div>
                        </section>
        
                        <section className='w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4'>
                            <div className='flex items-center justify-center gap-4'>
                                {/* 포켓몬 타입 */}
                                {pokemon.types.map((type)=>(
                                    <Type key={type} type={type}/>
                                ))}
                            </div>
                            <h2 className={`text-base font-semibold ${text}`}>
                                정보
                            </h2>
                                <div className='flex w-full items-center justify-between max-w-[400px] text-center'>
                                    <div className='w-full'>
                                        <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
                                        <div className='text-sm flex mt-1 gap-2 justify-center  text-zinc-200'>
                                            <Balance />
                                            {pokemon.weight}kg
                                        </div>
        
                                    </div>
                                    <div className='w-full'>
                                        <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
                                        <div className='text-sm flex mt-1 gap-2 justify-center  text-zinc-200'>
                                            <Vector />
                                            {pokemon.height}m
                                        </div>
        
                                    </div>
                                    <div className='w-full'>
                                        <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
                                        {pokemon.abilities.map((ability) => (
                                            <div key={ability} className="text-[0.5rem] text-zinc-100 capitalize"> {ability}</div>
                                        ))}
                                    </div>
                                </div>
        
                                <h2 className={`text-base font-semibold ${text}`}>
                                    기본 능력치
                                </h2>
                                <div className='w-full'>
                                    <table>
                                        <tbody>
                                            {pokemon.stats.map((stat)=>(
                                                <BaseStat
                                                    key={stat.name}
                                                    valueStat={stat.baseStat}
                                                    nameStat={stat.name}
                                                    type={pokemon.types[0]}
                                                />
                                            ))}                                   
                                        </tbody>
                                    </table>                            
                                </div>   
        
                                <h2 className={`text-base font-semibold ${text}`}>
                                    설명
                                </h2>
                                <p className='text-md leading-4 font-sans text-zinc-200 max-w-[30rem] text-center'>
                                    {pokemon.description}
                                </p>
        
                                <div className='flex my-8 flex-wrap justify-center'>
                                    {pokemon.sprites.map((url,index)=>(         //화살표 함수에서 => () 는 return하지 않는다는 의미
                                        <img
                                            key={index}  //보통 index를 안 넣지만 바뀌지 않는 요소에는 넣어도 상관 없음
                                            src={url}
                                            alt="sprites"
                                        />
                                    ))}
                                </div>       
        
                        </section>        
                </div>
                {/* 이미지를 누르면 isModalOpen 상태값이 true가 되면서 밑의 코드 실행.
                모달은 div의 크기를 가로, 세로 100%로 해서 뒤덮음 */}
                {isModalOpen && 
                    <DamageModal 
                        setIsModalOpen={setIsModalOpen} 
                        damages={pokemon.DamageRelations}
                    />
                }
        
            </article>   
          )
    }
 
    return null;
}

export default DetailPage