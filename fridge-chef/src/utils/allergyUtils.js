// 식약처 지정 알레르기 유발 물질 22종 + 기타 흔한 알레르기
const ALLERGENS = [
  '난류', '가금류', '계란', '달걀',
  '우유', '치즈', '버터', '요거트',
  '메밀',
  '땅콩', '대두', '콩', '두부',
  '밀', '밀가루', '빵',
  '고등어',
  '게', '새우', '랍스터', '갑각류',
  '돼지고기', '돈육',
  '복숭아',
  '토마토',
  '아황산류',
  '호두', '잣', '견과류',
  '닭고기', '계육',
  '쇠고기', '우육',
  '오징어',
  '조개류', '굴', '전복', '홍합'
];

/**
 * 재료 문자열을 분석하여 포함된 알레르기 유발 물질 배열을 반환합니다.
 * @param {string} ingredients - 예: "김치, 돼지고기, 두부, 대파"
 * @returns {string[]} - 예: ["돼지고기", "두부"]
 */
export const checkAllergies = (ingredients) => {
  if (!ingredients) return [];
  
  // 재료 문자열에 알레르기 키워드가 포함되어 있는지 확인
  const detected = ALLERGENS.filter(allergen => 
    ingredients.includes(allergen)
  );

  // 중복 제거 (예: 계란, 달걀이 둘 다 걸릴 경우 하나만 표시) 후 반환
  return [...new Set(detected)];
};