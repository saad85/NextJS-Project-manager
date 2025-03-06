const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
`;


const Sidebar = () => {
    return (
        <div className={sidebarClassNames}>
            <div className="flex h-[100%] w-full flex-col justify-start">
                Sidebar
                <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
                    <div className="text-xl font-bold text-gray-800 dark:text-white">
                        EDLIST
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar