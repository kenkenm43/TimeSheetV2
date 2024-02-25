//create force table
npx prisma db push

//migrate Prisma
npx prisma migrate dev --name init

//prisma studio
npx prisma studio

// rename
npx prisma migrate dev --name rename-migration --create-only

//run seed
npx prisma db seed
