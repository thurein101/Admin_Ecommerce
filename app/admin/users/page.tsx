
import { prisma } from "@/lib/prisma";
import { AdminUsersPage } from "./AdminUserCom";



export default async function Page() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return <AdminUsersPage users={users} />
}