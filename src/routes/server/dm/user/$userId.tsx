import { MessageList } from '#/components/MessageList'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '#/components/ui/input-group'
import type { MessageListItem } from '#/types'
import { createFileRoute } from '@tanstack/react-router'
import { MoreHorizontal, Phone, Search, Video } from 'lucide-react'

export const Route = createFileRoute('/server/dm/user/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const messages: MessageListItem[] = [
    { type: 'date', id: 'date-2023-02-11', label: 'February 11, 2023' },
    {
      type: 'message',
      id: 'msg-1',
      author: 'Farhan',
      time: '2/11/23, 2:09 PM',
      content: 'https://discord.gg/EgjTjNP9',
      embed: {
        title: 'You sent an invite, but...',
        subtitle: 'Invalid Invite',
        note: 'Try sending a new invite!',
      },
    },
    {
      type: 'message',
      id: 'msg-2',
      author: 'Farhan',
      time: '2/11/23, 2:10 PM',
      content: 'Check the new channel rules.',
      embed: {
        title: 'Server update',
        subtitle: 'Rules updated',
        note: 'Please review the rules channel.',
      },
    },
    {
      type: 'message',
      id: 'msg-3',
      author: 'Farhan',
      time: '2/11/23, 2:12 PM',
      content: 'Daily standup at 10 AM.',
      embed: {
        title: 'Reminder',
        subtitle: 'Standup',
        note: 'Join the call in #general.',
      },
    },
    {
      type: 'message',
      id: 'msg-4',
      author: 'Farhan',
      time: '2/11/23, 2:14 PM',
      content: 'New UI draft ready.',
      embed: {
        title: 'Design',
        subtitle: 'UI Draft v2',
        note: 'Feedback welcome.',
      },
    },
    {
      type: 'message',
      id: 'msg-5',
      author: 'Farhan',
      time: '2/11/23, 2:16 PM',
      content: 'Pushed fixes to main.',
      embed: {
        title: 'Release',
        subtitle: 'Hotfix applied',
        note: 'No action needed.',
      },
    },
    {
      type: 'message',
      id: 'msg-6',
      author: 'Farhan',
      time: '2/11/23, 2:18 PM',
      content: 'Please review my PR.',
      embed: {
        title: 'Code review',
        subtitle: 'PR #42',
        note: 'Thanks!',
      },
    },
    {
      type: 'message',
      id: 'msg-7',
      author: 'Farhan',
      time: '2/11/23, 2:19 PM',
      content: 'Updated dependencies.',
      embed: {
        title: 'Maintenance',
        subtitle: 'Deps updated',
        note: 'Tests passed.',
      },
    },
    {
      type: 'message',
      id: 'msg-8',
      author: 'Farhan',
      time: '2/11/23, 2:20 PM',
      content: 'Meeting moved to Friday.',
      embed: {
        title: 'Schedule',
        subtitle: 'Meeting change',
        note: 'Friday 3 PM.',
      },
    },
    {
      type: 'message',
      id: 'msg-9',
      author: 'Farhan',
      time: '2/11/23, 2:22 PM',
      content: 'New assets uploaded.',
      embed: {
        title: 'Assets',
        subtitle: 'Icons updated',
        note: 'Use v3 assets.',
      },
    },
    {
      type: 'message',
      id: 'msg-10',
      author: 'Farhan',
      time: '2/11/23, 2:24 PM',
      content: 'API latency improved.',
      embed: {
        title: 'Performance',
        subtitle: 'Latency -20%',
        note: 'Deployed to staging.',
      },
    },
    {
      type: 'message',
      id: 'msg-11',
      author: 'Farhan',
      time: '2/11/23, 2:26 PM',
      content: 'Docs updated.',
      embed: {
        title: 'Documentation',
        subtitle: 'README refreshed',
        note: 'See updated sections.',
      },
    },
    {
      type: 'message',
      id: 'msg-12',
      author: 'Farhan',
      time: '2/11/23, 2:28 PM',
      content: 'Build completed.',
      embed: {
        title: 'CI',
        subtitle: 'Build #128',
        note: 'All checks green.',
      },
    },
    {
      type: 'message',
      id: 'msg-13',
      author: 'Farhan',
      time: '2/11/23, 2:30 PM',
      content: 'Deployment queued.',
      embed: {
        title: 'Deploy',
        subtitle: 'Queued',
        note: 'Waiting for approval.',
      },
    },
    {
      type: 'message',
      id: 'msg-14',
      author: 'Farhan',
      time: '2/11/23, 2:32 PM',
      content: 'Fixed lint warnings.',
      embed: {
        title: 'Cleanup',
        subtitle: 'Lint fixes',
        note: 'No functional changes.',
      },
    },
    {
      type: 'message',
      id: 'msg-15',
      author: 'Farhan',
      time: '2/11/23, 2:34 PM',
      content: 'Added new endpoint.',
      embed: {
        title: 'API',
        subtitle: 'New endpoint',
        note: '/v2/metrics',
      },
    },
    {
      type: 'message',
      id: 'msg-16',
      author: 'Farhan',
      time: '2/11/23, 2:36 PM',
      content: 'Bug fix merged.',
      embed: {
        title: 'Fix',
        subtitle: 'Bug #77',
        note: 'Resolved edge case.',
      },
    },
    {
      type: 'message',
      id: 'msg-17',
      author: 'Farhan',
      time: '2/11/23, 2:38 PM',
      content: 'QA sign-off done.',
      embed: {
        title: 'QA',
        subtitle: 'Approved',
        note: 'Ready to deploy.',
      },
    },
    {
      type: 'message',
      id: 'msg-18',
      author: 'Farhan',
      time: '2/11/23, 2:40 PM',
      content: 'Added tests.',
      embed: {
        title: 'Tests',
        subtitle: 'Coverage +5%',
        note: 'New unit tests.',
      },
    },
    {
      type: 'message',
      id: 'msg-19',
      author: 'Farhan',
      time: '2/11/23, 2:42 PM',
      content: 'Refactor completed.',
      embed: {
        title: 'Refactor',
        subtitle: 'Module split',
        note: 'Improved readability.',
      },
    },
    {
      type: 'message',
      id: 'msg-20',
      author: 'Farhan',
      time: '2/11/23, 2:44 PM',
      content: 'Release notes drafted.',
      embed: {
        title: 'Release',
        subtitle: 'Notes ready',
        note: 'Pending review.',
      },
    },
    {
      type: 'message',
      id: 'msg-21',
      author: 'Farhan',
      time: '2/11/23, 2:46 PM',
      content: 'Staging verified.',
      embed: {
        title: 'Staging',
        subtitle: 'Verified',
        note: 'No blockers found.',
      },
    },
    {
      type: 'message',
      id: 'msg-22',
      author: 'Farhan',
      time: '2/11/23, 2:48 PM',
      content: 'Rollback plan created.',
      embed: {
        title: 'Plan',
        subtitle: 'Rollback',
        note: 'Attached in docs.',
      },
    },
    {
      type: 'message',
      id: 'msg-23',
      author: 'Farhan',
      time: '2/11/23, 2:50 PM',
      content: 'Endpoint monitoring set.',
      embed: {
        title: 'Monitoring',
        subtitle: 'Alerts configured',
        note: 'Pager duty enabled.',
      },
    },
    {
      type: 'message',
      id: 'msg-24',
      author: 'Farhan',
      time: '2/11/23, 2:52 PM',
      content: 'Cache warm-up done.',
      embed: {
        title: 'Cache',
        subtitle: 'Warm-up complete',
        note: 'Ready for traffic.',
      },
    },
    {
      type: 'message',
      id: 'msg-25',
      author: 'Farhan',
      time: '2/11/23, 2:54 PM',
      content: 'Edge rules updated.',
      embed: {
        title: 'CDN',
        subtitle: 'Rules applied',
        note: 'Propagation ongoing.',
      },
    },
    {
      type: 'message',
      id: 'msg-26',
      author: 'Farhan',
      time: '2/11/23, 2:56 PM',
      content: 'Security scan clean.',
      embed: {
        title: 'Security',
        subtitle: 'Scan passed',
        note: 'No critical issues.',
      },
    },
    {
      type: 'message',
      id: 'msg-27',
      author: 'Farhan',
      time: '2/11/23, 2:58 PM',
      content: 'Incremental build enabled.',
      embed: {
        title: 'Build',
        subtitle: 'Incremental',
        note: 'Faster dev builds.',
      },
    },
    {
      type: 'message',
      id: 'msg-28',
      author: 'Farhan',
      time: '2/11/23, 3:00 PM',
      content: 'Telemetry added.',
      embed: {
        title: 'Telemetry',
        subtitle: 'Metrics added',
        note: 'Dashboard updated.',
      },
    },
    {
      type: 'message',
      id: 'msg-29',
      author: 'Farhan',
      time: '2/11/23, 3:02 PM',
      content: 'User feedback collected.',
      embed: {
        title: 'Feedback',
        subtitle: 'Round 1',
        note: 'Insights in doc.',
      },
    },
    {
      type: 'message',
      id: 'msg-30',
      author: 'Farhan',
      time: '2/11/23, 3:04 PM',
      content: 'Added feature flag.',
      embed: {
        title: 'Feature',
        subtitle: 'Flag created',
        note: 'Off by default.',
      },
    },
    {
      type: 'message',
      id: 'msg-31',
      author: 'Farhan',
      time: '2/11/23, 3:06 PM',
      content: 'Changelog updated.',
      embed: {
        title: 'Changelog',
        subtitle: 'v1.3.0',
        note: 'Ready to publish.',
      },
    },
    {
      type: 'message',
      id: 'msg-32',
      author: 'Farhan',
      time: '2/11/23, 3:08 PM',
      content: 'Resolved merge conflicts.',
      embed: {
        title: 'Merge',
        subtitle: 'Conflicts resolved',
        note: 'Rebased on main.',
      },
    },
    {
      type: 'message',
      id: 'msg-33',
      author: 'Farhan',
      time: '2/11/23, 3:10 PM',
      content: 'Localization added.',
      embed: {
        title: 'i18n',
        subtitle: 'New locale',
        note: 'Added es-ES.',
      },
    },
    {
      type: 'message',
      id: 'msg-34',
      author: 'Farhan',
      time: '2/11/23, 3:12 PM',
      content: 'Analytics pipeline stable.',
      embed: {
        title: 'Analytics',
        subtitle: 'Pipeline stable',
        note: 'Latency normal.',
      },
    },
    {
      type: 'message',
      id: 'msg-35',
      author: 'Farhan',
      time: '2/11/23, 3:14 PM',
      content: 'Load test completed.',
      embed: {
        title: 'Load test',
        subtitle: 'Results good',
        note: 'P95 under target.',
      },
    },
    {
      type: 'message',
      id: 'msg-36',
      author: 'Farhan',
      time: '2/11/23, 3:16 PM',
      content: 'SSL renewed.',
      embed: {
        title: 'SSL',
        subtitle: 'Renewed',
        note: 'Valid for 1 year.',
      },
    },
    {
      type: 'message',
      id: 'msg-37',
      author: 'Farhan',
      time: '2/11/23, 3:18 PM',
      content: 'Sentry alerts configured.',
      embed: {
        title: 'Monitoring',
        subtitle: 'Sentry alerts',
        note: 'New alert rules.',
      },
    },
    {
      type: 'message',
      id: 'msg-38',
      author: 'Farhan',
      time: '2/11/23, 3:20 PM',
      content: 'New onboarding guide.',
      embed: {
        title: 'Docs',
        subtitle: 'Onboarding',
        note: 'Shared in wiki.',
      },
    },
    {
      type: 'message',
      id: 'msg-39',
      author: 'Farhan',
      time: '2/11/23, 3:22 PM',
      content: 'Cleanup tasks finished.',
      embed: {
        title: 'Maintenance',
        subtitle: 'Cleanup',
        note: 'Archived old branches.',
      },
    },
    {
      type: 'message',
      id: 'msg-40',
      author: 'Farhan',
      time: '2/11/23, 3:24 PM',
      content: 'Feature demo recorded.',
      embed: {
        title: 'Demo',
        subtitle: 'Recording ready',
        note: 'Link in drive.',
      },
    },
    {
      type: 'message',
      id: 'msg-41',
      author: 'Farhan',
      time: '2/11/23, 3:26 PM',
      content: 'Service health green.',
      embed: {
        title: 'Status',
        subtitle: 'All green',
        note: 'No incidents.',
      },
    },
    {
      type: 'message',
      id: 'msg-42',
      author: 'Farhan',
      time: '2/11/23, 3:28 PM',
      content: 'Scheduler optimized.',
      embed: {
        title: 'Scheduler',
        subtitle: 'Optimized',
        note: 'Reduced delays.',
      },
    },
    {
      type: 'message',
      id: 'msg-43',
      author: 'Farhan',
      time: '2/11/23, 3:30 PM',
      content: 'New report available.',
      embed: {
        title: 'Report',
        subtitle: 'Weekly report',
        note: 'See dashboard.',
      },
    },
    {
      type: 'message',
      id: 'msg-44',
      author: 'Farhan',
      time: '2/11/23, 3:32 PM',
      content: 'Queue depth normal.',
      embed: {
        title: 'Queue',
        subtitle: 'Normal',
        note: 'No throttling.',
      },
    },
    {
      type: 'message',
      id: 'msg-45',
      author: 'Farhan',
      time: '2/11/23, 3:34 PM',
      content: 'Feature toggled on.',
      embed: {
        title: 'Feature',
        subtitle: 'Enabled',
        note: 'Gradual rollout.',
      },
    },
    {
      type: 'message',
      id: 'msg-46',
      author: 'Farhan',
      time: '2/11/23, 3:36 PM',
      content: 'Backup completed.',
      embed: {
        title: 'Backup',
        subtitle: 'Completed',
        note: 'Snapshot stored.',
      },
    },
    {
      type: 'message',
      id: 'msg-47',
      author: 'Farhan',
      time: '2/11/23, 3:38 PM',
      content: 'Database vacuumed.',
      embed: {
        title: 'Database',
        subtitle: 'Maintenance',
        note: 'Vacuum complete.',
      },
    },
    {
      type: 'message',
      id: 'msg-48',
      author: 'Farhan',
      time: '2/11/23, 3:40 PM',
      content: 'Feature A/B test live.',
      embed: {
        title: 'Experiment',
        subtitle: 'A/B test',
        note: 'Monitoring impact.',
      },
    },
    {
      type: 'message',
      id: 'msg-49',
      author: 'Farhan',
      time: '2/11/23, 3:42 PM',
      content: 'Router rules tuned.',
      embed: {
        title: 'Networking',
        subtitle: 'Rules tuned',
        note: 'Lower latency.',
      },
    },
    {
      type: 'message',
      id: 'msg-50',
      author: 'Farhan',
      time: '2/11/23, 3:44 PM',
      content: 'Images optimized.',
      embed: {
        title: 'Assets',
        subtitle: 'Optimized',
        note: 'Smaller bundle size.',
      },
    },
    {
      type: 'message',
      id: 'msg-51',
      author: 'Farhan',
      time: '2/11/23, 3:46 PM',
      content: 'New webhook added.',
      embed: {
        title: 'Webhook',
        subtitle: 'Added',
        note: 'Event delivery ok.',
      },
    },
    {
      type: 'message',
      id: 'msg-52',
      author: 'Farhan',
      time: '2/11/23, 3:48 PM',
      content: 'Alert thresholds tuned.',
      embed: {
        title: 'Alerts',
        subtitle: 'Tuned',
        note: 'Reduced noise.',
      },
    },
    {
      type: 'message',
      id: 'msg-53',
      author: 'Farhan',
      time: '2/11/23, 3:50 PM',
      content: 'Release candidate built.',
      embed: {
        title: 'Release',
        subtitle: 'RC ready',
        note: 'QA starting.',
      },
    },
    {
      type: 'message',
      id: 'msg-54',
      author: 'Farhan',
      time: '2/11/23, 3:52 PM',
      content: 'New integration tested.',
      embed: {
        title: 'Integration',
        subtitle: 'Tested',
        note: 'All checks pass.',
      },
    },
    {
      type: 'message',
      id: 'msg-55',
      author: 'Farhan',
      time: '2/11/23, 3:54 PM',
      content: 'Rate limits updated.',
      embed: {
        title: 'Limits',
        subtitle: 'Updated',
        note: 'See config.',
      },
    },
    {
      type: 'message',
      id: 'msg-56',
      author: 'Farhan',
      time: '2/11/23, 3:56 PM',
      content: 'Feature flag cleanup.',
      embed: {
        title: 'Cleanup',
        subtitle: 'Flags removed',
        note: 'Deprecated flags.',
      },
    },
    {
      type: 'message',
      id: 'msg-57',
      author: 'Farhan',
      time: '2/11/23, 3:58 PM',
      content: 'Latency report posted.',
      embed: {
        title: 'Report',
        subtitle: 'Latency',
        note: 'Shared in channel.',
      },
    },
    {
      type: 'message',
      id: 'msg-58',
      author: 'Farhan',
      time: '2/11/23, 4:00 PM',
      content: 'User cohort analysis.',
      embed: {
        title: 'Analytics',
        subtitle: 'Cohort',
        note: 'Insights pending.',
      },
    },
    {
      type: 'message',
      id: 'msg-59',
      author: 'Farhan',
      time: '2/11/23, 4:02 PM',
      content: 'Release approved.',
      embed: {
        title: 'Release',
        subtitle: 'Approved',
        note: 'Deploy scheduled.',
      },
    },
    {
      type: 'message',
      id: 'msg-60',
      author: 'Farhan',
      time: '2/11/23, 4:04 PM',
      content: 'Postmortem drafted.',
      embed: {
        title: 'Postmortem',
        subtitle: 'Draft ready',
        note: 'Please review.',
      },
    },
    { type: 'date', id: 'date-2026-02-28', label: 'February 28, 2026' },
    {
      type: 'call',
      id: 'call-1',
      icon: '📞',
      text: 'Farhan started a call that lasted a few seconds.',
      time: '7:27 PM',
    },
  ]
  return (
    <div className="flex h-screen flex-col bg-white text-slate-900 dark:bg-black/20 dark:text-white/90">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-pink-500/80" />
          <div>
            <div className="text-sm font-semibold">farhanbantulm1</div>
            <div className="text-xs text-slate-500 dark:text-white/50">
              farhanbantulm1
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-white/60">
          <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
            <Phone className="h-4 w-4" />
          </button>
          <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
            <Video className="h-4 w-4" />
          </button>
          <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
            <Search className="h-4 w-4" />
          </button>
          <button className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col px-4 py-6">
          <MessageList messages={messages} />

          <div className="px-4 pb-6 pt-2">
            <InputGroup className="bg-slate-100 dark:bg-white/[0.07] border-transparent rounded-lg shadow-none h-11">
              <InputGroupAddon>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-400/30 hover:bg-slate-400/50 dark:bg-white/20 dark:hover:bg-white/30 text-slate-600 dark:text-white/70 text-lg font-light leading-none">
                  +
                </button>
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Message @farhanbantulm1"
                className="text-sm placeholder:text-slate-400 dark:placeholder:text-white/30 text-slate-900 dark:text-white"
              />
              <InputGroupAddon align="inline-end">
                <div className="flex items-center gap-1 text-slate-400 dark:text-white/40">
                  <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-white/10 text-base">
                    🎁
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-white/10 text-sm font-semibold">
                    GIF
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-white/10 text-base">
                    😊
                  </button>
                </div>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <aside className="w-72 border-l border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/30 lg:hidden">
          <div className="rounded-lg bg-pink-500/80 p-6 text-center">
            <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-white/90" />
            <div className="text-sm font-semibold">farhanbantulm1</div>
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600 dark:border-white/10 dark:bg-black/40 dark:text-white/60">
            <div className="text-[10px] uppercase text-slate-400 dark:text-white/40">
              Member Since
            </div>
            <div className="mt-2">Feb 2, 2023</div>
          </div>
          <button className="mt-4 w-full rounded-md bg-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-300 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20">
            View Full Profile
          </button>
        </aside>
      </div>
    </div>
  )
}
