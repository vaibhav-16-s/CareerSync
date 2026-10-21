/**
 * Seed demo employers, jobs, and job seekers via local API.
 * Usage: node scripts/seedDemoData.js
 */
const BASE = process.env.API_BASE || "http://localhost:5000/api";
const PASSWORD = "DemoPass@123";

const employers = [
  {
    sector: "Tech",
    name: "NovaSoft Labs",
    email: "hr@novasoftlabs.com",
    contact: "9876501001",
    address: "12 Innovation Park, Bengaluru",
    web: "https://novasoftlabs.com",
    jobs: [
      {
        title: "Full Stack Developer",
        desc: "Build and ship web features across React and Node.js. Collaborate with product and design on customer-facing products.",
        location: "Bengaluru",
        jobType: "Full Time",
        salary: "12-18 LPA",
      },
      {
        title: "DevOps Engineer",
        desc: "Own CI/CD, cloud infrastructure, and monitoring. Improve reliability and deployment speed for SaaS products.",
        location: "Bengaluru / Hybrid",
        jobType: "Full Time",
        salary: "14-20 LPA",
      },
      {
        title: "UI/UX Designer",
        desc: "Design intuitive product experiences, wireframes, and design systems for B2B software.",
        location: "Remote",
        jobType: "Full Time",
        salary: "10-15 LPA",
      },
    ],
  },
  {
    sector: "Tech",
    name: "PixelForge Systems",
    email: "careers@pixelforge.io",
    contact: "9876501002",
    address: "88 Tech Corridor, Hyderabad",
    web: "https://pixelforge.io",
    jobs: [
      {
        title: "Backend Engineer",
        desc: "Design scalable APIs and data services. Work with microservices, databases, and performance tuning.",
        location: "Hyderabad",
        jobType: "Full Time",
        salary: "13-19 LPA",
      },
      {
        title: "Mobile App Developer",
        desc: "Develop and maintain React Native apps for Android and iOS with focus on performance and UX.",
        location: "Hyderabad / Hybrid",
        jobType: "Full Time",
        salary: "11-16 LPA",
      },
      {
        title: "QA Automation Engineer",
        desc: "Build automated test suites, improve release quality, and partner with engineering on CI pipelines.",
        location: "Hyderabad",
        jobType: "Full Time",
        salary: "9-14 LPA",
      },
    ],
  },
  {
    sector: "Finance",
    name: "Meridian Capital",
    email: "talent@meridiancapital.in",
    contact: "9876502001",
    address: "Nariman Point, Mumbai",
    web: "https://meridiancapital.in",
    jobs: [
      {
        title: "Financial Analyst",
        desc: "Prepare financial models, variance analysis, and board reporting for investment portfolios.",
        location: "Mumbai",
        jobType: "Full Time",
        salary: "8-12 LPA",
      },
      {
        title: "Investment Associate",
        desc: "Support deal sourcing, due diligence, and valuation for private equity and growth investments.",
        location: "Mumbai",
        jobType: "Full Time",
        salary: "12-18 LPA",
      },
      {
        title: "Risk Management Officer",
        desc: "Monitor market and credit risk, maintain risk frameworks, and report to compliance leadership.",
        location: "Mumbai / Hybrid",
        jobType: "Full Time",
        salary: "10-15 LPA",
      },
    ],
  },
  {
    sector: "Law",
    name: "Ashford & Reed LLP",
    email: "hr@ashfordreed.com",
    contact: "9876503001",
    address: "Connaught Place, New Delhi",
    web: "https://ashfordreed.com",
    jobs: [
      {
        title: "Associate Attorney",
        desc: "Handle corporate and commercial matters, draft agreements, and support client negotiations.",
        location: "New Delhi",
        jobType: "Full Time",
        salary: "9-14 LPA",
      },
      {
        title: "Legal Research Assistant",
        desc: "Conduct case research, prepare briefs, and assist partners with litigation and advisory work.",
        location: "New Delhi",
        jobType: "Full Time",
        salary: "5-8 LPA",
      },
      {
        title: "Corporate Counsel",
        desc: "Advise on company law, compliance, M&A documentation, and governance for corporate clients.",
        location: "New Delhi / Hybrid",
        jobType: "Full Time",
        salary: "15-22 LPA",
      },
    ],
  },
  {
    sector: "Hotel Management",
    name: "Grand Harbor Hotels",
    email: "jobs@grandharborhotels.com",
    contact: "9876504001",
    address: "Marine Drive, Goa",
    web: "https://grandharborhotels.com",
    jobs: [
      {
        title: "Front Desk Manager",
        desc: "Lead front-office operations, guest check-in experience, and team scheduling across shifts.",
        location: "Goa",
        jobType: "Full Time",
        salary: "6-9 LPA",
      },
      {
        title: "Executive Chef",
        desc: "Oversee kitchen operations, menu development, food cost control, and culinary standards.",
        location: "Goa",
        jobType: "Full Time",
        salary: "10-16 LPA",
      },
      {
        title: "Guest Relations Executive",
        desc: "Deliver personalized guest service, resolve escalations, and coordinate VIP stays.",
        location: "Goa",
        jobType: "Full Time",
        salary: "4-7 LPA",
      },
    ],
  },
];

