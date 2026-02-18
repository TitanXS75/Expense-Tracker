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
        <nav className="fixed bottom-0 left-0 right-0 bg-nb-surface border-t-2 border-nb-border z-50 transition-colors duration-300"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
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
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-nb-border bg-nb-primary-soft`}>
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
        /* On mobile: full screen, no bg shell visible.
           On md+: centered card with decorative shell */
        <div className="min-h-screen bg-nb-surface md:bg-nb-app-bg md:nb-shell flex justify-center transition-colors duration-300">
            <main className="
                w-full min-h-screen bg-nb-surface overflow-x-hidden relative transition-colors duration-300
                md:max-w-md md:min-h-screen md:border-2 md:border-nb-border md:rounded-[1.75rem] md:shadow-nb-lg md:mt-6 md:mb-8
            ">
                <div className="px-4 pt-4 pb-24">
                    <Outlet />
                </div>
                <BottomNav />
            </main>
        </div>
    );
};

export default Layout;
