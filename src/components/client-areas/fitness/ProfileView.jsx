import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Mail, Phone, Calendar } from "lucide-react"
import useFitnessUserStore from "../../../store/fitnessUserStore"

function ProfileView() {
  const { user } = useFitnessUserStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profil</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informații personale</CardTitle>
          <CardDescription>Datele tale de utilizator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">Nume</div>
              <div className="font-medium">{user?.name || "Nespecificat"}</div>
            </div>
          </div>
          
          {user?.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
            </div>
          )}
          
          {user?.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Telefon</div>
                <div className="font-medium">{user.phone}</div>
              </div>
            </div>
          )}
          
          {user?.createdAt && (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Cont creat</div>
                <div className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("ro-RO")}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileView

