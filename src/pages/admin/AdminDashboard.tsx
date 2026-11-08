import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Clock3,
  Code2,
  FileText,
  Inbox,
  MessageSquare,
  Plus,
  RefreshCw,
  Settings2,
  Star,
  Users,
} from 'lucide-react';
import { supabase, type ContactMessage } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { useRouter } from '@/lib/router';

type DashboardData = {
  counts: {
    projects: number;
    services: number;
    team: number;
    testimonials: number;
    blog: number;
    messages: number;
    unreadMessages: number;
  };
  monthlyMessages: { key: string; label: string; count: number }[];
  recentMessages: ContactMessage[];
};

const MONTHS_TO_SHOW = 6;

function monthRange(offset: number) {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  date.setMonth(date.getMonth() + offset);
  const start = date.toISOString();
  const endDate = new Date(date);
  endDate.setMonth(endDate.getMonth() + 1);
  return {
    start,
    end: endDate.toISOString(),
    key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
    label: date.toLocaleDateString(undefined, { month: 'short' }),
  };
}

function formatRelativeDate(value: string) {
  const date = new Date(value);
  const elapsed = Date.now() - date.getTime();
  if (elapsed < 60_000) return 'Just now';
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)}m ago`;
  if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)}h ago`;
  if (elapsed < 7 * 86_400_000) return `${Math.floor(elapsed / 86_400_000)}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function compactNumber(value: number) {
  return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const { navigate } = useRouter();
  const { settings } = useTheme();
  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
  const headingFont = settings?.font_heading || 'Space Grotesk';
  const hf = `'${headingFont}', sans-serif`;

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const monthRanges = Array.from({ length: MONTHS_TO_SHOW }, (_, index) =>
        monthRange(index - (MONTHS_TO_SHOW - 1)),
      );
      const [
        projects,
        services,
        team,
        testimonials,
        blog,
        messages,
        unread,
        recentMessages,
        ...monthlyResults
      ] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(8),
        ...monthRanges.map(({ start, end }) =>
          supabase
            .from('contact_messages')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', start)
            .lt('created_at', end),
        ),
      ]);

      const failedResult = [
        projects,
        services,
        team,
        testimonials,
        blog,
        messages,
        unread,
        recentMessages,
        ...monthlyResults,
      ].find((result) => result.error);
      if (failedResult?.error) throw failedResult.error;

      setData({
        counts: {
          projects: projects.count ?? 0,
          services: services.count ?? 0,
          team: team.count ?? 0,
          testimonials: testimonials.count ?? 0,
          blog: blog.count ?? 0,
          messages: messages.count ?? 0,
          unreadMessages: unread.count ?? 0,
        },
        monthlyMessages: monthRanges.map((range, index) => ({
          ...range,
          count: monthlyResults[index].count ?? 0,
        })),
        recentMessages: (recentMessages.data ?? []) as ContactMessage[],
      });
      setRefreshedAt(new Date());
    } catch (loadError) {
      console.error('Failed to load admin dashboard:', loadError);
      setError(loadError instanceof Error ? loadError.message : 'Dashboard data could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const totalContent = data
    ? data.counts.projects + data.counts.services + data.counts.team + data.counts.testimonials + data.counts.blog
    : 0;
  const messageTotal = useMemo(
    () => data?.monthlyMessages.reduce((sum, month) => sum + month.count, 0) ?? 0,
    [data],
  );
  const contentMix = data
    ? [
        { label: 'Projects', count: data.counts.projects, icon: Briefcase, color: primary, to: '/admin/projects' },
        { label: 'Services', count: data.counts.services, icon: Code2, color: accent, to: '/admin/services' },
        { label: 'Blog posts', count: data.counts.blog, icon: BookOpen, color: '#a78bfa', to: '/admin/blog' },
        { label: 'Team members', count: data.counts.team, icon: Users, color: '#34d399', to: '/admin/team' },
        { label: 'Testimonials', count: data.counts.testimonials, icon: Star, color: '#fbbf24', to: '/admin/testimonials' },
      ]
    : [];

  const kpis = data
    ? [
        {
          label: 'Portfolio projects',
          value: data.counts.projects,
          note: 'Across your portfolio',
          icon: Briefcase,
          color: primary,
          to: '/admin/projects',
        },
        {
          label: 'Services',
          value: data.counts.services,
          note: 'In your service list',
          icon: Code2,
          color: accent,
          to: '/admin/services',
        },
        {
          label: 'Team members',
          value: data.counts.team,
          note: 'In your team directory',
          icon: Users,
          color: '#34d399',
          to: '/admin/team',
        },
        {
          label: 'Unread messages',
          value: data.counts.unreadMessages,
          note: `${compactNumber(data.counts.messages)} total received`,
          icon: Inbox,
          color: data.counts.unreadMessages > 0 ? '#fb7185' : '#34d399',
          to: '/admin/messages',
        },
      ]
    : [];

  return (
    <div className="admin-dashboard space-y-6 sm:space-y-8">
      <section className="dashboard-enter flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium" style={{ color: accent }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
            Operations overview
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ fontFamily: hf }}>
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Your content, conversations, and recent activity at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {refreshedAt && (
            <span className="hidden text-xs text-gray-500 sm:inline">
              Updated {refreshedAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
            </span>
          )}
          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={loading}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-gray-200 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200 sm:flex-row sm:items-center sm:justify-between">
          <span>Dashboard data could not be loaded: {error}</span>
          <button type="button" onClick={() => void loadDashboard()} className="font-semibold underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      <section aria-label="Key performance indicators" className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {loading && !data
          ? Array.from({ length: 4 }, (_, index) => <KpiSkeleton key={index} />)
          : kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <button
                  type="button"
                  key={kpi.label}
                  onClick={() => navigate(kpi.to)}
                  className="dashboard-enter dashboard-panel group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.045] sm:p-6"
                  style={{ animationDelay: `${index * 65}ms` }}
                >
                  <div className="pointer-events-none absolute -right-7 -top-8 h-28 w-28 rounded-full opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-20" style={{ backgroundColor: kpi.color }} />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="text-sm font-medium text-gray-400">{kpi.label}</span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10" style={{ color: kpi.color, backgroundColor: `${kpi.color}12` }}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="relative mt-5 flex items-end justify-between gap-3">
                    <span className="text-3xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl" style={{ fontFamily: hf }}>
                      {loading ? <span className="text-gray-500">…</span> : compactNumber(kpi.value)}
                    </span>
                    <span className="mb-1 inline-flex items-center gap-1 text-xs text-gray-500 transition-colors group-hover:text-gray-300">
                      View details <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{kpi.note}</p>
                </button>
              );
            })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
        <div className="dashboard-panel min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white" style={{ fontFamily: hf }}>Inbox activity</h3>
              <p className="mt-1 text-sm text-gray-500">Messages received over the last six months</p>
            </div>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-right">
              <span className="block text-lg font-semibold tabular-nums text-white">{compactNumber(messageTotal)}</span>
              <span className="text-[11px] text-gray-500">in this period</span>
            </div>
          </div>
          {data ? (
            <MessageChart data={data.monthlyMessages} color={primary} />
          ) : (
            <ChartSkeleton />
          )}
        </div>

        <div className="dashboard-panel min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white" style={{ fontFamily: hf }}>Content library</h3>
              <p className="mt-1 text-sm text-gray-500">A snapshot of what you manage</p>
            </div>
            <span className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-right">
              <span className="block text-lg font-semibold tabular-nums text-white">{compactNumber(totalContent)}</span>
              <span className="text-[11px] text-gray-500">total items</span>
            </span>
          </div>
          {data ? (
            <div className="mt-6 space-y-4">
              {contentMix.map((item, index) => {
                const Icon = item.icon;
                const percentage = totalContent ? (item.count / totalContent) * 100 : 0;
                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => navigate(item.to)}
                    className="group w-full text-left"
                  >
                    <span className="mb-2 flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2 text-sm text-gray-300">
                        <Icon className="h-4 w-4 shrink-0" style={{ color: item.color }} />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <span className="text-sm tabular-nums text-gray-400">{compactNumber(item.count)}</span>
                    </span>
                    <span className="block h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <span
                        className="block h-full rounded-full transition-[width] duration-700 ease-out"
                        style={{ width: `${percentage}%`, backgroundColor: item.color, transitionDelay: `${index * 55}ms` }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <ChartSkeleton />
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)]">
        <div className="dashboard-panel min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-5 sm:px-6">
            <div>
              <h3 className="text-base font-semibold text-white" style={{ fontFamily: hf }}>Recent inbox history</h3>
              <p className="mt-1 text-sm text-gray-500">The latest conversations from your website</p>
            </div>
            <button type="button" onClick={() => navigate('/admin/messages')} className="inline-flex items-center gap-1.5 text-sm font-medium transition hover:gap-2.5" style={{ color: primary }}>
              Open inbox <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {!data && loading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-12 animate-pulse rounded-lg bg-white/[0.04]" />)}
            </div>
          ) : data?.recentMessages.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="text-[11px] uppercase tracking-[0.12em] text-gray-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium sm:px-6">Sender</th>
                    <th scope="col" className="px-4 py-3 font-medium">Subject</th>
                    <th scope="col" className="px-4 py-3 font-medium">Received</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium sm:px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {data.recentMessages.map((message, index) => (
                    <tr
                      key={message.id}
                      className="dashboard-row transition-colors hover:bg-white/[0.035]"
                      style={{ animationDelay: `${index * 45}ms` }}
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <button
                          type="button"
                          aria-label={`Open inbox for ${message.name}`}
                          onClick={() => navigate('/admin/messages')}
                          className="max-w-[190px] truncate text-left font-medium text-gray-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400"
                        >
                          {message.name}
                        </button>
                        <div className="mt-1 max-w-[190px] truncate text-xs text-gray-500">{message.email}</div>
                      </td>
                      <td className="max-w-[230px] truncate px-4 py-4 text-gray-400">{message.subject}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-gray-500" title={new Date(message.created_at).toLocaleString()}>
                        {formatRelativeDate(message.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right sm:px-6">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${message.is_read ? 'bg-white/[0.05] text-gray-400' : 'bg-orange-400/10 text-orange-300'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${message.is_read ? 'bg-gray-500' : 'bg-orange-400'}`} />
                          {message.is_read ? 'Read' : 'New'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <MessageSquare className="mx-auto h-7 w-7 text-gray-600" />
              <p className="mt-3 text-sm text-gray-400">No messages yet</p>
              <p className="mt-1 text-xs text-gray-600">New website inquiries will appear here.</p>
            </div>
          )}
          {error && !data && <p className="px-6 pb-5 text-sm text-gray-500">History is unavailable until dashboard data loads.</p>}
        </div>

        <div className="dashboard-panel rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white" style={{ fontFamily: hf }}>Quick actions</h3>
              <p className="mt-1 text-sm text-gray-500">Jump straight into your next task</p>
            </div>
            <Settings2 className="h-5 w-5 text-gray-500" />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-2">
            <QuickAction icon={Plus} label="Add a project" detail="Showcase recent work" color={primary} onClick={() => navigate('/admin/projects')} />
            <QuickAction icon={FileText} label="Write a blog post" detail="Share an update or insight" color="#a78bfa" onClick={() => navigate('/admin/blog')} />
            <QuickAction icon={Inbox} label="Review messages" detail={data ? `${data.counts.unreadMessages} unread` : 'Open your inbox'} color="#fb7185" onClick={() => navigate('/admin/messages')} />
            <QuickAction icon={Settings2} label="Update site settings" detail="Brand, contact, and theme" color={accent} onClick={() => navigate('/admin/settings')} />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs text-gray-500">
            <span className="inline-flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" /> Content managed</span>
            <button type="button" onClick={() => navigate('/admin/pages')} className="inline-flex items-center gap-1 font-medium text-gray-300 hover:text-white">
              Manage pages <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {error && data && <p role="status" className="text-xs text-gray-500">Some dashboard information may be out of date. Refresh to try again.</p>}
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6" aria-hidden="true">
      <div className="flex items-start justify-between">
        <div className="h-4 w-28 animate-pulse rounded bg-white/[0.07]" />
        <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.07]" />
      </div>
      <div className="mt-5 h-9 w-20 animate-pulse rounded bg-white/[0.07]" />
      <div className="mt-2 h-3 w-36 animate-pulse rounded bg-white/[0.05]" />
    </div>
  );
}

