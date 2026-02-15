-- Database Schema for Smart Building App

-- Enable TimescaleDB for time-series data
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'online',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensor readings table (time-series)
CREATE TABLE IF NOT EXISTS sensor_readings (
  id BIGSERIAL,
  device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
  sensor_type VARCHAR(100) NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(50),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable for time-series
SELECT create_hypertable('sensor_readings', 'timestamp');

-- Indexes
CREATE INDEX idx_sensor_readings_device ON sensor_readings(device_id);
CREATE INDEX idx_sensor_readings_type ON sensor_readings(sensor_type);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
  alert_type VARCHAR(100) NOT NULL,
  message TEXT,
  severity VARCHAR(50) DEFAULT 'info',
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for local users, Auth0 handles main auth)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  auth0_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample devices
INSERT INTO devices (name, type, location, status) VALUES
  ('Temperature Sensor 1', 'temperature', 'Floor 1 - Lobby', 'online'),
  ('Temperature Sensor 2', 'temperature', 'Floor 2 - Office', 'online'),
  ('Motion Detector 1', 'motion', 'Floor 1 - Reception', 'online'),
  ('Light Sensor 1', 'light', 'Floor 3 - Meeting Room', 'offline'),
  ('Air Quality Sensor', 'air_quality', 'Floor 2 - Open Area', 'online');
