export type AdminMenuPermission = {
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
}

export type AdminMenuSection = {
  key: string
  title: string
  path: string | null
  permission: AdminMenuPermission
  children: AdminMenuSection[]
}

export const EMPTY_ADMIN_MENU_PERMISSION: AdminMenuPermission = {
  canCreate: false,
  canRead: true,
  canUpdate: false,
  canDelete: false,
}
