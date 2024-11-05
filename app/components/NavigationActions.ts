'use server';

import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
export async function getCount() {

  try {
    return await client.task.count({
      where: {
        status: 'todo'
      }
    });
  } catch(e) {
    return '?'
  }
}
