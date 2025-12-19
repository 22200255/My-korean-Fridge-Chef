import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

export const RecipeContext = createContext();

const MOCK_API = process.env.REACT_APP_MOCK_API;

const initialState = {
  savedRecipes: [], // 서버에서 받아올 데이터
  searchState: {
    query: "",
    results: [],
    category: "All",
    isExact: false
  },
  loading: false,
  error: null
};

const recipeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SAVED_RECIPES': // [Read] 서버 데이터로 초기화
      return { ...state, savedRecipes: action.payload };

    case 'ADD_SUCCESS': // [Create] 추가 성공
      return { ...state, savedRecipes: [...state.savedRecipes, action.payload] };

    case 'DELETE_SUCCESS': // [Delete] 삭제 성공
      return { ...state, savedRecipes: state.savedRecipes.filter(r => r.id !== action.payload) };

    case 'UPDATE_SUCCESS': // [Update] 수정 성공
      return {
        ...state,
        savedRecipes: state.savedRecipes.map(r => 
          r.id === action.payload.id ? action.payload : r
        )
      };

    case 'SET_SEARCH_STATE':
      return { ...state, searchState: { ...state.searchState, ...action.payload } };
      
    case 'RESET_SEARCH':
      return {
        ...state,
        searchState: { query: "", results: [], category: "All", isExact: false }
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export const RecipeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  // [Read] 앱 실행 시 MockAPI에서 데이터 불러오기
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!MOCK_API) return;

      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await axios.get(MOCK_API);
        dispatch({ type: 'SET_SAVED_RECIPES', payload: response.data });
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
        dispatch({ type: 'SET_ERROR', payload: "데이터를 불러오지 못했습니다." });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    fetchSavedRecipes();
  }, []);

  // [Create] 레시피 저장
  const addRecipe = async (recipe) => {
    // 중복 체크 (식약처 ID 기준)
    if (state.savedRecipes.some(r => r.RCP_SEQ === recipe.RCP_SEQ)) {
      alert("이미 저장된 레시피입니다!");
      return;
    }

    try {
      // MockAPI는 id를 자동 생성하므로, 기존 객체에서 혹시 모를 id 충돌 방지
      // 필요한 데이터만 골라서 보내거나 전체를 복사하되 id만 제외
      const { id, ...recipeData } = recipe; 
      const payload = { ...recipeData, myMemo: "", createdAt: new Date().toISOString() };

      const response = await axios.post(MOCK_API, payload);
      
      dispatch({ type: 'ADD_SUCCESS', payload: response.data });
      alert("나만의 레시피북에 저장되었습니다! (서버 저장 완료)");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  // [Delete] 레시피 삭제
  const deleteRecipe = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      await axios.delete(`${MOCK_API}/${id}`);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // [Update] 메모 수정
  const updateMemo = async (id, memo) => {
    try {
      const target = state.savedRecipes.find(r => r.id === id);
      if (!target) return;

      const updatedData = { ...target, myMemo: memo };
      const response = await axios.put(`${MOCK_API}/${id}`, updatedData);
      
      dispatch({ type: 'UPDATE_SUCCESS', payload: response.data });
      alert("메모가 수정되었습니다!");
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <RecipeContext.Provider value={{ 
      ...state, 
      dispatch,
      addRecipe, 
      deleteRecipe, 
      updateMemo 
    }}>
      {children}
    </RecipeContext.Provider>
  );
};