#!/usr/bin/env node
/**
 * Apply RLS policies to Supabase database
 * Run with: node apply-rls.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables. Add these to .env.local:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const rlsSQL = `
-- Enable Row Level Security on all tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "expenses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_limits" ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES
CREATE POLICY "users_can_view_own_data" ON "users" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_can_update_own_data" ON "users" FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_can_insert_own_data" ON "users" FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_can_delete_own_data" ON "users" FOR DELETE USING (auth.uid() = id);

-- EXPENSES TABLE POLICIES
CREATE POLICY "users_can_view_own_expenses" ON "expenses" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_can_insert_own_expenses" ON "expenses" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_update_own_expenses" ON "expenses" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_can_delete_own_expenses" ON "expenses" FOR DELETE USING (auth.uid() = user_id);

-- USER_LIMITS TABLE POLICIES
CREATE POLICY "users_can_view_own_limits" ON "user_limits" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_can_insert_own_limits" ON "user_limits" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_update_own_limits" ON "user_limits" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_can_delete_own_limits" ON "user_limits" FOR DELETE USING (auth.uid() = user_id);
`;

async function applyRLS() {
  console.log('🔄 Applying RLS policies to Supabase database...');
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: rlsSQL });
    
    if (error) {
      console.error('❌ Failed to apply RLS policies:', error.message);
      console.log('\n📋 Alternative: Run the SQL manually in Supabase Dashboard > SQL Editor');
      console.log('📄 SQL file location: drizzle/0002_strict_night_nurse.sql');
      process.exit(1);
    }
    
    console.log('✅ RLS policies applied successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n📋 Alternative: Run the SQL manually in Supabase Dashboard > SQL Editor');
    console.log('📄 SQL file location: drizzle/0002_strict_night_nurse.sql');
    process.exit(1);
  }
}

applyRLS();
