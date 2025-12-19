My Korean Fridge Chef

My Korean Fridge Chef는 사용자가 보유한 식재료를 기반으로 만들 수 있는 한식 레시피를 추천하고,
관심 레시피를 저장·관리할 수 있는 React 기반 SPA(Single Page Application) 프로젝트이다.
냉장고 속 재료를 효율적으로 활용하도록 돕는 것을 목표로 한다.

1. 프로젝트 개요

프로젝트명: My Korean Fridge Chef

프로젝트 성격: 개인/팀 웹 프로젝트 (Frontend 중심)

개발 방식: Single Page Application (SPA)

사용자는 재료를 검색 조건으로 입력하여 레시피를 탐색할 수 있으며,
레시피 상세 정보 확인, 즐겨찾기 등록, 나만의 레시피 관리 기능을 사용할 수 있다.

2. 주요 기능
2.1 재료 기반 레시피 검색

사용자가 입력한 키워드를 기준으로 레시피를 검색한다.

요리 종류, 조리 방법 등 카테고리 필터링이 가능하다.

검색 결과는 카드 형태로 제공된다.

2.2 레시피 상세 페이지

선택한 레시피의 상세 정보(요리명, 조리 방법 등)를 확인할 수 있다.

RecipeDetail / RecipeDetailPage 컴포넌트를 분리하여 관리한다.

2.3 즐겨찾기 및 나만의 레시피 관리

마음에 드는 레시피를 즐겨찾기에 저장할 수 있다.

MyRecipes 페이지에서 저장된 레시피를 관리한다.

Context API를 활용하여 전역 상태로 관리한다.

2.4 알레르기 정보 처리

allergyUtils.js를 통해 알레르기 관련 정보를 처리한다.

향후 개인 맞춤형 필터링 확장이 가능하도록 설계하였다.

2.5 정적 페이지 구성

HomePage, AboutPage 등 페이지별 컴포넌트를 분리하여 구성하였다.

React Router를 사용하여 페이지 전환을 처리한다.

3. 프로젝트 구조
My-korean-Fridge-Chef-main/
├── README.md
└── fridge-chef/
    ├── package.json
    ├── package-lock.json
    ├── .env
    ├── .gitignore
    ├── vercel.json
    ├── public/
    │   ├── index.html
    │   ├── manifest.json
    │   ├── robots.txt
    │   └── assets/
    │       └── logo/
    │           └── logo.png
    └── src/
        ├── App.css
        ├── App.js
        ├── index.js
        ├── pages/
        │   ├── HomePage.js
        │   ├── RecipesPage.js
        │   ├── RecipeDetail.js
        │   ├── RecipeDetailPage.js
        │   ├── FavoritesPage.js
        │   ├── MyRecipes.js
        │   ├── Search.js
        │   └── AboutPage.js
        ├── styles/
        │   └── Theme.css
        ├── utils/
        │   └── allergyUtils.js
        └── reportWebVitals.js

4. 사용 기술
Frontend

React

React Router

React Hooks (useState, useEffect, useMemo, useCallback, useRef)

Context API

Styling

CSS

공통 테마 스타일 분리 관리 (Theme.css)

배포

Vercel

vercel.json을 통한 배포 설정 관리

5. 기술적 특징
5.1 SPA 아키텍처

React Router를 사용하여 페이지 새로고침 없이 화면 전환을 구현하였다.

컴포넌트 단위로 페이지를 분리하여 유지보수성을 높였다.

5.2 전역 상태 관리

Context API를 사용하여 레시피 데이터와 즐겨찾기 상태를 전역으로 관리한다.

불필요한 Props Drilling을 방지하였다.

5.3 성능 최적화

useMemo를 활용하여 검색 및 필터링 시 불필요한 연산을 줄였다.

useCallback을 사용하여 함수 재생성을 최소화하였다.

5.4 코드 구조화

pages, utils, styles 디렉토리를 분리하여 역할 기반 구조를 유지하였다.

기능 확장 시 컴포넌트 추가가 용이하도록 설계하였다.

6. 향후 개선 방향

사용자 맞춤 알레르기 필터 고도화

로그인 기반 개인 레시피 관리 기능 추가

백엔드 API 연동 및 데이터 영속성 강화

모바일 UI 최적화

8. 프로젝트 목적 및 의의

본 프로젝트는 React 기반 SPA 구조에 대한 이해를 바탕으로,
실제 사용 시나리오를 고려한 기능 설계와 상태 관리 경험을 목표로 한다.
단순한 레시피 나열이 아닌, 사용자의 생활 패턴과 식재료 활용에 초점을 맞춘 서비스 구현을 지향한다.