import './index.css'

const projects = [
  {
    title: 'PfumaFlow',
    summary:
      'A digital liquidity infrastructure platform designed to solve delayed payment cycles in Zimbabwe and African supply chains. The system connects farmers, pharmacies, clinics, retailers, and investors through invoice factoring, real-time funding, investor marketplaces, AI risk scoring, and mobile money integrations to unlock working capital and stabilize operations.',
  },
  {
    title: 'MediLink AI',
    summary:
      'A real-time healthcare coordination platform focused on improving access to medical services, supplier coordination, and patient support. The platform enables intelligent healthcare routing, digital communication between clinics and suppliers, emergency response coordination, and operational healthcare analytics.',
  },
  {
    title: 'Pfuma Pamwe',
    summary:
      'A collaborative digital financial ecosystem built around shared economic empowerment, community savings, cooperative finance, and financial inclusion. The system focuses on enabling accessible financial participation and digitally coordinated community-driven funding models.',
  },
  {
    title: 'CyberSafe AI',
    summary:
      'An AI-driven cybersecurity and fraud intelligence platform designed to monitor suspicious activity, analyze behavioral anomalies, detect fraud patterns, and provide real-time digital security insights for fintech and enterprise systems.',
  },
  {
    title: 'EngineerNet',
    summary:
      'A technical collaboration ecosystem connecting engineers, innovators, and builders through shared project coordination, engineering knowledge exchange, innovation management, and digital technical networking infrastructure.',
  },
  {
    title: 'ZimSmart Wallet',
    summary:
      'A localized digital payment and wallet ecosystem designed to improve financial accessibility through mobile payments, digital wallet services, transaction management, and localized fintech infrastructure integration.',
  },
  {
    title: 'FinNexus Borrower-to-Lender',
    summary:
      'A borrower-to-investor financial marketplace that digitally connects lenders and borrowers through trust scoring, alternative lending systems, investment matching, and decentralized financial participation models.',
  },
  {
    title: 'AI Bank Kiosk',
    summary:
      'A smart AI-assisted banking kiosk platform that modernizes banking experiences through conversational finance, intelligent customer interaction systems, digital branch automation, and self-service financial operations.',
  },
  {
    title: 'Dzidzo.NET',
    summary:
      'A smart digital education ecosystem focused on improving academic accessibility, student collaboration, and institutional connectivity. The platform is designed to support online learning, academic resource sharing, student performance tracking, virtual classrooms, assignment management, and intelligent educational networking for schools, colleges, and universities across Zimbabwe and Africa.',
  },
]

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="hero-grid">
          <div>
            <p className="hero-kicker">
              Portfolio
            </p>
            <h1 className="hero-title">Prince K Mhizha</h1>
            <p className="hero-summary">
              Building intuitive and reliable digital systems across fintech, healthtech, cybersecurity, education, and engineering collaboration.
            </p>
          </div>
          <img
            src="/profile.jpg"
            alt="Portrait of Prince K Mhizha"
            className="hero-image"
          />
        </div>
      </header>

      <main className="app-main">
        <section id="projects">
          <h2 className="projects-title">Projects</h2>
          <p className="projects-subtitle">All portfolio projects are listed below.</p>

          <div className="projects-grid">
            {projects.map((project) => (
              <article key={project.title} className="project-card">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-summary">{project.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

