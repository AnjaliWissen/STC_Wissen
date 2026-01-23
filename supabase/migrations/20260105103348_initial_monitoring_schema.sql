/*
  # Blockchain Monitoring System Schema

  ## Overview
  Complete database schema for monitoring Hyperledger Fabric and Stellar blockchain networks.
  
  ## New Tables
  
  ### 1. `fabric_nodes`
  Tracks Hyperledger Fabric infrastructure components (Peers, Orderers, CAs)
  - `id` (uuid, primary key)
  - `node_name` (text) - Human-readable node identifier
  - `node_type` (text) - Type: peer, orderer, ca
  - `status` (text) - online, offline, syncing
  - `host` (text) - Node hostname/IP
  - `cpu_usage` (numeric) - CPU percentage
  - `memory_usage` (numeric) - Memory percentage
  - `storage_usage` (numeric) - Storage percentage
  - `last_heartbeat` (timestamptz) - Last health check
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. `transactions`
  All cross-border transaction records
  - `id` (uuid, primary key)
  - `fabric_hash` (text, unique) - Fabric transaction ID
  - `stellar_hash` (text) - Stellar transaction ID
  - `sender_id` (text) - Sender identifier
  - `recipient_id` (text) - Recipient identifier
  - `amount` (numeric) - Transaction amount
  - `source_currency` (text) - Original currency
  - `target_currency` (text) - Target currency
  - `status` (text) - pending, bridge_locked, fx_swapping, settled, failed
  - `error_message` (text) - Error details if failed
  - `submitted_at` (timestamptz) - Fabric submission time
  - `bridge_locked_at` (timestamptz) - Bridge lock time
  - `fx_swapped_at` (timestamptz) - FX swap completion time
  - `settled_at` (timestamptz) - Final settlement time
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. `network_metrics`
  Real-time network performance metrics
  - `id` (uuid, primary key)
  - `metric_type` (text) - tps, latency, block_time
  - `value` (numeric) - Metric value
  - `channel` (text) - Fabric channel name
  - `timestamp` (timestamptz)
  - `created_at` (timestamptz)
  
  ### 4. `fx_rates`
  Foreign exchange rates from Stellar DEX
  - `id` (uuid, primary key)
  - `currency_pair` (text) - e.g., USD_EUR
  - `rate` (numeric) - Exchange rate
  - `source` (text) - stellar_dex
  - `timestamp` (timestamptz)
  - `created_at` (timestamptz)
  
  ### 5. `bridge_liquidity`
  Liquidity status of escrow accounts
  - `id` (uuid, primary key)
  - `network` (text) - fabric, stellar
  - `currency` (text) - Currency code
  - `balance` (numeric) - Current balance
  - `threshold` (numeric) - Minimum threshold
  - `status` (text) - healthy, warning, critical
  - `updated_at` (timestamptz)
  - `created_at` (timestamptz)
  
  ### 6. `alerts`
  System alerts and notifications
  - `id` (uuid, primary key)
  - `alert_type` (text) - threshold, error, security
  - `severity` (text) - info, warning, critical
  - `title` (text) - Alert title
  - `message` (text) - Alert message
  - `metric` (text) - Related metric
  - `threshold_value` (numeric) - Threshold that triggered alert
  - `actual_value` (numeric) - Actual value
  - `acknowledged` (boolean) - Has been acknowledged
  - `acknowledged_by` (text) - User who acknowledged
  - `acknowledged_at` (timestamptz)
  - `resolved` (boolean) - Has been resolved
  - `resolved_at` (timestamptz)
  - `created_at` (timestamptz)
  
  ### 7. `alert_rules`
  Configurable alert thresholds
  - `id` (uuid, primary key)
  - `name` (text) - Rule name
  - `metric` (text) - Metric to monitor
  - `condition` (text) - gt, lt, eq
  - `threshold` (numeric) - Threshold value
  - `severity` (text) - info, warning, critical
  - `enabled` (boolean) - Is rule active
  - `created_by` (text) - User who created rule
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 8. `audit_logs`
  Immutable audit trail for compliance
  - `id` (uuid, primary key)
  - `action` (text) - Action performed
  - `user_id` (text) - User who performed action
  - `resource_type` (text) - Type of resource
  - `resource_id` (text) - Resource identifier
  - `details` (jsonb) - Additional details
  - `ip_address` (text) - Source IP
  - `timestamp` (timestamptz)
  - `created_at` (timestamptz)
  
  ### 9. `bridge_errors`
  Bridge-specific error tracking
  - `id` (uuid, primary key)
  - `transaction_id` (uuid) - Reference to transactions table
  - `error_type` (text) - stellar_payment_failed, fabric_timeout, etc.
  - `error_message` (text) - Detailed error message
  - `error_data` (jsonb) - Additional error context
  - `resolved` (boolean) - Has been resolved
  - `created_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users only
*/

