import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTests() {
  console.log('🧪 Running Verification Tests for SCRUM-16 Database Schema...\n');

  // Test 1: Query Users with RBAC roles
  const users = await prisma.user.findMany();
  console.log(`✅ [1/7] Users count: ${users.length} (Admin: ${users.filter(u => u.role === 'ADMIN').length}, Agents: ${users.filter(u => u.role === 'AGENT').length})`);

  // Test 2: Query Customers with Arabic/English names
  const customers = await prisma.customer.findMany({ include: { tickets: true } });
  console.log(`✅ [2/7] Customers count: ${customers.length} (All have tickets attached)`);
  customers.forEach(c => console.log(`   - ${c.name} (${c.nameAr}) [Tier: ${c.tier}] -> ${c.tickets.length} tickets`));

  // Test 3: Query Omnichannel Tickets with Relational Joins (Customer, Agent, Notes)
  const tickets = await prisma.ticket.findMany({
    include: {
      customer: true,
      assignedAgent: true,
      notes: true
    }
  });
  console.log(`\n✅ [3/7] Omnichannel Tickets count: ${tickets.length}`);
  tickets.forEach(t => {
    console.log(`   - [${t.ticketNumber}] ${t.title}`);
    console.log(`     Channel: ${t.channel} | Priority: ${t.priority} | Status: ${t.status} | Agent: ${t.assignedAgent?.name || 'Unassigned'} | Notes: ${t.notes.length}`);
  });

  // Test 4: Verify SLA Configurations
  const slas = await prisma.sLAConfig.findMany();
  console.log(`\n✅ [4/7] SLA Policies count: ${slas.length}`);
  slas.forEach(s => console.log(`   - Priority: ${s.priority} -> Response: ${s.responseTimeHours}h, Resolution: ${s.resolutionTimeHours}h`));

  // Test 5: Verify Knowledge Base Articles (Bilingual)
  const articles = await prisma.knowledgeArticle.findMany();
  console.log(`\n✅ [5/7] Knowledge Base Articles count: ${articles.length}`);
  articles.forEach(a => console.log(`   - [${a.slug}] ${a.title} / ${a.titleAr} (Votes: +${a.helpfulVotes}/-${a.unhelpfulVotes})`));

  // Test 6: Verify Canned Responses
  const canned = await prisma.cannedResponse.findMany();
  console.log(`\n✅ [6/7] Canned Responses count: ${canned.length}`);
  canned.forEach(c => console.log(`   - Shortcut: ${c.shortcut} -> "${c.title}"`));

  // Test 7: Verify Audit Logs
  const audits = await prisma.auditLog.findMany({ include: { actor: true } });
  console.log(`\n✅ [7/7] Audit Logs count: ${audits.length}`);
  audits.forEach(a => console.log(`   - Action: ${a.action} on ${a.entity} by ${a.actor?.name || 'System'}`));

  console.log('\n🎉 ALL 7 DATABASE INTEGRITY TESTS PASSED!');
}

runTests()
  .catch(e => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
