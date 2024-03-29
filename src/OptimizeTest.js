import React,{ useState,useEffect } from "react";


const CounterA = React.memo(({count}) => {

    useEffect(() => {
        console.log(`CounterA Update - count : ${count}`);
    })

    return <div>{count}</div>
});

const CounterB =({obj}) => {
    useEffect(() => {
        console.log(`CounterB Update - obj : ${obj.count}`);
    })
    return <div>{obj.count}</div>
};

const areEqual = (prevProps, nextProps) => {
    if(prevProps.obj.count === nextProps.obj.count) {
        return true;
    }
    return false;
    /*
    return true //현재 프롭과 이전 프롭이 같다 => 리렌더링 X
    return false //현재 프롭과 이전 프롭이 다르다 => 리렌더링 O
    */
}

const MemoizedCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {

    const [count,setCount] = useState(1);
    const [obj,setObj] = useState({
        count: 1
    });



    return <div style={{padding:50}}>
        <div>
            <h2>Counter A</h2>
            <CounterA count={count}/>
            <button onClick={() => setCount(count)}>A button</button>
        </div>
        <div>
            <h2>Counter B</h2>
            <MemoizedCounterB obj={obj} />
            <button onClick={() => setObj({
                count: obj.count
            })}>B button</button>
        </div>
    </div>
}

export default OptimizeTest;