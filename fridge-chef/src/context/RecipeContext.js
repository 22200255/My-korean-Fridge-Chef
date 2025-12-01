import React, { createContext, useReducer, useEffect } from 'react';

// 1. Context 생성 (강의안 99p)
export const RecipeContext = createContext();

// 2. 초기 상태 및 Reducer 정의 (강의안 113p)
const initialState = {
  savedRecipes: JSON.parse(localStorage.getItem('myRecipes')) || []
};

const recipeReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      // 이미 있는지 중복 체크
      if (state.savedRecipes.some(r => r.RCP_SEQ === action.payload.RCP_SEQ)) {
        alert("이미 저장된 레시피입니다!");
        return state;
      }
      alert("레시피북에 추가되었습니다!");
      return { savedRecipes: [...state.savedRecipes, { ...action.payload, myMemo: "" }] };
      
    case 'DELETE':
      if (!window.confirm("정말 삭제하시겠습니까?")) return state;
      return { savedRecipes: state.savedRecipes.filter(r => r.RCP_SEQ !== action.payload) };
      
    case 'UPDATE_MEMO':
      return {
        savedRecipes: state.savedRecipes.map(r => 
          r.RCP_SEQ === action.payload.id 
            ? { ...r, myMemo: action.payload.memo } 
            : r
        )
      };
      
    default:
      return state;
  }
};

// 3. Provider 컴포넌트 생성
export const RecipeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  // 상태가 변할 때마다 로컬스토리지 자동 동기화 (강의안 94p useEffect 활용)
  useEffect(() => {
    localStorage.setItem('myRecipes', JSON.stringify(state.savedRecipes));
  }, [state.savedRecipes]);

  return (
    <RecipeContext.Provider value={{ savedRecipes: state.savedRecipes, dispatch }}>
      {children}
    </RecipeContext.Provider>
  );
};