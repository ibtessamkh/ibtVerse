"use client"

import DoodleCrewFooter from "@/components/ui/doodle-crew-footer"

export default function Demo() {
  return (
    <div className="w-full">
      <DoodleCrewFooter
        wordmark="IBTESSAM"
        brand="ibtVerse"
        blurb="A multidisciplinary journey through computer science, veterinary medicine and cybersecurity."
        tagline="Curiosity connects every part of my journey."
        columns={[
          { title: "Explore", links: [{ label: "About", href: "#about" }, { label: "Experience", href: "#experience" }, { label: "Projects", href: "#projects" }] },
          { title: "Studies", links: [{ label: "Computer Science", href: "#about" }, { label: "Veterinary Medicine", href: "#about" }, { label: "Cybersecurity", href: "#experience" }] },
          { title: "Connect", links: [{ label: "Email", href: "mailto:khobiziibtessam@gmail.com" }, { label: "LinkedIn", href: "https://www.linkedin.com/in/khobizi-ibtessam-482781307" }] },
        ]}
        actions={[
          { label: "Explore my work", href: "#projects", icon: "star", variant: "outline" },
          { label: "Contact me", href: "#contact", icon: "sparkle", variant: "solid" },
        ]}
        copyright="© 2026 ibtVerse — the digital universe of Ibtessam"
        preset="auto"
      />
    </div>
  )
}
