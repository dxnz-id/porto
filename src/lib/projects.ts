export interface Project {
  slug: string;
  name: string;
  description: string;
  techStack: string[];
  images: { src: string; label: string }[];
}

const projects: Project[] = [
  {
    slug: "sipups",
    name: "SIPUPS",
    description:
      "A digital library platform for managing collections, users, and borrowing, built with a modern admin experience.",
    techStack: ["Laravel", "Filament", "MySQL"],
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3kLN-UnMNIbUS_9CfeN5a6p4sYFa84avKsyFkAxrfOQpxTQPq0JCl0zQbvo2-caKqEfGRfvALYjBboNvSLptuI8bvPujmVB7GWg_TTSao8wCCTQgGZLht3kdl-QuLLCB7THhYOuIqCTQ-CYb_9j7aM3Gu429sc5b6EdINtEC0TwFxDU6Uw6UB51J0COZbanKaKmM3BN7WTAGRxtxPMc_NOfS7Q9B6RxOdLQE5lJO-iQwjqOsCxJ-hiIX9Ngd6Vt8hDzOLKchWtn3Y",
        label: "Dashboard Overview",
      },
    ],
  },
  {
    slug: "labnotes",
    name: "LabNotes",
    description:
      "A laboratory management platform with a Laravel-powered backend and a modern React landing page.",
    techStack: ["Laravel", "Filament", "React", "Docker", "MariaDB"],
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4D8DBkjeNeWlFEEOY-1dRFLE-zgySJSdkjmKTgVaveY--Va66qDWwe1fA8Ak1vAElERixHeS-RYNI8YcnZK3HXapgRnLsmvxl2FKWwy-uyNwX9Br-odU0mCJ_FyXAtvkpzsJbIsM36Kf_fAVEIi-QySFOZO5eaZGRLXHcCUlR1GoH7XyP9vPrWCNuHPBvJUNSvKYdvjQmRnWB4n2EYA91H1zt26TFOCpue1uv_-tpmufgtkj4hq9EmXX_I02ku8LDCT-sSOPAyYQv",
        label: "LabNotes Hero",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeWChnG_WqrcVTSzbxDSu1v8thnmph4eyJN_Tf9oZmgEeLpdR3628Botx5GxRaCngTmNg0QIcF9oPTyeqzi0KPisU2x_8U0mWGsni8khrUnUDzdkWYVul6YL4aMKE-UVDHifyKY-6EBGu-Uwk27QgulpFvPCQiNF30RDYISTHGo4tpPAVPPjBJc1kW3H4SlgPX0SNEdyFFsBsRRkAFzoMHSewvuem5CuUxzkHXwJBP0q6v85qKhn-IyhqJfj0DwX4-PjbOhvDssL97",
        label: "Code",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3S7WYzbvZ3M49AS1ojQ9fE6vIUNFfsMPwpUJVvASmsS7232hwh6J54lYKoRL7pco8U5eIoAhlzu5I07RJK02OuNE9iooTJwkXAKq398FFtpj9Ty7zwusvF1qZQlwpiGEUuSCKRm2z9AZrr6iymuReKokWAuOfADRNAwxoTNtTKayS0AosH23RAntQI10gnKldiWSgxRJJKxqumCox-vpIzhRlzlHpZ7HnpaFxy2IFJCisuP_8nLg7Wdes8ziHV8oF174e5dPuOqdC",
        label: "Dashboard",
      },
    ],
  },
  {
    slug: "siwayut",
    name: "Siwayut Catering",
    description:
      "A catering management platform with a public landing page, order form, order tracking, and an admin panel, built on a custom vanilla PHP MVC framework.",
    techStack: ["PHP", "MySQL", "Tailwind CSS"],
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3S7WYzbvZ3M49AS1ojQ9fE6vIUNFfsMPwpUJVvASmsS7232hwh6J54lYKoRL7pco8U5eIoAhlzu5I07RJK02OuNE9iooTJwkXAKq398FFtpj9Ty7zwusvF1qZQlwpiGEUuSCKRm2z9AZrr6iymuReKokWAuOfADRNAwxoTNtTKayS0AosH23RAntQI10gnKldiWSgxRJJKxqumCox-vpIzhRlzlHpZ7HnpaFxy2IFJCisuP_8nLg7Wdes8ziHV8oF174e5dPuOqdC",
        label: "Dashboard",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUp5bZElFn40puK0yrY_7BoPSCWZuodq3EfQqM-6Wq-04XTN2vkrLHec-FTWJD30uz5eth470EBgBLlx5wljXYxXcn3uwNNyRjAyX_SPYy594djBwsWNL7ZZvFj4N8_y19Ms0XdIJoEl4-y9McM4YcDszveqETCxQzrEE-52BCeVYxOEXFGQ3FkUA42Nnlu5U3nJq6__n9bltMBgmXNf9dCp36NytAGA-U1HzEJlg8bhzY1u8ht84Bob1BAOXoMrXSXb95GbmPIVmw",
        label: "Mobile Interface",
      },
    ],
  },
];

export default projects;
