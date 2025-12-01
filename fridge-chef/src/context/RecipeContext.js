import React, { createContext, useReducer, useEffect } from 'react';

export const RecipeContext = createContext();

const initialState = {
  savedRecipes: JSON.parse(localStorage.getItem('myRecipes')) || [],
  // 👇 [중요] 이 부분이 없어서 에러가 난 것입니다! 꼭 있어야 해요.
  searchState: {
    query: "",
    results: [],
    category: "All",
    isExact: false
  }
};

const recipeReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      if (state.savedRecipes.some(r => r.RCP_SEQ === action.payload.RCP_SEQ)) {
        alert("이미 저장된 레시피입니다!");
        return state;
      }
      alert("나만의 레시피북에 저장되었습니다! 📝");
      return { ...state, savedRecipes: [...state.savedRecipes, { ...action.payload, myMemo: "" }] };
      
    case 'DELETE':
      if (!window.confirm("정말 삭제하시겠습니까?")) return state;
      return { ...state, savedRecipes: state.savedRecipes.filter(r => r.RCP_SEQ !== action.payload) };
      
    case 'UPDATE_MEMO':
      return {
        ...state,
        savedRecipes: state.savedRecipes.map(r => 
          r.RCP_SEQ === action.payload.id ? { ...r, myMemo: action.payload.memo } : r
        )
      };

    // 👇 [중요] 검색 상태를 업데이트하는 로직도 있어야 합니다.
    case 'SET_SEARCH_STATE':
      return {
        ...state,
        searchState: { ...state.searchState, ...action.payload }
      };
      
    default:
      return state;
  }
};

export const RecipeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  useEffect(() => {
    localStorage.setItem('myRecipes', JSON.stringify(state.savedRecipes));
  }, [state.savedRecipes]);

  // 여기서 ...state를 통해 savedRecipes와 searchState를 모두 내려보냅니다.
  return (
    <RecipeContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RecipeContext.Provider>
  );
};