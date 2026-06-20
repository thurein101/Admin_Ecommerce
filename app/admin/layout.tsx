import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden w-full">
      {/* 1. Desktop Sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      {/* 2. Mobile Header (Hamburger Menu) */}
      <div className="md:hidden fixed top-0 w-full p-4 bg-white border-b z-50 flex items-center">
        <Sheet>
          <SheetTrigger className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <span className="ml-4 font-bold">NEXTSHOP Admin</span>
      </div>

      {/* 3. Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pt-20 md:pt-8 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}