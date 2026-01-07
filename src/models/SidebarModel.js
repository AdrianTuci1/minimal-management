import useAppStore from "@/store/appStore"
import useWorkspaceStore from "@/store/workspaceStore"
import useWorkspaceConfig from "@/hooks/useWorkspaceConfig"
import { useNavigate } from "react-router-dom"

// Model pentru Sidebar care gestionează starea și interacțiunile
export class SidebarModel {
  constructor() {
    // Nu mai folosim getState() în constructor
    // Datele vor fi obținute prin parametrii metodelor
  }

  // Obține elementele meniului în funcție de configurație
  getMenuItems(workspaceType, config) {
    const menuItems = []

    // Adaugă elementul "home" la început
    menuItems.push(
      {
        id: "home",
        label: "Home",
        icon: "Home",
      }
    )

    // Adaugă elemente comune pentru toate tipurile de workspace
    menuItems.push(
      {
        id: "programari",
        label: config?.labels?.appointments || "Programări",
        icon: "CalendarDays",
      },
      {
        id: "pacienti",
        label: config?.labels?.patients || "Pacienți",
        icon: "User",
      },
      {
        id: "medici",
        label: config?.labels?.doctors || "Medici",
        icon: "UserCog",
      }
    )

    // Adaugă elemente specifice în funcție de tipul de workspace
    if (workspaceType === "hotel") {
      menuItems.push(
        {
          id: "camere",
          label: "Camere",
          icon: "Home",
        },
        {
          id: "rezervari",
          label: "Rezervări",
          icon: "CalendarDays",
        }
      )
    } else if (workspaceType === "fitness") {
      menuItems.push(
        {
          id: "antrenori",
          label: "Antrenori",
          icon: "UserCog",
        },
        {
          id: "tratamente",
          label: "Programe",
          icon: "Activity",
        }
      )
    } else {
      // Clinic (default)
      menuItems.push(
        {
          id: "tratamente",
          label: config?.labels?.treatments || "Tratamente",
          icon: "Activity",
        },
        {
          id: "automatizari",
          label: "Automatizări",
          icon: "Wand2",
        },
        {
          id: "setari",
          label: "Setări",
          icon: "Settings",
        }
      )
    }

    return menuItems
  }

  // Obține elementele de navigare pentru workspace-ul curent
  getWorkspaceNavigationItems(workspace, navigate) {
    return [
      {
        id: "dashboard",
        label: "Panou de control",
        icon: "LayoutDashboard",
        onClick: () => {
          const { goToGroupView } = useWorkspaceStore.getState()
          goToGroupView()
          navigate("/")
        },
      },
      {
        id: "public",
        label: "Pagina client",
        icon: "ExternalLink",
        onClick: () => {
          if (workspace?.id) {
            window.open(`/workspace/${workspace.id}/public`, "_blank")
          }
        },
      },
    ]
  }

  // Verifică dacă un element de meniu este activ
  isMenuItemActive(itemId, activeMenu) {
    return itemId === activeMenu
  }

  // Gestionează schimbarea meniului activ
  handleMenuChange(menuId, setActiveMenu) {
    setActiveMenu(menuId)
  }

  // Gestionează deschiderea spotlight
  handleOpenSpotlight(setIsSpotlightOpen) {
    setIsSpotlightOpen(true)
  }

  // Gestionează închiderea spotlight
  handleCloseSpotlight(setIsSpotlightOpen) {
    setIsSpotlightOpen(false)
  }

  // Gestionează selectarea unui element din spotlight
  handleSpotlightSelect(item, setIsSpotlightOpen) {
    item?.onSelect?.()
    setIsSpotlightOpen(false)
  }

  // Gestionează comutarea stării de colapsare a sidebar-ului
  handleToggleCollapse(isSidebarCollapsed, toggleSidebarCollapsed) {
    toggleSidebarCollapsed()
  }
}

// Hook pentru a folosi modelul în componente
export const useSidebarModel = () => {
  const {
    activeMenu,
    setActiveMenu,
    isSpotlightOpen,
    setIsSpotlightOpen,
    isSidebarCollapsed,
    toggleSidebarCollapsed
  } = useAppStore()
  const { currentWorkspace: workspace, workspaceType, config } = useWorkspaceConfig()
  const navigate = useNavigate()

  const model = new SidebarModel()

  return {
    menuItems: model.getMenuItems(workspaceType, config),
    workspaceNavigationItems: model.getWorkspaceNavigationItems(workspace, navigate),
    isMenuItemActive: (itemId) => model.isMenuItemActive(itemId, activeMenu),
    handleMenuChange: (menuId) => model.handleMenuChange(menuId, setActiveMenu),
    handleOpenSpotlight: () => model.handleOpenSpotlight(setIsSpotlightOpen),
    handleCloseSpotlight: () => model.handleCloseSpotlight(setIsSpotlightOpen),
    handleSpotlightSelect: (item) => model.handleSpotlightSelect(item, setIsSpotlightOpen),
    handleToggleCollapse: () => model.handleToggleCollapse(isSidebarCollapsed, toggleSidebarCollapsed),
  }
}

export default SidebarModel
