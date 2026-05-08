import { useCallback, useEffect, useState } from 'react'
import { getAdminRoleKeysFromToken } from '../../auth/model/adminAuthSession'
import {
  getRbacRoles,
  getRolePermissionTree,
  type RbacPermissionTreeNode,
  type RbacRole,
} from '../api/adminRbacApi'
import type { AdminMenuPermission, AdminMenuSection } from './adminMenu'

type NormalizedMenuNode = {
  menuId: string
  menuKey: string
  menuNm: string
  path: string | null
  sortNo: number
  permission: AdminMenuPermission
  children: NormalizedMenuNode[]
}

type MutableNormalizedMenuNode = {
  menuId: string
  menuKey: string
  menuNm: string
  path: string | null
  sortNo: number
  permission: AdminMenuPermission
  children: Map<string, MutableNormalizedMenuNode>
}

function toBoolean(value: unknown) {
  return value === true || value === 1
}

function mergePermission(
  current: AdminMenuPermission,
  next: AdminMenuPermission
): AdminMenuPermission {
  return {
    canCreate: current.canCreate || next.canCreate,
    canRead: current.canRead || next.canRead,
    canUpdate: current.canUpdate || next.canUpdate,
    canDelete: current.canDelete || next.canDelete,
  }
}

function getNodePermission(node: RbacPermissionTreeNode): AdminMenuPermission {
  return {
    canCreate: toBoolean(node.permission?.canCreate),
    canRead: toBoolean(node.permission?.canRead),
    canUpdate: toBoolean(node.permission?.canUpdate),
    canDelete: toBoolean(node.permission?.canDelete),
  }
}

function mergeTreeNode(
  nodeMap: Map<string, MutableNormalizedMenuNode>,
  node: RbacPermissionTreeNode
) {
  const mapKey = node.menuId || node.menuKey
  const current = nodeMap.get(mapKey)

  const mergedPermission = current
    ? mergePermission(current.permission, getNodePermission(node))
    : getNodePermission(node)

  const targetNode: MutableNormalizedMenuNode =
    current ?? {
      menuId: node.menuId,
      menuKey: node.menuKey,
      menuNm: node.menuNm,
      path: node.path ?? null,
      sortNo: Number(node.sortNo ?? 0),
      permission: mergedPermission,
      children: new Map<string, MutableNormalizedMenuNode>(),
    }

  targetNode.menuNm = node.menuNm
  targetNode.path = node.path ?? null
  targetNode.sortNo = Number(node.sortNo ?? 0)
  targetNode.permission = mergedPermission

  nodeMap.set(mapKey, targetNode)

  for (const child of node.children ?? []) {
    mergeTreeNode(targetNode.children, child)
  }
}

function toSortedNodeArray(
  nodeMap: Map<string, MutableNormalizedMenuNode>
): NormalizedMenuNode[] {
  return [...nodeMap.values()]
    .sort((a, b) => {
      if (a.sortNo === b.sortNo) {
        return a.menuNm.localeCompare(b.menuNm)
      }
      return a.sortNo - b.sortNo
    })
    .map((node) => ({
      menuId: node.menuId,
      menuKey: node.menuKey,
      menuNm: node.menuNm,
      path: node.path,
      sortNo: node.sortNo,
      permission: node.permission,
      children: toSortedNodeArray(node.children),
    }))
}

function filterReadableTree(nodes: NormalizedMenuNode[]): NormalizedMenuNode[] {
  return nodes.reduce<NormalizedMenuNode[]>((acc, node) => {
    const readableChildren = filterReadableTree(node.children)
    const isReadable = node.permission.canRead || readableChildren.length > 0

    if (isReadable) {
      acc.push({
        ...node,
        children: readableChildren,
      })
    }

    return acc
  }, [])
}

function toAdminMenuSections(nodes: NormalizedMenuNode[]): AdminMenuSection[] {
  return nodes.map((node) => ({
    key: node.menuId || node.menuKey,
    title: node.menuNm,
    path: node.path,
    permission: node.permission,
    children: toAdminMenuSections(node.children),
  }))
}

function resolveRoleIds(roles: RbacRole[], tokenRoleKeys: string[]): string[] {
  const roleCandidates =
    tokenRoleKeys.length > 0
      ? roles.filter((role) => tokenRoleKeys.includes(role.roleKey))
      : roles

  const activeRoleIds = roleCandidates
    .filter((role) => role.status === 'ACTIVE')
    .map((role) => role.roleId)

  const fallbackRoleIds = roleCandidates.map((role) => role.roleId)

  const roleIds = activeRoleIds.length > 0 ? activeRoleIds : fallbackRoleIds
  return [...new Set(roleIds)]
}

function pickLoadErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return '메뉴 권한 정보를 불러오지 못했습니다.'
}

export function useAuthorizedSidebarMenu() {
  const [sections, setSections] = useState<AdminMenuSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadAuthorizedMenu = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const [roles, tokenRoleKeys] = await Promise.all([
        getRbacRoles(),
        Promise.resolve(getAdminRoleKeysFromToken()),
      ])

      const roleIds = resolveRoleIds(roles, tokenRoleKeys)

      if (roleIds.length === 0) {
        throw new Error('할당된 Role 정보를 찾을 수 없습니다.')
      }

      const permissionTrees = await Promise.all(
        roleIds.map((roleId) => getRolePermissionTree(roleId))
      )

      const rootMap = new Map<string, MutableNormalizedMenuNode>()

      for (const tree of permissionTrees) {
        for (const node of tree) {
          mergeTreeNode(rootMap, node)
        }
      }

      const mergedTree = toSortedNodeArray(rootMap)
      const readableTree = filterReadableTree(mergedTree)
      setSections(toAdminMenuSections(readableTree))
    } catch (error) {
      setSections([])
      setErrorMessage(pickLoadErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAuthorizedMenu()
  }, [loadAuthorizedMenu])

  return {
    sections,
    isLoading,
    errorMessage,
    reload: loadAuthorizedMenu,
  }
}
