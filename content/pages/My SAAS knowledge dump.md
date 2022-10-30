---
title: My SAAS knowledge dump
tags:
  - saas
  - thoughts
categories:
  - saas
date: 2022-10-30
lastMod: 2022-10-30
ShowToc: true
public: true
format: article

---
![Cover](https://images.unsplash.com/photo-1667120651808-34305af680d3?ixlib=rb-4.0.3&ixid=mnwxmja3fdb8mhxwag90by1wywdlfhx8fgvufdb8fhx8&auto=format&fit=crop&w=1468&q=80)

Here are my observations about #SAAS  ***(Software As A Service):***

  + 🚄 **Build for speed** - especially the speed at which you can iterate and pivot. Therefore, extensible design should be thought of from day one. Are you building one ESP integration? - Design in such a way that you can build N integrations, this goes from product level down to how you store your data and how you surface reports and alerts.

  + 🚣 **Data Migration** - it's a pain - avoid it at all costs. It's a necessary evil which rarely spawns out of the blue, it's that monster that has been watching you ignore it in plain sight while you engineer away your product without ever considering that one day you might have to migrate a lot of real customer data and every record and every boolean field counts. The day the monster surfaces, you better be ready to trade your sleep and sanity. The best way is to avoid the migration altogether but if the benefits are manifold, design your system and workflows such that it is easier to migrate data and you prepare a pipeline for this.

  + 🚂 **Engineering** - Building something that works is more often easier than building something that works and doesn't break. A lot of engineering boils down to anticipating what could break and trying to proactively prevent the breaking. In this anticipation, you will end up falling into what's best and what's better than what and all sorts of opinion. It's extremely important to know what you're looking for and solve for that urgently, it's very easy to anticipate into oblivion.

  + 🫥 **Hidden Customers** - Internal stakeholders are as much your customers as external customers. Any data, process or communication that needs to be exchanged internally either manually or surfaced via a tool, should be a part of engineering. And the best tool in this case is a well written documentation that anticipates the questions and has them addressed in the doc.

  + 🔬 **Metrics** - At the end of it all, what matters is that your existing customers continue paying you and you get new customers who pay you and that you have a good enough diff of the amount it costs you to build and the amount you get paid by the customers. Everything else is an assumed solution to help do it effectively and efficiently.
