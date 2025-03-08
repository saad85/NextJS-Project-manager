import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
            <Sidebar />
            <main className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg md:pl-64`}>
                <Navbar />
                {children}
            </main>
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
