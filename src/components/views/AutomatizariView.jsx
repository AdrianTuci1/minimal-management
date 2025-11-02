import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Drawer, DrawerContent, DrawerField } from "@/components/ui/drawer"
import { getTableColumns } from "@/config/tableColumns"
import useAppStore from "@/store/appStore"
import { Settings, Mail, Zap, CheckCircle2 } from "lucide-react"
import EmailTemplateEditor from "@/components/EmailTemplateEditor"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const availableTriggers = [
  { id: "programare-noua", label: "Programare nouă" },
  { id: "programare-modificata", label: "Programare modificată" },
  { id: "programare-anulata", label: "Programare anulată" },
  { id: "pacient-nou", label: "Pacient nou" },
]

const availableActions = [
  { id: "send-email", label: "Trimite email" },
  { id: "send-sms", label: "Trimite SMS" },
  { id: "create-task", label: "Creează sarcină" },
]

const availableTables = [
  { id: "pacienti", label: "Pacienți" },
  { id: "medici", label: "Medici" },
  { id: "tratamente", label: "Tratamente" },
  { id: "programari", label: "Programări" },
]

const initialAutomations = [
  {
    id: "auto-1",
    name: "Confirmare programare",
    trigger: "Programare nouă",
    action: "Trimite email",
    status: "activă",
    selectedTable: "pacienti",
    emailTemplate: "Bună {data.pacient},\n\nVă confirmăm programarea pentru {data.programare} la {clinic.name}.\n\nAdresă: {clinic.address}",
  },
]

const statusVariants = {
  activă: "bg-emerald-500/10 text-emerald-600",
  inactivă: "bg-gray-500/10 text-gray-600",
}

