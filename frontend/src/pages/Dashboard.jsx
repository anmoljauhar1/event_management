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
        { name: 'Events Hosted', value: '0', icon: CalendarIcon, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
        { name: 'Confirmed Bookings', value: '0', icon: TicketIcon, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30' },
        { name: 'Active Listings', value: '0', icon: HeartIcon, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-950/30' },
      ]
    : [
        { name: 'Saved Events', value: '0', icon: HeartIcon, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-950/30' },
        { name: 'Upcoming Tickets', value: '0', icon: TicketIcon, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30' },
        { name: 'Event Invitations', value: '0', icon: CalendarIcon, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] mb-10">
          <section className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 shadow-2xl p-8 text-white relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.4),_transparent_38%)] pointer-events-none" />
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300 opacity-80">Welcome back</p>
              <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight">Good {isHost ? 'morning' : 'evening'}, {displayName}</h1>
              <p className="mt-4 max-w-2xl text-sm text-slate-300 leading-relaxed">
                {isHost
                  ? 'Manage your hosted events, review booking insights, and keep your attendees delighted from one place.'
                  : 'See your upcoming plans, explore the best events nearby, and keep your favorites ready for checkout.'}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 shadow-lg shadow-slate-950/20">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Role</p>
                  <p className="mt-3 text-xl font-bold text-white">{roleLabel}</p>
                </div>
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5 shadow-lg shadow-slate-950/10">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Recommended next step</p>
                  <p className="mt-3 text-xl font-bold text-white">{isHost ? 'Publish a new event' : 'Book your next ticket'}</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-xl">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Instant summary</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/70 p-4">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Active goals</span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">4</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/70 p-4">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">New alerts</span>
                  <span className="text-xs font-black text-green-600 dark:text-green-400">2</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/70 p-4">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Next action</span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">Review now</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Need help?</h2>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Quick tips</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-slate-300">
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
            <div key={item.name} className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-lg p-6 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className={`rounded-3xl p-3 ${item.bg}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">{item.name}</span>
              </div>
              <p className="mt-6 text-4xl font-black text-gray-900 dark:text-white">{item.value}</p>
              <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">{isHost ? 'Track your latest event metrics and attendee interest.' : 'Quick overview of your event activity and saved ideas.'}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <main className="space-y-8">
            <section className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isHost ? 'Host dashboard actions' : 'Your next steps'}</h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                    {isHost
                      ? 'Everything you need to manage events, attendees, and venue planning.'
                      : 'Stay on top of events you like and the bookings you have lined up.'}
                  </p>
                </div>
                <Link
                  to={isHost ? '/events/create' : '/events'}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-xs font-black text-white uppercase tracking-[0.24em] transition-all hover:bg-indigo-700"
                >
                  {isHost ? 'Create Event' : 'Explore Events'}
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {overviewCards.map((c, i) => (
                  <article key={i} className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{c.title}</h3>
                    <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">{c.desc}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent activity</h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Latest updates from your account and events.</p>
                </div>
                <button className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-400 hover:underline">View full log</button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{isHost ? 'No new event updates yet.' : 'No activity available yet.'}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{isHost ? 'Create or publish an event to see booking activity here.' : 'Explore events and book tickets to populate this feed.'}</p>
                </div>
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Top actions</h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Fast links for the tasks you use most.</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex items-center justify-between rounded-3xl border border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-4 text-sm text-gray-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-900 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <action.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      {action.label}
                    </span>
                    <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-lg p-6">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Helpful resources</h2>
              <ul className="mt-5 space-y-3 text-sm text-gray-600 dark:text-slate-300">
                <li className="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">Use filters on the events page to find the perfect category.</li>
                <li className="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">Update your profile so attendees can connect with you easily.</li>
                <li className="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">Switch to premium when you want advanced attendee analytics.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;