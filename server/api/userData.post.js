import db from "../utils/db";
import { serverSupabaseClient } from '#supabase/server';
import { serverSupabaseUser } from '#supabase/server';
import { defineEventHandler } from 'h3';
import { readBody } from 'h3'



export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);

    const body =  await readBody(event);

    const updatedUserData = await db.updateUserData(client, user.id, body);

    return updatedUserData;
  
  });