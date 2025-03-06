import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
            <Sidebar />
            <Navbar />
            {children}
        </div>
    )
}

const DashboardWrapper = ({children}: {children: React.ReactNode}) => {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    )
}

export default DashboardWrapper
