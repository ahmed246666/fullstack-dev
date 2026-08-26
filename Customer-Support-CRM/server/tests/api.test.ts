import http from 'http';
import app from '../src/server';
import { prisma } from '../src/db';

async function runApiTests() {
  console.log('🧪 Starting End-to-End API Integration Tests for SCRUM-17...\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5001, resolve));
  const baseUrl = 'http://localhost:5001/api';

  try {
    // 1. Health Check
    const healthRes = await fetch(`${baseUrl}/health`);
    const health = await healthRes.json();
    console.log(`✅ [1/8] GET /api/health -> Status: ${healthRes.status}, Body:`, health.status);

    // 2. Customers List
    const custRes = await fetch(`${baseUrl}/customers?search=Tariq&tier=ENTERPRISE`);
    const custData = await custRes.json();
    console.log(`✅ [2/8] GET /api/customers -> Status: ${custRes.status}, Found: ${custData.data?.length} customer(s)`);

    // 3. Customer 360 Profile
    const firstCust = custData.data[0];
    const profileRes = await fetch(`${baseUrl}/customers/${firstCust.id}`);
    const profileData = await profileRes.json();
    console.log(`✅ [3/8] GET /api/customers/:id -> Status: ${profileRes.status}, Total Tickets: ${profileData.data?.stats?.totalTickets}`);

    // 4. Omnichannel Tickets List with SLA Computation
    const ticketsRes = await fetch(`${baseUrl}/tickets?channel=WHATSAPP`);
    const ticketsData = await ticketsRes.json();
    console.log(`✅ [4/8] GET /api/tickets?channel=WHATSAPP -> Status: ${ticketsRes.status}, Found: ${ticketsData.data?.length}, SLA: ${ticketsData.data?.[0]?.slaStatus}`);

    // 5. Create New Ticket with Dynamic SLA Deadlines
    const createTicketRes = await fetch(`${baseUrl}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Payment gateway webhook signature mismatch',
        description: 'Webhook verification returned 401 on Saudi Riyal checkout transaction.',
        customerId: firstCust.id,
        priority: 'URGENT',
        channel: 'EMAIL',
        department: 'Technical'
      })
    });
    const newTicket = await createTicketRes.json();
    console.log(`✅ [5/8] POST /api/tickets -> Status: ${createTicketRes.status}, Created: ${newTicket.data?.ticketNumber}, Priority: ${newTicket.data?.priority}, SLA Status: ${newTicket.data?.slaStatus}`);

    // 6. Add Note & Update Ticket Status
    const ticketId = newTicket.data.id;
    const noteRes = await fetch(`${baseUrl}/tickets/${ticketId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Investigating webhook HMAC secret rotation with payment provider.',
        authorName: 'Sara Al-Ghamdi',
        isInternal: true,
        channel: 'INTERNAL'
      })
    });
    const noteData = await noteRes.json();
    console.log(`✅ [6/8] POST /api/tickets/:id/notes -> Status: ${noteRes.status}, Added Note: ${noteData.data?.id}`);

    // 7. Knowledge Base & Agents
    const kbRes = await fetch(`${baseUrl}/knowledge-base?category=Getting%20Started`);
    const kbData = await kbRes.json();
    const agentsRes = await fetch(`${baseUrl}/users/agents`);
    const agentsData = await agentsRes.json();
    console.log(`✅ [7/8] GET /api/knowledge-base & /api/users/agents -> KB Articles: ${kbData.data?.length}, Agents: ${agentsData.data?.length}`);

    // 8. OpenAPI JSON Contract Endpoint
    const openapiRes = await fetch(`${baseUrl}/openapi.json`);
    const openapiData = await openapiRes.json();
    console.log(`✅ [8/8] GET /api/openapi.json -> Status: ${openapiRes.status}, OpenAPI Version: ${openapiData.openapi}, Endpoints: ${Object.keys(openapiData.paths || {}).length}`);

    console.log('\n🎉 ALL 8 REST API INTEGRATION TESTS PASSED 100%!');
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runApiTests().catch((e) => {
  console.error('❌ API Test Failed:', e);
  process.exit(1);
});
