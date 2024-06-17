import prisma from "../src/config/prisma";
import { EmployeeType } from "../src/types/employeeTypes";

type User = {
  username: string;
  firstName: string;
  lastName: string;
  idCard: string;
  password: string;
};
type Role = {
  id: number;
  name: string;
};

function getEmployees(): EmployeeType[] {
  return [
    {
      idCard: "1520101164070",
      firstName: "nattawat",
      lastName: "wangsupadilok",
      gender: "male",
    },
  ];
}

// function getUsers(): User[] {
//   return [
//     {
//       username: "kenkenm43",
//       firstName: "nat",
//       lastName: "wan",
//       idCard: "15201101164070",
//       password: "12345678",
//     },
//   ];
// }
function getRoles(): Role[] {
  return [
    {
      id: 1,
      name: "user",
    },
    {
      id: 2,
      name: "admin",
    },
  ];
}

async function seed() {
  await Promise.all(
    getRoles().map((role) => {
      return prisma.role.create({
        data: {
          id: role.id,
          name: role.name,
        },
      });
    })
  );
  await Promise.all(
    getEmployees().map((employee) => {
      return prisma.employee.create({
        data: {
          idCard: employee.idCard,
          firstName: employee.firstName,
          lastName: employee.lastName,
          gender: employee.gender,
        },
      });
    })
  );

  // await Promise.all(
  //   getUsers().map((user) => {
  //     return prisma.user.create({
  //       data: {
  //         username: user.username,
  //         firstName: user.firstName,
  //         lastName: user.lastName,
  //         idCard: user.idCard,
  //         password: user.password,
  //       },
  //     });
  //   })
  // );
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
