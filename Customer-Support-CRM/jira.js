/**
 * Jira Integration Helper for Antigravity & Developer Workflow
 * Usage:
 *   node jira.js list
 *   node jira.js create "Summary" "Description" [Story|Task|Bug]
 *   node jira.js transition <issueKey> "In Progress"|"Done"|"To Do"
 */

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        process.env[match[1]] = (match[2] || '').trim();
      }
    }
  }
}

loadEnv();

const baseUrl = process.env.JIRA_BASE_URL;
const email = process.env.JIRA_EMAIL;
const apiToken = process.env.JIRA_API_TOKEN;
const projectKey = process.env.JIRA_PROJECT_KEY || 'SCRUM';
const epicKey = process.env.JIRA_WEEK3_EPIC;

if (!baseUrl || !email || !apiToken) {
  console.error('Missing Jira credentials in .env');
  process.exit(1);
}

const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
const headers = {
  'Authorization': `Basic ${auth}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

async function listIssues() {
  const url = `${baseUrl}/rest/api/3/search/jql?jql=${encodeURIComponent(`project = ${projectKey} ORDER BY key ASC`)}&fields=summary,status,issuetype,parent`;
  const res = await fetch(url, { headers });
  const data = await res.json();
  console.log(`\n📋 Jira Issues in Project [${projectKey}]:\n`);
  console.log('Key'.padEnd(12) + 'Type'.padEnd(10) + 'Status'.padEnd(16) + 'Summary');
  console.log('-'.repeat(85));
  if (data.issues) {
    for (const issue of data.issues) {
      const key = issue.key.padEnd(12);
      const type = (issue.fields.issuetype?.name || '').padEnd(10);
      const status = (issue.fields.status?.name || '').padEnd(16);
      const summary = issue.fields.summary || '';
      console.log(`${key}${type}${status}${summary}`);
    }
  }
}

async function createIssue(summary, description, issueType = 'Story') {
  const payload = {
    fields: {
      project: { key: projectKey },
      summary,
      description: description || summary,
      issuetype: { name: issueType }
    }
  };
  if (epicKey && issueType !== 'Epic') {
    payload.fields.parent = { key: epicKey };
  }

  const res = await fetch(`${baseUrl}/rest/api/2/issue`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`✅ Created ${issueType} [${data.key}]: ${summary}`);
  } else {
    console.error('❌ Failed to create issue:', data);
  }
}

async function transitionIssue(issueKey, targetStatus) {
  // 1. Get available transitions
  const transRes = await fetch(`${baseUrl}/rest/api/3/issue/${issueKey}/transitions`, { headers });
  const transData = await transRes.json();
  const transition = transData.transitions?.find(t => t.name.toLowerCase() === targetStatus.toLowerCase());
  
  if (!transition) {
    console.error(`Transition '${targetStatus}' not found for ${issueKey}. Available:`, transData.transitions?.map(t => t.name));
    return;
  }

  const res = await fetch(`${baseUrl}/rest/api/3/issue/${issueKey}/transitions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ transition: { id: transition.id } })
  });

  if (res.ok) {
    console.log(`✅ Moved ${issueKey} to '${transition.name}'`);
  } else {
    console.error(`❌ Failed to transition ${issueKey}:`, await res.text());
  }
}

async function main() {
  const [,, cmd, ...args] = process.argv;
  if (!cmd || cmd === 'list') {
    await listIssues();
  } else if (cmd === 'create') {
    const [summary, description, type] = args;
    if (!summary) {
      console.log('Usage: node jira.js create "<summary>" "<description>" [Story|Task|Bug]');
      return;
    }
    await createIssue(summary, description, type || 'Story');
  } else if (cmd === 'transition' || cmd === 'move') {
    const [issueKey, status] = args;
    if (!issueKey || !status) {
      console.log('Usage: node jira.js transition <SCRUM-X> "<Status>"');
      return;
    }
    await transitionIssue(issueKey, status);
  } else {
    console.log('Commands: list, create, transition');
  }
}

main().catch(console.error);
