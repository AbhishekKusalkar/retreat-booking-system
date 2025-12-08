import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres:wellness_password_dev@localhost:5432/wellness_retreats',
})
