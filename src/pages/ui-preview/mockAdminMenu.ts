import {
  EMPTY_ADMIN_MENU_PERMISSION,
  type AdminMenuSection,
} from '../../features/navigation/model/adminMenu'

function createLeaf(key: string, title: string): AdminMenuSection {
  return {
    key,
    title,
    path: null,
    permission: { ...EMPTY_ADMIN_MENU_PERMISSION },
    children: [],
  }
}

export const previewAdminMenuSections: AdminMenuSection[] = [
  createLeaf('home', 'Home'),
  {
    key: 'member',
    title: '회원관리',
    path: null,
    permission: { ...EMPTY_ADMIN_MENU_PERMISSION },
    children: [
      createLeaf('member-list', '회원 목록'),
      createLeaf('member-withdraw', '회원 탈퇴 관리'),
    ],
  },
  {
    key: 'mypet',
    title: '마이핏 관리',
    path: null,
    permission: { ...EMPTY_ADMIN_MENU_PERMISSION },
    children: [
      createLeaf('mypet-status', '마이핏 현황'),
      createLeaf('mypet-breed', '품종 관리'),
      createLeaf('mypet-stat', '펫 통계'),
    ],
  },
  {
    key: 'membership',
    title: '멤버십 관리',
    path: null,
    permission: { ...EMPTY_ADMIN_MENU_PERMISSION },
    children: [
      createLeaf('membership-status', '멤버십 현황'),
      createLeaf('membership-payment', '결제 관리'),
      createLeaf('membership-refund', '환불 관리'),
    ],
  },
  {
    key: 'reward',
    title: '리워드 관리',
    path: null,
    permission: { ...EMPTY_ADMIN_MENU_PERMISSION },
    children: [
      createLeaf('reward-status', '리워드 현황'),
      createLeaf('reward-grant', '리워드 수동 지급'),
      createLeaf('reward-revoke', '리워드 수동 회수'),
      createLeaf('reward-setting', '리워드 설정'),
    ],
  },
  {
    key: 'event',
    title: '이벤트관리',
    path: null,
    permission: { ...EMPTY_ADMIN_MENU_PERMISSION },
    children: [
      createLeaf('event-list', '이벤트 목록'),
      createLeaf('event-create', '이벤트 생성'),
    ],
  },
  {
    key: 'notice',
    title: '알림 관리',
    path: null,
    permission: { ...EMPTY_ADMIN_MENU_PERMISSION },
    children: [
      createLeaf('notice-status', '알림 현황'),
      createLeaf('notice-post', '공지 사항'),
      createLeaf('notice-policy', '알림 정책 설정'),
    ],
  },
  {
    key: 'support',
    title: '고객 지원',
    path: null,
    permission: { ...EMPTY_ADMIN_MENU_PERMISSION },
    children: [
      createLeaf('support-qna', '1:1 문의'),
      createLeaf('support-faq', 'FAQ 관리'),
    ],
  },
  {
    key: 'system',
    title: '시스템 설정',
    path: null,
    permission: { ...EMPTY_ADMIN_MENU_PERMISSION },
    children: [
      createLeaf('system-account', '관리자 계정 관리'),
      createLeaf('system-audit', '감사 로그'),
      createLeaf('system-service', '서비스 설정'),
    ],
  },
]
