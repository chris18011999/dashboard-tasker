'use server';

import { revalidatePath, revalidateTag } from "next/cache";

export const revalidateWeatherTag = () =>{
  revalidateTag('weather');
  revalidatePath('/')
}