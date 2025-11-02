import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Drawer, DrawerContent, DrawerField } from "@/components/ui/drawer"
import { getTableColumns } from "@/config/tableColumns"
import { getDrawerInputs } from "@/config/drawerInputs.jsx"
import useAppStore from "@/store/appStore"
import { User, Calendar, FileText } from "lucide-react"

const patients = [
  {
    name: "Ioana Marinescu",
    email: "ioana.marinescu@email.com",
    phone: "0723 887 210",
    dePlata: "450 RON",
    upcoming: "Control aparat dentar - 12 feb, 09:00",
  },
  {
    name: "Adrian Pavel",
    email: "adrian.pavel@email.com",
    phone: "0721 535 298",
    dePlata: "280 RON",
    upcoming: "Strângere arcuri - 12 feb, 10:45",
  },
  {
    name: "Maria Tudor",
    email: "maria.tudor@email.com",
    phone: "0730 611 927",
    dePlata: "1200 RON",
    upcoming: "Implant finalizare - 12 feb, 09:15",
  },
  {
    name: "Sorina Pătrașcu",
    email: "sorina.patrascu@email.com",
    phone: "0745 632 110",
    dePlata: "350 RON",
    upcoming: "Albire profesională - 12 feb, 08:45",
  },
  {
    name: "Carmen Iacob",
    email: "carmen.iacob@email.com",
    phone: "0733 440 118",
    dePlata: "0 RON",
    upcoming: "Chirurgie parodontală - 12 feb, 11:00",
  },
  {
    name: "Nicu Tănase",
    email: "nicu.tanase@email.com",
    phone: "0720 445 987",
    dePlata: "650 RON",
    upcoming: "Consult ortodontic - 12 feb, 12:15",
  },
  {
    name: "Elena Vasilescu",
    email: "elena.vasilescu@email.com",
    phone: "0746 208 315",
    dePlata: "180 RON",
    upcoming: "Igienizare profesională - 12 feb, 15:30",
  },
  {
    name: "Marius Petru",
    email: "marius.petru@email.com",
    phone: "0736 553 112",
    dePlata: "0 RON",
    upcoming: "Control post-tratament - 12 feb, 16:45",
  },
  {
    name: "Georgiana Pavel",
    email: "georgiana.pavel@email.com",
    phone: "0712 631 940",
    dePlata: "890 RON",
    upcoming: "Fațete ceramice - 13 feb, 10:00",
  },
  {
    name: "Robert Ifrim",
    email: "robert.ifrim@email.com",
    phone: "0732 118 546",
    dePlata: "220 RON",
    upcoming: "Radiografie panoramică - 13 feb, 11:30",
  },
]

const PatientsView = () => {
  const columns = getTableColumns("pacienti")
  const drawerFields = getDrawerInputs("pacienti")
  const { isDrawerOpen, drawerData, drawerViewId, drawerMode, openDrawer, closeDrawer } = useAppStore()
  
  const [formData, setFormData] = useState({})

  const isCreateMode = drawerMode === "create"
  const displayData = isCreateMode ? formData : drawerData

  useEffect(() => {
    if (isCreateMode && isDrawerOpen) {
      setFormData({})
    }
  }, [isCreateMode, isDrawerOpen])

  const handleRowClick = (patient) => {
    openDrawer("pacienti", patient, "edit")
  }

  const handleFieldChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  return (
    <>
      <div className="flex h-[calc(100vh-128px)] flex-col overflow-hidden">
        <div className="min-w-[960px] overflow-auto">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead
                    key={column.id}
                    className={index < columns.length - 1 ? "border-r border-border/70" : ""}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow
                  key={patient.email}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleRowClick(patient)}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.id}
                      className={index < columns.length - 1 ? "border-r border-border/60" : ""}
                    >
                      {column.id === "pacient" ? (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {patient.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{patient.name}</span>
                            <span className="text-xs text-muted-foreground">{patient.phone}</span>
                          </div>
                        </div>
                      ) : column.id === "dePlata" ? (
                        <span className={patient.dePlata === "0 RON" ? "text-muted-foreground" : "font-medium text-foreground"}>
                          {patient.dePlata}
                        </span>
                      ) : (
                        column.render ? column.render(patient) : column.accessor(patient)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Drawer
        open={isDrawerOpen && drawerViewId === "pacienti"}
        onOpenChange={closeDrawer}
        title={isCreateMode ? "Adaugă pacient nou" : "Detalii pacient"}
        tabs={
          !isCreateMode
            ? [
                {
                  id: "details",
                  icon: User,
                  content: (
                    <DrawerContent>
                      <>
                        {drawerData && (
                          <div className="mb-6 flex items-center gap-4 pb-6 border-b border-border">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback className="text-lg">
                                {drawerData.name
                                  ?.split(" ")
                                  .map((part) => part[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase() || "N/A"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">{drawerData.name || "Pacient nou"}</h3>
                              {drawerData.email && <p className="text-sm text-muted-foreground">{drawerData.email}</p>}
                            </div>
                          </div>
                        )}
                        {drawerFields.map((field) => {
                          const value = field.accessor(displayData || {})
                          const isEditable = field.editable

                          return (
                            <DrawerField
                              key={field.id}
                              label={field.label}
                              type={field.type}
                              editable={isEditable}
                              value={value}
                              onChange={(newValue) => handleFieldChange(field.id, newValue)}
                            >
                              {!isEditable && field.render ? (
                                field.render(value)
                              ) : !isEditable ? (
                                <div className="text-base text-foreground">{value || "-"}</div>
                              ) : null}
                            </DrawerField>
                          )
                        })}
                      </>
                    </DrawerContent>
                  ),
                },
                {
                  id: "appointments",
                  icon: Calendar,
                  content: (
                    <DrawerContent>
                      <div className="text-sm text-muted-foreground">Istoric programări</div>
                    </DrawerContent>
                  ),
                },
                {
                  id: "treatment",
                  icon: FileText,
                  content: (
                    <DrawerContent>
                      <div className="text-sm text-muted-foreground">Plan tratament</div>
                    </DrawerContent>
                  ),
                },
              ]
            : undefined
        }
        defaultTab="details"
      >
        {isCreateMode && (
          <DrawerContent>
            <>
              {drawerFields.map((field) => {
                const value = field.accessor(displayData || {})
                const isEditable = true

                return (
                  <DrawerField
                    key={field.id}
                    label={field.label}
                    type={field.type}
                    editable={isEditable}
                    value={value}
                    onChange={(newValue) => handleFieldChange(field.id, newValue)}
                  />
                )
              })}
            </>
          </DrawerContent>
        )}
      </Drawer>
    </>
  )
}

export default PatientsView

