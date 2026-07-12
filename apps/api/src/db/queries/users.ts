import type { User } from '@pebnews/shared-types'

export async function getUserByEmail(db: D1Database, email: string): Promise<User | null> {
  return db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<User>()
}

export async function getUserById(db: D1Database, id: string): Promise<User | null> {
  return db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first<User>()
}

export async function createUser(
  db: D1Database,
  user: Pick<User, 'id' | 'name' | 'email' | 'password_hash' | 'role'>
): Promise<User> {
  await db
    .prepare(
      `INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`
    )
    .bind(user.id, user.name, user.email, user.password_hash, user.role)
    .run()
  return user as User
}
