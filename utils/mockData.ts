import {
    CommunicationSummary, DailyMetric, Campaign, Template, AudienceSegment,
    AuditLogEntry, ChannelConfiguration, CostSummary, AlertRule, UserProfile,
    ScheduledJob, SystemHealthMetric, LiveMessage
} from '../types';

export const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;
export const getRandomInt = (min: number, max: number) => Math.floor(getRandom(min, max));

export const formatLargeNumber = (num: number): string => {
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1)}k`;
    }
    return num.toLocaleString();
};

export const generateMockCommunicationSummaries = (): CommunicationSummary[] => [
    { channel: 'Email', sent: getRandomInt(1_200_000, 1_500_000), delivered: getRandomInt(1_180_000, 1_480_000), failed: getRandomInt(1000, 5000), openRate: getRandom(20, 30), clickRate: getRandom(2, 5), optOutRate: getRandom(0.1, 0.5) },
    { channel: 'SMS', sent: getRandomInt(800_000, 900_000), delivered: getRandomInt(790_000, 890_000), failed: getRandomInt(500, 2000), optOutRate: getRandom(0.05, 0.2) },
    { channel: 'Voice', sent: getRandomInt(40_000, 60_000), delivered: getRandomInt(39_000, 59_000), failed: getRandomInt(100, 500) },
];

export const generateMockDailyMetrics = (days: number): DailyMetric[] => {
    const data: DailyMetric[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() - i);
        const date = currentDate.toISOString().split('T')[0];

        const emailSent = getRandomInt(40000, 60000);
        const smsSent = getRandomInt(25000, 35000);
        const voiceMinutes = getRandomInt(1500, 2500);

        data.push({
            date,
            emailSent,
            smsSent,
            voiceMinutes,
            emailDelivered: Math.floor(emailSent * getRandom(0.99, 0.999)),
            smsDelivered: Math.floor(smsSent * getRandom(0.99, 0.998)),
        });
    }
    return data;
};

export const generateMockCampaigns = (count: number): Campaign[] => {
    const campaigns: Campaign[] = [];
    const statuses = ['Scheduled', 'Active', 'Completed', 'Draft', 'Paused'] as const;
    const channels = ['Email', 'SMS', 'Voice', 'Multi-Channel'] as const;
    const audiences = ['All Customers', 'High-Value Segment', 'Savings Account Holders', 'Loan Applicants', 'New Customers', 'Credit Card Users'];
    const creators = ['admin@bank.com', 'marketing@bank.com', 'john.doe@bank.com'];

    for (let i = 0; i < count; i++) {
        const status = statuses[getRandomInt(0, statuses.length)];
        const channel = channels[getRandomInt(0, channels.length)];
        const startDate = new Date(Date.now() - getRandomInt(0, 90) * 24 * 60 * 60 * 1000).toISOString();
        const endDate = new Date(Date.parse(startDate) + getRandomInt(7, 30) * 24 * 60 * 60 * 1000).toISOString();
        const totalSent = getRandomInt(50000, 500000);
        const delivered = Math.floor(totalSent * getRandom(0.98, 0.999));
        const cost = totalSent * (channel === 'Email' ? getRandom(0.001, 0.005) : channel === 'SMS' ? getRandom(0.01, 0.05) : getRandom(0.1, 0.3));

        campaigns.push({
            id: `CAMP-${1000 + i}`,
            name: `Q${getRandomInt(1, 4)} ${new Date().getFullYear()} ${channel} Promo ${i + 1}`,
            status: status,
            channel: channel,
            startDate: startDate,
            endDate: endDate,
            targetAudience: audiences[getRandomInt(0, audiences.length)],
            totalSent: totalSent,
            delivered: delivered,
            openRate: channel === 'Email' ? getRandom(15, 40) : undefined,
            clickRate: channel === 'Email' ? getRandom(1, 10) : undefined,
            cost: parseFloat(cost.toFixed(2)),
            creator: creators[getRandomInt(0, creators.length)],
            lastModified: new Date(Date.parse(startDate) + getRandomInt(0, (new Date().getTime() - Date.parse(startDate)) / 1000) * 1000).toISOString(),
        });
    }
    return campaigns.sort((a,b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
};

export const generateMockTemplates = (count: number): Template[] => {
    const templates: Template[] = [];
    const channels = ['Email', 'SMS', 'Voice'] as const;
    const categories = ['Promotional', 'Transactional', 'Alerts', 'Marketing', 'Onboarding', 'Security'];
    const statuses = ['Active', 'Archived', 'Draft'] as const;
    const creators = ['admin@bank.com', 'designer@bank.com'];
    const allTags = ['promotional', 'account', 'security', 'alert', 'loan', 'savings', 'credit card', 'marketing', 'welcome'];

    for (let i = 0; i < count; i++) {
        const channel = channels[getRandomInt(0, channels.length)];
        const category = categories[getRandomInt(0, categories.length)];
        const selectedTags = Array.from({ length: getRandomInt(1, 3) }, () => allTags[getRandomInt(0, allTags.length)]);

        templates.push({
            id: `TPL-${1000 + i}`,
            name: `${channel} Template ${i + 1}: ${category} message`,
            channel: channel,
            subject: channel === 'Email' ? `Your Bank Update #${i + 1} - Important Info` : undefined,
            previewText: `This is a short preview of the ${channel} message content for template ${i + 1} regarding ${category.toLowerCase()}...`,
            contentHtml: channel === 'Email' ? `<p>Hello {{customer_name}},</p><p>This is a detailed HTML email for ${category}.</p>` : undefined,
            contentText: `Hello {{customer_name}}, This is a ${channel} message for ${category}. More details available online.`,
            lastModified: new Date(Date.now() - getRandomInt(0, 60) * 24 * 60 * 60 * 1000).toISOString(),
            version: getRandomInt(1, 5),
            status: statuses[getRandomInt(0, statuses.length)],
            category: category,
            tags: Array.from(new Set(selectedTags)),
            createdBy: creators[getRandomInt(0, creators.length)],
        });
    }
    return templates.sort((a,b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
};

export const generateMockAudienceSegments = (count: number): AudienceSegment[] => {
    const segments: AudienceSegment[] = [];
    const baseCriteria = [
        'Age > 25', 'Has Savings Account', 'Credit Score > 700', 'Active Loan',
        'Last Login < 30 days', 'High Net Worth', 'New Customer (last 90 days)',
        'Resides in specific region (e.g., California)', 'Opted-in for Promotions',
        'Monthly Spend > $1000', 'No Credit Card'
    ];
    const creators = ['admin@bank.com', 'marketing@bank.com'];

    for (let i = 0; i < count; i++) {
        const selectedCriteria = Array.from({ length: getRandomInt(1, 3) }, () => baseCriteria[getRandomInt(0, baseCriteria.length)]);
        segments.push({
            id: `SEG-${1000 + i}`,
            name: `Segment ${i + 1} - ${selectedCriteria[0].split(' ')[0]}`,
            description: `Customers matching criteria: ${selectedCriteria.join(', ')}. Automatically updated every 24 hours.`,
            criteria: selectedCriteria,
            memberCount: getRandomInt(10000, 500000),
            lastUpdated: new Date(Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
            createdBy: creators[getRandomInt(0, creators.length)],
            isDynamic: getRandom(0, 1) > 0.5,
        });
    }
    return segments.sort((a,b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
};

export const generateMockAuditLogs = (count: number): AuditLogEntry[] => {
    const logs: AuditLogEntry[] = [];
    const users = ['admin@bank.com', 'manager@bank.com', 'analyst@bank.com', 'dev@bank.com', 'auditor@bank.com'];
    const actions = ['Created Campaign', 'Updated Template', 'Deleted Segment', 'Changed Channel Config', 'Exported Report', 'Logged In', 'Scheduled Message', 'Approved Campaign', 'Deactivated User'];
    const entityTypes = ['Campaign', 'Template', 'Audience Segment', 'Channel Configuration', 'User', 'Report'];

    for (let i = 0; i < count; i++) {
        const timestamp = new Date(Date.now() - getRandomInt(0, 7 * 24 * 60 * 60 * 1000)).toISOString();
        const action = actions[getRandomInt(0, actions.length)];
        const entityType = entityTypes[getRandomInt(0, entityTypes.length)];
        logs.push({
            id: `AUDIT-${1000 + i}`,
            timestamp: timestamp,
            user: users[getRandomInt(0, users.length)],
            action: action,
            details: `${action} on ${entityType} ID: ${getRandomInt(1000, 2000)} by ${users[getRandomInt(0, users.length)]}.`,
            entityType: entityType,
            entityId: `${entityType.substring(0, 3).toUpperCase()}-${getRandomInt(1000, 2000)}`,
            ipAddress: `192.168.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}`,
        });
    }
    return logs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const generateMockChannelConfigurations = (count: number): ChannelConfiguration[] => {
    const configs: ChannelConfiguration[] = [];
    const types = ['Email', 'SMS', 'Voice'] as const;
    const providers = {
        Email: ['SendGrid', 'Mailgun', 'AWS SES', 'Google SMTP'],
        SMS: ['Twilio', 'Nexmo', 'Sinch', 'Vonage SMS'],
        Voice: ['Twilio Voice', 'Vonage Voice', 'Plivo']
    };
    const statuses = ['Active', 'Inactive', 'Pending'] as const;

    for (let i = 0; i < count; i++) {
        const type = types[getRandomInt(0, types.length)];
        const providerList = providers[type];
        const provider = providerList[getRandomInt(0, providerList.length)];
        const dailyLimit = getRandomInt(100000, 1000000);
        const currentDailyUsage = getRandomInt(0, dailyLimit);

        configs.push({
            id: `CHANNEL-${100 + i}`,
            name: `${provider} ${type} Gateway`,
            type: type,
            status: statuses[getRandomInt(0, statuses.length)],
            provider: provider,
            apiKeyPreview: `sk_${'x'.repeat(getRandomInt(4, 8))}...${'y'.repeat(4)}`,
            dailyLimit: dailyLimit,
            currentDailyUsage: currentDailyUsage,
            lastTested: new Date(Date.now() - getRandomInt(0, 7) * 24 * 60 * 60 * 1000).toISOString(),
            settings: {
                region: ['us-east-1', 'eu-west-1', 'ap-southeast-2'][getRandomInt(0,3)],
                senderId: type === 'SMS' ? `BANKMSG${getRandomInt(100,999)}` : undefined,
                emailDomain: type === 'Email' ? `mail.bank${getRandomInt(1,3)}.com` : undefined,
                callForwarding: type === 'Voice' ? getRandom(0,1) > 0.5 : undefined,
            }
        });
    }
    return configs.sort((a,b) => a.name.localeCompare(b.name));
};

export const generateMockCostSummaries = (months: number): CostSummary[] => {
    const data: CostSummary[] = [];
    let currentMonth = new Date();
    currentMonth.setMonth(currentMonth.getMonth() - months);

    for (let i = 0; i < months; i++) {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        const monthName = currentMonth.toLocaleString('en-us', { month: 'short', year: 'numeric' });

        const emailCost = getRandom(1000, 5000);
        const smsCost = getRandom(5000, 15000);
        const voiceCost = getRandom(500, 2000);
        const totalCost = emailCost + smsCost + voiceCost;

        data.push({
            month: monthName,
            emailCost: parseFloat(emailCost.toFixed(2)),
            smsCost: parseFloat(smsCost.toFixed(2)),
            voiceCost: parseFloat(voiceCost.toFixed(2)),
            totalCost: parseFloat(totalCost.toFixed(2)),
            currency: 'USD',
        });
    }
    return data;
};

export const generateMockAlertRules = (count: number): AlertRule[] => {
    const rules: AlertRule[] = [];
    const metrics = ['emailDeliverability', 'smsDeliverability', 'emailBounceRate', 'smsFailureRate', 'campaignCostExceeded', 'templateUsageDrop', 'apiLatency'];
    const operators = ['gt', 'lt'] as const;
    const channels = ['email', 'sms', 'dashboard', 'slack'] as const;
    const statuses = ['Active', 'Inactive'] as const;
    const severities = ['Low', 'Medium', 'High', 'Critical'] as const;

    for (let i = 0; i < count; i++) {
        const metric = metrics[getRandomInt(0, metrics.length)];
        const operator = operators[getRandomInt(0, operators.length)];
        let threshold = getRandom(1, 100);
        if (metric.includes('Latency')) threshold = getRandom(100, 500); // ms
        if (metric.includes('CostExceeded')) threshold = getRandom(1000, 10000); // USD
        threshold = parseFloat(threshold.toFixed(1));

        const channel = channels[getRandomInt(0, channels.length)];
        const status = statuses[getRandomInt(0, statuses.length)];
        const severity = severities[getRandomInt(0, severities.length)];

        rules.push({
            id: `ALERT-${1000 + i}`,
            name: `Alert for ${metric} ${operator === 'gt' ? '>' : '<'} ${threshold}${metric.includes('Rate') || metric.includes('Deliverability') ? '%' : (metric.includes('Cost') ? '$' : (metric.includes('Latency') ? 'ms' : ''))}`,
            metric: metric,
            threshold: threshold,
            operator: operator,
            channel: channel,
            status: status,
            severity: severity,
            lastTriggered: status === 'Active' && getRandom(0, 1) > 0.5 ? new Date(Date.now() - getRandomInt(0, 7) * 24 * 60 * 60 * 1000).toISOString() : undefined,
            description: `Triggers when ${metric} goes ${operator === 'gt' ? 'above' : 'below'} ${threshold}.`,
        });
    }
    return rules.sort((a,b) => a.name.localeCompare(b.name));
};

export const generateMockUserProfiles = (count: number): UserProfile[] => {
    const profiles: UserProfile[] = [];
    const roles = ['Admin', 'Manager', 'Analyst', 'Viewer', 'Auditor'] as const;
    const statuses = ['Active', 'Inactive', 'Pending'] as const;
    const defaultPermissions: { [key: string]: string[] } = {
        'Admin': ['all'],
        'Manager': ['campaigns.*', 'templates.*', 'audiences.*', 'reports.view'],
        'Analyst': ['campaigns.view', 'reports.*', 'audiences.view'],
        'Viewer': ['campaigns.view', 'reports.view'],
        'Auditor': ['auditlogs.view', 'reports.view', 'channelconfig.view'],
    };

    for (let i = 0; i < count; i++) {
        const role = roles[getRandomInt(0, roles.length)];
        const status = statuses[getRandomInt(0, statuses.length)];
        const firstName = `User${i + 1}`;
        const lastName = `Bank`;
        profiles.push({
            id: `USER-${1000 + i}`,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@bank.com`,
            role: role,
            lastLogin: new Date(Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
            status: status,
            permissions: defaultPermissions[role],
        });
    }
    return profiles.sort((a,b) => a.name.localeCompare(b.name));
};

export const generateMockScheduledJobs = (count: number): ScheduledJob[] => {
    const jobs: ScheduledJob[] = [];
    const types = ['CampaignSend', 'ReportGeneration', 'DataSync', 'AlertCheck', 'AudienceRefresh'] as const;
    const statuses = ['Scheduled', 'Running', 'Completed', 'Failed', 'Paused'] as const;
    const schedules = ['daily at 03:00 AM', 'weekly (Mon 02:00 AM)', 'monthly (1st 01:00 AM)', 'hourly', 'CRON * * * * *'];
    const creators = ['system', 'admin@bank.com', 'analyst@bank.com'];

    for (let i = 0; i < count; i++) {
        const type = types[getRandomInt(0, types.length)];
        const status = statuses[getRandomInt(0, statuses.length)];
        const schedule = schedules[getRandomInt(0, schedules.length)];
        const lastRun = new Date(Date.now() - getRandomInt(0, 14) * 24 * 60 * 60 * 1000).toISOString();
        const nextRun = new Date(Date.parse(lastRun) + getRandomInt(1, 7) * 24 * 60 * 60 * 1000).toISOString();

        jobs.push({
            id: `JOB-${1000 + i}`,
            name: `${type} - ${schedule} run`,
            type: type,
            status: status,
            schedule: schedule,
            lastRun: lastRun,
            nextRun: nextRun,
            details: `Job details for ${type} ${i + 1}. This job ensures ${type === 'CampaignSend' ? ' timely delivery of messages' : type === 'ReportGeneration' ? 'reports are up-to-date' : 'data consistency and freshness'}.`,
            createdBy: creators[getRandomInt(0, creators.length)],
        });
    }
    return jobs.sort((a,b) => new Date(b.nextRun).getTime() - new Date(a.nextRun).getTime());
};

export const generateMockSystemHealthMetrics = (): SystemHealthMetric[] => {
    const now = new Date().toISOString();
    return [
        { name: 'API Latency', value: getRandom(50, 200), unit: 'ms', status: getRandom(0, 100) > 90 ? 'Warning' : 'Normal', timestamp: now, description: 'Average response time for external API calls.' },
        { name: 'Message Queue Size', value: getRandomInt(10, 500), unit: 'messages', status: getRandom(0, 100) > 80 ? 'Warning' : 'Normal', timestamp: now, description: 'Number of messages waiting to be processed.' },
        { name: 'Database Connections', value: getRandomInt(20, 100), unit: '', status: 'Normal', timestamp: now, description: 'Active connections to the database server.' },
        { name: 'Service Uptime', value: parseFloat(getRandom(99.9, 100).toFixed(2)), unit: '%', status: 'Normal', timestamp: now, description: 'Percentage of time services have been operational.' },
        { name: 'SMS Gateway Health', value: getRandom(0, 100) > 95 ? 0 : getRandom(95,100), unit: '%', status: getRandom(0, 100) > 95 ? 'Critical' : 'Normal', timestamp: now, description: 'Current health status of the primary SMS gateway.' },
        { name: 'Email Send Rate', value: getRandomInt(10000, 50000), unit: '/min', status: 'Normal', timestamp: now, description: 'Current outgoing email volume per minute.' },
    ];
};

export const generateMockLiveMessages = (count: number): LiveMessage[] => {
    const messages: LiveMessage[] = [];
    const channels = ['Email', 'SMS', 'Voice'] as const;
    const statuses = ['Sent', 'Delivered', 'Failed', 'Opened', 'Clicked', 'Bounced'] as const;
    const failureReasons = ['Invalid Number', 'Blocked', 'Content Violation', 'Temporary Error', 'Opted Out'];

    for (let i = 0; i < count; i++) {
        const channel = channels[getRandomInt(0, channels.length)];
        const status = statuses[getRandomInt(0, statuses.length)];
        const recipient = channel === 'Email' ? `****${getRandomInt(100,999)}@bank.com` : `+1 (***) ***-${getRandomInt(1000,9999)}`;
        const campaignId = getRandom(0,1) > 0.5 ? `CAMP-${getRandomInt(1000,2000)}` : undefined;
        const templateId = getRandom(0,1) > 0.5 ? `TPL-${getRandomInt(1000,2000)}` : undefined;
        const errorReason = status === 'Failed' || status === 'Bounced' ? failureReasons[getRandomInt(0, failureReasons.length)] : undefined;

        messages.push({
            id: `MSG-${100000 + i}`,
            timestamp: new Date(Date.now() - getRandomInt(0, 60 * 60 * 1000)).toISOString(), // Last hour
            channel: channel,
            recipient: recipient,
            status: status,
            campaignId: campaignId,
            templateId: templateId,
            errorReason: errorReason,
        });
    }
    return messages.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};