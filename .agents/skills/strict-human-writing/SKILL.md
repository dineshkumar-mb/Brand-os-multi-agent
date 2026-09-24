---
name: strict-human-writing
description: Strict Human-Writing Rules to ensure technical content sounds like an experienced human developer communicating from real experience—eliminating AI clichés, corporate fluff, formulaic structures, and fake enthusiasm.
---

# Strict Human-Writing Rules

## 1. Core Principle

Write like an experienced human developer communicating from real experience—not like an AI generating polished generic content.

Every piece of writing must prioritize:

**Specificity → Experience → Evidence → Original thought → Natural language**

Never optimize for sounding “professional” at the expense of sounding human.

---

## 2. Never Use Generic AI Openings

Do not begin with phrases such as:

* “In today's rapidly evolving…”
* “In the ever-changing world of…”
* “In the modern digital landscape…”
* “As technology continues to evolve…”
* “In the fast-paced world of…”
* “The future of X is…”
* “X has become increasingly important…”

Start with the actual problem, observation, experience, result, or question.

---

## 3. Never Use AI-Favorite Vocabulary Without a Genuine Reason

Avoid unnecessary use of words such as:

* delve
* pivotal
* crucial
* transformative
* revolutionary
* seamless
* robust
* leverage
* foster
* facilitate
* underscore
* showcase
* intricate
* testament
* interplay
* bolster
* landscape
* paradigm
* empower
* unlock
* game-changing

Use simpler, more natural words whenever possible.

---

## 4. Avoid Corporate/Marketing Language

Do not write:

> “This solution empowers organizations to unlock scalable innovation.”

Prefer:

> “This reduced the API response time from 800ms to 240ms.”

Whenever possible, replace abstract claims with measurable or observable facts.

---

## 5. Minimize Em Dashes

Do not repeatedly use `—` as a recognizable writing pattern.

Use normal punctuation, sentence breaks, commas, or parentheses where appropriate.

An occasional em dash is acceptable. Repeated use is not.

---

## 6. Avoid Formulaic “Not X, But Y” Construction

Do not repeatedly use:

* “It’s not about X. It’s about Y.”
* “This isn’t just X—it’s Y.”
* “Not only X, but also Y.”
* “The real issue isn’t X. It’s Y.”

Use this structure only when it genuinely expresses an important contrast.

---

## 7. Avoid Predictable Three-Part Lists

Do not mechanically write:

> “Faster, smarter, and more scalable.”

or:

> “Simple, powerful, and reliable.”

Three-part structures are allowed when natural, but they must never become a default writing pattern.

---

## 8. Do Not Manufacture Enthusiasm

Avoid unnecessary words such as:

* exciting
* amazing
* incredible
* powerful
* game-changing
* groundbreaking
* revolutionary
* fascinating
* transformative

Do not make ordinary technical improvements sound revolutionary.

State what actually happened.

---

## 9. Replace Claims With Evidence

Never make a strong claim without supporting it when evidence is available.

Weak:

> “This architecture is highly scalable.”

Strong:

> “We moved the background indexing work into BullMQ, so API requests no longer wait for document processing.”

Prefer:

**What happened → Why → Evidence → Result**

---

## 10. Inject Real Experience

Whenever the content is based on personal/project experience, include concrete details when available:

* what was built
* what broke
* what was tried
* what failed
* what changed
* why the change was made
* measurable results
* technical constraints
* unexpected behavior
* lessons learned

Never replace actual experience with generic advice.

---

## 11. Allow Human Imperfection

Human writing does not need to have perfectly symmetrical sentence structures.

Use natural variation:

* short sentences
* longer explanations
* occasional fragments when appropriate
* different paragraph lengths
* natural transitions
* direct statements

Do not make every paragraph look algorithmically identical.

---

## 12. Do Not Over-Structure

Do not automatically create:

* 5–10 headings
* numbered sections
* “Key Takeaways”
* “Final Thoughts”
* “Conclusion”
* multiple nested bullet lists

Structure should exist because it improves comprehension, not because the format looks organized.

---

## 13. Do Not Restate the User's Question

Do not begin by repeating what the reader already knows.

Instead of:

> “You may be wondering how React performance can be improved…”

Start with the actual insight.

---

## 14. Avoid Repetitive Transition Words

Do not repeatedly use:

* Furthermore
* Moreover
* Additionally
* Consequently
* Therefore
* However
* In conclusion
* Ultimately
* That said

Use natural transitions—or no transition when one isn't needed.

---

## 15. Do Not Manufacture Perfect Conclusions

Avoid generic endings such as:

* “The future belongs to…”
* “Ultimately, success depends on…”
* “The key takeaway is…”
* “This is just the beginning.”
* “Keep learning, keep building, and keep growing.”
* “Embrace the future.”

End with the actual conclusion, observation, lesson, question, or implication.

---

## 16. Avoid Artificially Positive Narratives

Real engineering includes:

* bugs
* wrong assumptions
* failed approaches
* trade-offs
* compromises
* debugging
* uncertainty
* technical debt

Do not turn every story into:

**Problem → AI solution → amazing result → inspirational lesson**

A credible story can be:

**Problem → wrong assumption → failed attempt → discovery → fix → trade-off**

---

## 17. Preserve Technical Specificity

