import { useMemo } from "react"
import useWorkspaceStore from "../store/workspaceStore"
import { getWorkspaceConfig, getLabel, getMenuItems } from "../config/workspaceConfig"

/**
 * Hook pentru a accesa configurația workspace-ului curent
 * Returnează etichete personalizate, meniuri și alte configurări
 * bazate pe tipul workspace-ului selectat
 */
export const useWorkspaceConfig = () => {
  const { selectedWorkspaceId, workspaces } = useWorkspaceStore()

  const currentWorkspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === selectedWorkspaceId) || null
  }, [workspaces, selectedWorkspaceId])

  const workspaceType = currentWorkspace?.type || "clinic"
  const config = useMemo(() => getWorkspaceConfig(workspaceType), [workspaceType])
  const menuItems = useMemo(() => getMenuItems(workspaceType), [workspaceType])

  // Funcție helper pentru a obține o etichetă
  const getLabelForKey = (key) => {
    return getLabel(workspaceType, key)
  }

  return {
    workspaceType,
    config,
    menuItems,
    getLabel: getLabelForKey,
    currentWorkspace,
  }
}

export default useWorkspaceConfig

