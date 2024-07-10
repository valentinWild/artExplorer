import { defineEventHandler } from 'h3'
import axios from 'axios';
import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  const userId = user.id;

  const userData = await db.getUserQuizData(client, userId);
  return userData;

});
          