'use server';

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const client = new PrismaClient();

export const createNewTag = async (name: string) => {
  await client.tag.create({
    data: {
      name
    }
  })

  revalidatePath('/tasks/new')
}