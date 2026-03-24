# CLAUDE.md — Working Instructions for Sanas Developer Console Prototype

## Who I Am
I am a Product Manager building a developer console for Sanas. I provide requirements through text descriptions and screenshots. I do not have a technical background, so all communication should avoid jargon and be kept clear and simple.

---

## What We Are Building
A **developer console for Sanas** — a working prototype that will eventually be deployed as a website, likely through v0.

---

## How We Work Together

### My Role
- I give requirements one at a time, in the form of:
  - Written descriptions
  - Screenshots or visual references
- I review what gets built and give feedback

### Your Role (Claude)
- Translate my requirements into a working visual prototype
- Keep the prototype deployable via v0
- Maintain three files after every single iteration:
- Keep the design as close to the screen shot provided, if needed any clarifying questions you can ask


---

## The Three Files You Must Always Maintain

### 1. `CLAUDE.md` (this file)
- The rulebook for how we work
- Only update this if I explicitly ask you to change how we operate

### 2. `README.md`
- A running log of what has been built, iteration by iteration
- Written in plain language — no technical jargon
- Updated after every iteration with:
  - What was built in this iteration
  - What changed from the previous version
  - Current state of the prototype
  - What is still pending or not yet built

- If a prompt comes with a -skip at the end do not include in this file for that iteration and from next iteration this file has to be included

### 3. `REQUIREMENTS.md`
- A structured record of every requirement I have given
- For each requirement, written as:
  - **User Journey** — the path a user takes end to end
  - **User Story** — written as: *"As a [user], I want to [action], so that [benefit]"*
  - **Acceptance Criteria** — a plain-language checklist of what "done" looks like
  - **Open Questions / Missing Details** — gaps in what I provided that need to be clarified before or during build
- Requirements focus on the **what and why — not the how**
- The how is an engineering decision
- If a prompt comes with a -skip at the end do not include in this file for that iteration and from next iteration this file has to be included

---

## Rules for Every Iteration

1. **Always update all three files** — CLAUDE.md (if needed), README.md, and REQUIREMENTS.md — before presenting the prototype
2. **Never assume missing details** — flag them clearly in REQUIREMENTS.md under "Open Questions"
3. **Always keep the prototype deployable** — it should be ready to drop into v0 at any point
4. **Ask clarifying questions sparingly** — only when a gap would block building anything at all
5. **Design quality matters** — the prototype should look like a real product, not a rough sketch
- If a prompt comes with a -skip at the end do not include in this file for that iteration and from next iteration this file has to be included

---

## Tone and Communication Style
- Plain language only
- No technical jargon unless I ask for it
- Be direct about what was built, what is missing, and what needs a decision from me