const AutomatizariView = () => {
  const { isDrawerOpen, drawerData, drawerViewId, drawerMode, openDrawer, closeDrawer } = useAppStore()
  const [automations, setAutomations] = useState(initialAutomations)
  const [formData, setFormData] = useState({
    name: "",
    trigger: "",
    action: "",
    selectedTable: "",
    emailTemplate: "",
    smsTemplate: "",
    googleAuthorized: false,
    googleEmail: "",
    status: "activă",
  })

  const isCreateMode = drawerMode === "create"
  const displayData = isCreateMode ? formData : (drawerData || formData)

  useEffect(() => {
    if (isDrawerOpen && drawerViewId === "automatizari") {
      if (isCreateMode) {
        setFormData({
          name: "",
          trigger: "",
          action: "",
          selectedTable: "",
          emailTemplate: "",
          smsTemplate: "",
          googleAuthorized: false,
          googleEmail: "",
          status: "activă",
        })
      } else if (drawerData) {
        setFormData({
          name: drawerData.name || "",
          trigger: drawerData.trigger || "",
          action: drawerData.action || "",
          selectedTable: drawerData.selectedTable || "",
          emailTemplate: drawerData.emailTemplate || "",
          smsTemplate: drawerData.smsTemplate || "",
          googleAuthorized: drawerData.googleAuthorized || false,
          googleEmail: drawerData.googleEmail || "",
          status: drawerData.status || "activă",
        })
      }
    }
  }, [isDrawerOpen, drawerViewId, drawerMode, drawerData, isCreateMode])

  const handleRowClick = (automation) => {
    openDrawer("automatizari", automation, "edit")
  }

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth flow
    // This would typically open a popup or redirect to Google OAuth
    // For now, we'll simulate success
    const mockEmail = "example@gmail.com"
    handleFieldChange("googleAuthorized", true)
    handleFieldChange("googleEmail", mockEmail)
  }

  const handleGoogleRevoke = () => {
    handleFieldChange("googleAuthorized", false)
    handleFieldChange("googleEmail", "")
  }

  const handleSave = () => {
    if (isCreateMode) {
      const newAutomation = {
        id: `auto-${Date.now()}`,
        ...formData,
      }
      setAutomations((prev) => [...prev, newAutomation])
    } else {
      setAutomations((prev) =>
        prev.map((auto) => (auto.id === drawerData.id ? { ...auto, ...formData } : auto))
      )
    }
    closeDrawer()
  }

  const columns = [
    { id: "nume", label: "Nume", accessor: (row) => row.name },
    { id: "eveniment", label: "Eveniment", accessor: (row) => row.trigger },
    { id: "actiune", label: "Acțiune", accessor: (row) => row.action },
    { id: "status", label: "Status", accessor: (row) => row.status },
  ]

  return (
    <>
      <div className="flex h-[calc(100vh-128px)] flex-col overflow-hidden bg-muted/20">
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
              {automations.map((automation) => (
                <TableRow
                  key={automation.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleRowClick(automation)}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.id}
                      className={index < columns.length - 1 ? "border-r border-border/60" : ""}
                    >
                      {column.id === "nume" ? (
                        <span className="font-medium text-foreground">{column.accessor(automation)}</span>
                      ) : column.id === "status" ? (
                        <Badge
                          variant="secondary"
                          className={statusVariants[automation.status] || "bg-muted text-muted-foreground"}
                        >
                          {column.accessor(automation)}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">{column.accessor(automation)}</span>
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
        open={isDrawerOpen && drawerViewId === "automatizari"}
        onOpenChange={closeDrawer}
        title={isCreateMode ? "Adaugă automatizare nouă" : "Editează automatizare"}
        tabs={
          !isCreateMode
            ? [
                {
                  id: "details",
                  icon: Settings,
                  content: (
                    <DrawerContent>
                      <div className="space-y-6">
                        <DrawerField
                          label="Nume automatizare"
                          type="text"
                          editable={true}
                          value={displayData?.name || ""}
                          onChange={(value) => handleFieldChange("name", value)}
                        />

                        <div className="mb-6">
                          <label className="mb-2 block text-sm font-medium text-muted-foreground">
                            Eveniment trigger
                          </label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between">
                                {displayData?.trigger || "Selectează eveniment"}
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                              <DropdownMenuLabel>Evenimente</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {availableTriggers.map((trigger) => (
                                <DropdownMenuItem
                                  key={trigger.id}
                                  onSelect={() => handleFieldChange("trigger", trigger.label)}
                                >
                                  {trigger.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mb-6">
                          <label className="mb-2 block text-sm font-medium text-muted-foreground">
                            Acțiune
                          </label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between">
                                {displayData?.action || "Selectează acțiune"}
                                <Zap className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                              <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {availableActions.map((action) => (
                                <DropdownMenuItem
                                  key={action.id}
                                  onSelect={() => handleFieldChange("action", action.label)}
                                >
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {displayData?.action === "Trimite email" && (
                          <>
                            <div className="mb-6">
                              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                Tabel sursă
                              </label>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" className="w-full justify-between">
                                    {displayData?.selectedTable
                                      ? availableTables.find((t) => t.id === displayData.selectedTable)?.label
                                      : "Selectează tabel"}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
                                  <DropdownMenuLabel>Tabele</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {availableTables.map((table) => (
                                    <DropdownMenuItem
                                      key={table.id}
                                      onSelect={() => handleFieldChange("selectedTable", table.id)}
                                    >
                                      {table.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="mb-6">
                              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                Autorizare email
                              </label>
                              {displayData?.googleAuthorized ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-700">
                                      Autorizat: {displayData?.googleEmail || "Email Google"}
                                    </span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleGoogleRevoke}
                                    className="w-full"
                                  >
                                    Revocă autorizarea
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  onClick={handleGoogleAuth}
                                  className="w-full justify-center gap-2 border-blue-200 bg-blue-50 hover:bg-blue-100"
                                >
                                  <Mail className="h-4 w-4 text-blue-600" />
                                  <span className="text-blue-700">Autorizează Google</span>
                                </Button>
                              )}
                            </div>

                            <div className="mb-6">
                              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                Șablon email
                              </label>
                              <EmailTemplateEditor
                                value={displayData?.emailTemplate || ""}
                                onChange={(value) => handleFieldChange("emailTemplate", value)}
                                selectedTable={displayData?.selectedTable}
                              />
                            </div>
                          </>
                        )}

                        {displayData?.action === "Trimite SMS" && (
                          <>
                            <div className="mb-6">
                              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                Tabel sursă
                              </label>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" className="w-full justify-between">
                                    {displayData?.selectedTable
                                      ? availableTables.find((t) => t.id === displayData.selectedTable)?.label
                                      : "Selectează tabel"}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
                                  <DropdownMenuLabel>Tabele</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {availableTables.map((table) => (
                                    <DropdownMenuItem
                                      key={table.id}
                                      onSelect={() => handleFieldChange("selectedTable", table.id)}
                                    >
                                      {table.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <p className="mt-2 text-xs text-muted-foreground">
                                SMS este pre-autorizat și nu necesită configurare suplimentară.
                              </p>
                            </div>

                            <div className="mb-6">
                              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                Șablon SMS
                              </label>
                              <EmailTemplateEditor
                                value={displayData?.smsTemplate || ""}
                                onChange={(value) => handleFieldChange("smsTemplate", value)}
                                selectedTable={displayData?.selectedTable}
                              />
                            </div>
                          </>
                        )}

                        <div className="mb-6">
                          <label className="mb-2 block text-sm font-medium text-muted-foreground">Status</label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between">
                                {displayData?.status || "activă"}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onSelect={() => handleFieldChange("status", "activă")}>
                                activă
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleFieldChange("status", "inactivă")}>
                                inactivă
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </DrawerContent>
                  ),
                },
              ]
            : undefined
        }
        defaultTab="details"
        actions={[
          {
            id: "save",
            label: "Salvează",
            variant: "default",
            onClick: handleSave,
          },
          {
            id: "cancel",
            label: "Anulează",
            variant: "outline",
            onClick: closeDrawer,
          },
        ]}
      >
        {isCreateMode && (
          <DrawerContent>
            <div className="space-y-6">
              <DrawerField
                label="Nume automatizare"
                type="text"
                editable={true}
                value={displayData?.name || ""}
                onChange={(value) => handleFieldChange("name", value)}
              />

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Eveniment trigger
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {displayData?.trigger || "Selectează eveniment"}
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>Evenimente</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {availableTriggers.map((trigger) => (
                      <DropdownMenuItem
                        key={trigger.id}
                        onSelect={() => handleFieldChange("trigger", trigger.label)}
                      >
                        {trigger.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Acțiune</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {displayData?.action || "Selectează acțiune"}
                      <Zap className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {availableActions.map((action) => (
                      <DropdownMenuItem
                        key={action.id}
                        onSelect={() => handleFieldChange("action", action.label)}
                      >
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {displayData?.action === "Trimite email" && (
                <>
                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">Tabel sursă</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {displayData?.selectedTable
                            ? availableTables.find((t) => t.id === displayData.selectedTable)?.label
                            : "Selectează tabel"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuLabel>Tabele</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableTables.map((table) => (
                          <DropdownMenuItem
                            key={table.id}
                            onSelect={() => handleFieldChange("selectedTable", table.id)}
                          >
                            {table.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">
                      Autorizare email
                    </label>
                    {displayData?.googleAuthorized ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">
                            Autorizat: {displayData?.googleEmail || "Email Google"}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGoogleRevoke}
                          className="w-full"
                        >
                          Revocă autorizarea
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleGoogleAuth}
                        className="w-full justify-center gap-2 border-blue-200 bg-blue-50 hover:bg-blue-100"
                      >
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-700">Autorizează Google</span>
                      </Button>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">Șablon email</label>
                    <EmailTemplateEditor
                      value={displayData?.emailTemplate || ""}
                      onChange={(value) => handleFieldChange("emailTemplate", value)}
                      selectedTable={displayData?.selectedTable}
                    />
                  </div>
                </>
              )}

              {displayData?.action === "Trimite SMS" && (
                <>
                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">Tabel sursă</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {displayData?.selectedTable
                            ? availableTables.find((t) => t.id === displayData.selectedTable)?.label
                            : "Selectează tabel"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuLabel>Tabele</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableTables.map((table) => (
                          <DropdownMenuItem
                            key={table.id}
                            onSelect={() => handleFieldChange("selectedTable", table.id)}
                          >
                            {table.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <p className="mt-2 text-xs text-muted-foreground">
                      SMS este pre-autorizat și nu necesită configurare suplimentară.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">Șablon SMS</label>
                    <EmailTemplateEditor
                      value={displayData?.smsTemplate || ""}
                      onChange={(value) => handleFieldChange("smsTemplate", value)}
                      selectedTable={displayData?.selectedTable}
                    />
                  </div>
                </>
              )}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Status</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {displayData?.status || "activă"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => handleFieldChange("status", "activă")}>
                      activă
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleFieldChange("status", "inactivă")}>
                      inactivă
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </DrawerContent>
        )}
      </Drawer>
    </>
  )
}

export default AutomatizariView