const jobSeekers = [
  {
    sector: "Tech",
    name: "Arjun Mehta",
    email: "arjun.mehta.tech@example.com",
    contact: "9811100001",
    address: "Koramangala, Bengaluru",
    DOB: "1998-04-12",
    gender: "Male",
    qual: "B.Tech Computer Science",
    skills: "JavaScript, React, Node.js, MongoDB",
    Bio: "Full-stack developer focused on modern web apps and APIs.",
  },
  {
    sector: "Law",
    name: "Priya Sharma",
    email: "priya.sharma.law@example.com",
    contact: "9811100002",
    address: "South Extension, New Delhi",
    DOB: "1997-09-21",
    gender: "Female",
    qual: "LL.B.",
    skills: "Contract Drafting, Legal Research, Corporate Law",
    Bio: "Law graduate with interest in corporate and commercial practice.",
  },
  {
    sector: "Hotel Management",
    name: "Rahul Nair",
    email: "rahul.nair.hotel@example.com",
    contact: "9811100003",
    address: "Panaji, Goa",
    DOB: "1996-01-30",
    gender: "Male",
    qual: "B.Sc. Hospitality Management",
    skills: "Front Office, Guest Relations, Hotel Operations",
    Bio: "Hospitality professional with front-desk and guest-service experience.",
  },
  {
    sector: "Finance",
    name: "Sneha Kapoor",
    email: "sneha.kapoor.finance@example.com",
    contact: "9811100004",
    address: "Andheri, Mumbai",
    DOB: "1999-06-08",
    gender: "Female",
    qual: "MBA Finance",
    skills: "Financial Modelling, Excel, Risk Analysis, Valuation",
    Bio: "Finance graduate seeking analyst and investment roles.",
  },
  {
    sector: "Tech",
    name: "Karan Desai",
    email: "karan.desai.tech@example.com",
    contact: "9811100005",
    address: "Whitefield, Bengaluru",
    DOB: "1999-11-15",
    gender: "Male",
    qual: "B.E. Information Technology",
    skills: "Python, Django, PostgreSQL, AWS",
    Bio: "Backend-focused developer with interest in cloud and APIs.",
  },
  {
    sector: "Tech",
    name: "Ananya Iyer",
    email: "ananya.iyer.tech@example.com",
    contact: "9811100006",
    address: "Hitech City, Hyderabad",
    DOB: "2000-03-22",
    gender: "Female",
    qual: "B.Tech Computer Science",
    skills: "TypeScript, React, Next.js, Tailwind",
    Bio: "Frontend developer building accessible and performant web apps.",
  },
];