-- Create tables
CREATE TABLE IF NOT EXISTS fabric_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_name text NOT NULL,
  node_type text NOT NULL CHECK (node_type IN ('peer', 'orderer', 'ca')),
  status text NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'syncing')),
  host text NOT NULL,
  cpu_usage numeric DEFAULT 0,
  memory_usage numeric DEFAULT 0,
  storage_usage numeric DEFAULT 0,
  last_heartbeat timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fabric_hash text UNIQUE NOT NULL,
  stellar_hash text,
  sender_id text NOT NULL,
  recipient_id text NOT NULL,
  amount numeric NOT NULL,
  source_currency text NOT NULL,
  target_currency text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'bridge_locked', 'fx_swapping', 'settled', 'failed')),
  error_message text,
  submitted_at timestamptz DEFAULT now(),
  bridge_locked_at timestamptz,
  fx_swapped_at timestamptz,
  settled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS network_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text NOT NULL CHECK (metric_type IN ('tps', 'latency', 'block_time')),
  value numeric NOT NULL,
  channel text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fx_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_pair text NOT NULL,
  rate numeric NOT NULL,
  source text DEFAULT 'stellar_dex',
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bridge_liquidity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network text NOT NULL CHECK (network IN ('fabric', 'stellar')),
  currency text NOT NULL,
  balance numeric NOT NULL,
  threshold numeric NOT NULL,
  status text NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'warning', 'critical')),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL CHECK (alert_type IN ('threshold', 'error', 'security')),
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  title text NOT NULL,
  message text NOT NULL,
  metric text,
  threshold_value numeric,
  actual_value numeric,
  acknowledged boolean DEFAULT false,
  acknowledged_by text,
  acknowledged_at timestamptz,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alert_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  metric text NOT NULL,
  condition text NOT NULL CHECK (condition IN ('gt', 'lt', 'eq')),
  threshold numeric NOT NULL,
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  enabled boolean DEFAULT true,
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  user_id text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  details jsonb,
  ip_address text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bridge_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id),
  error_type text NOT NULL,
  error_message text NOT NULL,
  error_data jsonb,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fabric_nodes_status ON fabric_nodes(status);
CREATE INDEX IF NOT EXISTS idx_fabric_nodes_type ON fabric_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_fabric_hash ON transactions(fabric_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_network_metrics_timestamp ON network_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_network_metrics_type ON network_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_fx_rates_timestamp ON fx_rates(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE fabric_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE fx_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridge_liquidity ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridge_errors ENABLE ROW LEVEL SECURITY;

-- RLS Policies (for authenticated users - adjust based on your auth setup)
CREATE POLICY "Allow read access to fabric nodes"
  ON fabric_nodes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to network metrics"
  ON network_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to fx rates"
  ON fx_rates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to bridge liquidity"
  ON bridge_liquidity FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow update alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read access to alert rules"
  ON alert_rules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow manage alert rules"
  ON alert_rules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read access to audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to bridge errors"
  ON bridge_errors FOR SELECT
  TO authenticated
  USING (true);