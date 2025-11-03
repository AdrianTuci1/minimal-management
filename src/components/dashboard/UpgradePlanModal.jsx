import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronRight, Plus, User } from "lucide-react"
import { cn } from "@/lib/utils"
import useWorkspaceStore from "../../store/workspaceStore"

const SEAT_TYPES = {
  full: {
    name: "Full",
    color: "bg-blue-500",
    includes: "Figma Design, Figma Sites (Beta), Figma Make, Dev Mode, FigJam, and Figma Slides",
    monthlyPrice: 16,
  },
  collab: {
    name: "Collab",
    color: "bg-purple-500",
    includes: "FigJam and Figma Slides",
    monthlyPrice: 3,
  },
  dev: {
    name: "Dev",
    color: "bg-green-500",
    includes: "Dev Mode",
    monthlyPrice: 12,
  },
}

const CURRENCIES = [
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
]

const UpgradePlanModal = ({ open, onClose, onNext }) => {
  const { currentUser } = useWorkspaceStore()
  const [step, setStep] = useState("upgrade-type") // "upgrade-type" | "choose-seats"
  const [selectedOption, setSelectedOption] = useState(null) // "just-me" or "team"
  const [billingCycle, setBillingCycle] = useState("annual") // "annual" | "monthly"
  const [currency, setCurrency] = useState("EUR")
  
  // Mock team members - in real app, this would come from store
  const [teamMembers, setTeamMembers] = useState([
    {
      id: "user-1",
      name: "Tucicovenco Adrian",
      email: "adrian.tucicovenco@gmail.com",
      initials: "TA",
      isYou: true,
      seatType: "full",
    },
    {
      id: "user-2",
      name: "Victor Georgescu",
      email: "victorgeorgescu22@gmail.com",
      initials: "VG",
      isYou: false,
      seatType: "collab",
    },
  ])

  // Handle Escape key
  useEffect(() => {
    if (open) {
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          handleClose()
        }
      }
      
      document.addEventListener("keydown", handleEscape)
      
      return () => {
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [open])

  // Reset step when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep("upgrade-type")
      setSelectedOption(null)
    }
  }, [open])

  const handleClose = () => {
    setStep("upgrade-type")
    setSelectedOption(null)
    onClose()
  }

  if (!open) return null

  const handleNext = () => {
    if (step === "upgrade-type" && selectedOption) {
      if (selectedOption === "team") {
        setStep("choose-seats")
      } else {
        // For "just-me", proceed directly
        if (onNext) {
          onNext(selectedOption)
        }
      }
    } else if (step === "choose-seats") {
      if (onNext) {
        onNext({ option: selectedOption, teamMembers, billingCycle, currency })
      }
    }
  }

  const handleBack = () => {
    if (step === "choose-seats") {
      setStep("upgrade-type")
    }
  }

  const handleSeatTypeChange = (memberId, newSeatType) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId ? { ...member, seatType: newSeatType } : member
      )
    )
  }

  const calculateTotal = () => {
    const seatCounts = teamMembers.reduce((acc, member) => {
      acc[member.seatType] = (acc[member.seatType] || 0) + 1
      return acc
    }, {})

    const fullCount = seatCounts.full || 0
    const collabCount = seatCounts.collab || 0
    const devCount = seatCounts.dev || 0

    const fullPrice = fullCount * SEAT_TYPES.full.monthlyPrice
    const collabPrice = collabCount * SEAT_TYPES.collab.monthlyPrice
    const devPrice = devCount * SEAT_TYPES.dev.monthlyPrice

    const monthlyTotal = fullPrice + collabPrice + devPrice
    return {
      fullCount,
      collabCount,
      devCount,
      fullPrice,
      collabPrice,
      devPrice,
      monthlyTotal,
      yearlyTotal: monthlyTotal * 12,
    }
  }

  const totals = calculateTotal()
  const assignedSeats = teamMembers.length
  const unassignedSeats = 0

  const breadcrumbs = [
    { label: "Upgrade type", step: "upgrade-type" },
    { label: "Choose seats", step: "choose-seats" },
    { label: "Payment information", step: "payment" },
    { label: "Review", step: "review" },
  ]

  const currentStepIndex = breadcrumbs.findIndex(b => b.step === step)

  const renderUpgradeTypeStep = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <Button
          variant="ghost"
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.step} className="flex items-center gap-2">
              {index > 0 && <span className="text-muted-foreground">&gt;</span>}
              <span
                className={cn(
                  index === currentStepIndex
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </div>
        
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">
            Cine face upgrade la un plan Professional?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card
          className={cn(
            "cursor-pointer transition-all duration-200 hover:border-primary/50",
            selectedOption === "just-me" 
              ? "border-primary border-2 bg-primary/5" 
              : "border-border"
          )}
          onClick={() => setSelectedOption("just-me")}
        >
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className={cn(
                "w-20 h-20 rounded-lg border-2 flex items-center justify-center relative",
                selectedOption === "just-me" 
                  ? "border-primary bg-primary/10" 
                  : "border-border bg-muted/50"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-sm border-2 rotate-45",
                  selectedOption === "just-me" 
                    ? "border-primary bg-primary/20" 
                    : "border-muted-foreground bg-muted"
                )} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Doar eu</h3>
                <p className="text-sm text-muted-foreground">
                  Poți invita oricând oameni mai târziu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "cursor-pointer transition-all duration-200 hover:border-primary/50",
            selectedOption === "team" 
              ? "border-primary border-2 bg-primary/5" 
              : "border-border"
          )}
          onClick={() => setSelectedOption("team")}
        >
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className={cn(
                "w-20 h-20 rounded-lg border-2 flex items-center justify-center relative overflow-hidden",
                selectedOption === "team" 
                  ? "border-primary bg-primary/10" 
                  : "border-border bg-muted/50"
              )}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-sm border border-red-500 bg-red-500/30 rotate-45" />
                  <div className="absolute top-4 left-3 w-4 h-4 rounded-sm border border-green-500 bg-green-500/30 rotate-45" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 rounded-sm border border-yellow-500 bg-yellow-500/30 rotate-45" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 rounded-sm border border-purple-500 bg-purple-500/30 rotate-45" />
                  <div className={cn(
                    "w-5 h-5 rounded-sm border-2 rotate-45",
                    selectedOption === "team" 
                      ? "border-primary bg-primary/30" 
                      : "border-muted-foreground bg-muted"
                  )} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Eu și echipa mea</h3>
                <p className="text-sm text-muted-foreground">
                  Obține locuri pentru mai multe persoane
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          variant="default"
          size="lg"
          onClick={handleNext}
          disabled={!selectedOption}
          className="min-w-[250px]"
        >
          Următorul: Locuri și plată
        </Button>
      </div>
        </div>
      </div>
    </div>
  )

  const renderChooseSeatsStep = () => {
    const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || "€"
    const priceMultiplier = billingCycle === "annual" ? 12 : 1
    const periodLabel = billingCycle === "annual" ? "yr" : "mo"

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.step} className="flex items-center gap-2">
                {index > 0 && <span className="text-muted-foreground">&gt;</span>}
                <span
                  className={cn(
                    index === currentStepIndex
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {crumb.label}
                </span>
              </div>
            ))}
          </div>
          
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="flex gap-8 flex-1 overflow-hidden p-8">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Choose a seat type for everyone in {currentUser?.name || "Tucicovenco Adrian"}'s team.
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Seat types have been suggested based on previous Figma use.{" "}
              <a href="#" className="text-primary hover:underline">Learn more about seats</a>
            </p>

            {/* Team Members Table */}
            <div className="border rounded-lg overflow-hidden mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:text-foreground">
                      Name <ChevronDown className="inline h-4 w-4 ml-1" />
                    </TableHead>
                    <TableHead>Seat</TableHead>
                    <TableHead>Includes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.isYou ? (
                                <User className="h-4 w-4" />
                              ) : (
                                member.initials
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {member.name} {member.isYou && <span className="text-muted-foreground">(You)</span>}
                            </div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto p-2 gap-2 hover:bg-transparent">
                              {member.seatType === "full" ? (
                                <div className="relative w-5 h-5">
                                  <div className={cn("absolute inset-0 rounded-full", SEAT_TYPES[member.seatType].color, "opacity-80")} />
                                  <div className={cn("absolute top-0 left-0 w-2.5 h-2.5 rounded-full border-2 border-white", SEAT_TYPES[member.seatType].color)} />
                                  <div className={cn("absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white", SEAT_TYPES[member.seatType].color)} />
                                  <div className={cn("absolute top-0 right-0 w-2 h-2 rounded-full border border-white", SEAT_TYPES[member.seatType].color, "opacity-60")} />
                                  <div className={cn("absolute bottom-0 left-0 w-2 h-2 rounded-full border border-white", SEAT_TYPES[member.seatType].color, "opacity-60")} />
                                </div>
                              ) : member.seatType === "collab" ? (
                                <div className="relative w-5 h-5">
                                  <div className={cn("absolute top-0 left-0 w-3 h-3 rounded-full border-2 border-white", SEAT_TYPES[member.seatType].color)} />
                                  <div className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white", SEAT_TYPES[member.seatType].color)} />
                                </div>
                              ) : (
                                <div className={cn("w-5 h-5 rounded-full", SEAT_TYPES[member.seatType].color)} />
                              )}
                              <span>{SEAT_TYPES[member.seatType].name}</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {Object.entries(SEAT_TYPES).map(([key, seat]) => (
                              <DropdownMenuItem
                                key={key}
                                onClick={() => handleSeatTypeChange(member.id, key)}
                              >
                                <div className="flex items-center gap-2">
                                  {key === "full" ? (
                                    <div className="relative w-4 h-4">
                                      <div className={cn("absolute inset-0 rounded-full", seat.color, "opacity-80")} />
                                      <div className={cn("absolute top-0 left-0 w-1.5 h-1.5 rounded-full border border-white", seat.color)} />
                                      <div className={cn("absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full border border-white", seat.color)} />
                                    </div>
                                  ) : key === "collab" ? (
                                    <div className="relative w-4 h-4">
                                      <div className={cn("absolute top-0 left-0 w-2 h-2 rounded-full border border-white", seat.color)} />
                                      <div className={cn("absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white", seat.color)} />
                                    </div>
                                  ) : (
                                    <div className={cn("w-4 h-4 rounded-full", seat.color)} />
                                  )}
                                  <span>{seat.name}</span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {SEAT_TYPES[member.seatType].includes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Add Seats Link */}
            <div className="flex items-center justify-between mb-8">
              <Button variant="ghost" className="gap-2">
                <Plus className="h-4 w-4" />
                Add seats to assign later
              </Button>
              <div className="text-sm text-muted-foreground">
                Current total: {assignedSeats} assigned seats, {unassignedSeats} unassigned seats
              </div>
            </div>
          </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Professional plan</h3>
              
              {/* Currency */}
              <div className="mb-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {currencySymbol} {currency}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {CURRENCIES.map((curr) => (
                      <DropdownMenuItem
                        key={curr.code}
                        onClick={() => setCurrency(curr.code)}
                      >
                        {curr.symbol} {curr.code}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Billing Cycle */}
              <div className="mb-6 space-y-3">
                <div className="text-sm font-medium mb-2">Billing Cycle</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="billing"
                      checked={billingCycle === "annual"}
                      onChange={() => setBillingCycle("annual")}
                      className="w-4 h-4"
                    />
                    <span className="flex-1">Annual</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                      Save up to 20%
                    </Badge>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="billing"
                      checked={billingCycle === "monthly"}
                      onChange={() => setBillingCycle("monthly")}
                      className="w-4 h-4"
                    />
                    <span>Monthly</span>
                  </label>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 mb-4">
                {totals.fullCount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{totals.fullCount} Full seat</span>
                    <span>
                      × {currencySymbol}{SEAT_TYPES.full.monthlyPrice}/{billingCycle === "annual" ? "mo" : "mo"} × {billingCycle === "annual" ? "12 months" : "1 month"} = {currencySymbol}{totals.fullPrice * priceMultiplier}/{periodLabel}
                    </span>
                  </div>
                )}
                {totals.devCount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{totals.devCount} Dev seats</span>
                    <span>
                      × {currencySymbol}{SEAT_TYPES.dev.monthlyPrice}/{billingCycle === "annual" ? "mo" : "mo"} × {billingCycle === "annual" ? "12 months" : "1 month"} = {currencySymbol}{totals.devPrice * priceMultiplier}/{periodLabel}
                    </span>
                  </div>
                )}
                {totals.collabCount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{totals.collabCount} Collab seat</span>
                    <span>
                      × {currencySymbol}{SEAT_TYPES.collab.monthlyPrice}/{billingCycle === "annual" ? "mo" : "mo"} × {billingCycle === "annual" ? "12 months" : "1 month"} = {currencySymbol}{totals.collabPrice * priceMultiplier}/{periodLabel}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between font-semibold mb-2">
                  <span>Subtotal</span>
                  <span>{currencySymbol}{totals.monthlyTotal * priceMultiplier}/{periodLabel}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  See your total (including taxes) in Review
                </p>
              </div>

              <Button
                variant="default"
                className="w-full"
                onClick={handleNext}
              >
                Next: Payment information
              </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={handleClose} />
      
      <div className="relative z-10 w-full h-full bg-background flex flex-col">
        {step === "upgrade-type" ? renderUpgradeTypeStep() : renderChooseSeatsStep()}
      </div>
    </div>
  )
}

export default UpgradePlanModal

