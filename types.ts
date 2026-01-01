export interface CommunicationSummary {
    channel: string;
    sent: number;
    delivered: number;
    failed: number;
    openRate?: number;
    clickRate?: number;
    optOutRate?: number;
}

export interface DailyMetric {
    date: string;
    emailSent: number;
    smsSent: number;
    voiceMinutes: number;
    emailDelivered: number;
    smsDelivered: number;
}

export interface Campaign {
    id: string;
    name: string;
    status: 'Scheduled' | 'Active' | 'Completed' | 'Draft' | 'Paused';
    channel: 'Email' | 'SMS' | 'Voice' | 'Multi-Channel';
    startDate: string;
    endDate: string;
    targetAudience: string;
    totalSent: number;
    delivered: number;
    openRate?: number;
    clickRate?: number;
    cost: number;
    creator: string;
    lastModified: string;
}

export interface Template {
    id: string;
    name: string;
    channel: 'Email' | 'SMS' | 'Voice';
    subject?: string;
    previewText: string;
    contentHtml?: string;
    contentText?: string;
    lastModified: string;
    version: number;
    status: 'Active' | 'Archived' | 'Draft';
    category: string;
    tags: string[];
    createdBy: string;
}

export interface AudienceSegment {
    id: string;
    name: string;
    description: string;
    criteria: string[];
    memberCount: number;
    lastUpdated: string;
    createdBy: string;
    isDynamic: boolean;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
    entityType?: string;
    entityId?: string;
    ipAddress?: string;
}

export interface ChannelConfiguration {
    id: string;
    name: string;
    type: 'Email' | 'SMS' | 'Voice';
    status: 'Active' | 'Inactive' | 'Pending';
    provider: string;
    apiKeyPreview: string;
    dailyLimit: number;
    currentDailyUsage: number;
    lastTested: string;
    settings: { [key: string]: string | number | boolean };
}

export interface CostSummary {
    month: string;
    emailCost: number;
    smsCost: number;
    voiceCost: number;
    totalCost: number;
    currency: string;
}

export interface AlertRule {
    id: string;
    name: string;
    metric: string;
    threshold: number;
    operator: 'gt' | 'lt' | 'eq';
    channel: 'email' | 'sms' | 'dashboard' | 'slack';
    status: 'Active' | 'Inactive';
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    lastTriggered?: string;
    description: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Analyst' | 'Viewer' | 'Auditor';
    lastLogin: string;
    status: 'Active' | 'Inactive' | 'Pending';
    permissions: string[];
}

export interface ScheduledJob {
    id: string;
    name: string;
    type: 'CampaignSend' | 'ReportGeneration' | 'DataSync' | 'AlertCheck' | 'AudienceRefresh';
    status: 'Scheduled' | 'Running' | 'Completed' | 'Failed' | 'Paused';
    schedule: string;
    lastRun: string;
    nextRun: string;
    details?: string;
    createdBy: string;
}

export interface SystemHealthMetric {
    name: string;
    value: number;
    unit: string;
    status: 'Normal' | 'Warning' | 'Critical';
    timestamp: string;
    description: string;
}

export interface LiveMessage {
    id: string;
    timestamp: string;
    channel: 'Email' | 'SMS' | 'Voice';
    recipient: string;
    status: 'Sent' | 'Delivered' | 'Failed' | 'Opened' | 'Clicked' | 'Bounced';
    campaignId?: string;
    templateId?: string;
    errorReason?: string;
}