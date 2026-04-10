-- Enable Row Level Security on all tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "expenses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_limits" ENABLE ROW LEVEL SECURITY;

-- ==================== USERS TABLE POLICIES ====================

-- Policy: Users can read only their own user record
CREATE POLICY "users_can_view_own_data"
  ON "users"
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update only their own user record
CREATE POLICY "users_can_update_own_data"
  ON "users"
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Allow insert during signup (authenticated users can create their profile)
CREATE POLICY "users_can_insert_own_data"
  ON "users"
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can delete only their own user record
CREATE POLICY "users_can_delete_own_data"
  ON "users"
  FOR DELETE
  USING (auth.uid() = id);

-- ==================== EXPENSES TABLE POLICIES ====================

-- Policy: Users can read only their own expenses
CREATE POLICY "users_can_view_own_expenses"
  ON "expenses"
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own expenses
CREATE POLICY "users_can_insert_own_expenses"
  ON "expenses"
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own expenses
CREATE POLICY "users_can_update_own_expenses"
  ON "expenses"
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete only their own expenses
CREATE POLICY "users_can_delete_own_expenses"
  ON "expenses"
  FOR DELETE
  USING (auth.uid() = user_id);

-- ==================== USER_LIMITS TABLE POLICIES ====================

-- Policy: Users can read only their own limits
CREATE POLICY "users_can_view_own_limits"
  ON "user_limits"
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own limits
CREATE POLICY "users_can_insert_own_limits"
  ON "user_limits"
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own limits
CREATE POLICY "users_can_update_own_limits"
  ON "user_limits"
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete only their own limits
CREATE POLICY "users_can_delete_own_limits"
  ON "user_limits"
  FOR DELETE
  USING (auth.uid() = user_id);