function ChartSkeleton() {
  return <div className="mt-7 h-48 animate-pulse rounded-lg bg-white/[0.035]" aria-label="Loading chart" />;
}

function MessageChart({ data, color }: { data: DashboardData['monthlyMessages']; color: string }) {
  const width = 640;
  const height = 190;
  const padding = { top: 18, right: 12, bottom: 30, left: 30 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(4, ...data.map((item) => item.count));
  const step = maxValue <= 8 ? 2 : Math.ceil(maxValue / 4);
  const ticks = Array.from({ length: Math.floor(maxValue / step) + 1 }, (_, index) => index * step);
  if (ticks[ticks.length - 1] < maxValue) ticks.push(ticks[ticks.length - 1] + step);
  const points = data.map((item, index) => {
    const x = padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding.top + chartHeight - (item.count / Math.max(ticks[ticks.length - 1], 1)) * chartHeight;
    return { ...item, x, y };
  });
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${path} L ${points[points.length - 1]?.x ?? padding.left} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  return (
    <div className="mt-5 w-full">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Website messages received by month over the last six months" className="w-full overflow-visible">
        <defs>
          <linearGradient id="dashboard-chart-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {ticks.map((tick) => {
          const y = padding.top + chartHeight - (tick / Math.max(ticks[ticks.length - 1], 1)) * chartHeight;
          return (
            <g key={tick}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 5" />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" fill="#6b7280" fontSize="10">{tick}</text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#dashboard-chart-fill)" />
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="dashboard-chart-line" />
        {points.map((point) => (
          <g key={point.key} className="dashboard-chart-point">
            <title>{`${point.label}: ${point.count} messages`}</title>
            <circle cx={point.x} cy={point.y} r="8" fill={color} opacity="0.12" />
            <circle cx={point.x} cy={point.y} r="3.5" fill="#0b0b12" stroke={color} strokeWidth="2" />
            <text x={point.x} y={height - 7} textAnchor="middle" fill="#8b909b" fontSize="11">{point.label}</text>
          </g>
        ))}
      </svg>
      <p className="sr-only">{data.map((item) => `${item.label}: ${item.count} messages`).join('. ')}</p>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  detail,
  color,
  onClick,
}: {
  icon: typeof Plus;
  label: string;
  detail: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-w-0 items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition hover:border-white/[0.07] hover:bg-white/[0.035]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.07]" style={{ color, backgroundColor: `${color}12` }}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-gray-200">{label}</span>
        <span className="mt-0.5 block truncate text-xs text-gray-500">{detail}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-gray-300" />
    </button>
  );
}
