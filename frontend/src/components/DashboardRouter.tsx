import { useAuthStore } from '@/store/auth'
import Navigation from './Navigation'
import UserDashboard from './dashboards/UserDashboard'
import AdminDashboard from './dashboards/AdminDashboard'
import SuperAdminDashboard from './dashboards/SuperAdminDashboard'

export default function DashboardRouter() {
  const { user } = useAuthStore()

  if (!user) return null

  const DashboardComponent = () => {
    switch (user.role) {
      case 'SUPER_ADMIN':
        return <SuperAdminDashboard />
      case 'ADMIN':
        return <AdminDashboard />
      case 'USER':
      default:
        return <UserDashboard />
    }
  }

  return (
    <>
      <Navigation />
      <DashboardComponent />
    </>
  )
}
