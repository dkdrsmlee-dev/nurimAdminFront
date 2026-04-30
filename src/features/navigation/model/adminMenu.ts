export type AdminMenuSection = {
  key: string
  title: string
  children: string[]
}

export const adminMenuSections: AdminMenuSection[] = [
  { key: 'home', title: 'Home', children: [] },
  { key: 'member', title: '회원관리', children: ['회원 목록', '회원 탈퇴 관리'] },
  {
    key: 'mypet',
    title: '마이핏 관리',
    children: ['마이핏 현황', '품종 관리', '펫 통계'],
  },
  {
    key: 'membership',
    title: '멤버십 관리',
    children: ['멤버십 현황', '결제 관리', '환불 관리'],
  },
  {
    key: 'reward',
    title: '리워드 관리',
    children: ['리워드 현황', '리워드 수동 지급', '리워드 수동 회수', '리워드 설정'],
  },
  {
    key: 'event',
    title: '이벤트관리',
    children: ['이벤트 목록', '이벤트 생성'],
  },
  {
    key: 'notice',
    title: '알림 관리',
    children: ['알림 현황', '공지 사항', '알림 정책 설정'],
  },
  { key: 'support', title: '고객 지원', children: ['1:1 문의', 'FAQ 관리'] },
  {
    key: 'system',
    title: '시스템 설정',
    children: ['관리자 계정 관리', '감사 로그', '서비스 설정'],
  },
]
