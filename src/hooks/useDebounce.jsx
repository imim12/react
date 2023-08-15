import { useEffect, useState } from "react";

export const useDebounce = (value, delay)=>{
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(()=>{

        const handler = setTimeout(()=>{
            setDebouncedValue(value);
        },delay);

        return () =>{    //delay시간이 지나기 전에 value가 다시 호출되면  clearTimeout(handler)으로 현재 setTimeout()을 취소하고 다시 처음부터  setTimeout() 실행
            clearTimeout(handler);
        }
    },[value, delay])

    return debouncedValue;
}