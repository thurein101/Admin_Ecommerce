
import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

// 1. Prisma Neon Adapter အတွက် Singleton Generator ကို တည်ဆောက်ခြင်း
const prismaClientSingleton = () => {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  })
  return new PrismaClient({ adapter })
}

// 2. Global Type Definition သတ်မှတ်ခြင်း (TypeScript Error မတက်စေရန်)
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// 3. Global Instance ရှိရင် ယူသုံး၊ မရှိရင် အသစ်တစ်ခုပဲ ဆောက်ခိုင်းခြင်း
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// 4. Production မဟုတ်ရင် Global Variable ထဲ သိမ်းထားခိုင်းခြင်း (Hot Reload ဒဏ်မှ ကာကွယ်ရန်)
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma