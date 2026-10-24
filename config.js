/*
  ============================================================
  SITE CONFIG: the only file you need to edit for your content
  ============================================================
  - Leave a value as "" (empty) and that button shows as "Not added yet"
    instead of linking anywhere. Nothing is faked.
  - Links must start with https://
*/
window.SITE_CONFIG = {
  // Contact details
  email: "vikas7pro@gmail.com",

  // Full profile URLs (must start with https://)
  instagram: "https://www.instagram.com/vikas.creation/",
  linkedin: "https://www.linkedin.com/in/vikas-tem?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  github: "https://github.com/vikaspro-max",

  // Path to your resume file, e.g. "assets/resume/Vikas-Kumar-Resume.pdf"
  // Leave empty and the "Download Resume" button stays hidden.
  resume: "",

  /*
    Projects. For each card you can set:
      title        : card heading
      description  : one or two sentences
      tags         : list of short labels
      icon         : one of: layout, palette, camera, terminal, code, video
      image        : optional thumbnail, e.g. "assets/projects/banners.jpg" (16:10 works best)
      link         : optional https:// link to the project (or "" for none)
      placeholder  : true = shows a "Placeholder" badge. Set to false once it is real work.
  */
  projects: [
    {
      title: "Personal Portfolio Website",
      description: "This site: a responsive portfolio built from scratch with HTML, CSS and vanilla JavaScript.",
      tags: ["HTML", "CSS", "JavaScript"],
      icon: "layout",
      image: "",
      link: "",
      placeholder: false
    },
    {
      title: "Graphic Design & Banner Collection",
      description: "Space reserved for my posters, banners and visual layouts. Samples will be added here.",
      tags: ["Posters", "Banners", "Layouts"],
      icon: "palette",
      image: "",
      link: "",
      placeholder: true
    },
    {
      title: "Photo Editing & Cinematic Visuals",
      description: "Space reserved for edited photos and cinematic colour work. Samples will be added here.",
      tags: ["Photo editing", "Colour", "Composition"],
      icon: "camera",
      image: "",
      link: "",
      placeholder: true
    },
    {
      title: "C / C++ Academic Programs",
      description: "Space reserved for programs written during coursework and practice.",
      tags: ["C", "C++", "Coursework"],
      icon: "terminal",
      image: "",
      link: "",
      placeholder: true
    }
  ]
};
