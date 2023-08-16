import React, { useEffect, useRef } from 'react'

const BaseStat = ({valueStat,nameStat,type}) => {

    const bg=`bg-${type}`;

    const ref=useRef(null)  //ref : state와 다르게 업데이트가 되더라도 자동으로 렌더링 되지 않음
    //useRef가 사용된 태그에 접근 할 수 있음.
    //current의 초기값으로 null을 줬지만 div에 할당했기때문에 그 div의 요소가 current에 들어감
    
    useEffect(() => {
      const setValueStat = ref.current;
      //console.log("`1`1`1`1",ref.current);
      const calc= valueStat * (100/255);
      setValueStat.style.width = calc+'%';
    }, [])
    
    

  return (
        <tr className='w-full text-white'>
            <td className='sm:px-5'>{nameStat}</td>
            <td className='px-2 sm:px-3'>{valueStat}</td>
            <td>
                <div
                    className={
                        `flex items-start h-2 min-w-[10rem] overflow-hidden rounded bg-gray-600`
                    }
                >
                    <div ref={ref} className={`h-3 ${bg}`}></div>  
                </div>
            </td>
            <td className='px-2 sm:px-5'>255</td>
        </tr>
  )
}

export default BaseStat