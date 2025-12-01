import { useState, useCallback } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY; 

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async (ingredient) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/${API_KEY}/COOKRCP01/json/1/20/RCP_PARTS_DTLS=${ingredient}`;
      const response = await axios.get(url);
      
      const result = response.data.COOKRCP01;
      
      // [수정] 데이터를 상태로 관리하지 않고 바로 반환(Return)함
      // -> 검색 컴포넌트가 받아서 Context에 저장하도록 위임
      if (result && result.row) {
        return result.row;
      } else {
        return [];
      }
    } catch (err) {
      console.error("에러 상세:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // data 상태는 제거 (Context에서 관리하므로)
  return { loading, error, fetchRecipes };
}