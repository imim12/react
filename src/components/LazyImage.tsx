import React, { useEffect, useState } from 'react'

interface LazyImageProps {
    url : string;
    alt : string;
}


const LazyImage = ({url, alt}:LazyImageProps) => {
    const [isLoading,setIsLoading] = useState<boolean>(true);  //초기값 true  //5. 랜더링. 
    const [opacity, setOpacity] = useState<string>('opacity-0'); 

    useEffect(()=>{  //1.   //랜더링 과정을 생각해봄. 5번이 먼저 일어나고 3번이 일어나는지 잘 모르겠음
        isLoading ? setOpacity('opacity-0') : setOpacity('opacity-100');  //4.  setOpacity값 변경
    },[isLoading])  //3. isLoading 값이 바뀔때마다 useEffect 실행

  return (
    <>
        {isLoading && (   //6. 랜더링 되면서 isLoading 값이 false이기 때문에 여긴 자동으로 안 보임
            <div className='absolute h-full  z-10 w-full flex items-center justify-center'>
                ...loading
            </div>
        )}
        <img 
            src={url}
            alt={alt}
            width="100%"
            height="auto"
            loading="lazy"
            onLoad={()=>setIsLoading(false)} //2. //onLoad= 이미지 로딩이 다 될때의 상태를 말함. setIsLoading(false)값을 줘서 ...loading이 안보이게함  
            className={`object-contain h-full ${opacity}`} //6. 바뀐 값이 opacity에 들어감
        />
    </>
  )
}

export default LazyImage