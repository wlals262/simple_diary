import React,{ useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

// https://jsonplaceholder.typicode.com/comments

const reducer = (state, action) => {
  switch(action.type){
    case 'INIT':{
      return action.data
    }
    case 'CREATE':{
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date
      }
      return [newItem, ...state];
    }
    case 'REMOVE':{
      return state.filter((it) => it.id !== action.targetId);
    } //id가 targetId가 아닌경우에만 state에 넣어 해당 id 삭제
    case 'EDIT':{
      return state.map((it)=> it.id === action.targetId ? {...it,content:action.newContent} : it);
    } //id가 원하는 id일 경우 다른 내용은 그대로 두고, content만 newContent로 변환
    default :
    return state;
  }
};

export const DiaryStateContext = React.createContext(); //전체본문을 감싸주게 배치 (data만 배치하기위한 context)
export const DiaryDispatchContext = React.createContext(); //나머지 onCreate, onRemove, onEdit 배치용 context


const App = () => {
  // const [data, setData] = useState([]);
  const [data, dispatch] = useReducer(reducer, []);

  const dataId = useRef(0);

  const getData = async () => { //async await로 작동하는 API 사용
    const res = await fetch(
      'https://jsonplaceholder.typicode.com/comments'
    ).then((res)=>res.json());
    
    const initData = res.slice(0,20).map((it) => {
      return {
        author : it.email,
        content : it.body,
        emotion : Math.floor(Math.random() * 5)+1,
        created_date : new Date().getTime(),
        id : dataId.current++
      }
    })

    dispatch({type: "INIT", data: initData}); //action의 타입이 init이고 data가 initData인 state를 받는다.
  };

  useEffect(()=> {
    getData();
  },[]);

  const onCreate = useCallback((author, content, emotion) => { //data(일기 배열)에 새로운 일기 추가
    dispatch({type:'CREATE', data: {author, content, emotion, id: dataId.current}});
    dataId.current += 1;
    },
    []
  ); //Mount될때 1번만 실행

  const onRemove = useCallback((targetId) => {
    dispatch({type:"REMOVE", targetId});
    // const newDiaryList = data.filter((it) => it.id !== targetId); //filter로 id가 targetId가 아닌것만 출력시킨다(삭제한 일기는 보이지 않음)
    // setData(data => data.filter((it) => it.id !== targetId)); //newDiaryList가 아닌 항상 최신 state가 전달되는 data를 사용해야 한다.
  }, []);

  const onEdit = useCallback((targetId, newContent) => {

    dispatch({type: "EDIT", targetId, newContent});

    // setData(
    //   data =>
    //   data.map((it) =>it.id === targetId ? {...it, content: newContent} : it)
    // );
  }, []);

  const memoizedDispatches = useMemo(() => {
    return {onCreate,onRemove,onEdit}
  }, []);

  const getDiaryAnalysis = useMemo(
    () => {

      const goodCount = data.filter((it) => it.emotion >= 3).length; //감정점수가 3이상인 일기의 count 수행
      const badCount = data.length - goodCount;
      const goodRatio = (goodCount / data.length) * 100;
      return {goodCount,badCount,goodRatio};
    }, [data.length]
  ); //이땐 함수가 아니라 값이다.

  const {goodCount, badCount, goodRatio} = getDiaryAnalysis;
  // 일기분석 시작 이 2번 출력되는데 맨처음 초기화할때 객체 0 0 0 을 초기화할때 1번,
  // 그리고 api를 받아올때 리렌더 되어서 다시 한번 출력된다.

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className='App'>
          <DiaryEditor /> 
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수: {goodCount}</div>
          <div>기분 나쁜 일기 개수: {badCount}</div>
          <div>기분 좋은 일기 비율: {goodRatio}%</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
