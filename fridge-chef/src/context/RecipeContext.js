import React, { createContext, useReducer, useEffect } from 'react';

export const RecipeContext = createContext();

// 검색/즐겨찾기 초기 상태
const initialState = {
  savedRecipes: JSON.parse(localStorage.getItem('myRecipes')) || [],
  searchState: {
    query: "",
    results: [],
    category: "All",
    isExact: false
  }
};

const recipeReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      // 이미 저장된 레시피면 그대로
      if (state.savedRecipes.some(r => r.RCP_SEQ === action.payload.RCP_SEQ)) {
        return state;
      }
      alert("나만의 레시피북에 저장되었습니다!");
      return { ...state, savedRecipes: [...state.savedRecipes, { ...action.payload, myMemo: "" }] };
    }

    case 'DELETE': {
      if (!window.confirm("정말 삭제하시겠습니까?")) return state; // confirm 로직 유지
      return {
        ...state,
        savedRecipes: state.savedRecipes.filter(
          (r) => r.RCP_SEQ !== action.payload
        )
      };
    }

    case 'UPDATE_MEMO': {
      const { id, memo } = action.payload;
      return {
        ...state,
        savedRecipes: state.savedRecipes.map((r) =>
          r.RCP_SEQ === id ? { ...r, myMemo: memo } : r
        )
      };
    }

    case 'SET_SEARCH_STATE': {
      return {
        ...state,
        searchState: {
          ...state.searchState,
          ...action.payload
        }
      };
    }

    // 검색 상태 전체 초기화
    case 'RESET_SEARCH': {
      return {
        ...state,
        searchState: {
          query: "",
          results: [],
          category: "All",
          isExact: false
        }
      };
    }

    default:
      return state;
  }
};

export const RecipeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  useEffect(() => {
    localStorage.setItem('myRecipes', JSON.stringify(state.savedRecipes));
  }, [state.savedRecipes]);

  return (
    <RecipeContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RecipeContext.Provider>
  );
};