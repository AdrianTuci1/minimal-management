import EntityView from "./EntityView"
import { getDemoStaff } from "@/config/demoData"

const StaffView = () => {
  return (
    <EntityView
      entityType="staff"
      demoDataFunction={getDemoStaff}
    />
  )
}

export default StaffView
