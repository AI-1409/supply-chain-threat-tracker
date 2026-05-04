"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentsDataSchema = exports.IncidentSchema = exports.RemediationSchema = exports.AttributionSchema = exports.SourceSchema = exports.ImpactStatisticsSchema = exports.IOCSchema = exports.TimingIOCSchema = exports.BehavioralIOCSchema = exports.RegistryIOCSchema = exports.FileTypeIOCSchema = exports.FilePathIOCSchema = exports.FileHashIOCSchema = exports.DomainIOCSchema = exports.NetworkIOCSchema = exports.MaliciousPackageSchema = exports.AttackMechanicsSchema = exports.CVSSSchema = void 0;
exports.validateIncident = validateIncident;
exports.validateIncidentsData = validateIncidentsData;
exports.safeValidateIncident = safeValidateIncident;
exports.safeValidateIncidentsData = safeValidateIncidentsData;
// Zod schema for incident validation - recreated from updated types.ts
const zod_1 = require("zod");
// ==================== CVSS Related Types ====================
exports.CVSSSchema = zod_1.z.object({
    base_score: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]),
    severity: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    vector: zod_1.z.string(),
    attack_vector: zod_1.z.enum(['network', 'adjacent', 'local', 'physical']),
    attack_complexity: zod_1.z.enum(['low', 'high']),
    privileges_required: zod_1.z.enum(['none', 'low', 'high']),
    user_interaction: zod_1.z.enum(['none', 'required']),
});
// ==================== Attack Mechanics Types ====================
exports.AttackMechanicsSchema = zod_1.z.object({
    primary: zod_1.z.string(),
    secondary: zod_1.z.string().optional(),
    tertiary: zod_1.z.string().optional(),
    delivery: zod_1.z.string(),
    description: zod_1.z.string(),
});
// ==================== IOC (Indicators of Compromise) Types ====================
// Malicious Package IOC
exports.MaliciousPackageSchema = zod_1.z.object({
    name: zod_1.z.string(),
    version: zod_1.z.string().optional(),
    versions: zod_1.z.array(zod_1.z.string()).optional(),
    registry: zod_1.z.string().optional(),
    publisher: zod_1.z.string().optional(),
    sha256: zod_1.z.string().optional(),
    time_window: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    replaced_by: zod_1.z.array(zod_1.z.string()).optional(),
    owner: zod_1.z.string().optional(),
    target: zod_1.z.string().optional(),
    count: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
    publishers: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
});
// Network IOC
exports.NetworkIOCSchema = zod_1.z.object({
    type: zod_1.z.string(),
    value: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    path: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
});
// Domain IOC
exports.DomainIOCSchema = zod_1.z.object({
    type: zod_1.z.string(),
    value: zod_1.z.string(),
    registered: zod_1.z.string().optional(),
    elapsed_to_compromise: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
});
// File Hash IOC
exports.FileHashIOCSchema = zod_1.z.object({
    type: zod_1.z.string(),
    value: zod_1.z.string(),
    context: zod_1.z.string().optional(),
});
// File Path IOC
exports.FilePathIOCSchema = zod_1.z.object({
    type: zod_1.z.string(),
    value: zod_1.z.string(),
    description: zod_1.z.string().optional(),
});
// File Type IOC
exports.FileTypeIOCSchema = zod_1.z.object({
    type: zod_1.z.string(),
    pattern: zod_1.z.string(),
    target: zod_1.z.string().optional(),
});
// Registry IOC
exports.RegistryIOCSchema = zod_1.z.object({
    type: zod_1.z.string(),
    path: zod_1.z.string(),
    action: zod_1.z.string(),
});
// Behavioral IOC
exports.BehavioralIOCSchema = zod_1.z.object({
    type: zod_1.z.string(),
    pattern: zod_1.z.string().optional(),
    target: zod_1.z.string().optional(),
    action: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    method: zod_1.z.string().optional(),
    command: zod_1.z.string().optional(),
    coin: zod_1.z.string().optional(),
    targets: zod_1.z.array(zod_1.z.string()).optional(),
    suspicious_binaries: zod_1.z.array(zod_1.z.string()).optional(),
    methods: zod_1.z.array(zod_1.z.string()).optional(),
    currencies: zod_1.z.array(zod_1.z.string()).optional(),
    description: zod_1.z.string().optional(),
    tactic: zod_1.z.string().optional(),
    trigger: zod_1.z.string().optional(),
});
// Timing IOC
exports.TimingIOCSchema = zod_1.z.object({
    window_start: zod_1.z.string().optional(),
    maintained_duration: zod_1.z.string().optional(),
});
// ==================== IOCs Root ====================
exports.IOCSchema = zod_1.z.object({
    malicious_packages: zod_1.z.array(exports.MaliciousPackageSchema),
    network: zod_1.z.array(exports.NetworkIOCSchema).optional(),
    domain: zod_1.z.array(exports.DomainIOCSchema).optional(),
    file_hashes: zod_1.z.array(exports.FileHashIOCSchema).optional(),
    file_path: zod_1.z.array(exports.FilePathIOCSchema).optional(),
    file_type: zod_1.z.array(exports.FileTypeIOCSchema).optional(),
    registry: zod_1.z.array(exports.RegistryIOCSchema).optional(),
    behavioral: zod_1.z.array(exports.BehavioralIOCSchema),
    timing: zod_1.z.array(exports.TimingIOCSchema).optional(),
});
// ==================== Impact Statistics ====================
exports.ImpactStatisticsSchema = zod_1.z.object({
    downloads: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
    affected_direct_packages: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
    affected_major_projects: zod_1.z.array(zod_1.z.string()).optional(),
    specific_target: zod_1.z.string().optional(),
    theft_threshold_btc: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
    theft_threshold_bch: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
    affected_users: zod_1.z.string().optional(),
    exposure_duration: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
    data_targeted: zod_1.z.array(zod_1.z.string()).optional(),
    severity_reason: zod_1.z.string().optional(),
    safe_versions: zod_1.z.array(zod_1.z.string()).optional(),
    total_malicious_packages: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
    affected_platforms: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    targeted_wallets: zod_1.z.string().optional(),
    campaigns_count: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
    researcher: zod_1.z.string().optional(),
    direct_consumers: zod_1.z.string().optional(),
    transitive_reach: zod_1.z.string().optional(),
    weekly_downloads_before_attack: zod_1.z.string().optional(),
    capabilities: zod_1.z.array(zod_1.z.string()).optional(),
    atypical_tactic: zod_1.z.string().optional(),
    affected_maintainers: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
    targeted_crate: zod_1.z.string().optional(),
    infrastructure_status: zod_1.z.string().optional(),
    tokens_at_risk: zod_1.z.string().optional(),
});
// ==================== Source ====================
exports.SourceSchema = zod_1.z.object({
    url: zod_1.z.string(),
    type: zod_1.z.string(),
    reliability: zod_1.z.enum(['low', 'medium', 'high']),
});
// ==================== Attribution ====================
exports.AttributionSchema = zod_1.z.object({
    confidence: zod_1.z.enum(['low', 'medium', 'high']),
    threat_actor: zod_1.z.string(),
    motivation: zod_1.z.string(),
    notes: zod_1.z.string().optional(),
    ttps: zod_1.z.array(zod_1.z.string()).optional(),
    accounts: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
    attack_history: zod_1.z.string().optional(),
    campaigns: zod_1.z.string().optional(),
    taunt: zod_1.z.string().optional(),
    technical_skill: zod_1.z.string().optional(),
    financial_connection: zod_1.z.string().optional(),
});
// ==================== Remediation ====================
exports.RemediationSchema = zod_1.z.object({
    affected_versions: zod_1.z.string().optional(),
    fixed_version: zod_1.z.string().optional(),
    safe_versions: zod_1.z.array(zod_1.z.string()).optional(),
    mitigation: zod_1.z.string(),
});
// ==================== Incident ====================
exports.IncidentSchema = zod_1.z.object({
    id: zod_1.z.string(),
    package: zod_1.z.string(),
    ecosystem: zod_1.z.string(),
    cve: zod_1.z.string(),
    ghsa: zod_1.z.string(),
    discovered: zod_1.z.string(),
    reported: zod_1.z.string(),
    confidence_level: zod_1.z.enum(['low', 'medium', 'high']),
    cvss: exports.CVSSSchema,
    attack_mechanics: exports.AttackMechanicsSchema,
    iocs: exports.IOCSchema,
    impact_statistics: exports.ImpactStatisticsSchema,
    sources: zod_1.z.array(exports.SourceSchema),
    attribution: exports.AttributionSchema,
    remediation: exports.RemediationSchema,
    status: zod_1.z.enum(['active', 'mitigated', 'resolved', 'investigating']),
});
// ==================== Root Data Structure ====================
exports.IncidentsDataSchema = zod_1.z.object({
    incidents: zod_1.z.array(exports.IncidentSchema),
});
// ==================== Validation Helper Functions ====================
/**
 * Validates data against the Incident schema
 * @throws {z.ZodError} if validation fails
 */
function validateIncident(data) {
    return exports.IncidentSchema.parse(data);
}
/**
 * Validates data against the IncidentsData schema
 * @throws {z.ZodError} if validation fails
 */
function validateIncidentsData(data) {
    return exports.IncidentsDataSchema.parse(data);
}
/**
 * Validates data against the Incident schema
 * Returns success result without throwing
 */
function safeValidateIncident(data) {
    return exports.IncidentSchema.safeParse(data);
}
/**
 * Validates data against the IncidentsData schema
 * Returns success result without throwing
 */
function safeValidateIncidentsData(data) {
    return exports.IncidentsDataSchema.safeParse(data);
}
