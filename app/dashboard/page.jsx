
import { auth, signOut } from "@/auth";
import { database } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.email) redirect("/");

  const email = session.user.email.trim().toLowerCase();
  const owner = (process.env.OWNER_EMAIL || "").trim().toLowerCase();
  if (owner && email === owner) redirect("/admin");

  const sql = database();
  await sql`
    INSERT INTO membership_requests (email, full_name, status)
    VALUES (${email}, ${session.user.name || ""}, 'PENDING')
    ON CONFLICT (email) DO UPDATE
    SET full_name = EXCLUDED.full_name
  `;

  const rows = await sql`
    SELECT status FROM membership_requests WHERE email = ${email} LIMIT 1
  `;

  const status = rows[0]?.status;

  const messages = {
    PENDING: "تم استلام طلب عضويتك، وهو الآن قيد مراجعة مالك الموقع.",
    APPROVED: "مبروك! تمت الموافقة على عضويتك. الآن يمكنك الوصول للمحتوى.",
    REJECTED: "تم رفض طلب العضوية الخاص بك، يمكنك التواصل مع مالك الموقع للاستفسار.",
    EXCLUDED: "تم استبعاد هذه العضوية من الموقع.",
  };

  return (
    <main>
      <section className="card">
        <div className="tag">MEMBERSHIP STATUS</div>
        <h1>حالة طلب العضوية: {status === "APPROVED" ? "مقبول" : status}</h1>
        <p>أهلاً {session.user.name || "زائر"}</p>
        <p className="status">{messages[status] || "تعذر قراءة الحالة"}</p>
        <p className="small">{email}</p>
        <p className="small">إذا اعتمد المالك قراراً جديداً، حدّث الصفحة لرؤيته.</p>
        <form action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}>
          <button className="button" type="submit">تسجيل الخروج</button>
        </form>
      </section>
    </main>
  );
}
