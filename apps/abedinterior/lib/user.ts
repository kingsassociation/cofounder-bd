import { prisma } from "./prisma";
async function mergeGuestUser(
  mainUser: any,
  guestUser: any,
  newPhoneNumber: string,
) {
  await prisma.order.updateMany({
    where: { userId: guestUser.id },
    data: { userId: mainUser.id },
  });
  await prisma.user.delete({
    where: { id: guestUser.id },
  });
  return await prisma.user.update({
    where: { id: mainUser.id },
    data: { phoneNumber: newPhoneNumber },
  });
}
export async function findOrCreateUserByPhone({
  phoneNumber,
  name,
  userId,
  email,
}: {
  phoneNumber: string;
  name?: string;
  userId?: string | null;
  email?: string | null;
}) {
  if (userId) {
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user) {
      if (phoneNumber && user.phoneNumber !== phoneNumber) {
        const existingPhoneUser = await prisma.user.findUnique({
          where: { phoneNumber },
        });
        if (existingPhoneUser) {
          if (existingPhoneUser.isGuest) {
            user = await mergeGuestUser(user, existingPhoneUser, phoneNumber);
          } else if (existingPhoneUser.id !== user.id) {
            console.warn(
              `Phone ${phoneNumber} is already taken by User ${existingPhoneUser.id}`,
            );
            return user;
          }
        } else {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { phoneNumber },
          });
        }
      }
      if (email && !user.email) {
        const existingEmailUser = await prisma.user.findUnique({
          where: { email },
        });
        if (!existingEmailUser) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { email },
          });
        }
      }
      return user;
    }
  }
  const userByPhone = await prisma.user.findUnique({
    where: { phoneNumber },
  });
  if (userByPhone) {
    return userByPhone;
  }
  if (email) {
    const userByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (userByEmail) {
      const existingPhoneUser = await prisma.user.findUnique({
        where: { phoneNumber },
      });
      if (!existingPhoneUser) {
        return await prisma.user.update({
          where: { id: userByEmail.id },
          data: {
            phoneNumber,
            isGuest: false,
          },
        });
      } else {
        if (existingPhoneUser.isGuest) {
          return await mergeGuestUser(
            userByEmail,
            existingPhoneUser,
            phoneNumber,
          );
        }
        return userByEmail;
      }
    }
  }
  return await prisma.user.create({
    data: {
      phoneNumber,
      name,
      email: email || null,
      isGuest: !userId,
    },
  });
}
