(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/businessTypes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Business Types and Automation Configurations
// Supports: Sales/Orders, Appointments/Bookings, Enquiries/Support, Lead Capture, Email
__turbopack_context__.s([
    "businessCategories",
    ()=>businessCategories,
    "businessKindChannelMap",
    ()=>businessKindChannelMap,
    "businessKinds",
    ()=>businessKinds,
    "countries",
    ()=>countries,
    "defaultAppointmentConfig",
    ()=>defaultAppointmentConfig,
    "defaultEmailMarketingConfig",
    ()=>defaultEmailMarketingConfig,
    "defaultEnquiryConfig",
    ()=>defaultEnquiryConfig,
    "defaultLeadCaptureConfig",
    ()=>defaultLeadCaptureConfig,
    "defaultSalesConfig",
    ()=>defaultSalesConfig,
    "generateId",
    ()=>generateId,
    "getAutomationsForBusinessKind",
    ()=>getAutomationsForBusinessKind,
    "getDefaultConfig",
    ()=>getDefaultConfig,
    "mockEmailConnect",
    ()=>mockEmailConnect,
    "mockManyChatOAuth",
    ()=>mockManyChatOAuth,
    "mockTikTokOAuth",
    ()=>mockTikTokOAuth,
    "planDetails",
    ()=>planDetails
]);
const businessCategories = [
    {
        id: 'sales_orders',
        name: 'Sales / Orders',
        description: 'Automate product inquiries, orders, and payment collection',
        icon: '🛒',
        color: 'from-orange-500 to-amber-500'
    },
    {
        id: 'appointments_bookings',
        name: 'Appointments / Bookings',
        description: 'Manage appointment scheduling, availability, and reminders',
        icon: '📅',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'enquiries_support',
        name: 'Enquiries / Support',
        description: 'Handle customer questions, support tickets, and FAQs',
        icon: '💬',
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 'lead_capture',
        name: 'Lead Capture',
        description: 'Capture leads from comments, DMs, and social interactions',
        icon: '📥',
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 'email_marketing',
        name: 'Email Automation',
        description: 'Send automated emails for follow-ups, notifications, and marketing',
        icon: '📧',
        color: 'from-red-500 to-rose-500'
    }
];
const businessKinds = [
    {
        id: 'vendor',
        name: 'Vendor / Online Seller',
        description: 'Sells physical or digital products',
        icon: '🛒',
        color: 'from-orange-500 to-amber-500',
        enabledAutomations: [
            'sales_orders',
            'lead_capture',
            'email_marketing'
        ]
    },
    {
        id: 'service_provider',
        name: 'Service Provider',
        description: 'Offers services (freelancers, agencies, consultants)',
        icon: '🧑‍💼',
        color: 'from-purple-500 to-indigo-500',
        enabledAutomations: [
            'lead_capture',
            'enquiries_support',
            'email_marketing'
        ]
    },
    {
        id: 'appointment_based',
        name: 'Appointment-Based Business',
        description: 'Clinics, salons, coaches, tutors',
        icon: '📅',
        color: 'from-blue-500 to-cyan-500',
        enabledAutomations: [
            'appointments_bookings',
            'enquiries_support',
            'email_marketing'
        ]
    },
    {
        id: 'lead_driven',
        name: 'Lead-Driven Business',
        description: 'Realtors, marketers, schools, SaaS founders',
        icon: '📥',
        color: 'from-green-500 to-emerald-500',
        enabledAutomations: [
            'lead_capture',
            'email_marketing'
        ]
    }
];
const businessKindChannelMap = {
    vendor: {
        instagram: [
            'sales_orders',
            'lead_capture'
        ],
        facebook: [
            'sales_orders'
        ],
        whatsapp: [
            'sales_orders',
            'lead_capture'
        ],
        tiktok: [
            'lead_capture'
        ],
        email: [
            'email_marketing',
            'lead_capture'
        ]
    },
    service_provider: {
        instagram: [
            'lead_capture'
        ],
        facebook: [
            'lead_capture'
        ],
        whatsapp: [
            'lead_capture',
            'enquiries_support'
        ],
        tiktok: [
            'lead_capture'
        ],
        email: [
            'email_marketing',
            'enquiries_support'
        ]
    },
    appointment_based: {
        instagram: [
            'appointments_bookings',
            'enquiries_support'
        ],
        facebook: [
            'appointments_bookings',
            'enquiries_support'
        ],
        whatsapp: [
            'appointments_bookings',
            'enquiries_support'
        ],
        tiktok: [
            'lead_capture'
        ],
        email: [
            'email_marketing',
            'appointments_bookings'
        ]
    },
    lead_driven: {
        instagram: [
            'lead_capture'
        ],
        facebook: [
            'lead_capture'
        ],
        whatsapp: [
            'lead_capture'
        ],
        tiktok: [
            'lead_capture'
        ],
        email: [
            'email_marketing',
            'lead_capture'
        ]
    }
};
const getAutomationsForBusinessKind = (businessKind, channel)=>{
    return businessKindChannelMap[businessKind]?.[channel] || [];
};
const defaultSalesConfig = {
    catalogType: 'simple',
    products: [],
    triggerKeywords: [
        'buy',
        'order',
        'price',
        'how much'
    ],
    welcomeMessage: 'Hi! 👋 Welcome to our store. What would you like to order today?',
    orderConfirmationMessage: '✅ Order confirmed! We\'ll process it shortly.',
    paymentRequired: true,
    paymentMethods: [
        'bank_transfer'
    ],
    deliveryOptions: [
        'delivery'
    ],
    collectCustomerInfo: [
        'name',
        'phone',
        'address'
    ]
};
const defaultAppointmentConfig = {
    appointmentName: 'Consultation',
    duration: '30',
    paymentRequired: false,
    availability: [
        {
            day: 'Mon',
            enabled: true,
            slots: [
                {
                    startTime: '09:00',
                    endTime: '17:00'
                }
            ]
        },
        {
            day: 'Tue',
            enabled: true,
            slots: [
                {
                    startTime: '09:00',
                    endTime: '17:00'
                }
            ]
        },
        {
            day: 'Wed',
            enabled: true,
            slots: [
                {
                    startTime: '09:00',
                    endTime: '17:00'
                }
            ]
        },
        {
            day: 'Thu',
            enabled: true,
            slots: [
                {
                    startTime: '09:00',
                    endTime: '17:00'
                }
            ]
        },
        {
            day: 'Fri',
            enabled: true,
            slots: [
                {
                    startTime: '09:00',
                    endTime: '17:00'
                }
            ]
        },
        {
            day: 'Sat',
            enabled: false,
            slots: []
        },
        {
            day: 'Sun',
            enabled: false,
            slots: []
        }
    ],
    maxPerSlot: 1,
    bufferTime: 15,
    triggerKeywords: [
        'book',
        'appointment',
        'schedule',
        'reserve'
    ],
    welcomeMessage: 'Hi 👋 Thanks for reaching out to book an appointment. Please reply with your preferred DATE.',
    dateRequestMessage: 'Great! Please select your preferred date:',
    timeRequestMessage: 'What time works best for you?',
    dateUnavailableMessage: 'Sorry 😕 that date is fully booked. Please choose another date.',
    confirmationMessage: '✅ Your appointment is confirmed! We look forward to seeing you.',
    sendReminder: true,
    reminderTiming: [
        '24h'
    ],
    reminderMessage: '⏰ Reminder: You have an appointment today at {{time}}.',
    collectCustomerInfo: [
        'name',
        'phone'
    ],
    notifyAdmin: true
};
const defaultEnquiryConfig = {
    supportType: 'hybrid',
    faqs: [],
    ticketCategories: [
        'General Inquiry',
        'Technical Issue',
        'Billing',
        'Feedback'
    ],
    ticketFields: [
        {
            id: '1',
            label: 'Subject',
            type: 'text',
            required: true
        },
        {
            id: '2',
            label: 'Description',
            type: 'textarea',
            required: true
        }
    ],
    triggerKeywords: [
        'help',
        'support',
        'question',
        'issue',
        'problem'
    ],
    welcomeMessage: 'Hi! 👋 How can we help you today? You can ask a question or describe your issue.',
    faqNotFoundMessage: 'I couldn\'t find an answer to that. Let me connect you with our support team.',
    ticketCreatedMessage: '✅ Your support ticket has been created. We\'ll get back to you shortly.',
    escalationMessage: 'A team member will respond to you shortly.',
    autoEscalateUnresolved: true,
    escalationTimeout: 5,
    collectCustomerInfo: [
        'name',
        'email'
    ],
    notifyAdmin: true,
    workingHoursOnly: false
};
const defaultLeadCaptureConfig = {
    captureMethod: 'both',
    triggerKeywords: [
        'info',
        'interested',
        'price',
        'more'
    ],
    commentTriggerType: 'keyword',
    welcomeMessage: 'Hi! 👋 Thanks for your interest. Let me get your details so we can help you better.',
    followUpMessages: [
        {
            message: 'Just checking in! Did you have any questions?',
            delayMinutes: 60
        }
    ],
    collectInfo: [
        'name',
        'phone',
        'email'
    ],
    qualifyingQuestions: [],
    thankYouMessage: 'Thank you! We\'ll be in touch soon.',
    redirectToWhatsApp: false,
    tagLeads: [
        'new'
    ],
    notifyAdmin: true
};
const defaultEmailMarketingConfig = {
    senderName: 'Your Business',
    senderEmail: 'hello@yourbusiness.com',
    replyToEmail: 'support@yourbusiness.com',
    welcomeEmailEnabled: true,
    welcomeEmailDelay: 0,
    followUpSequence: [],
    triggerEvents: [
        'lead_capture'
    ],
    trackOpens: true,
    trackClicks: true,
    unsubscribeEnabled: true
};
const generateId = ()=>Math.random().toString(36).substring(2, 9);
const getDefaultConfig = (category)=>{
    switch(category){
        case 'sales_orders':
            return {
                type: 'sales_orders',
                config: {
                    ...defaultSalesConfig
                }
            };
        case 'appointments_bookings':
            return {
                type: 'appointments_bookings',
                config: {
                    ...defaultAppointmentConfig
                }
            };
        case 'enquiries_support':
            return {
                type: 'enquiries_support',
                config: {
                    ...defaultEnquiryConfig
                }
            };
        case 'lead_capture':
            return {
                type: 'lead_capture',
                config: {
                    ...defaultLeadCaptureConfig
                }
            };
        case 'email_marketing':
            return {
                type: 'email_marketing',
                config: {
                    ...defaultEmailMarketingConfig
                }
            };
    }
};
const planDetails = {
    starter: {
        name: 'Starter',
        price: '₦25,000',
        priceValue: 25000,
        maxChannels: 1,
        maxAutomations: 2,
        maxContacts: 500,
        features: [
            '1 Social Channel (WhatsApp OR IG/FB/TikTok)',
            'Lead Capture Automation',
            'Basic FAQ Bot',
            'Dashboard Analytics',
            '500 Contacts Limit',
            'Email Support'
        ],
        description: '1 channel of your choice',
        supportedCategories: [
            'lead_capture',
            'enquiries_support'
        ]
    },
    professional: {
        name: 'Professional',
        price: '₦50,000',
        priceValue: 50000,
        maxChannels: 2,
        maxAutomations: 8,
        maxContacts: 2500,
        features: [
            '2 Social Channels',
            'All Automation Types',
            'Appointment Booking',
            'Sales & Order Automation',
            'Email Automation',
            '2,500 Contacts Limit',
            'Priority Support'
        ],
        description: '2 channels of your choice',
        supportedCategories: [
            'lead_capture',
            'enquiries_support',
            'appointments_bookings',
            'sales_orders',
            'email_marketing'
        ]
    },
    enterprise: {
        name: 'Enterprise',
        price: '₦120,000',
        priceValue: 120000,
        maxChannels: 5,
        maxAutomations: 'unlimited',
        maxContacts: 10000,
        features: [
            'All 5 Channels (IG, FB, WhatsApp, TikTok, Email)',
            'Unlimited Automations',
            'AI-Powered Responses',
            'Advanced Analytics',
            '10,000+ Contacts',
            'Dedicated Account Manager',
            'Custom Integrations',
            'White-label Options'
        ],
        description: 'All channels (IG, FB, WhatsApp, TikTok, Email)',
        supportedCategories: [
            'lead_capture',
            'enquiries_support',
            'appointments_bookings',
            'sales_orders',
            'email_marketing'
        ]
    }
};
const countries = [
    'Nigeria',
    'Ghana',
    'Kenya',
    'South Africa',
    'United States',
    'United Kingdom',
    'Canada',
    'Other'
];
const mockManyChatOAuth = async (channel)=>{
    await new Promise((resolve)=>setTimeout(resolve, 2000));
    return {
        success: true,
        workspaceId: `ws_${channel}_${Math.random().toString(36).substring(7)}`,
        accessToken: `at_${channel}_${Math.random().toString(36).substring(7)}`,
        accountName: `@demo_${channel}_account`
    };
};
const mockTikTokOAuth = async ()=>{
    await new Promise((resolve)=>setTimeout(resolve, 2000));
    return {
        success: true,
        workspaceId: `ws_tiktok_${Math.random().toString(36).substring(7)}`,
        accessToken: `at_tiktok_${Math.random().toString(36).substring(7)}`,
        accountName: `@demo_tiktok_creator`
    };
};
const mockEmailConnect = async ()=>{
    await new Promise((resolve)=>setTimeout(resolve, 1500));
    return {
        success: true,
        workspaceId: `ws_email_${Math.random().toString(36).substring(7)}`,
        accessToken: `at_email_${Math.random().toString(36).substring(7)}`,
        accountName: `hello@yourbusiness.com`
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/onboardingTypes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Onboarding types and mock data for ManyChat integration
// NOTE: Main plan and business types are in businessTypes.ts
// This file is kept for legacy compatibility
__turbopack_context__.s([
    "automationGoals",
    ()=>automationGoals,
    "countries",
    ()=>countries,
    "generateId",
    ()=>generateId,
    "initialOnboardingData",
    ()=>initialOnboardingData,
    "mockManyChatOAuth",
    ()=>mockManyChatOAuth,
    "mockTikTokOAuth",
    ()=>mockTikTokOAuth,
    "planDetails",
    ()=>planDetails
]);
const planDetails = {
    starter: {
        name: 'Starter',
        price: '₦25,000',
        maxChannels: 1,
        maxAutomations: 2,
        maxContacts: 500,
        features: [
            '1 Social Channel',
            'Lead Capture Automation',
            'Basic FAQ Bot',
            'Dashboard Analytics',
            'Email Support'
        ],
        description: '1 channel of your choice'
    },
    professional: {
        name: 'Professional',
        price: '₦50,000',
        maxChannels: 2,
        maxAutomations: 8,
        maxContacts: 2500,
        features: [
            '2 Social Channels',
            'All Automation Types',
            'Appointment Booking',
            'Transactional Email',
            'Priority Support'
        ],
        description: '2 channels of your choice'
    },
    enterprise: {
        name: 'Enterprise',
        price: '₦120,000',
        maxChannels: 4,
        maxAutomations: 'unlimited',
        maxContacts: 10000,
        features: [
            'All 4 Social Channels',
            'Unlimited Automations',
            'AI-Powered Responses',
            'Dedicated Account Manager',
            'Custom Integrations'
        ],
        description: 'All channels (IG, FB, WhatsApp, TikTok)'
    }
};
const automationGoals = [
    {
        id: 'lead_capture',
        name: 'Get leads from comments',
        description: 'Automatically DM users who comment on your posts with a keyword',
        icon: '📥',
        followUpQuestion: 'What keyword should trigger the lead capture?',
        followUpPlaceholder: 'e.g., "INFO", "PRICE", "BUY"',
        followUpType: 'text'
    },
    {
        id: 'auto_reply',
        name: 'Reply to DMs automatically',
        description: 'Send instant welcome messages to new DM conversations',
        icon: '💬',
        followUpQuestion: 'What welcome message should we send?',
        followUpPlaceholder: 'e.g., "Hi! 👋 Thanks for reaching out. How can I help you today?"',
        followUpType: 'textarea'
    },
    {
        id: 'whatsapp_redirect',
        name: 'Redirect customers to WhatsApp',
        description: 'Send your WhatsApp link when customers want to chat',
        icon: '📱',
        followUpQuestion: 'What is your WhatsApp business number?',
        followUpPlaceholder: '+234 xxx xxx xxxx',
        followUpType: 'phone'
    },
    {
        id: 'faq_bot',
        name: 'Answer FAQs automatically',
        description: 'Set up automatic responses to common questions',
        icon: '🤖',
        followUpQuestion: 'Set up your FAQ responses',
        followUpPlaceholder: '',
        followUpType: 'faq'
    }
];
const initialOnboardingData = {
    email: '',
    password: '',
    emailVerified: false,
    businessDetails: null,
    selectedPlan: 'starter',
    paymentCompleted: false,
    channels: [
        {
            type: 'instagram',
            connected: false
        },
        {
            type: 'facebook',
            connected: false
        },
        {
            type: 'whatsapp',
            connected: false
        },
        {
            type: 'tiktok',
            connected: false
        }
    ],
    automations: []
};
const countries = [
    'Nigeria',
    'Ghana',
    'Kenya',
    'South Africa',
    'United States',
    'United Kingdom',
    'Canada',
    'Other'
];
const mockManyChatOAuth = async (channel)=>{
    await new Promise((resolve)=>setTimeout(resolve, 2000));
    return {
        success: true,
        workspaceId: `ws_${channel}_${Math.random().toString(36).substring(7)}`,
        accessToken: `at_${channel}_${Math.random().toString(36).substring(7)}`,
        accountName: `@demo_${channel}_account`
    };
};
const mockTikTokOAuth = async ()=>{
    await new Promise((resolve)=>setTimeout(resolve, 2000));
    return {
        success: true,
        workspaceId: `tt_ws_${Math.random().toString(36).substring(7)}`,
        accessToken: `tt_at_${Math.random().toString(36).substring(7)}`,
        accountName: `@demo_tiktok_account`
    };
};
const generateId = ()=>Math.random().toString(36).substring(2, 9);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/mockData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Mock data for the application
__turbopack_context__.s([
    "clientTrafficData",
    ()=>clientTrafficData,
    "generateChartData",
    ()=>generateChartData,
    "mockActivities",
    ()=>mockActivities,
    "mockClients",
    ()=>mockClients,
    "mockLeads",
    ()=>mockLeads,
    "mockWebhookLogs",
    ()=>mockWebhookLogs
]);
const mockLeads = [
    {
        id: '1',
        name: 'Adebayo Johnson',
        phone: '+234 801 234 5678',
        platform: 'whatsapp',
        status: 'paid',
        date: '2024-12-10',
        messages: [
            {
                sender: 'user',
                text: 'Hi, I saw your ad about the product',
                time: '10:30 AM'
            },
            {
                sender: 'bot',
                text: 'Hello! Welcome to our store. How can I help you today?',
                time: '10:30 AM'
            },
            {
                sender: 'user',
                text: 'How much is the premium package?',
                time: '10:31 AM'
            },
            {
                sender: 'bot',
                text: 'Our premium package is ₦25,000. It includes...',
                time: '10:31 AM'
            },
            {
                sender: 'user',
                text: 'Great! I want to buy',
                time: '10:35 AM'
            }
        ]
    },
    {
        id: '2',
        name: 'Chioma Okafor',
        phone: '+234 802 345 6789',
        platform: 'instagram',
        status: 'interested',
        date: '2024-12-09',
        messages: [
            {
                sender: 'user',
                text: 'Is this still available?',
                time: '2:15 PM'
            },
            {
                sender: 'bot',
                text: 'Yes! It is available. Would you like more details?',
                time: '2:15 PM'
            },
            {
                sender: 'user',
                text: 'Yes please',
                time: '2:20 PM'
            }
        ]
    },
    {
        id: '3',
        name: 'Emeka Nwosu',
        phone: '+234 803 456 7890',
        platform: 'facebook',
        status: 'new',
        date: '2024-12-11',
        messages: [
            {
                sender: 'user',
                text: 'Hello',
                time: '9:00 AM'
            },
            {
                sender: 'bot',
                text: 'Hi there! Welcome. How can I assist you?',
                time: '9:00 AM'
            }
        ]
    },
    {
        id: '4',
        name: 'Fatima Ibrahim',
        phone: '+234 804 567 8901',
        platform: 'whatsapp',
        status: 'paid',
        date: '2024-12-08',
        messages: [
            {
                sender: 'user',
                text: 'I want to order',
                time: '4:00 PM'
            },
            {
                sender: 'bot',
                text: 'Great! What would you like to order?',
                time: '4:00 PM'
            }
        ]
    },
    {
        id: '5',
        name: 'Gbenga Adeleke',
        phone: '+234 805 678 9012',
        platform: 'tiktok',
        status: 'interested',
        date: '2024-12-07',
        messages: [
            {
                sender: 'user',
                text: 'Saw your TikTok video',
                time: '11:00 AM'
            },
            {
                sender: 'bot',
                text: 'Thank you! Which product caught your attention?',
                time: '11:00 AM'
            }
        ]
    },
    {
        id: '6',
        name: 'Halima Yusuf',
        phone: '+234 806 789 0123',
        platform: 'instagram',
        status: 'new',
        date: '2024-12-11',
        messages: [
            {
                sender: 'user',
                text: 'Price?',
                time: '3:30 PM'
            }
        ]
    },
    {
        id: '7',
        name: 'Ikenna Obiora',
        phone: '+234 807 890 1234',
        platform: 'whatsapp',
        status: 'paid',
        date: '2024-12-06',
        messages: [
            {
                sender: 'user',
                text: 'Ready to pay',
                time: '1:00 PM'
            },
            {
                sender: 'bot',
                text: 'Perfect! Here are the payment details...',
                time: '1:00 PM'
            }
        ]
    },
    {
        id: '8',
        name: 'Juliet Eze',
        phone: '+234 808 901 2345',
        platform: 'facebook',
        status: 'interested',
        date: '2024-12-10',
        messages: [
            {
                sender: 'user',
                text: 'Do you deliver to Abuja?',
                time: '5:00 PM'
            },
            {
                sender: 'bot',
                text: 'Yes, we deliver nationwide!',
                time: '5:00 PM'
            }
        ]
    }
];
const mockActivities = [
    {
        id: '1',
        type: 'lead',
        platform: 'whatsapp',
        message: 'New lead captured from WhatsApp',
        time: '2 min ago'
    },
    {
        id: '2',
        type: 'sale',
        platform: 'instagram',
        message: 'Sale confirmed: ₦25,000',
        time: '15 min ago'
    },
    {
        id: '3',
        type: 'message',
        platform: 'whatsapp',
        message: 'Bot replied to customer inquiry',
        time: '23 min ago'
    },
    {
        id: '4',
        type: 'lead',
        platform: 'tiktok',
        message: 'New lead from TikTok ad',
        time: '45 min ago'
    },
    {
        id: '5',
        type: 'bot',
        platform: 'facebook',
        message: 'Bot activated for Facebook page',
        time: '1 hour ago'
    },
    {
        id: '6',
        type: 'sale',
        platform: 'whatsapp',
        message: 'Sale confirmed: ₦15,000',
        time: '2 hours ago'
    },
    {
        id: '7',
        type: 'message',
        platform: 'instagram',
        message: 'Customer requested callback',
        time: '3 hours ago'
    }
];
const generateChartData = ()=>{
    const data = [];
    const today = new Date();
    for(let i = 29; i >= 0; i--){
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }),
            leads: Math.floor(Math.random() * 30) + 10,
            sales: Math.floor(Math.random() * 15) + 5
        });
    }
    return data;
};
const mockClients = [
    {
        id: '1',
        name: 'Jordan Smith',
        company: 'Acme Corp',
        email: 'jordan@acme.com',
        phone: '+234 801 111 1111',
        apiKey: 'ak_live_Xk9j2mNp4Q7rT1wZ8vB3cD6fH0gI',
        status: 'active',
        plan: 'Professional',
        leadLimit: 1000,
        leadsUsed: 456,
        revenue: 2450000,
        joinedDate: '2024-06-15',
        platforms: {
            whatsapp: true,
            instagram: true,
            facebook: false,
            tiktok: false
        },
        notificationNumber: '+234 801 111 1111',
        automations: [
            {
                goalId: 'lead_capture',
                goalName: 'Get Leads from Comments',
                channel: 'instagram',
                status: 'active'
            },
            {
                goalId: 'whatsapp_redirect',
                goalName: 'Redirect to WhatsApp',
                channel: 'instagram',
                status: 'active'
            }
        ],
        planExpiryDate: '2025-02-15'
    },
    {
        id: '2',
        name: 'Sarah Okonkwo',
        company: 'TechStart Inc',
        email: 'sarah@techstart.ng',
        phone: '+234 802 222 2222',
        apiKey: 'ak_live_Lm8k3nOq5R9sU2xA1yC4eF7hJ0lK',
        status: 'active',
        plan: 'Enterprise',
        leadLimit: 5000,
        leadsUsed: 1234,
        revenue: 5800000,
        joinedDate: '2024-03-20',
        platforms: {
            whatsapp: true,
            instagram: true,
            facebook: true,
            tiktok: true
        },
        notificationNumber: '+234 802 222 2222',
        automations: [
            {
                goalId: 'lead_capture',
                goalName: 'Get Leads from Comments',
                channel: 'instagram',
                status: 'active'
            },
            {
                goalId: 'auto_reply',
                goalName: 'Reply to DMs',
                channel: 'facebook',
                status: 'active'
            },
            {
                goalId: 'faq_bot',
                goalName: 'Answer FAQs',
                channel: 'whatsapp',
                status: 'active'
            },
            {
                goalId: 'whatsapp_redirect',
                goalName: 'Redirect to WhatsApp',
                channel: 'tiktok',
                status: 'paused'
            }
        ],
        planExpiryDate: '2025-03-20'
    },
    {
        id: '3',
        name: 'Michael Adekunle',
        company: 'Growth Co',
        email: 'michael@growth.co',
        phone: '+234 803 333 3333',
        apiKey: 'ak_live_Pn0l4oRr6S1tV3yB2zA5dG8iL1mN',
        status: 'active',
        plan: 'Starter',
        leadLimit: 500,
        leadsUsed: 389,
        revenue: 890000,
        joinedDate: '2024-09-01',
        platforms: {
            whatsapp: true,
            instagram: false,
            facebook: false,
            tiktok: false
        },
        notificationNumber: '+234 803 333 3333',
        automations: [
            {
                goalId: 'faq_bot',
                goalName: 'Answer FAQs',
                channel: 'whatsapp',
                status: 'active'
            }
        ],
        planExpiryDate: '2025-01-01'
    },
    {
        id: '4',
        name: 'Amara Chukwu',
        company: 'RetailMax',
        email: 'amara@retailmax.ng',
        phone: '+234 804 444 4444',
        apiKey: 'ak_live_Qo1m5pSs7T2uW4zC3aB6eH9jM2oP',
        status: 'suspended',
        plan: 'Professional',
        leadLimit: 1000,
        leadsUsed: 1000,
        revenue: 1200000,
        joinedDate: '2024-07-10',
        platforms: {
            whatsapp: true,
            instagram: true,
            facebook: false,
            tiktok: false
        },
        notificationNumber: '+234 804 444 4444',
        automations: [
            {
                goalId: 'lead_capture',
                goalName: 'Get Leads from Comments',
                channel: 'instagram',
                status: 'paused'
            }
        ],
        planExpiryDate: '2025-02-10'
    },
    {
        id: '5',
        name: 'David Obi',
        company: 'Fashion Hub',
        email: 'david@fashionhub.ng',
        phone: '+234 805 555 5555',
        apiKey: 'ak_live_Rp2n6qTt8U3vX5aC4bD7fI0kN3pQ',
        status: 'active',
        plan: 'Enterprise',
        leadLimit: 5000,
        leadsUsed: 2890,
        revenue: 7500000,
        joinedDate: '2024-01-05',
        platforms: {
            whatsapp: true,
            instagram: true,
            facebook: true,
            tiktok: true
        },
        notificationNumber: '+234 805 555 5555',
        automations: [
            {
                goalId: 'lead_capture',
                goalName: 'Get Leads from Comments',
                channel: 'instagram',
                status: 'active'
            },
            {
                goalId: 'lead_capture',
                goalName: 'Get Leads from Comments',
                channel: 'tiktok',
                status: 'active'
            },
            {
                goalId: 'auto_reply',
                goalName: 'Reply to DMs',
                channel: 'instagram',
                status: 'active'
            },
            {
                goalId: 'faq_bot',
                goalName: 'Answer FAQs',
                channel: 'whatsapp',
                status: 'active'
            },
            {
                goalId: 'whatsapp_redirect',
                goalName: 'Redirect to WhatsApp',
                channel: 'facebook',
                status: 'active'
            }
        ],
        planExpiryDate: '2025-04-05'
    }
];
const mockWebhookLogs = [
    {
        id: '1',
        timestamp: '2024-12-11T14:32:15Z',
        source: 'ManyChat',
        endpoint: '/api/webhooks/manychat',
        status: 'success',
        payload: '{"user_id": "12345", "message": "Hello", "platform": "instagram"}',
        response: '{"status": "received", "lead_id": "abc123"}'
    },
    {
        id: '2',
        timestamp: '2024-12-11T14:30:45Z',
        source: 'WAmation',
        endpoint: '/api/webhooks/wamation',
        status: 'success',
        payload: '{"phone": "+234801234567", "message": "Price?", "type": "text"}',
        response: '{"status": "processed", "bot_response": true}'
    },
    {
        id: '3',
        timestamp: '2024-12-11T14:28:30Z',
        source: 'ManyChat',
        endpoint: '/api/webhooks/manychat',
        status: 'error',
        payload: '{"user_id": "67890", "message": null}',
        response: '{"error": "Invalid message format"}'
    },
    {
        id: '4',
        timestamp: '2024-12-11T14:25:00Z',
        source: 'TikTok',
        endpoint: '/api/webhooks/tiktok',
        status: 'success',
        payload: '{"lead_info": {"name": "Test User", "comment": "Interested!"}}',
        response: '{"status": "lead_created"}'
    },
    {
        id: '5',
        timestamp: '2024-12-11T14:20:15Z',
        source: 'WAmation',
        endpoint: '/api/webhooks/wamation',
        status: 'success',
        payload: '{"phone": "+234802345678", "type": "payment_confirmed", "amount": 25000}',
        response: '{"status": "sale_recorded"}'
    }
];
const clientTrafficData = mockClients.filter((c)=>c.status === 'active').map((client)=>({
        name: client.company,
        leads: client.leadsUsed,
        revenue: client.revenue / 1000
    })).sort((a, b)=>b.leads - a.leads);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/portal/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProtectedRoute$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProtectedRoute.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$portal$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/portal/Dashboard.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProtectedRoute$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProtectedRoute"], {
        allowedRoles: [
            'client'
        ],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$portal$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/portal/page.tsx",
            lineNumber: 7,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/portal/page.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = Page;
var _c;
__turbopack_context__.k.register(_c, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_ddee52c7._.js.map