import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Seeding TEXACO Rewards database...')

  // Admin user
  const hashedPassword = await bcrypt.hash('johndoe123', 10)
  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: { name: 'Admin TEXACO', email: 'john@doe.com', password: hashedPassword, role: 'admin' },
  })

  // Stations
  const stationsData = [
    { name: 'TEXACO Centro', address: '6a Avenida 10-50 Zona 1', city: 'Guatemala', phone: '2230-1000', manager: 'Carlos Méndez' },
    { name: 'TEXACO Zona 10', address: 'Boulevard Los Próceres 15-20', city: 'Guatemala', phone: '2367-2000', manager: 'Ana López' },
    { name: 'TEXACO Mixco', address: 'Calzada San Juan 8-30', city: 'Mixco', phone: '2435-3000', manager: 'Roberto García' },
    { name: 'TEXACO Carretera al Salvador', address: 'Km 15.5 Carretera al Salvador', city: 'Santa Catarina Pinula', phone: '6634-4000', manager: 'María Hernández' },
  ]

  const stations = []
  for (const s of stationsData) {
    const station = await prisma.station.upsert({
      where: { id: s.name.replace(/\s+/g, '-').toLowerCase() },
      update: s,
      create: { ...s },
    })
    stations.push(station)
  }

  // Points Config
  const pointsConfigs = [
    { fuelType: 'REGULAR', pointsPerQuetzal: 1.0, description: 'Puntos por Q1 de gasolina Regular' },
    { fuelType: 'PREMIUM', pointsPerQuetzal: 1.5, description: 'Puntos por Q1 de gasolina Premium' },
    { fuelType: 'DIESEL', pointsPerQuetzal: 1.0, description: 'Puntos por Q1 de Diésel' },
    { fuelType: 'STORE', pointsPerQuetzal: 0.5, description: 'Puntos por Q1 en compras de tienda' },
  ]
  for (const pc of pointsConfigs) {
    await prisma.pointsConfig.upsert({ where: { fuelType: pc.fuelType }, update: pc, create: pc })
  }

  // Tier Config
  const tiers = [
    { name: 'BRONCE', minPoints: 0, multiplier: 1.0, color: '#CD7F32', benefits: 'Acumulación básica de puntos' },
    { name: 'PLATA', minPoints: 5000, multiplier: 1.25, color: '#C0C0C0', benefits: '25% más puntos en cada compra' },
    { name: 'ORO', minPoints: 15000, multiplier: 1.5, color: '#FFD700', benefits: '50% más puntos + recompensas exclusivas' },
    { name: 'PLATINO', minPoints: 50000, multiplier: 2.0, color: '#E5E4E2', benefits: 'Puntos dobles + beneficios VIP' },
  ]
  for (const t of tiers) {
    await prisma.tierConfig.upsert({ where: { name: t.name }, update: t, create: t })
  }

  // Rewards
  const rewardsData = [
    { name: '5 Galones de Regular', description: 'Llena tu tanque con 5 galones de gasolina Regular totalmente gratis', pointsCost: 500, category: 'FUEL' },
    { name: '3 Galones de Premium', description: 'Disfruta de 3 galones de gasolina Premium sin costo', pointsCost: 600, category: 'FUEL' },
    { name: 'Lavado de Auto Completo', description: 'Lavado exterior e interior completo en cualquier estación', pointsCost: 300, category: 'EXPERIENCE' },
    { name: 'Café Gratis', description: 'Un café de cualquier tamaño en la tienda de conveniencia', pointsCost: 50, category: 'STORE' },
    { name: 'Combo Snack', description: 'Bebida + snack de la tienda', pointsCost: 100, category: 'STORE' },
    { name: 'Gorra TEXACO', description: 'Gorra oficial con logo TEXACO', pointsCost: 800, category: 'MERCHANDISE' },
    { name: 'Cambio de Aceite', description: 'Cambio de aceite con filtro incluido', pointsCost: 1500, category: 'EXPERIENCE' },
    { name: 'Termo TEXACO', description: 'Termo de acero inoxidable con logo TEXACO', pointsCost: 1200, category: 'MERCHANDISE' },
  ]
  for (const r of rewardsData) {
    const existing = await prisma.reward.findFirst({ where: { name: r.name } })
    if (!existing) await prisma.reward.create({ data: r })
  }

  // Customers
  const customersData = [
    { firstName: 'Juan', lastName: 'Pérez', phone: '5555-0001', email: 'juan.perez@gmail.com', tier: 'ORO', totalPoints: 2500, lifetimePoints: 18000 },
    { firstName: 'María', lastName: 'García', phone: '5555-0002', email: 'maria.garcia@gmail.com', tier: 'PLATA', totalPoints: 1200, lifetimePoints: 8500 },
    { firstName: 'Carlos', lastName: 'López', phone: '5555-0003', email: 'carlos.lopez@gmail.com', tier: 'BRONCE', totalPoints: 450, lifetimePoints: 3200 },
    { firstName: 'Ana', lastName: 'Martínez', phone: '5555-0004', email: 'ana.martinez@gmail.com', tier: 'PLATINO', totalPoints: 5800, lifetimePoints: 62000 },
    { firstName: 'Roberto', lastName: 'Hernández', phone: '5555-0005', email: 'roberto.h@gmail.com', tier: 'ORO', totalPoints: 3100, lifetimePoints: 22000 },
    { firstName: 'Laura', lastName: 'Díaz', phone: '5555-0006', email: 'laura.diaz@gmail.com', tier: 'BRONCE', totalPoints: 180, lifetimePoints: 1500 },
    { firstName: 'Pedro', lastName: 'Ramírez', phone: '5555-0007', email: 'pedro.r@gmail.com', tier: 'PLATA', totalPoints: 900, lifetimePoints: 7200 },
    { firstName: 'Sofía', lastName: 'Torres', phone: '5555-0008', email: 'sofia.torres@gmail.com', tier: 'ORO', totalPoints: 4200, lifetimePoints: 19500 },
  ]

  const customers = []
  for (const c of customersData) {
    const customer = await prisma.customer.upsert({
      where: { phone: c.phone },
      update: { totalPoints: c.totalPoints, lifetimePoints: c.lifetimePoints, tier: c.tier },
      create: c,
    })
    customers.push(customer)
  }

  // Generate transactions for last 14 days
  const fuelTypes = ['REGULAR', 'PREMIUM', 'DIESEL']
  const now = Date.now()
  for (let day = 0; day < 14; day++) {
    const date = new Date(now - day * 24 * 60 * 60 * 1000)
    const txCount = 3 + Math.floor(Math.random() * 5)
    for (let j = 0; j < txCount; j++) {
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const station = stations[Math.floor(Math.random() * stations.length)]
      const isFuel = Math.random() > 0.3
      const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)]
      const amount = isFuel ? 100 + Math.floor(Math.random() * 400) : 15 + Math.floor(Math.random() * 85)
      const gallons = isFuel ? Math.round(amount / (30 + Math.random() * 15)) : null
      const pointsEarned = Math.floor(amount * (isFuel ? 1 : 0.5))

      await prisma.transaction.create({
        data: {
          customerId: customer.id,
          stationId: station.id,
          type: isFuel ? 'FUEL' : 'STORE',
          fuelType: isFuel ? fuelType : null,
          gallons,
          amount,
          pointsEarned,
          date,
        },
      })
    }
  }

  // Active promotion
  const promoStart = new Date(now - 7 * 24 * 60 * 60 * 1000)
  const promoEnd = new Date(now + 23 * 24 * 60 * 60 * 1000)
  const existingPromo = await prisma.promotion.findFirst({ where: { name: 'Puntos Dobles en Premium' } })
  if (!existingPromo) {
    await prisma.promotion.create({
      data: {
        name: 'Puntos Dobles en Premium',
        description: '¡Gana el doble de puntos al cargar Premium este mes!',
        type: 'DOUBLE_POINTS',
        multiplier: 2.0,
        fuelType: 'PREMIUM',
        startDate: promoStart,
        endDate: promoEnd,
      },
    })
  }

  console.log('Seed completed!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
