const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, '');
}

const telemetry = {
  requests: [], // sliding window of last 40 requests
  lastFaultNote: null
};

const combatState = {
  phase: 'PHASE_00_STANDBY',
  activeFault: 'NONE',
  outageStartTime: null,
  healTime: null,
  mttr_seconds: null,
  red_unit: {
    id: 'UNIT-01',
    name: 'CHAOS-RED',
    role: 'SABOTEUR MECHA',
    status: 'ARMED_IDLE',
    aggression: 35,
    active_payload: 'NONE'
  },
  blue_unit: {
    id: 'UNIT-02',
    name: '@SRE-BLUE',
    role: 'SENTINEL SRE',
    status: 'PATROL_NOMINAL',
    shield_matrix: 100,
    repair_drones: 'STANDBY'
  },
  war_logs: [
    {
      timestamp: new Date().toISOString(),
      sender: 'SYSTEM-OVERWATCH',
      type: 'RADIO',
      text: '[SYS_NOMINAL] SWITCH GAMEDAY BATTLEGROUND INITIALIZED. ALL FIXTURES HEALTHY.'
    },
    {
      timestamp: new Date().toISOString(),
      sender: '@SRE-BLUE',
      type: 'DEFENSE',
      text: '[PATROL] TELEMETRY MATRIX SYNCHRONIZED. TARGET-SERVICE SLO NOMINAL.'
    },
    {
      timestamp: new Date().toISOString(),
      sender: 'CHAOS-RED',
      type: 'ATTACK',
      text: '[STANDBY] WEAPONS SUBSYSTEMS ARMED. SCANNING CHECKOUT FOR UNGUARDED DEREFERENCES.'
    }
  ]
};

function recordMetric(entry) {
  telemetry.requests.push(entry);
  if (telemetry.requests.length > 40) {
    telemetry.requests.shift();
  }
}

function resetTelemetry() {
  telemetry.requests = [];
  telemetry.lastFaultNote = null;
}

function addWarLog(sender, type, text) {
  combatState.war_logs.push({
    timestamp: new Date().toISOString(),
    sender,
    type,
    text
  });
  if (combatState.war_logs.length > 50) {
    combatState.war_logs.shift();
  }
}

function getWarLogs() {
  return combatState.war_logs.slice(-25);
}

function logEvent(level, message, meta = {}) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
  const line = JSON.stringify(payload) + '\n';
  fs.appendFileSync(LOG_FILE, line, 'utf8');
  if (level === 'ERROR') {
    console.error(`[ERROR] ${payload.timestamp} - ${message}`, meta.stack || '');
  } else {
    console.log(`[${level}] ${payload.timestamp} - ${message}`);
  }
}

function getMetricsSummary() {
  const recent = telemetry.requests.slice(-15);
  if (recent.length === 0) {
    return {
      status: combatState.phase === 'PHASE_01_RED_STRIKE' || combatState.activeFault !== 'NONE' ? 'CRITICAL_OUTAGE' : 'HEALTHY',
      p99_latency_ms: combatState.activeFault === 'latency-bomb' ? 2610 : 12,
      error_rate_percent: combatState.activeFault !== 'NONE' ? 100 : 0,
      total_requests: 0,
      recent_events: []
    };
  }

  const latencies = recent.map(r => r.latency_ms).sort((a, b) => a - b);
  const p99Index = Math.max(0, Math.floor(latencies.length * 0.99) - 1);
  const p99 = latencies[p99Index] || latencies[latencies.length - 1] || 12;
  const errors = recent.filter(r => r.status >= 500).length;
  const errorRate = Math.round((errors / recent.length) * 100);

  const isOutage = errorRate >= 25 || p99 > 1000 || combatState.activeFault !== 'NONE';

  return {
    status: isOutage ? 'CRITICAL_OUTAGE' : 'HEALTHY',
    p99_latency_ms: p99,
    error_rate_percent: errorRate,
    total_requests: telemetry.requests.length,
    recent_events: recent.slice(-10)
  };
}

function updateCombatState(event = {}) {
  const { phase, sender, text, fault, details } = event;

  if (fault) {
    combatState.activeFault = fault === 'reset' ? 'NONE' : fault;
    combatState.red_unit.active_payload = combatState.activeFault;
  }

  if (phase) {
    combatState.phase = phase;

    switch (phase) {
      case 'PHASE_00_STANDBY':
        combatState.activeFault = 'NONE';
        combatState.outageStartTime = null;
        combatState.healTime = null;
        combatState.red_unit.status = 'ARMED_IDLE';
        combatState.red_unit.aggression = 35;
        combatState.red_unit.active_payload = 'NONE';
        combatState.blue_unit.status = 'PATROL_NOMINAL';
        combatState.blue_unit.shield_matrix = 100;
        combatState.blue_unit.repair_drones = 'STANDBY';
        break;

      case 'PHASE_01_RED_STRIKE':
        if (!combatState.outageStartTime) {
          combatState.outageStartTime = new Date().toISOString();
        }
        combatState.healTime = null;
        combatState.mttr_seconds = null;
        combatState.red_unit.status = 'STRIKE_ENGAGED';
        combatState.red_unit.aggression = 100;
        combatState.blue_unit.status = 'TRIAGE_ALERT';
        combatState.blue_unit.shield_matrix = 15;
        combatState.blue_unit.repair_drones = 'DISPATCHED';
        break;

      case 'PHASE_02_BLUE_SCANNING':
        combatState.blue_unit.status = 'SCANNING_TELEMETRY';
        break;

      case 'PHASE_03_AUTH_REQUIRED':
        combatState.blue_unit.status = 'DIFF_PENDING_AUTH';
        break;

      case 'PHASE_04_HEAL_VERIFIED':
        combatState.healTime = new Date().toISOString();
        if (combatState.outageStartTime) {
          const diffMs = Date.now() - new Date(combatState.outageStartTime).getTime();
          combatState.mttr_seconds = Number((diffMs / 1000).toFixed(2));
        } else {
          combatState.mttr_seconds = 1.4;
        }
        combatState.activeFault = 'NONE';
        combatState.red_unit.status = 'ARMED_IDLE';
        combatState.red_unit.aggression = 25;
        combatState.red_unit.active_payload = 'NONE';
        combatState.blue_unit.status = 'HOTPATCH_VERIFIED';
        combatState.blue_unit.shield_matrix = 100;
        combatState.blue_unit.repair_drones = 'STANDBY';
        break;
    }
  }

  if (text) {
    addWarLog(sender || 'TACTICAL_BUS', 'EVENT', text);
  }

  return getCombatState();
}

function getCombatState() {
  return JSON.parse(JSON.stringify(combatState));
}

module.exports = {
  LOG_FILE,
  recordMetric,
  resetTelemetry,
  logEvent,
  addWarLog,
  getWarLogs,
  getMetricsSummary,
  updateCombatState,
  getCombatState
};
