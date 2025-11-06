import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Save, Edit2, X } from "lucide-react"
import useWorkspaceStore from "../../../store/workspaceStore"

function AccountView() {
  const navigate = useNavigate()
  const { currentUser, updateUser } = useWorkspaceStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
  })

  // Sync formData when currentUser changes
  useEffect(() => {
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      address: currentUser?.address || "",
    })
  }, [currentUser])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      address: currentUser?.address || "",
    })
    setIsEditing(false)
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contul meu</h1>
        <p className="text-muted-foreground mt-2">
          Gestionează informațiile contului tău
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profil</CardTitle>
              <CardDescription>
                Informațiile tale personale
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editează
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Anulează
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvează
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xl">
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{formData.name}</p>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Nume complet
              </label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Introdu numele tău complet"
                />
              ) : (
                <p className="text-sm text-foreground">{formData.name || "Nu e setat"}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@example.com"
                />
              ) : (
                <p className="text-sm text-foreground">{formData.email || "Nu e setat"}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Telefon
              </label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+40 123 456 789"
                />
              ) : (
                <p className="text-sm text-foreground">{formData.phone || "Nu e setat"}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Adresă
              </label>
              {isEditing ? (
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Strada, Număr, Oraș"
                />
              ) : (
                <p className="text-sm text-foreground">{formData.address || "Nu e setat"}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Setări cont</CardTitle>
          <CardDescription>
            Preferințe și opțiuni pentru contul tău
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Tip utilizator</p>
              <p className="text-sm text-muted-foreground">
                {currentUser?.userType === "service_user" 
                  ? "Folosesc serviciile" 
                  : "Prestez servicii"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              // Resetează tipul utilizatorului pentru a re-trigger onboarding-ul
              updateUser({ userType: null })
              navigate("/")
            }}>
              Schimbă
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountView

