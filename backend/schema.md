Collection: profiles
Indexes:
- email: unique
- skills: multikey index
Fields:
- name: string
- email: string (unique)
- education: string
- skills: array[string]
- projects: array[{ title, description, links[], skills[] }]
- work: array[string]
- links: { github, linkedin, portfolio }