async function postJson(path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  const summary = {
    employers: [],
    jobsPosted: 0,
    jobSeekers: [],
    errors: [],
  };

  console.log(`Seeding against ${BASE}\n`);

  for (const emp of employers) {
    console.log(`Registering employer [${emp.sector}]: ${emp.name}`);
    const reg = await postJson("/admin/employer_register", {
      name: emp.name,
      email: emp.email,
      contact: emp.contact,
      address: emp.address,
      password: PASSWORD,
      web: emp.web,
    });

    if (!reg.ok && !/already exists/i.test(reg.data.message || "")) {
      summary.errors.push({ type: "employer", email: emp.email, ...reg });
      console.log(`  FAIL (${reg.status}): ${reg.data.message || JSON.stringify(reg.data)}`);
      continue;
    }

    if (/already exists/i.test(reg.data.message || "")) {
      console.log(`  Already exists — will try login & post jobs`);
    } else {
      console.log(`  OK: ${reg.data.message}`);
    }

    const login = await postJson("/home/login", {
      email: emp.email,
      password: PASSWORD,
    });

    if (!login.data?.success || !login.data?.token) {
      summary.errors.push({ type: "login", email: emp.email, ...login });
      console.log(`  Login FAIL: ${login.data?.error || JSON.stringify(login.data)}`);
      continue;
    }

    summary.employers.push({
      sector: emp.sector,
      name: emp.name,
      email: emp.email,
      password: PASSWORD,
    });

    for (const job of emp.jobs) {
      const posted = await postJson(
        "/employer/register-job",
        { ...job, status: "Active" },
        login.data.token
      );

      if (!posted.ok) {
        summary.errors.push({
          type: "job",
          employer: emp.email,
          title: job.title,
          ...posted,
        });
        console.log(`  Job FAIL "${job.title}": ${posted.data.message || JSON.stringify(posted.data)}`);
      } else {
        summary.jobsPosted += 1;
        console.log(`  Job OK: ${job.title}`);
      }
    }
  }

  console.log("\nRegistering job seekers...");
  for (const js of jobSeekers) {
    console.log(`Registering job seeker [${js.sector}]: ${js.name}`);
    const reg = await postJson("/home/jobseeker_register", {
      name: js.name,
      email: js.email,
      contact: js.contact,
      address: js.address,
      password: PASSWORD,
      qual: js.qual,
      skills: js.skills,
      DOB: js.DOB,
      Bio: js.Bio,
      gender: js.gender,
    });

    if (!reg.ok && !/already registered/i.test(reg.data.message || "")) {
      summary.errors.push({ type: "jobseeker", email: js.email, ...reg });
      console.log(`  FAIL (${reg.status}): ${reg.data.message || JSON.stringify(reg.data)}`);
      continue;
    }

    if (/already registered/i.test(reg.data.message || "")) {
      console.log(`  Already exists`);
    } else {
      console.log(`  OK: ${reg.data.message}`);
    }

    summary.jobSeekers.push({
      sector: js.sector,
      name: js.name,
      email: js.email,
      password: PASSWORD,
    });
  }

  console.log("\n========== SEED SUMMARY ==========");
  console.log(`Employers ready: ${summary.employers.length}/5`);
  console.log(`Jobs posted: ${summary.jobsPosted}/15`);
  console.log(`Job seekers ready: ${summary.jobSeekers.length}/4`);
  console.log(`Errors: ${summary.errors.length}`);
  if (summary.errors.length) {
    console.log(JSON.stringify(summary.errors, null, 2));
  }
  console.log("\nShared password for all seeded accounts:", PASSWORD);
  console.log(
    JSON.stringify(
      {
        employers: summary.employers,
        jobSeekers: summary.jobSeekers,
      },
      null,
      2
    )
  );

  if (summary.errors.length) prwocess.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
