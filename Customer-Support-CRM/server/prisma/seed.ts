import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for AZM Customer Support CRM...');

  // 1. Clear existing data in reverse relation order
  await prisma.auditLog.deleteMany();
  await prisma.note.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.cannedResponse.deleteMany();
  await prisma.knowledgeArticle.deleteMany();
  await prisma.sLAConfig.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing database records.');

  // 2. Seed Users & Agents (RBAC)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Ahmed Osama',
      nameAr: 'أحمد أسامة',
      email: 'admin@azmsquad.com',
      role: 'ADMIN',
      department: 'Management',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    }
  });

  const agentSara = await prisma.user.create({
    data: {
      name: 'Sara Al-Ghamdi',
      nameAr: 'سارة الغامدي',
      email: 'sara.ghamdi@azmsquad.com',
      role: 'AGENT',
      department: 'Technical',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    }
  });

  const agentKhalid = await prisma.user.create({
    data: {
      name: 'Khalid Al-Mansoor',
      nameAr: 'خالد المنصور',
      email: 'khalid.mansoor@azmsquad.com',
      role: 'AGENT',
      department: 'Billing',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    }
  });

  const agentNoura = await prisma.user.create({
    data: {
      name: 'Noura Al-Shehri',
      nameAr: 'نورة الشهري',
      email: 'noura.shehri@azmsquad.com',
      role: 'AGENT',
      department: 'Support',
      avatarUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    }
  });

  console.log('✅ Created 4 Users & Agents.');

  // 3. Seed SLA Policies
  await prisma.sLAConfig.createMany({
    data: [
      {
        priority: 'URGENT',
        responseTimeHours: 1.0,
        resolutionTimeHours: 4.0,
        escalationRole: 'ADMIN'
      },
      {
        priority: 'HIGH',
        responseTimeHours: 2.0,
        resolutionTimeHours: 8.0,
        escalationRole: 'ADMIN'
      },
      {
        priority: 'MEDIUM',
        responseTimeHours: 4.0,
        resolutionTimeHours: 24.0,
        escalationRole: 'AGENT'
      },
      {
        priority: 'LOW',
        responseTimeHours: 8.0,
        resolutionTimeHours: 48.0,
        escalationRole: 'AGENT'
      }
    ]
  });

  console.log('✅ Seeded 4 SLA Configuration Policies.');

  // 4. Seed Canned Responses
  await prisma.cannedResponse.createMany({
    data: [
      {
        shortcut: '/greet',
        title: 'Standard Greeting',
        titleAr: 'الترحيب القياسي',
        content:
          'Hello! Thank you for reaching out to AZM Squad Support. How may I assist you today?',
        contentAr: 'أهلاً بك! شكراً لتواصلك مع دعم عزم. كيف يمكنني مساعدتك اليوم؟',
        category: 'Greetings'
      },
      {
        shortcut: '/investigating',
        title: 'Issue Under Investigation',
        titleAr: 'جاري فحص المشكلة',
        content:
          'We are currently investigating your request with our engineering team and will update you shortly.',
        contentAr: 'نحن نعمل حالياً على متابعة طلبك مع الفريق التقني وسنزودك بالتحديث في أقرب وقت.',
        category: 'Troubleshooting'
      },
      {
        shortcut: '/invoice',
        title: 'Invoice & Billing Clarification',
        titleAr: 'توضيح الفاتورة والمدفوعات',
        content:
          'Your billing receipt has been generated and attached. Please let us know if you have any questions.',
        contentAr: 'تم إصدار إيصال الدفع وإرفاقه. يرجى إعلامنا إذا كان لديك أي استفسار إضافي.',
        category: 'Billing'
      },
      {
        shortcut: '/resolve',
        title: 'Resolution Confirmation',
        titleAr: 'تأكيد إغلاق التذكرة',
        content:
          'We are glad to inform you that your issue has been resolved! Please feel free to rate our support service.',
        contentAr: 'يسعدنا إبلاغك بأنه تم حل مشكلتك بنجاح! يسعدنا تقييمك لمستوى الخدمة المقدمة.',
        category: 'Closures'
      }
    ]
  });

  console.log('✅ Seeded 4 Canned Responses.');

  // 5. Seed Knowledge Base Articles (Bilingual)
  await prisma.knowledgeArticle.createMany({
    data: [
      {
        slug: 'getting-started-guide',
        title: 'Quick Start: Setting Up Your AZM Portal Account',
        titleAr: 'دليل البدء السريع: إعداد حسابك في بوابة عزم',
        content:
          'Learn how to configure your account settings, invite team members, and set up your initial notification preferences in less than 5 minutes.',
        contentAr:
          'تعرف على كيفية ضبط إعدادات حسابك، ودعوة أعضاء الفريق، وإعداد تفضيلات التنبيهات في أقل من 5 دقائق.',
        category: 'Getting Started',
        tags: 'onboarding, account, setup',
        helpfulVotes: 42,
        unhelpfulVotes: 1
      },
      {
        slug: 'managing-api-keys',
        title: 'How to Generate and Rotate OpenAPI API Keys',
        titleAr: 'كيفية إنشاء وتدوير مفاتيح واجهة برمجة التطبيقات (API)',
        content:
          'Detailed documentation on generating secure OAuth & Bearer tokens for our REST and OpenAPI contract endpoints.',
        contentAr:
          'دليل مفصل حول إنشاء وتدوير رموز الوصول الآمنة للتكامل مع واجهات برمجة التطبيقات وOpenAPI.',
        category: 'API & Integrations',
        tags: 'api, security, keys',
        helpfulVotes: 35,
        unhelpfulVotes: 0
      },
      {
        slug: 'sla-tiers-explained',
        title: 'Understanding SLA Response & Resolution Guarantees',
        titleAr: 'فهم اتفاقيات مستوى الخدمة (SLA) وأوقات الاستجابة',
        content:
          'Overview of response target times for Urgent (1h), High (2h), Medium (4h), and Low (8h) priorities.',
        contentAr:
          'نظرة عامة على الأوقات المستهدفة للاستجابة والحل للأولويات العاجلة والعالية والمتوسطة.',
        category: 'Account & Billing',
        tags: 'sla, support, policy',
        helpfulVotes: 28,
        unhelpfulVotes: 2
      }
    ]
  });

  console.log('✅ Seeded 3 Knowledge Base Articles.');

  // 6. Seed Customers (Bilingual & Multi-Channel)
  const custTariq = await prisma.customer.create({
    data: {
      name: 'Tariq Al-Harbi',
      nameAr: 'طارق الحربي',
      email: 'tariq.harbi@aramco.example.com',
      phone: '+966 50 123 4567',
      company: 'PetroTech Solutions',
      tier: 'ENTERPRISE',
      preferredLang: 'ar',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    }
  });

  const custMona = await prisma.customer.create({
    data: {
      name: 'Mona Al-Zahrani',
      nameAr: 'منى الزهراني',
      email: 'mona.zahrani@fintech-sa.example.com',
      phone: '+966 55 987 6543',
      company: 'Riyadh FinTech Labs',
      tier: 'VIP',
      preferredLang: 'en',
      avatarUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    }
  });

  const custFaisal = await prisma.customer.create({
    data: {
      name: 'Faisal Al-Otaibi',
      nameAr: 'فيصل العتيبي',
      email: 'faisal.otaibi@cloud-sa.example.com',
      phone: '+966 54 333 2211',
      company: 'Najd Cloud Services',
      tier: 'STANDARD',
      preferredLang: 'ar',
      avatarUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    }
  });

  const custReem = await prisma.customer.create({
    data: {
      name: 'Reem Al-Dossari',
      nameAr: 'ريم الدوسري',
      email: 'reem.dossari@logistics.example.com',
      phone: '+966 56 444 8899',
      company: 'Gulf Express Logistics',
      tier: 'VIP',
      preferredLang: 'en',
      avatarUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    }
  });

  console.log('✅ Created 4 Customers across Enterprise, VIP & Standard tiers.');

  // 7. Seed Omnichannel Tickets
  const now = new Date();

  // Ticket 1: Urgent - WhatsApp - Technical
  const t1 = await prisma.ticket.create({
    data: {
      ticketNumber: 'TCK-1001',
      title: 'Database connection timeout on production cluster',
      description:
        'Our ERP integration suddenly failed with error ETIMEDOUT when querying warehouse stocks.',
      status: 'OPEN',
      priority: 'URGENT',
      channel: 'WHATSAPP',
      category: 'Technical',
      department: 'Technical',
      customerId: custTariq.id,
      assignedAgentId: agentSara.id,
      responseDueAt: new Date(now.getTime() + 1 * 3600 * 1000),
      resolutionDueAt: new Date(now.getTime() + 4 * 3600 * 1000),
      firstResponseAt: new Date(now.getTime() - 15 * 60 * 1000)
    }
  });

  // Ticket 2: High - Email - Billing
  const t2 = await prisma.ticket.create({
    data: {
      ticketNumber: 'TCK-1002',
      title: 'Discrepancy in monthly enterprise subscription invoice #INV-2026-08',
      description:
        'The calculated VAT on invoice #INV-2026-08 shows an unexpected debit charge for extra user seats.',
      status: 'NEW',
      priority: 'HIGH',
      channel: 'EMAIL',
      category: 'Billing',
      department: 'Billing',
      customerId: custMona.id,
      assignedAgentId: agentKhalid.id,
      responseDueAt: new Date(now.getTime() + 2 * 3600 * 1000),
      resolutionDueAt: new Date(now.getTime() + 8 * 3600 * 1000)
    }
  });

  // Ticket 3: Medium - Live Chat - Support
  const t3 = await prisma.ticket.create({
    data: {
      ticketNumber: 'TCK-1003',
      title: 'Need assistance setting up RTL Arabic typography in PDF reports',
      description:
        'When exporting monthly summary PDFs, Arabic text appears disconnected or left-aligned.',
      status: 'PENDING',
      priority: 'MEDIUM',
      channel: 'LIVE_CHAT',
      category: 'General',
      department: 'Support',
      customerId: custFaisal.id,
      assignedAgentId: agentNoura.id,
      responseDueAt: new Date(now.getTime() + 4 * 3600 * 1000),
      resolutionDueAt: new Date(now.getTime() + 24 * 3600 * 1000),
      firstResponseAt: new Date(now.getTime() - 2 * 3600 * 1000)
    }
  });

  // Ticket 4: Low - Web Form - Resolved with CSAT
  const t4 = await prisma.ticket.create({
    data: {
      ticketNumber: 'TCK-1004',
      title: 'Request to update corporate billing contact email address',
      description: 'Please update our primary billing email to accounts@logistics.example.com.',
      status: 'RESOLVED',
      priority: 'LOW',
      channel: 'WEB_FORM',
      category: 'Inquiries',
      department: 'Support',
      customerId: custReem.id,
      assignedAgentId: agentNoura.id,
      responseDueAt: new Date(now.getTime() - 24 * 3600 * 1000),
      resolutionDueAt: new Date(now.getTime() - 12 * 3600 * 1000),
      firstResponseAt: new Date(now.getTime() - 22 * 3600 * 1000),
      resolvedAt: new Date(now.getTime() - 10 * 3600 * 1000),
      csatRating: 5,
      csatFeedback: 'Prompt and highly professional assistance! Thank you Noura.'
    }
  });

  // Ticket 5: SMS - Urgent
  const t5 = await prisma.ticket.create({
    data: {
      ticketNumber: 'TCK-1005',
      title: 'SMS Alert: API rate limit threshold reached (95%)',
      description:
        'Automated webhook alert: Gateway API consumed 95% of allocated monthly rate limits.',
      status: 'NEW',
      priority: 'URGENT',
      channel: 'SMS',
      category: 'Technical',
      department: 'Technical',
      customerId: custTariq.id,
      assignedAgentId: agentSara.id,
      responseDueAt: new Date(now.getTime() + 45 * 60 * 1000),
      resolutionDueAt: new Date(now.getTime() + 3 * 3600 * 1000)
    }
  });

  console.log('✅ Created 5 Omnichannel Tickets across WhatsApp, Email, Live Chat, Web Form, SMS.');

  // 8. Seed Conversation Notes & Activity Feed
  await prisma.note.createMany({
    data: [
      {
        ticketId: t1.id,
        authorId: agentSara.id,
        authorName: 'Sara Al-Ghamdi',
        content: 'Investigating network latency with the DevOps team. Verified proxy health.',
        isInternal: true,
        channel: 'INTERNAL'
      },
      {
        ticketId: t1.id,
        authorId: agentSara.id,
        authorName: 'Sara Al-Ghamdi',
        content:
          'Dear Tariq, we identified a temporary replica failover and have rerouted your connection pool.',
        isInternal: false,
        channel: 'WHATSAPP'
      },
      {
        ticketId: t3.id,
        authorId: agentNoura.id,
        authorName: 'Noura Al-Shehri',
        content:
          'Provided customer with Cairo/Amiri font configuration snippet for the PDF exporter.',
        isInternal: false,
        channel: 'LIVE_CHAT'
      }
    ]
  });

  console.log('✅ Seeded internal and public Ticket Notes.');

  // 9. Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: adminUser.id,
        actorName: 'Ahmed Osama',
        action: 'UPDATE_SLA_POLICY',
        entity: 'SLAConfig',
        entityId: 'ALL',
        details: 'Updated Urgent priority SLA response target to 1.0 hour.'
      },
      {
        actorId: agentSara.id,
        actorName: 'Sara Al-Ghamdi',
        action: 'ASSIGN_TICKET',
        entity: 'Ticket',
        entityId: t1.id,
        details: 'Assigned ticket TCK-1001 to Sara Al-Ghamdi.'
      }
    ]
  });

  console.log('✅ Seeded Audit Log entries.');
  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
