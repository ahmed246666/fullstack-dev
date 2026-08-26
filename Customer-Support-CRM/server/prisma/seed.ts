import { PrismaClient, Role, Department, AgentStatus, CustomerTier, Channel, TicketStatus, TicketPriority, TicketCategory, InteractionType, AuthorType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CRM database seeding...');

  // 1. Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.knowledgeBaseArticle.deleteMany();
  await prisma.cannedReply.deleteMany();
  await prisma.sLAConfig.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.user.deleteMany();

  // 2. SLA Configurations
  console.log('Creating SLA configurations...');
  await prisma.sLAConfig.createMany({
    data: [
      { priority: TicketPriority.URGENT, responseTimeMinutes: 15, resolutionTimeMinutes: 120, escalationThresholdMinutes: 30 },
      { priority: TicketPriority.HIGH, responseTimeMinutes: 30, resolutionTimeMinutes: 240, escalationThresholdMinutes: 60 },
      { priority: TicketPriority.MEDIUM, responseTimeMinutes: 120, resolutionTimeMinutes: 720, escalationThresholdMinutes: 240 },
      { priority: TicketPriority.LOW, responseTimeMinutes: 480, resolutionTimeMinutes: 1440, escalationThresholdMinutes: 720 },
    ]
  });

  // 3. System Settings
  console.log('Creating system settings...');
  await prisma.systemSetting.createMany({
    data: [
      { key: 'company_name', value: 'AZM Enterprise CRM', category: 'BRANDING' },
      { key: 'default_language', value: 'ar', category: 'LOCALIZATION' },
      { key: 'sla_enforcement_enabled', value: 'true', category: 'SLA' },
      { key: 'ai_copilot_enabled', value: 'true', category: 'AI' },
      { key: 'whatsapp_webhook_status', value: 'active', category: 'INTEGRATIONS' },
      { key: 'email_incoming_address', value: 'support@azm.sa', category: 'INTEGRATIONS' },
    ]
  });

  // 4. Users / Agents
  console.log('Creating agents & admin users...');
  const admin = await prisma.user.create({
    data: {
      email: 'tariq.admin@azm.sa',
      name: 'Tariq Al-Mansoor',
      nameAr: 'طارق المنصور',
      role: Role.ADMIN,
      department: Department.TECHNICAL,
      status: AgentStatus.ONLINE,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    }
  });

  const agentSarah = await prisma.user.create({
    data: {
      email: 'sarah.jenkins@azm.sa',
      name: 'Sarah Jenkins',
      nameAr: 'سارة جينكينز',
      role: Role.AGENT,
      department: Department.CUSTOMER_CARE,
      status: AgentStatus.ONLINE,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    }
  });

  const agentOmar = await prisma.user.create({
    data: {
      email: 'omar.farooq@azm.sa',
      name: 'Omar Farooq',
      nameAr: 'عمر فاروق',
      role: Role.AGENT,
      department: Department.BILLING,
      status: AgentStatus.AWAY,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    }
  });

  const agentLayla = await prisma.user.create({
    data: {
      email: 'layla.mahmoud@azm.sa',
      name: 'Layla Mahmoud',
      nameAr: 'ليلى محمود',
      role: Role.AGENT,
      department: Department.TECHNICAL,
      status: AgentStatus.ONLINE,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    }
  });

  // 5. Customers
  console.log('Creating customer profiles...');
  const customerSTC = await prisma.customer.create({
    data: {
      name: 'Khalid Al-Subaie (STC Enterprise)',
      nameAr: 'خالد السبيعي (شركة الاتصالات السعودية)',
      email: 'khalid.subaie@stc.com.sa',
      phone: '+966 50 123 4567',
      company: 'Saudi Telecom Company (STC)',
      tier: CustomerTier.ENTERPRISE,
      primaryChannel: Channel.WHATSAPP,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      tags: 'VIP,Enterprise,Telco,High-Value',
      customFields: JSON.stringify({ erpCustomerId: 'ERP-STC-9021', contractLevel: 'Platinum', accountManager: 'Tariq Al-Mansoor' })
    }
  });

  const customerAramco = await prisma.customer.create({
    data: {
      name: 'Mona Al-Ghamdi (Aramco Digital)',
      nameAr: 'منى الغامدي (أرامكو الرقمية)',
      email: 'mona.ghamdi@aramco.com.sa',
      phone: '+966 55 987 6543',
      company: 'Aramco Digital Solutions',
      tier: CustomerTier.VIP,
      primaryChannel: Channel.EMAIL,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      tags: 'VIP,Energy,Cloud-Infra',
      customFields: JSON.stringify({ erpCustomerId: 'ERP-ARM-3044', contractLevel: 'Gold' })
    }
  });

  const customerRiyad = await prisma.customer.create({
    data: {
      name: 'Fahad Al-Otaibi (Riyad Bank)',
      nameAr: 'فهد العتيبي (بنك الرياض)',
      email: 'fahad.otaibi@riyadbank.com.sa',
      phone: '+966 54 332 1100',
      company: 'Riyad Bank Corporation',
      tier: CustomerTier.ENTERPRISE,
      primaryChannel: Channel.LIVE_CHAT,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      tags: 'Enterprise,Fintech,Banking,SLA-Strict',
      customFields: JSON.stringify({ erpCustomerId: 'ERP-RB-8812', contractLevel: 'Platinum' })
    }
  });

  const customerRajhi = await prisma.customer.create({
    data: {
      name: 'Reem Al-Shehri (Al-Rajhi Retail)',
      nameAr: 'ريم الشهري (الراجحي للتجزئة)',
      email: 'reem.shehri@alrajhiretail.sa',
      phone: '+966 56 445 9988',
      company: 'Al-Rajhi Retail Group',
      tier: CustomerTier.STANDARD,
      primaryChannel: Channel.WEB_FORM,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      tags: 'Retail,Standard',
      customFields: JSON.stringify({ erpCustomerId: 'ERP-RR-1029' })
    }
  });

  // 6. Tickets
  console.log('Creating omnichannel tickets...');
  const now = new Date();

  // Ticket 1: URGENT WhatsApp Ticket (Payment Gateway Timeout)
  const ticket1 = await prisma.ticket.create({
    data: {
      ticketNumber: 'TICK-1001',
      title: 'Critical Payment Gateway Timeout in Saudi Checkout',
      description: 'Customers are experiencing HTTP 504 gateway timeout when checking out via Mada and Apple Pay on mobile.',
      status: TicketStatus.OPEN,
      priority: TicketPriority.URGENT,
      category: TicketCategory.BILLING,
      channel: Channel.WHATSAPP,
      department: Department.BILLING,
      customerId: customerSTC.id,
      assignedAgentId: agentOmar.id,
      slaResponseDue: new Date(now.getTime() + 15 * 60 * 1000),
      slaResolutionDue: new Date(now.getTime() + 120 * 60 * 1000),
      firstRespondedAt: new Date(now.getTime() - 5 * 60 * 1000),
      aiSummary: 'High severity billing issue: Mada/Apple Pay gateway timeouts on mobile checkout affecting STC enterprise customers.',
      aiSuggestedReplies: JSON.stringify([
        'We have isolated the latency in the Mada upstream processor and are applying an emergency routing patch.',
        'Our billing engineering team is actively investigating the Mada timeout and failover is being initiated.'
      ]),
      aiUrgencyScore: 95,
      tags: 'mada,apple-pay,checkout,urgent'
    }
  });

  // Ticket 2: HIGH SAML SSO Email Ticket
  const ticket2 = await prisma.ticket.create({
    data: {
      ticketNumber: 'TICK-1002',
      title: 'SSO Login SAML Assertion Mismatch on iOS App',
      description: 'Aramco Digital engineers cannot authenticate using Okta SAML IDP after v2.4 upgrade.',
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
      category: TicketCategory.TECHNICAL,
      channel: Channel.EMAIL,
      department: Department.TECHNICAL,
      customerId: customerAramco.id,
      assignedAgentId: agentLayla.id,
      slaResponseDue: new Date(now.getTime() + 25 * 60 * 1000),
      slaResolutionDue: new Date(now.getTime() + 200 * 60 * 1000),
      aiSummary: 'Authentication failure: Okta SAML attribute mapping changed during v2.4 mobile update causing token rejection.',
      aiSuggestedReplies: JSON.stringify([
        'Please verify that the EntityID in Okta SAML configuration matches https://auth.azm.sa/saml/metadata.',
        'We have released a hotfix v2.4.1 addressing the iOS SAML token parsing regression.'
      ]),
      aiUrgencyScore: 82,
      tags: 'sso,saml,okta,ios'
    }
  });

  // Ticket 3: PENDING VAT Invoice Inquiry
  const ticket3 = await prisma.ticket.create({
    data: {
      ticketNumber: 'TICK-1003',
      title: 'Inquiry Regarding ZATCA Phase 2 E-Invoicing Compliance',
      description: 'Requesting updated monthly tax invoice with ZATCA cryptographic stamp and QR code for Q3 audit.',
      status: TicketStatus.PENDING,
      priority: TicketPriority.MEDIUM,
      category: TicketCategory.BILLING,
      channel: Channel.LIVE_CHAT,
      department: Department.BILLING,
      customerId: customerRiyad.id,
      assignedAgentId: agentOmar.id,
      slaResponseDue: new Date(now.getTime() + 60 * 60 * 1000),
      slaResolutionDue: new Date(now.getTime() + 480 * 60 * 1000),
      firstRespondedAt: new Date(now.getTime() - 30 * 60 * 1000),
      aiSummary: 'Billing inquiry: Riyad Bank requesting ZATCA Phase 2 compliant tax invoices for Q3 financial reporting.',
      aiSuggestedReplies: JSON.stringify([
        'Your ZATCA Phase 2 compliant XML and PDF invoices have been generated and attached to your portal account.',
        'We can schedule an onboarding call to integrate direct ZATCA e-invoicing API webhooks.'
      ]),
      aiUrgencyScore: 40,
      tags: 'zatca,vat,invoice,tax'
    }
  });

  // Ticket 4: NEW Feature Request
  const ticket4 = await prisma.ticket.create({
    data: {
      ticketNumber: 'TICK-1004',
      title: 'Feature Request: Automated Audit Log S3 Export & SIEM Webhooks',
      description: 'We require daily automated export of security and ticket audit logs to an enterprise Amazon S3 bucket.',
      status: TicketStatus.NEW,
      priority: TicketPriority.LOW,
      category: TicketCategory.FEATURE_REQUEST,
      channel: Channel.WEB_FORM,
      department: Department.TECHNICAL,
      customerId: customerRajhi.id,
      slaResponseDue: new Date(now.getTime() + 240 * 60 * 1000),
      slaResolutionDue: new Date(now.getTime() + 1200 * 60 * 1000),
      aiSummary: 'Feature request for SIEM / S3 log streaming integration for corporate compliance.',
      aiSuggestedReplies: JSON.stringify([
        'Thank you for the feature request. This capability is planned for our Q4 enterprise release roadmap.'
      ]),
      aiUrgencyScore: 20,
      tags: 'audit-log,s3,siem,feature-request'
    }
  });

  // Ticket 5: RESOLVED Ticket with CSAT
  const ticket5 = await prisma.ticket.create({
    data: {
      ticketNumber: 'TICK-1005',
      title: 'Activation Link Expired for Secondary Support Agent Account',
      description: 'Account activation token expired before the branch manager could verify their email.',
      status: TicketStatus.RESOLVED,
      priority: TicketPriority.LOW,
      category: TicketCategory.GENERAL,
      channel: Channel.EMAIL,
      department: Department.CUSTOMER_CARE,
      customerId: customerSTC.id,
      assignedAgentId: agentSarah.id,
      slaResponseDue: new Date(now.getTime() - 240 * 60 * 1000),
      slaResolutionDue: new Date(now.getTime() - 120 * 60 * 1000),
      firstRespondedAt: new Date(now.getTime() - 230 * 60 * 1000),
      resolvedAt: new Date(now.getTime() - 90 * 60 * 1000),
      csatRating: 5,
      csatFeedback: 'Super fast turnaround and instant account regeneration. Great support!',
      aiSummary: 'Resolved user activation link expiry by triggering a refreshed magic link.',
      aiUrgencyScore: 15,
      tags: 'account,activation,resolved'
    }
  });

  // 7. Interactions / Conversation Activity
  console.log('Creating ticket interaction history...');
  await prisma.interaction.createMany({
    data: [
      {
        ticketId: ticket1.id,
        customerId: customerSTC.id,
        type: InteractionType.CUSTOMER_MESSAGE,
        authorType: AuthorType.CUSTOMER,
        authorId: customerSTC.id,
        authorName: 'Khalid Al-Subaie',
        content: 'Emergency: Mada payments are stalling at 99% progress bar for mobile users.',
        channel: Channel.WHATSAPP,
        isInternalOnly: false,
        createdAt: new Date(now.getTime() - 40 * 60 * 1000)
      },
      {
        ticketId: ticket1.id,
        type: InteractionType.INTERNAL_NOTE,
        authorType: AuthorType.AGENT,
        authorId: agentOmar.id,
        authorName: 'Omar Farooq',
        content: 'Internal Note: Escalated to Payment Ops team. Upstream gateway reported minor packet drops.',
        channel: Channel.INTERNAL,
        isInternalOnly: true,
        createdAt: new Date(now.getTime() - 25 * 60 * 1000)
      },
      {
        ticketId: ticket1.id,
        type: InteractionType.AGENT_REPLY,
        authorType: AuthorType.AGENT,
        authorId: agentOmar.id,
        authorName: 'Omar Farooq',
        content: 'Dear Khalid, our gateway team is rerouting transactions through our secondary Saudi network route. Please monitor and let us know if transactions resume.',
        channel: Channel.WHATSAPP,
        isInternalOnly: false,
        createdAt: new Date(now.getTime() - 10 * 60 * 1000)
      },
      {
        ticketId: ticket2.id,
        customerId: customerAramco.id,
        type: InteractionType.CUSTOMER_MESSAGE,
        authorType: AuthorType.CUSTOMER,
        authorId: customerAramco.id,
        authorName: 'Mona Al-Ghamdi',
        content: 'Our security team noticed error 400 invalid_grant when authenticating from iOS devices.',
        channel: Channel.EMAIL,
        isInternalOnly: false,
        createdAt: new Date(now.getTime() - 60 * 60 * 1000)
      },
      {
        ticketId: ticket2.id,
        type: InteractionType.AGENT_REPLY,
        authorType: AuthorType.AGENT,
        authorId: agentLayla.id,
        authorName: 'Layla Mahmoud',
        content: 'Hi Mona, we have verified the assertion certificate. A patched build v2.4.1 is now ready for testing in your MDM profile.',
        channel: Channel.EMAIL,
        isInternalOnly: false,
        createdAt: new Date(now.getTime() - 15 * 60 * 1000)
      }
    ]
  });

  // 8. Canned Replies
  console.log('Creating canned quick replies...');
  await prisma.cannedReply.createMany({
    data: [
      {
        shortcut: '/greet',
        title: 'Customer Greeting',
        titleAr: 'الترحيب بالعميل',
        content: 'Hello {{customer_name}}, thank you for reaching out to AZM Support. How may I assist you today?',
        contentAr: 'أهلاً بك {{customer_name}}، نشكر تواصلك مع الدعم الفني في عزم. كيف يمكننا مساعدتك اليوم؟',
        category: 'GENERAL'
      },
      {
        shortcut: '/investigating',
        title: 'Under Active Investigation',
        titleAr: 'قيد التحقيق الفني',
        content: 'We are actively investigating this issue with our senior engineering team and will provide you with a resolution update shortly.',
        contentAr: 'يقوم الفريق الهندسي بالتحقق من الحالة حالياً وسنوافيكم بآخر المستجدات خلال وقت وجيز.',
        category: 'TECHNICAL'
      },
      {
        shortcut: '/resolved',
        title: 'Ticket Resolution Notice',
        titleAr: 'إشعار إغلاق التذكرة',
        content: 'This issue has now been resolved. Please verify on your end and feel free to reach out if you need any additional assistance!',
        contentAr: 'تم حل المشكلة بنجاح. يرجى التحقق من طرفكم، ويسعدنا تواصلكم في حال وجود أي استفسار إضافي!',
        category: 'GENERAL'
      },
      {
        shortcut: '/zatca-info',
        title: 'ZATCA Compliance Details',
        titleAr: 'معلومات الفوترة الإلكترونية (زاتكا)',
        content: 'All invoices generated via our platform adhere to ZATCA Phase 2 specifications with embedded cryptographic seals.',
        contentAr: 'جميع الفواتير الصادرة عبر المنصة متوافقة مع متطلبات المرحلة الثانية لهيئة الزكاة والضريبة والجمارك.',
        category: 'BILLING'
      }
    ]
  });

  // 9. Knowledge Base Articles
  console.log('Creating Knowledge Base articles...');
  await prisma.knowledgeBaseArticle.createMany({
    data: [
      {
        title: 'How to Configure WhatsApp & SMS Webhook Notifications',
        titleAr: 'كيفية ربط إشعارات الواتساب والرسائل القصيرة عبر Webhook',
        slug: 'whatsapp-sms-webhook-configuration',
        category: 'INTEGRATIONS',
        excerpt: 'Step-by-step guide to setting up automated WhatsApp and SMS incident dispatching for enterprise support.',
        content: '## Overview\n\nAZM CRM provides native webhook gateways for WhatsApp Cloud API and local SMS providers in KSA. Follow these steps to generate webhook secrets and map events...',
        contentAr: '## نظرة عامة\n\nتوفر منصة عزم بوابات ربط مرنة مع واتساب للأعمال ومزودي الرسائل النصية القصيرة في المملكة...',
        helpfulCount: 42,
        notHelpfulCount: 1,
        isPublished: true,
        authorId: admin.id
      },
      {
        title: 'Enterprise SLA Targets, Timers and Escalation Matrix',
        titleAr: 'سياسة مستوى الخدمة SLA ومصفوفة التصعيد للمؤسسات',
        slug: 'enterprise-sla-targets-and-escalation',
        category: 'GENERAL',
        excerpt: 'Complete documentation on response and resolution deadlines across Urgent, High, Medium, and Low ticket priorities.',
        content: '## SLA Commitment Matrix\n\n- **Urgent (P1):** 15-minute response, 2-hour resolution.\n- **High (P2):** 30-minute response, 4-hour resolution.\n- **Medium (P3):** 2-hour response, 12-hour resolution.\n- **Low (P4):** 8-hour response, 24-hour resolution.',
        contentAr: '## مصفوفة التزامات مستوى الخدمة\n\n- **طارئ (P1):** استجابة خلال 15 دقيقة، حل خلال ساعتين.\n- **عالي (P2):** استجابة خلال 30 دقيقة، حل خلال 4 ساعات.',
        helpfulCount: 89,
        notHelpfulCount: 3,
        isPublished: true,
        authorId: admin.id
      },
      {
        title: 'Configuring Okta SAML 2.0 Single Sign-On (SSO)',
        titleAr: 'إعداد تسجيل الدخول الموحد SSO عبر Okta SAML 2.0',
        slug: 'okta-saml-sso-setup-guide',
        category: 'TECHNICAL',
        excerpt: 'How to configure corporate Identity Providers (IdP) for unified CRM access control.',
        content: '## SAML Configuration\n\n1. Navigate to Settings > Authentication > SSO.\n2. Enter IdP Issuer URL and upload the X.509 signing certificate...',
        contentAr: '## إعدادات SAML\n\n1. توجه إلى الإعدادات > المصادقة > الدخول الموحد.\n2. أدخل رابط جهة الهوية وقم برفع شهادة التوقيع الرقمي...',
        helpfulCount: 35,
        notHelpfulCount: 2,
        isPublished: true,
        authorId: admin.id
      }
    ]
  });

  // 10. Audit Logs
  console.log('Creating initial audit log entries...');
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'SYSTEM_INITIALIZED',
        entityType: 'SYSTEM',
        entityId: 'ROOT',
        userId: admin.id,
        details: JSON.stringify({ version: '1.0.0', environment: 'production', seededAt: now }),
        ipAddress: '127.0.0.1'
      },
      {
        action: 'TICKET_CREATED',
        entityType: 'TICKET',
        entityId: ticket1.id,
        userId: admin.id,
        details: JSON.stringify({ ticketNumber: 'TICK-1001', priority: 'URGENT', channel: 'WHATSAPP' }),
        ipAddress: '192.168.1.100'
      }
    ]
  });

  console.log('✅ CRM database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
