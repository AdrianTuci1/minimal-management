import { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Briefcase, ExternalLink, Calendar, Clock, User, MapPin, Phone, Mail, Package, ChevronDown, ChevronUp, QrCode, Home, UserCheck } from "lucide-react"
import useWorkspaceStore from "../../../store/workspaceStore"
import { getWorkspaceConfig } from "../../../config/workspaceConfig"
import { checkClientAuth } from "../../../services/subscriptionService"

function ServicesView() {
  const navigate = useNavigate()
  const { currentUser, workspaces } = useWorkspaceStore()
  const [expandedServices, setExpandedServices] = useState({})
  const [activeTab, setActiveTab] = useState("active") // "active" or "inactive"
  const [showQRCode, setShowQRCode] = useState(false)

  // Verifică autentificarea clientului
  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await checkClientAuth()
      setIsAuthenticated(authResult.authenticated)
    }
    
    checkAuth()
  }, [])

  const toggleServiceExpansion = (serviceId) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }))
  }

  // Obține serviciile asociate utilizatorului din localStorage (abonamente)
  const userServices = useMemo(() => {
    try {
      // Obține sesiunea clientului
      const sessionData = localStorage.getItem('clientSession')
      if (!sessionData) return []

      const session = JSON.parse(sessionData)
      
      // Obține toți clienții din localStorage
      const clients = JSON.parse(localStorage.getItem('subscriptionClients') || '{}')
      
      // Filtrează clienții care aparțin utilizatorului curent
      const userClients = Object.values(clients).filter(client => {
        // Verifică dacă clientul este asociat cu email-ul utilizatorului sau cu sesiunea
        return client.formData?.email === currentUser.email || 
               client.formData?.email === session.email ||
               session.clientId === client.clientId
      })

      // Extrage serviciile din abonamentele utilizatorului
      const services = []
      userClients.forEach(client => {
        if (client.subscription) {
          services.push({
            id: client.clientId,
            name: client.subscription.name || 'Abonament',
            description: client.subscription.description || `${client.subscription.duration} - ${client.subscription.price} RON`,
            price: client.subscription.price,
            duration: client.subscription.duration,
            workspaceId: client.workspaceId,
            confirmed: client.confirmed,
            createdAt: client.createdAt,
            confirmedAt: client.confirmedAt,
            type: client.subscription.type || 'fitness', // Adăugăm tipul serviciului
          })
        }
      })

      return services
    } catch (error) {
      console.error('Error loading user services:', error)
      return []
    }
  }, [currentUser.email])

  // Servicii dummy pentru demonstrație
  const dummyServices = [
    {
      id: 'fitness-dummy',
      name: 'Abonament Fitness Premium',
      description: 'Acces complet la sală, piscine și clase de grup',
      price: 299,
      duration: 'Lunar',
      type: 'fitness',
      confirmed: true,
      confirmedAt: new Date('2023-11-15').toISOString(),
      workspaceId: 'fitness-1',
      isDummy: true,
      details: {
        qrCode: 'FIT-2023-12345',
        accessLevel: 'Premium',
        validUntil: '31.12.2023',
        facilities: ['Sală de forță', 'Piscină', 'Saună', 'Clase de grup']
      }
    },
    {
      id: 'hotel-dummy',
      name: 'Rezervare Hotel Ocean View',
      description: 'Camera dublă cu vedere la mare, all-inclusive',
      price: 1200,
      duration: '7 nopți',
      type: 'hotel',
      confirmed: true,
      confirmedAt: new Date('2023-10-20').toISOString(),
      workspaceId: 'hotel-1',
      isDummy: true,
      details: {
        roomType: 'Camera Dublă Deluxe',
        checkIn: '15.07.2023',
        checkOut: '22.07.2023',
        address: 'Strada Litoralului nr. 45, Mamaia',
        amenities: ['All-inclusive', 'Vedere la mare', 'Balcon', 'Aer condiționat']
      }
    },
    {
      id: 'clinic-dummy',
      name: 'Programare la Dentist',
      description: 'Consult și igienizare completă',
      price: 450,
      duration: '2 ore',
      type: 'clinic',
      confirmed: false,
      confirmedAt: null,
      workspaceId: 'clinic-1',
      isDummy: true,
      details: {
        dentistName: 'Dr. Popescu Andrei',
        specialization: 'Stomatologie generală',
        location: 'Cabinetul Smile Perfect',
        address: 'Strada Zorilor nr. 12, Cluj-Napoca',
        phone: '+40 264 123 456',
        appointmentDate: '20.12.2023',
        appointmentTime: '14:30'
      }
    }
  ]

  // Combină serviciile reale cu cele dummy
  const allServices = [...userServices, ...dummyServices]

  // Filtrează serviciile active/inactive
  const filteredServices = allServices.filter(service => {
    if (activeTab === "active") {
      return service.confirmed === true
    } else {
      return service.confirmed === false
    }
  })

  const handleViewWorkspace = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`)
  }

  const handleShowQRCode = (service) => {
    if (service.type === 'fitness') {
      setShowQRCode(service.id)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Servicii</h1>
        <p className="text-muted-foreground mt-2">
          Serviciile și abonamentele tale active
        </p>
      </div>

      {/* Tab-uri pentru servicii active/inactive */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1 text-sm font-medium">
        <button
          className={`rounded-md px-3 py-1.5 transition-all ${
            activeTab === "active"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active
        </button>
        <button
          className={`rounded-md px-3 py-1.5 transition-all ${
            activeTab === "inactive"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("inactive")}
        >
          Inactive
        </button>
      </div>

      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {activeTab === "active" ? "Nu ai servicii active" : "Nu ai servicii inactive"}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              {activeTab === "active" 
                ? "Abonamentele și serviciile tale active vor apărea aici."
                : "Serviciile tale inactive sau expirate vor apărea aici."
              }
            </p>
            <Button variant="outline" onClick={() => navigate('/')}>
              Explorează servicii
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {filteredServices.map((service) => {
            const workspace = workspaces.find(ws => ws.id === service.workspaceId)
            const workspaceConfig = workspace ? getWorkspaceConfig(workspace.type) : null
            const isExpanded = expandedServices[service.id]
            const showQR = showQRCode === service.id
            
            const address = workspace?.address || service.details?.address || "Strada Exemplu nr. 123, București"
            const email = workspace?.email || "contact@example.com"
            const phone = workspace?.phone || service.details?.phone || "+40 123 456 789"

            return (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1 flex items-center gap-2">
                        {service.type === 'fitness' && <User className="h-5 w-5 text-blue-500" />}
                        {service.type === 'hotel' && <Home className="h-5 w-5 text-green-500" />}
                        {service.type === 'clinic' && <UserCheck className="h-5 w-5 text-purple-500" />}
                        {service.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {service.confirmed ? (
                        <Badge variant="default" className="ml-2">
                          Activ
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="ml-2">
                          Neconfirmat
                        </Badge>
                      )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleServiceExpansion(service.id)}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="font-semibold text-foreground">
                      {service.price?.toLocaleString("ro-RO")} RON
                    </div>
                  </div>

                  {workspace && (
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span className="truncate">{workspace.name || service.details?.location}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleViewWorkspace(service.workspaceId)}
                        >
                          Deschide
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {service.confirmedAt && (
                    <div className="pt-2 text-xs text-muted-foreground">
                      Confirmat pe {new Date(service.confirmedAt).toLocaleDateString("ro-RO")}
                    </div>
                  )}

                  {/* Detalii extinse pentru serviciu */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-border">
                      {service.type === 'fitness' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Detalii Abonament</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShowQRCode(service)}
                            >
                              <QrCode className="h-4 w-4 mr-2" />
                              Cod QR
                            </Button>
                          </div>
                          
                          {showQR && (
                            <div className="bg-muted p-4 rounded-md text-center">
                              <div className="bg-white p-4 rounded-md inline-block">
                                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mx-auto mb-2">
                                  <QrCode className="h-16 w-16 text-gray-500" />
                                </div>
                                <p className="text-xs font-mono">{service.details?.qrCode || 'FIT-2023-12345'}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Nivel acces:</span>
                              <p className="font-medium">{service.details?.accessLevel || 'Standard'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Valabil până:</span>
                              <p className="font-medium">{service.details?.validUntil || '31.12.2023'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground text-sm">Facilități incluse:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(service.details?.facilities || ['Sală de forță', 'Piscină', 'Saună']).map((facility, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {service.type === 'hotel' && (
                        <div className="space-y-3">
                          <h4 className="font-medium">Detalii Rezervare</h4>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Tip cameră:</span>
                              <p className="font-medium">{service.details?.roomType || 'Camera Dublă'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Durată:</span>
                              <p className="font-medium">{service.duration}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Check-in:</span>
                              <p className="font-medium">{service.details?.checkIn || '15.07.2023'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Check-out:</span>
                              <p className="font-medium">{service.details?.checkOut || '22.07.2023'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground text-sm">Adresă:</span>
                            <p className="font-medium">{address}</p>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground text-sm">Facilități:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(service.details?.amenities || ['All-inclusive', 'Vedere la mare']).map((amenity, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {service.type === 'clinic' && (
                        <div className="space-y-3">
                          <h4 className="font-medium">Detalii Programare</h4>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Medic:</span>
                              <p className="font-medium">{service.details?.dentistName || 'Dr. Popescu Andrei'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Specializare:</span>
                              <p className="font-medium">{service.details?.specialization || 'Stomatologie generală'}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Data:</span>
                              <p className="font-medium">{service.details?.appointmentDate || '20.12.2023'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Ora:</span>
                              <p className="font-medium">{service.details?.appointmentTime || '14:30'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground text-sm">Locație:</span>
                            <p className="font-medium">{service.details?.location || 'Cabinetul Smile Perfect'}</p>
                            <p className="text-sm text-muted-foreground">{address}</p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{phone}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ServicesView

