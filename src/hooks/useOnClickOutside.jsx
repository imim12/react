import { useEffect } from "react";

export default function useOnClickOutside(ref, handler){
    
    useEffect(() => {

        const listener = (event) =>{
            
            //모달 안을 클릭했는지
            if(!ref.current || ref.current.contains(event.target)){  //ref.current가 있는지(==ref를 DOM요소에 적용했는지), 클릭한 곳이 ref 적용된 DOM 요소에 속해있는지(==모달창 안인지)
                return;   //모달 안이기 때문에 모달창 안 닫아도 됨
            }
            
            //모달 밖을 클릭했는지
            handler()  //handler는 DamageModal.jsx에서 useOnClickOutside(ref, ()=>setIsModalOpen(false)); 부분의 setIsModalOpen(false)을 호출하는 것이라 모달창 닫기가 됨
        }
        document.addEventListener("mousedown", listener);

        return () =>{  //이 컴포넌트를 더 이상 사용 안 하면  mousedown 이벤트 제거
            document.removeEventListener("mousedown", listener);
        }

    }, [ref, handler])
    
}