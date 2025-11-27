import type { ApiResponse } from '../apis/types/common';
import type { CoupleInfoResponse } from '../apis/couple/response';

// API의 반환값인 Promise 타입을 정의
type MatchingPromise = Promise<ApiResponse<CoupleInfoResponse>>;

// Promise를 저장할 변수. let으로 선언하여 재할당이 가능하게 함
let storedPromise: MatchingPromise | null = null;

// Promise를 저장하는 함수
export const setBackgroundTaskPromise = (promise: MatchingPromise) => {
  storedPromise = promise;
};

// 저장된 Promise를 가져오는 함수
export const getBackgroundTaskPromise = () => {
  return storedPromise;
};