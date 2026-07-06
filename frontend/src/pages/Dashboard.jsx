import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  TicketIcon, 
  PlusIcon, 
  UserCircleIcon,
  HeartIcon,
  ChevronRightIcon,
  
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const isHost = user?.role === 'admin';
  const displayName = user?.first_name || user?.username || 'Friend';
  const roleLabel = isHost ? 'Event Host' : 'Attendee';

  const stats = isHost
    ? [
        { name: 'Events Hosted', value: '0', icon: CalendarIcon, colorClass: 'metric-primary' },
        { name: 'Confirmed Bookings', value: '0', icon: TicketIcon, colorClass: 'metric-secondary' },
        { name: 'Active Listings', value: '0', icon: HeartIcon, colorClass: 'metric-accent' },
      ]
    : [
        { name: 'Saved Events', value: '0', icon: HeartIcon, colorClass: 'metric-accent' },
        { name: 'Upcoming Tickets', value: '0', icon: TicketIcon, colorClass: 'metric-secondary' },
        { name: 'Event Invitations', value: '0', icon: CalendarIcon, colorClass: 'metric-primary' },
      ];

  const quickActions = isHost
    ? [
        { label: 'Create event', to: '/events/create', icon: PlusIcon },
        { label: 'Manage bookings', to: '/bookings', icon: TicketIcon },
        { label: 'Edit profile', to: '/profile/edit', icon: UserCircleIcon },
      ]
    : [
        { label: 'Browse events', to: '/events', icon: HeartIcon },
        { label: 'My bookings', to: '/bookings', icon: TicketIcon },
        { label: 'Update profile', to: '/profile/edit', icon: UserCircleIcon },
      ];

    const overviewCards = [
      {
        title: isHost ? 'Live ticket sales' : 'Saved favorites',
        desc: isHost ? 'Monitor the latest orders and attendee interest.' : 'Keep your top events ready for easy booking.'
      },
      {
        title: isHost ? 'Attendee messages' : 'Upcoming schedule',
        desc: isHost ? 'Reply quickly to event requests and questions.' : 'Review the events you plan to attend.'
      },
      {
        title: isHost ? 'Venue status' : 'Latest recommendations',
        desc: isHost ? 'Check venue availability and event readiness.' : 'Discover new events matched to your interests.'
      },
      {
        title: isHost ? 'Event growth' : 'Booking reminders',
        desc: isHost ? 'See which event categories are gaining more traction.' : 'Stay on top of event dates and ticket deadlines.'
      }
    ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-500 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] mb-10">
          <section className="rounded-[2rem] overflow-hidden bg-[var(--surface)] shadow-2xl p-8 text-[var(--text-primary)] relative border border-[color:var(--border)]">
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{background: 'radial-gradient(circle at top left, rgba(var(--accent-rgb), 0.22), transparent 24%), radial-gradient(circle at bottom right, rgba(var(--primary-rgb), 0.18), transparent 30%)'}} />
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-muted)] opacity-90">Welcome back</p>
              <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight">Good {isHost ? 'morning' : 'evening'}, {displayName}</h1>
              <p className="mt-4 max-w-2xl text-sm text-[var(--text-secondary)] leading-relaxed">
                {isHost
                  ? 'Manage your hosted events, review booking insights, and keep your attendees delighted from one place.'
                  : 'See your upcoming plans, explore the best events nearby, and keep your favorites ready for checkout.'}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-[var(--surface-elevated)] border border-[color:var(--border)] p-5 shadow-lg shadow-[color:rgba(15,23,36,0.16)]">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Role</p>
                  <p className="mt-3 text-xl font-bold text-[var(--text-primary)]">{roleLabel}</p>
                </div>
                <div className="rounded-3xl bg-[color:rgba(255,255,255,0.04)] border border-[color:var(--border)] p-5 shadow-lg shadow-[color:rgba(15,23,36,0.12)]">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">Recommended next step</p>
                  <p className="mt-3 text-xl font-bold text-[var(--text-primary)]">{isHost ? 'Publish a new event' : 'Book your next ticket'}</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-[var(--surface)] border border-[color:var(--border)] p-6 shadow-xl">
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">Instant summary</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-3xl border border-[color:var(--border)] bg-[var(--surface-soft)] p-4">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Active goals</span>
                  <span className="text-xs font-black text-[var(--primary)]">4</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl border border-[color:var(--border)] bg-[var(--surface-soft)] p-4">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">New alerts</span>
                  <span className="text-xs font-black text-[var(--success)]">2</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl border border-[color:var(--border)] bg-[var(--surface-soft)] p-4">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Next action</span>
                  <span className="text-xs font-black text-[var(--primary)]">Review now</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[var(--surface)] border border-[color:var(--border)] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">Need help?</h2>
                <span className="text-xs font-semibold text-[var(--primary)]">Quick tips</span>
              </div>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li>Use filters on the events page to find the perfect category.</li>
                <li>Keep your profile updated so attendees can connect with you quickly.</li>
                <li>Tap the quick links to finish tasks faster.</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Stats Grid (single polished set retained below) */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-10">
          {stats.map((item) => (
            <div key={item.name} className="rounded-3xl bg-[var(--surface)] border border-[color:var(--border)] shadow-lg p-6 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className={`rounded-3xl p-3 ${item.colorClass}`}>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">{item.name}</span>
              </div>
              <p className="mt-6 text-4xl font-black text-[var(--text-primary)]">{item.value}</p>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">{isHost ? 'Track your latest event metrics and attendee interest.' : 'Quick overview of your event activity and saved ideas.'}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <main className="space-y-8">
            <section className="rounded-3xl bg-[var(--surface)] border border-[color:var(--border)] shadow-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{isHost ? 'Host dashboard actions' : 'Your next steps'}</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    {isHost
                      ? 'Everything you need to manage events, attendees, and venue planning.'
                      : 'Stay on top of events you like and the bookings you have lined up.'}
                  </p>
                </div>
                <Link
                  to={isHost ? '/events/create' : '/events'}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-black text-[var(--text-primary)] uppercase tracking-[0.24em] transition-all hover:bg-[var(--primary-hover)]"
                >
                  {isHost ? 'Create Event' : 'Explore Events'}
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {overviewCards.map((c, i) => (
                  <article key={i} className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface-soft)] p-5">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{c.title}</h3>
                    <p className="mt-3 text-sm text-[var(--text-secondary)]">{c.desc}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-[var(--surface)] border border-[color:var(--border)] shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Recent activity</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Latest updates from your account and events.</p>
                </div>
                <button className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--primary)] hover:underline">View full log</button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{isHost ? 'No new event updates yet.' : 'No activity available yet.'}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{isHost ? 'Create or publish an event to see booking activity here.' : 'Explore events and book tickets to populate this feed.'}</p>
                </div>
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-[var(--surface)] border border-[color:var(--border)] shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">Top actions</h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Fast links for the tasks you use most.</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex items-center justify-between rounded-3xl border border-[color:var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-secondary)] hover:bg-[color:rgba(var(--primary-rgb),0.08)] transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <action.icon className="h-4 w-4 text-[var(--primary)]" />
                      {action.label}
                    </span>
                    <ChevronRightIcon className="h-4 w-4 text-[var(--text-muted)]" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[var(--surface)] border border-[color:var(--border)] shadow-lg p-6">
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">Helpful resources</h2>
              <ul className="mt-5 space-y-3 text-sm text-[var(--text-secondary)]">
                <li className="rounded-3xl bg-[var(--surface-soft)] p-4">Use filters on the events page to find the perfect category.</li>
                <li className="rounded-3xl bg-[var(--surface-soft)] p-4">Update your profile so attendees can connect with you easily.</li>
                <li className="rounded-3xl bg-[var(--surface-soft)] p-4">Switch to premium when you want advanced attendee analytics.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;