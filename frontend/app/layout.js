import Sidebar from "@/components/dashboard/Sidebar";
import "./globals.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Inventory Management Systems",
  description: "Gondal Industries Inventory Management Systems",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <table className="w-[100%]">
          <tbody>
            <Toaster richColors position="top-right" duration={3000} />
            <tr>
              <td>{children}</td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
