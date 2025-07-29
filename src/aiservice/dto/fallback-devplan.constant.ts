import { CreateDevplanDto } from './create-devplan.dto'; 

export class FallbackDevPlan {
  static get data(): CreateDevplanDto {
    return {
      step1: {
        jobs: [
          {
            _id: "684741da95b823d012de26cb",
            employerId:"684741da95b823d012de2705",
            title: "Backend Developer",
            company: "Russell Inc",
            match: "This job matches the user's experience as a Backend Developer.  Although the location and required languages don't align, the user's experience with Node.js and MongoDB is relevant. The required experience is significantly higher than the user's.",
            matchScore: 30,
          },
          {
            _id: "684741da95b823d012de26e1",
            employerId:"684741da95b823d012de2705",
            title: "Backend Developer",
            company: "Williams PLC",
            match: "The job title matches the user's experience.  The user's experience with MongoDB and their stated interest in working remotely makes this somewhat relevant, despite the location and higher experience requirements.",
            matchScore: 35,
          },
          {
            _id: "684741da95b823d012de26f6",
            employerId:"684741da95b823d012de2705",
            title: "Backend Developer",
            company: "Moore-Henry",
            match: "This Backend Developer role has a remote work option, aligning with the user's preference. The user's experience with Node.js and Git is relevant, despite the seniority level discrepancy and location.",
            matchScore: 40,
          },
          {
            _id: "684741da95b823d012de2700",
            employerId:"684741da95b823d012de2705",
            title: "Backend Developer",
            company: "Brown, Silva and Lopez",
            match: "This role is a remote Backend Developer position, matching the user's preference. The user's skills in Node.js and Git, and experience with REST APIs are relevant.  The seniority level is higher than the user's.",
            matchScore: 45,
          },
          {
            _id: "684741da95b823d012de2705",
            employerId:"684741da95b823d012de2705",
            title: "Backend Developer",
            company: "Cooper-Booker",
            match: "This is a full-time, remote Backend Developer position aligning with the user's preferences. The user's experience with Node.js, REST APIs, and Git makes this a strong match despite the junior level requirement.",
            matchScore: 60,
          },
        ],
      },
      step2: {
        months: [
          {
            month: "Month 1: Foundation (أساسيات)",
            tasks: [
              {
                week: 1,
                tasks: [
                  "Refine resume and LinkedIn profile to highlight relevant skills (Node.js, REST APIs, MongoDB, Git).",
                  "Research companies in Germany offering remote Backend Developer roles.",
                  "Practice coding challenges on platforms like LeetCode and HackerRank focusing on data structures and algorithms."
                ]
              },
              {
                week: 2,
                tasks: [
                  "Network with professionals on LinkedIn, focusing on those working in remote Backend Developer roles in Germany.",
                  "Start learning Kubernetes and Docker (crucial skills based on job postings).",
                  "Improve German language skills (consider online courses or language exchange partners)."
                ]
              },
              {
                week: 3,
                tasks: [
                  "Prepare for technical interviews: review data structures, algorithms, and system design principles.",
                  "Practice behavioral interview questions, focusing on teamwork and problem-solving.",
                  "Create a portfolio showcasing completed projects, including the ones from previous internships."
                ]
              },
              {
                week: 4,
                tasks: [
                  "Continue practicing coding and interview questions.",
                  "Research salary expectations for Backend Developers in Germany.",
                  "Begin applying for jobs identified in Week 1."
                ]
              }
            ]
          },
          {
            month: "Month 2: Skills in Action (مهارات عملية)",
            tasks: [
              {
                week: 5,
                tasks: [
                  "Actively participate in online coding communities and contribute to open-source projects to enhance skills and portfolio."
                ]
              },
              {
                week: 6,
                tasks: [
                  "Attend online workshops or webinars related to backend development, cloud architecture, and relevant technologies (Kubernetes, Docker).",
                  "Continue to actively apply to jobs and track application progress."
                ]
              },
              {
                week: 7,
                tasks: [
                  "Follow up on job applications.",
                  "Prepare for second-round interviews, which may involve more in-depth technical questions and system design challenges."
                ]
              },
              {
                week: 8,
                tasks: [
                  "Practice creating a strong presentation to convey technical concepts effectively.",
                  "Network with recruiters and hiring managers on LinkedIn."
                ]
              }
            ]
          },
          {
            month: "Month 3: Career Readiness (جاهزية مهنية)",
            tasks: [
              {
                week: 9,
                tasks: [
                  "Negotiate job offers effectively. Prepare questions to ask the hiring manager during the final stages.",
                  "Review and finalize contract terms."
                ]
              },
              {
                week: 10,
                tasks: [
                  "Prepare for onboarding and transition smoothly into the new role.",
                  "Set personal and professional goals for the next six months."
                ]
              },
              {
                week: 11,
                tasks: [
                  "Continue learning and developing skills in the chosen field.",
                  "Explore opportunities for professional development and networking."
                ]
              },
              {
                week: 12,
                tasks: [
                  "Evaluate career progress and adjust plans as needed.",
                  "Seek mentorship or coaching to support long-term career goals."
                ]
              }
            ]
          }
        ]
      }
    };
  }
}
