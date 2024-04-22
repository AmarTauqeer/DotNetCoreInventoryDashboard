import Sidebar from "@/components/Sidebar";
import "./globals.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Employee Management",
  description: "Comple crud operations on department and employee",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Toaster richColors position="top-right" duration={3000} />
          <div className="mr-2">
            <Sidebar />
          </div>
          <div className="w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
