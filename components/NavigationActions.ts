'use server';

import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

import { currentUser } from '@clerk/nextjs/server';

export async function getCount() {
  const user = await currentUser();

  if(!user) {
    return
  }

  try {
    return await client.task.count({
      where: {
        status: 'todo',
        ownerId: user.id
      }
    });
  } catch(e) {
    console.warn(e);

    return '?'
  }
}
