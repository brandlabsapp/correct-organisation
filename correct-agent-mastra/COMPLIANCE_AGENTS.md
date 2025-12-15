# Compliance Agent System

This document describes the compliance agent system built with Mastra, designed
to handle compliance queries through a multi-agent architecture.

## Architecture Overview

The system follows the architecture defined in the mermaid diagram:

```
User Query → Orchestrator Agent → [CompanyAgent | WebSearchAgent] → Merged Response
```

### Core Agents

#### 1. Orchestrator Agent (`orchestratorAgent`)

- **Role**: Main entry point that routes queries and merges responses
- **Tools**: `companyDatabaseTool`, `webSearchTool`
- **Function**: Determines whether queries are company-specific, general legal,
  or both

#### 2. Company Agent (`companyAgent`)

- **Role**: Handles company-specific policies and internal compliance
- **Tools**: `companyDatabaseTool`
- **Function**: Searches internal policies, procedures, and compliance records

#### 3. Web Search Agent (`webSearchAgent`)

- **Role**: Handles general legal and regulatory queries
- **Tools**: `webSearchTool`
- **Function**: Searches external legal sources and regulations

### Future Agents

#### 4. Due Date Agent (`dueDateAgent`)

- **Role**: Tracks compliance deadlines and due dates
- **Tools**: `companyDatabaseTool`
- **Function**: Monitors upcoming compliance requirements and alerts

#### 5. Fine Agent (`fineAgent`)

- **Role**: Analyzes fines, penalties, and enforcement actions
- **Tools**: `webSearchTool`, `companyDatabaseTool`
- **Function**: Calculates financial impact of non-compliance

#### 6. Law Agent (`lawAgent`)

- **Role**: Provides comprehensive legal research and analysis
- **Tools**: `webSearchTool`
- **Function**: Deep legal research with case law and precedents

## Tools

### Company Database Tool (`companyDatabaseTool`)

- Searches internal company policies and compliance records
- Returns policies with version numbers and last updated dates
- Includes compliance status and responsible departments

### Web Search Tool (`webSearchTool`) - SearXNG Integration

- **Privacy-focused metasearch**: Uses [SearXNG](https://docs.searxng.org/) to
  aggregate results from 245+ search engines
- **No tracking**: Searches without user profiling or data collection
- **Authoritative sources**: Prioritizes government sources (SEC, OSHA, EU,
  etc.)
- **Jurisdiction detection**: Automatically detects and filters by legal
  jurisdiction
- **Relevance scoring**: Advanced scoring based on legal keywords and source
  authority
- **Fallback system**: Falls back to cached legal resources if SearXNG is
  unavailable
- **Configurable instances**: Supports multiple SearXNG instances (default:
  https://searx.be)

## Scorers

The system includes specialized scorers for compliance evaluation:

1. **Citation Quality Scorer**: Evaluates proper source citations
2. **Policy vs Law Distinction Scorer**: Ensures clear distinction between
   internal policies and external laws
3. **Tool Call Appropriateness Scorers**: Validates correct tool usage
4. **Completeness Scorer**: Ensures comprehensive responses

## Usage

### Starting the System

```bash
npm run dev
```

### Example Queries

**Company-specific query:** "What is our data privacy policy regarding GDPR
compliance?"

**General legal query:** "What are the current SOX requirements for financial
reporting?"

**Mixed query:** "How does our current privacy policy align with GDPR
requirements?"

## Data Sources

### Company Database (Mock Data)

- Company policies with categories (privacy, financial, hr)
- Compliance records with status tracking
- Due dates and responsible departments

### SearXNG Web Search

- **Real-time search**: Live results from 245+ search engines
- **Privacy protection**: No user tracking or profiling
- **Authoritative sources**: Government, legal, and regulatory websites
- **Jurisdiction-aware**: Automatic detection of legal jurisdictions
- **Fallback data**: Cached legal resources when SearXNG is unavailable

### SearXNG Configuration

- **Default instance**: https://searx.be (configurable)
- **Alternative instances**: Can use any public SearXNG instance from
  [searx.space](https://searx.space)
- **Categories**: Supports general, news, science, and other search categories
- **Rate limiting**: Respects SearXNG instance limits
- **Error handling**: Graceful fallback to cached data

## Development

### Adding New Agents

1. Create agent file in `src/mastra/agents/`
2. Import and add to `src/mastra/index.ts`
3. Add appropriate tools and scorers

### Adding New Tools

1. Create tool file in `src/mastra/tools/`
2. Import in relevant agent files
3. Update tool schemas as needed

### Adding New Scorers

1. Add scorer to `src/mastra/scorers/compliance-scorers.ts`
2. Import in `src/mastra/index.ts`
3. Configure sampling rates in agents

## Future Enhancements

1. **Real Database Integration**: Replace mock data with actual company database
2. **Live Web Search**: Integrate with real search APIs (Google, Bing, legal
   databases)
3. **Workflow Integration**: Add compliance workflows for complex processes
4. **Notification System**: Implement alerts for due dates and compliance
   changes
5. **Reporting Dashboard**: Create compliance reporting and analytics
