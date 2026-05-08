import {
  AdminAuthenticatedApiError,
  requestAdminApiWithAutoRefresh,
} from '../../auth/api/adminAuthenticatedApi'

export type RbacRole = {
  roleId: string
  roleKey: string
  roleNm: string
  status: string
}

type RbacPermissionValue = boolean | number | null | undefined

export type RbacPermissionTreeNode = {
  menuId: string
  parentMenuId: string | null
  menuKey: string
  menuNm: string
  path: string | null
  sortNo: number
  permission?: {
    canCreate?: RbacPermissionValue
    canRead?: RbacPermissionValue
    canUpdate?: RbacPermissionValue
    canDelete?: RbacPermissionValue
  }
  children?: RbacPermissionTreeNode[]
}

export class AdminRbacApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'AdminRbacApiError'
    this.status = status
  }
}

async function requestRbacData<T>(path: string): Promise<T> {
  try {
    return await requestAdminApiWithAutoRefresh<T>(
      path,
      { method: 'GET' },
      {
        fallbackErrorMessage: 'RBAC 조회 요청에 실패했습니다.',
      }
    )
  } catch (error) {
    if (error instanceof AdminAuthenticatedApiError) {
      throw new AdminRbacApiError(error.status, error.message)
    }

    if (error instanceof Error) {
      throw new AdminRbacApiError(500, error.message)
    }

    throw new AdminRbacApiError(500, 'RBAC 조회 요청에 실패했습니다.')
  }
}

export function getRbacRoles() {
  return requestRbacData<RbacRole[]>('/api/v1/admin/rbac/roles')
}

export function getRolePermissionTree(roleId: string) {
  return requestRbacData<RbacPermissionTreeNode[]>(
    `/api/v1/admin/rbac/roles/${roleId}/permission-tree`
  )
}
