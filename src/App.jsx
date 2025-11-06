import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom"
import Dashboard from "./components/dashboard/Dashboard"
import WorkspaceView from "./components/views/WorkspaceView"
import ClientView from "./components/views/ClientView"
import PublicServicesView from "./components/views/PublicServicesView"
import RequestAppointmentView from "./components/views/RequestAppointmentView"
import BecomeClientView from "./components/views/BecomeClientView"
import BookReservationView from "./components/views/BookReservationView"
import PaymentDetailsView from "./components/views/PaymentDetailsView"
import ClientAccessInstructionsView from "./components/views/ClientAccessInstructionsView"
import SubscriptionPaymentView from "./components/views/SubscriptionPaymentView"
import ConfirmSubscriptionView from "./components/views/ConfirmSubscriptionView"
import ClientAccessView from "./components/views/ClientAccessView"
import ClientLoginView from "./components/views/ClientLoginView"
import ClientAreaView from "./components/views/ClientAreaView"
import OnboardingView from "./components/views/OnboardingView"
import useWorkspaceStore from "./store/workspaceStore"
import { GlobalDropdownBackdrop } from "./components/ui/dropdown-menu"
import { useMemo, useEffect } from "react"

// Wrapper component for WorkspaceView that gets workspace from route
function WorkspaceViewWrapper() {
  const { workspaceId } = useParams()
  const { workspaces, selectWorkspace } = useWorkspaceStore()

  const workspace = useMemo(() => {
    return workspaces.find((ws) => ws.id === workspaceId) || null
  }, [workspaces, workspaceId])

  // Sync route with store when workspace is found
  useEffect(() => {
    if (workspace && workspaceId) {
      selectWorkspace(workspaceId)
    }
  }, [workspace, workspaceId, selectWorkspace])

  if (!workspace) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Workspace-ul nu a fost găsit</h1>
          <p className="text-muted-foreground">Workspace-ul cu ID-ul {workspaceId} nu există.</p>
        </div>
      </div>
    )
  }

  return <WorkspaceView workspace={workspace} />
}

// Wrapper component for Dashboard that checks onboarding
function DashboardWrapper() {
  const { hasCompletedOnboarding } = useWorkspaceStore()

  if (!hasCompletedOnboarding()) {
    return <OnboardingView />
  }

  return (
    <>
      <Dashboard />
      <GlobalDropdownBackdrop />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={
          <>
            <OnboardingView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/" element={<DashboardWrapper />} />
        <Route path="/workspace/:workspaceId/public" element={
          <>
            <ClientView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/public/services" element={
          <>
            <PublicServicesView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/public/request-appointment" element={
          <>
            <RequestAppointmentView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/public/become-client" element={
          <>
            <BecomeClientView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/public/book-reservation" element={
          <>
            <BookReservationView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/public/payment-details" element={
          <>
            <PaymentDetailsView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/public/subscription-payment" element={
          <>
            <SubscriptionPaymentView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/public/client-access-instructions" element={
          <>
            <ClientAccessInstructionsView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/public/confirm-subscription/:token" element={
          <>
            <ConfirmSubscriptionView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/client-login" element={
          <>
            <ClientLoginView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/client" element={
          <>
            <ClientAreaView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId/:clientId" element={
          <>
            <ClientAccessView />
            <GlobalDropdownBackdrop />
          </>
        } />
        <Route path="/workspace/:workspaceId" element={
          <>
            <WorkspaceViewWrapper />
            <GlobalDropdownBackdrop />
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
