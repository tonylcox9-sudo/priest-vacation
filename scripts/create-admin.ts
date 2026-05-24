import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@diocese.org'
  const password = process.env.ADMIN_PASSWORD || 'changeme123'
  
  const hashedPassword = await bcrypt.hash(password, 10)
  
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: 'Diocese Administrator',
      role: 'super_admin'
    }
  })
  
  console.log(`Admin created: ${email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })