
import "./globals.css";

export const metadata = {
  title: "بوابة أعضاء مسار الويب",
  description: "إدارة طلبات العضوية وتجربة Google Login",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