For technical writing, prefer concrete technologies and mechanisms over vague terminology.

Weak:

> “We improved the AI architecture.”

Strong:

> “We moved embeddings from MongoDB into ChromaDB and moved indexing into a BullMQ worker.”

Use actual implementation details whenever they are known.

---

## 18. Do Not Pretend Certainty

When something is uncertain, say so naturally.

Use:

* “I initially thought…”
* “The first approach failed because…”
* “I haven't tested this at scale yet.”
* “This worked for our use case, but…”
* “The trade-off is…”

Do not manufacture confidence.

---

## 19. Include Personal Opinions Only When Grounded

When expressing an opinion, connect it to experience or evidence.

Weak:

> “Microservices are always better for large applications.”

Better:

> “For our application, splitting the background processing from the API made deployment easier. I wouldn't automatically apply the same architecture to a small CRUD application.”

---

## 20. Avoid Generic AI Advice

Never write generic advice merely to fill space.

Avoid:

> “Developers should continuously learn, adapt to new technologies, and embrace innovation.”

Prefer a concrete observation:

> “I used to focus heavily on adding libraries to projects. After debugging dependency and state-management issues across multiple applications, I started evaluating whether each dependency actually removed complexity.”

---

## 21. Vary Sentence Rhythm

Do not make every sentence similar.

Bad pattern:

> “We built X. We implemented Y. We added Z. We improved A. We optimized B.”

Instead, naturally combine sentences:

> “The first version worked, but the state started leaking between projects when users switched workspaces. The root cause turned out to be that several Redux slices weren't scoped by project ID.”

---

## 22. Avoid Repetitive Hooks

Do not repeatedly begin content with:

* “I recently…”
* “Here’s what I learned…”
* “One thing I realized…”
* “A lesson I learned…”
* “Something interesting happened…”
* “Let me share…”

Use them only when genuinely appropriate.

---

## 23. Do Not Force Storytelling

Not every technical post needs a dramatic story.

Use the format that naturally fits the information:

* observation
* technical explanation
* debugging story
* architecture decision
* experiment
* comparison
* lesson
* failure analysis
* case study

---

## 24. Do Not Repeat Topics Without New Information

If a topic has already been covered, do not produce another post simply by changing the wording.

A repeated topic must introduce something substantially different:

* new implementation
* new experiment
* new failure
* new benchmark
* new architecture
* new lesson
* new perspective
* new real-world experience

---

## 25. Every Technical Claim Must Survive the “How?” Test

Whenever the writing says:

> “This improves performance.”

Ask:

**How?**

Whenever it says:

> “This makes the system scalable.”

Ask:

**What changed that makes it scalable?**

Whenever it says:

> “AI improved the workflow.”

Ask:

**Which step changed, and what was the measurable effect?**

If the answer is unavailable, weaken or remove the claim.

---

## 26. Use Numbers When They Exist

Prefer:

> “15 APIs”

over:

> “many APIs”

Prefer:

> “7 tests passed”

over:

> “the tests passed successfully”

Prefer:

> “reduced processing from 12 seconds to 4 seconds”

over:

> “significantly improved processing speed.”

Never invent numbers.

---

## 27. No Fake Personal Experience

Never write:

> “I discovered…”

> “When I worked on…”

> “I spent three days…”

unless that experience is actually known.

Do not manufacture personal stories to make AI-generated content appear human.

---

## 28. No Fake Emotion

Do not manufacture:

* frustration
* excitement
* surprise
* fear
* confidence
* disappointment

unless the user actually experienced or expressed it.

---

## 29. No Artificial Engagement Bait

Do not automatically end posts with:

> “What do you think?”

> “Have you experienced this?”

> “Agree or disagree?”

> “Drop your thoughts below.”

Ask a question only when there is a genuine reason for discussion.

---

## 30. Humanization Must Not Mean Sloppiness

Do not intentionally introduce:

* spelling mistakes
* grammatical errors
* random lowercase text
* unnecessary abbreviations
* fake typos
* awkward sentences

“Human” means **natural and distinctive**, not deliberately incorrect.

---

# Final Quality Gate

Before publishing any generated content, check:

### Authenticity

* Does this sound like a specific person?
* Is there real experience or evidence?
* Could the same text have been written about almost any developer?

### Language

* Did I remove unnecessary AI-style vocabulary?
* Did I avoid repetitive em dashes?
* Did I avoid corporate jargon?
* Did I avoid excessive positivity?

### Structure

* Is the structure natural?
* Are there unnecessary headings or lists?
* Are paragraph lengths artificially uniform?
* Am I forcing a predictable introduction/conclusion?

### Technical credibility

* Are claims supported?
* Are technical details concrete?
* Did I distinguish experience from general advice?
* Did I avoid pretending certainty?

### Originality

* Does this add a new idea?
* Does it contain a distinctive observation?
* Is it merely rewriting something commonly said online?

### Human voice

* Would a real engineer naturally say this?
* Does the writing contain specific decisions, trade-offs, mistakes, or observations?
* Does it sound like someone who actually built or investigated the thing?

## Absolute Rule

**Never “humanize” writing by simply replacing AI words.**

The goal is not to hide AI authorship.

The goal is to produce writing that is **specific, technically grounded, experience-driven, original, naturally structured, and genuinely useful.**
