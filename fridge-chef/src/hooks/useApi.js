import { useState, useCallback } from 'react';
import axios from 'axios';

// .env 파일에서 키를 가져옵니다.
const API_KEY = process.env.REACT_APP_API_KEY; 

export default function useApi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async (ingredient) => {
    setLoading(true);
    try {
      // [수정 포인트]
      // package.json에 proxy를 설정했으므로, 도메인을 빼고 /api 부터 시작하면 됩니다.
      // 요청 주소: http://localhost:3000/api/인증키/서비스명/... -> 프록시가 실제 주소로 토스해줌
      
      const url = `/api/${API_KEY}/COOKRCP01/json/1/10/RCP_PARTS_DTLS=${ingredient}`;
      
      console.log("요청 URL 확인:", url); // 콘솔에서 URL이 잘 찍히는지 확인

      const response = await axios.get(url);
      
      // 데이터 구조 확인 (식약처 API는 COOKRCP01 안에 row가 있음)
      const result = response.data.COOKRCP01;
      
      if (result && result.row) {
        setData(result.row);
        setError(null);
      } else {
        setData([]);
        setError("검색 결과가 없습니다.");
      }
    } catch (err) {
      console.error("에러 상세:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchRecipes };
}