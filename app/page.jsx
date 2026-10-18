
import { auth, signIn } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main>
      <section className="card">
        <div className="dots">
          <span className="dot blue" />
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>

        <div className="tag">WEB DEVELOPMENT TRACK</div>
        <h1>مرحباً، مسار إنشاء الويب</h1>
        <p>هذا الموقع يوضح آلية الموافقة على طلبات تسجيل الدخول باستخدام Google</p>
        <p>المستخدم: {session?.user ? (
          <Link className="button primary" href="/dashboard">دخول إلى لوحة التحكم</Link>
        ) : (
          <form action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}>
            <button className="button primary" type="submit">تسجيل الدخول باستخدام Google</button>
          </form>
        )}</p>
        <p className="small">يمكنك من هنا تسجيل دخولك، وذلك من خلال استخدام حسابك في Google</p>
      </section>
    </main>
  );
}
