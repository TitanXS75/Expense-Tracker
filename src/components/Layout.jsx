import { LayoutDashboard, Receipt, Settings, PieChart } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const BottomNav = () => {
    const navItems = [
        { to: "/", icon: LayoutDashboard, label: "Home" },
        { to: "/transactions", icon: Receipt, label: "History" },
        { to: "/charts", icon: PieChart, label: "Charts" },
        { to: "/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-nb-surface border-t-2 border-nb-border safe-area-bottom z-50 transition-colors duration-300 shadow-nb-lg">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-semibold tracking-wide uppercase ${isActive
                                ? 'text-nb-primary'
                                : 'text-nb-muted hover:text-slate-900'
                            }`
                        }
                    >
                        <span className="flex h-8 w-8 items-center justify-center border-2 border-nb-border rounded-full bg-nb-primary-soft shadow-nb-md">
                            <item.icon className="w-4 h-4" />
                        </span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

const Layout = () => {
    return (
        <div className="min-h-screen nb-shell pb-20 flex justify-center transition-colors duration-300 bg-nb-app-bg">
            <main className="w-full max-w-md min-h-screen bg-nb-surface border-2 border-nb-border rounded-[1.75rem] shadow-nb-lg overflow-x-hidden relative transition-colors duration-300 mt-6 mb-8 px-4">
                <div className="p-4 md:p-6 pb-24">
                    <Outlet />
                </div>
                <BottomNav />
            </main>
        </div>
    );
};

export default Layout;
