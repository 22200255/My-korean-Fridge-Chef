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
      return {
        ...state,
        savedRecipes: [
          ...state.savedRecipes,
          { ...action.payload, myMemo: action.payload.myMemo || "" }
        ]
      };
    }

    case 'DELETE': {
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

    // 🔥 여기: 검색 상태 전체 초기화
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
