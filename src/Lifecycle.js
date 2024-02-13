import React,{useEffect,useState} from 'react';

const UnmountTest = () => {
    useEffect(() => {
        console.log("Mount!");

        return () => {
            //Unmount 시점에 실행
            console.log("Unmount!");
        }
    },[]); //Unmount를 확인하고 싶다면 Callback 함수에서 return 으로 함수를 return 시키면 됨

    return <div>Unmount Testing Component</div>
}

const Lifecycle = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggle = () => setIsVisible(!isVisible);

    return <div style={{ padding: 20 }}>
        <button onClick={toggle}>ON/OFF</button>
        {isVisible && <UnmountTest/>}
    </div> //단락회로 평가 : isVisible이 false이면 and연산이므로 Unmount 수행 x , true일 경우만 UnmountTest 렌더링 실시
};

export default Lifecycle;