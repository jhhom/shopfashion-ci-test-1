import { KyselyDB } from "@seed/seed/db";

export async function seedAdmins(db: KyselyDB) {
  await db
    .insertInto("admins")
    .values({
      email: "admin",
      password: "admin123",
      username: "admin",
    })
    .execute();
}
