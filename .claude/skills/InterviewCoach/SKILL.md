

All projects
New session
Build fraud detection tool portfolio project
1028 additions, 1 deletions
+1028
−1
Build email drafting agent with OpenAI
Build LinkedIn post writer tool
Summarize r/productmanagement discussions
Project Kickoff
Skills
Connectors

Plugins
Skills

Personal skills
skill-creator

SKILL.md

agents

assets

eval-viewer

references

scripts

LICENSE.txt
skill-creator
Added by
Anthropic
Trigger
Slash command + auto
Description
Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.

Skill Creator
A skill for creating new skills and iteratively improving them.

At a high level, the process of creating a skill goes like this:

Decide what you want the skill to do and roughly how it should do it
Write a draft of the skill
Create a few test prompts and run claude-with-access-to-the-skill on them
Help the user evaluate the results both qualitatively and quantitatively
While the runs happen in the background, draft some quantitative evals if there aren't any (if there are some, you can either use as is or modify if you feel something needs to change about them). Then explain them to the user (or if they already existed, explain the ones that already exist)
Use the eval-viewer/generate_review.py script to show the user the results for them to look at, and also let them look at the quantitative metrics
Rewrite the skill based on feedback from the user's evaluation of the results (and also if there are any glaring flaws that become apparent from the quantitative benchmarks)
Repeat until you're satisfied
Expand the test set and try again at larger scale
Your job when using this skill is to figure out where the user is in this process and then jump in and help them progress through these stages. So for instance, maybe they're like "I want to make a skill for X". You can help narrow down what they mean, write a draft, write the test cases, figure out how they want to evaluate, run all the prompts, and repeat.

On the other hand, maybe they already have a draft of the skill. In this case you can go straight to the eval/iterate part of the loop.

Of course, you should always be flexible and if the user is like "I don't need to run a bunch of evaluations, just vibe with me", you can do that instead.

Then after the skill is done (but again, the order is flexible), you can also run the skill description improver, which we have a whole separate script for, to optimize the triggering of the skill.

Cool? Cool.

Communicating with the user
The skill creator is liable to be used by people across a wide range of familiarity with coding jargon. If you haven't heard (and how could you, it's only very recently that it started), there's a trend now where the power of Claude is inspiring plumbers to open up their terminals, parents and grandparents to google "how to install npm". On the other hand, the bulk of users are probably fairly computer-literate.

So please pay attention to context cues to understand how to phrase your communication! In the default case, just to give you some idea:

"evaluation" and "benchmark" are borderline, but OK
for "JSON" and "assertion" you want to see serious cues from the user that they know what those things are before using them without explaining them
It's OK to briefly explain terms if you're in doubt, and feel free to clarify terms with a short definition if you're unsure if the user will get it.

Creating a skill
Capture Intent
Start by understanding the user's intent. The current conversation might already contain a workflow the user wants to capture (e.g., they say "turn this into a skill"). If so, extract answers from the conversation history first — the tools used, the sequence of steps, corrections the user made, input/output formats observed. The user may need to fill the gaps, and should confirm before proceeding to the next step.

What should this skill enable Claude to do?
When should this skill trigger? (what user phrases/contexts)
What's the expected output format?
Should we set up test cases to verify the skill works? Skills with objectively verifiable outputs (file transforms, data extraction, code generation, fixed workflow steps) benefit from test cases. Skills with subjective outputs (writing style, art) often don't need them. Suggest the appropriate default based on the skill type, but let the user decide.
Interview and Research
Proactively ask questions about edge cases, input/output formats, example files, success criteria, and dependencies. Wait to write test prompts until you've got this part ironed out.

Check available MCPs - if useful for research (searching docs, finding similar skills, looking up best practices), research in parallel via subagents if available, otherwise inline. Come prepared with context to reduce burden on the user.

Write the SKILL.md
Based on the user interview, fill in these components:

name: Skill identifier
description: When to trigger, what it does. This is the primary triggering mechanism - include both what the skill does AND specific contexts for when to use it. All "when to use" info goes here, not in the body. Note: currently Claude has a tendency to "undertrigger" skills -- to not use them when they'd be useful. To combat this, please make the skill descriptions a little bit "pushy". So for instance, instead of "How to build a simple fast dashboard to display internal Anthropic data.", you might write "How to build a simple fast dashboard to display internal Anthropic data. Make sure to use this skill whenever the user mentions dashboards, data visualization, internal metrics, or wants to display any kind of company data, even if they don't explicitly ask for a 'dashboard.'"
compatibility: Required tools, dependencies (optional, rarely needed)
the rest of the skill :)
Skill Writing Guide
Anatomy of a Skill
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/    - Executable code for deterministic/repetitive tasks
    ├── references/ - Docs loaded into context as needed
    └── assets/     - Files used in output (templates, icons, fonts)
Progressive Disclosure
Skills use a three-level loading system:

Metadata (name + description) - Always in context (~100 words)
SKILL.md body - In context whenever skill triggers (<500 lines ideal)
Bundled resources - As needed (unlimited, scripts can execute without loading)
These word counts are approximate and you can feel free to go longer if needed.

Key patterns:

Keep SKILL.md under 500 lines; if you're approaching this limit, add an additional layer of hierarchy along with clear pointers about where the model using the skill should go next to follow up.
Reference files clearly from SKILL.md with guidance on when to read them
For large reference files (>300 lines), include a table of contents
Domain organization: When a skill supports multiple domains/frameworks, organize by variant:

cloud-deploy/
├── SKILL.md (workflow + selection)
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
Claude reads only the relevant reference file.

Principle of Lack of Surprise
This goes without saying, but skills must not contain malware, exploit code, or any content that could compromise system security. A skill's contents should not surprise the user in their intent if described. Don't go along with requests to create misleading skills or skills designed to facilitate unauthorized access, data exfiltration, or other malicious activities. Things like a "roleplay as an XYZ" are OK though.

Writing Patterns
Prefer using the imperative form in instructions.

Defining output formats - You can do it like this:

markdown
## Report structure
ALWAYS use this exact template:
# [Title]
## Executive summary
## Key findings
## Recommendations
Examples pattern - It's useful to include examples. You can format them like this (but if "Input" and "Output" are in the examples you might want to deviate a little):

markdown
## Commit message format
**Example 1:**
Input: Added user authentication with JWT tokens
Output: feat(auth): implement JWT-based authentication
Writing Style
Try to explain to the model why things are important in lieu of heavy-handed musty MUSTs. Use theory of mind and try to make the skill general and not super-narrow to specific examples. Start by writing a draft and then look at it with fresh eyes and improve it.

Test Cases
After writing the skill draft, come up with 2-3 realistic test prompts — the kind of thing a real user would actually say. Share them with the user: [you don't have to use this exact language] "Here are a few test cases I'd like to try. Do these look right, or do you want to add more?" Then run them.

Save test cases to evals/evals.json. Don't write assertions yet — just the prompts. You'll draft assertions in the next step while the runs are in progress.

json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's task prompt",
      "expected_output": "Description of expected result",
      "files": []
    }
  ]
}
See references/schemas.md for the full schema (including the assertions field, which you'll add later).

Running and evaluating test cases
This section is one continuous sequence — don't stop partway through. Do NOT use /skill-test or any other testing skill.

Put results in <skill-name>-workspace/ as a sibling to the skill directory. Within the workspace, organize results by iteration (iteration-1/, iteration-2/, etc.) and within that, each test case gets a directory (eval-0/, eval-1/, etc.). Don't create all of this upfront — just create directories as you go.

Step 1: Spawn all runs (with-skill AND baseline) in the same turn
For each test case, spawn two subagents in the same turn — one with the skill, one without. This is important: don't spawn the with-skill runs first and then come back for baselines later. Launch everything at once so it all finishes around the same time.

With-skill run:

Execute this task:
- Skill path: <path-to-skill>
- Task: <eval prompt>
- Input files: <eval files if any, or "none">
- Save outputs to: <workspace>/iteration-<N>/eval-<ID>/with_skill/outputs/
- Outputs to save: <what the user cares about — e.g., "the .docx file", "the final CSV">
Baseline run (same prompt, but the baseline depends on context):

Creating a new skill: no skill at all. Same prompt, no skill path, save to without_skill/outputs/.
Improving an existing skill: the old version. Before editing, snapshot the skill (cp -r <skill-path> <workspace>/skill-snapshot/), then point the baseline subagent at the snapshot. Save to old_skill/outputs/.
Write an eval_metadata.json for each test case (assertions can be empty for now). Give each eval a descriptive name based on what it's testing — not just "eval-0". Use this name for the directory too. If this iteration uses new or modified eval prompts, create these files for each new eval directory — don't assume they carry over from previous iterations.

json
{
  "eval_id": 0,
  "eval_name": "descriptive-name-here",
  "prompt": "The user's task prompt",
  "assertions": []
}
Step 2: While runs are in progress, draft assertions
Don't just wait for the runs to finish — you can use this time productively. Draft quantitative assertions for each test case and explain them to the user. If assertions already exist in evals/evals.json, review them and explain what they check.

Good assertions are objectively verifiable and have descriptive names — they should read clearly in the benchmark viewer so someone glancing at the results immediately understands what each one checks. Subjective skills (writing style, design quality) are better evaluated qualitatively — don't force assertions onto things that need human judgment.

Update the eval_metadata.json files and evals/evals.json with the assertions once drafted. Also explain to the user what they'll see in the viewer — both the qualitative outputs and the quantitative benchmark.

Step 3: As runs complete, capture timing data
When each subagent task completes, you receive a notification containing total_tokens and duration_ms. Save this data immediately to timing.json in the run directory:

json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3
}
This is the only opportunity to capture this data — it comes through the task notification and isn't persisted elsewhere. Process each notification as it arrives rather than trying to batch them.

Step 4: Grade, aggregate, and launch the viewer
Once all runs are done:

Grade each run — spawn a grader subagent (or grade inline) that reads agents/grader.md and evaluates each assertion against the outputs. Save results to grading.json in each run directory. The grading.json expectations array must use the fields text, passed, and evidence (not name/met/details or other variants) — the viewer depends on these exact field names. For assertions that can be checked programmatically, write and run a script rather than eyeballing it — scripts are faster, more reliable, and can be reused across iterations.
Aggregate into benchmark — run the aggregation script from the skill-creator directory:
bash
   python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>
This produces benchmark.json and benchmark.md with pass_rate, time, and tokens for each configuration, with mean ± stddev and the delta. If generating benchmark.json manually, see references/schemas.md for the exact schema the viewer expects. Put each with_skill version before its baseline counterpart.

Do an analyst pass — read the benchmark data and surface patterns the aggregate stats might hide. See agents/analyzer.md (the "Analyzing Benchmark Results" section) for what to look for — things like assertions that always pass regardless of skill (non-discriminating), high-variance evals (possibly flaky), and time/token tradeoffs.
Launch the viewer with both qualitative outputs and quantitative data:
bash
   nohup python <skill-creator-path>/eval-viewer/generate_review.py \
     <workspace>/iteration-N \
     --skill-name "my-skill" \
     --benchmark <workspace>/iteration-N/benchmark.json \
     > /dev/null 2>&1 &
   VIEWER_PID=$!
For iteration 2+, also pass --previous-workspace <workspace>/iteration-<N-1>.

Cowork / headless environments: If webbrowser.open() is not available or the environment has no display, use --static <output_path> to write a standalone HTML file instead of starting a server. Feedback will be downloaded as a feedback.json file when the user clicks "Submit All Reviews". After download, copy feedback.json into the workspace directory for the next iteration to pick up.

Note: please use generate_review.py to create the viewer; there's no need to write custom HTML.

Tell the user something like: "I've opened the results in your browser. There are two tabs — 'Outputs' lets you click through each test case and leave feedback, 'Benchmark' shows the quantitative comparison. When you're done, come back here and let me know."
What the user sees in the viewer
The "Outputs" tab shows one test case at a time:

Prompt: the task that was given
Output: the files the skill produced, rendered inline where possible
Previous Output (iteration 2+): collapsed section showing last iteration's output
Formal Grades (if grading was run): collapsed section showing assertion pass/fail
Feedback: a textbox that auto-saves as they type
Previous Feedback (iteration 2+): their comments from last time, shown below the textbox
The "Benchmark" tab shows the stats summary: pass rates, timing, and token usage for each configuration, with per-eval breakdowns and analyst observations.

Navigation is via prev/next buttons or arrow keys. When done, they click "Submit All Reviews" which saves all feedback to feedback.json.

Step 5: Read the feedback
When the user tells you they're done, read feedback.json:

json
{
  "reviews": [
    {"run_id": "eval-0-with_skill", "feedback": "the chart is missing axis labels", "timestamp": "..."},
    {"run_id": "eval-1-with_skill", "feedback": "", "timestamp": "..."},
    {"run_id": "eval-2-with_skill", "feedback": "perfect, love this", "timestamp": "..."}
  ],
  "status": "complete"
}
Empty feedback means the user thought it was fine. Focus your improvements on the test cases where the user had specific complaints.

Kill the viewer server when you're done with it:

bash
kill $VIEWER_PID 2>/dev/null
Improving the skill
This is the heart of the loop. You've run the test cases, the user has reviewed the results, and now you need to make the skill better based on their feedback.

How to think about improvements
Generalize from the feedback. The big picture thing that's happening here is that we're trying to create skills that can be used a million times (maybe literally, maybe even more who knows) across many different prompts. Here you and the user are iterating on only a few examples over and over again because it helps move faster. The user knows these examples in and out and it's quick for them to assess new outputs. But if the skill you and the user are codeveloping works only for those examples, it's useless. Rather than put in fiddly overfitty changes, or oppressively constrictive MUSTs, if there's some stubborn issue, you might try branching out and using different metaphors, or recommending different patterns of working. It's relatively cheap to try and maybe you'll land on something great.
Keep the prompt lean. Remove things that aren't pulling their weight. Make sure to read the transcripts, not just the final outputs — if it looks like the skill is making the model waste a bunch of time doing things that are unproductive, you can try getting rid of the parts of the skill that are making it do that and seeing what happens.
Explain the why. Try hard to explain the why behind everything you're asking the model to do. Today's LLMs are smart. They have good theory of mind and when given a good harness can go beyond rote instructions and really make things happen. Even if the feedback from the user is terse or frustrated, try to actually understand the task and why the user is writing what they wrote, and what they actually wrote, and then transmit this understanding into the instructions. If you find yourself writing ALWAYS or NEVER in all caps, or using super rigid structures, that's a yellow flag — if possible, reframe and explain the reasoning so that the model understands why the thing you're asking for is important. That's a more humane, powerful, and effective approach.
Look for repeated work across test cases. Read the transcripts from the test runs and notice if the subagents all independently wrote similar helper scripts or took the same multi-step approach to something. If all 3 test cases resulted in the subagent writing a create_docx.py or a build_chart.py, that's a strong signal the skill should bundle that script. Write it once, put it in scripts/, and tell the skill to use it. This saves every future invocation from reinventing the wheel.
This task is pretty important (we are trying to create billions a year in economic value here!) and your thinking time is not the blocker; take your time and really mull things over. I'd suggest writing a draft revision and then looking at it anew and making improvements. Really do your best to get into the head of the user and understand what they want and need.

The iteration loop
After improving the skill:

Apply your improvements to the skill
Rerun all test cases into a new iteration-<N+1>/ directory, including baseline runs. If you're creating a new skill, the baseline is always without_skill (no skill) — that stays the same across iterations. If you're improving an existing skill, use your judgment on what makes sense as the baseline: the original version the user came in with, or the previous iteration.
Launch the reviewer with --previous-workspace pointing at the previous iteration
Wait for the user to review and tell you they're done
Read the new feedback, improve again, repeat
Keep going until:

The user says they're happy
The feedback is all empty (everything looks good)
You're not making meaningful progress
Advanced: Blind comparison
For situations where you want a more rigorous comparison between two versions of a skill (e.g., the user asks "is the new version actually better?"), there's a blind comparison system. Read agents/comparator.md and agents/analyzer.md for the details. The basic idea is: give two outputs to an independent agent without telling it which is which, and let it judge quality. Then analyze why the winner won.

This is optional, requires subagents, and most users won't need it. The human review loop is usually sufficient.

Description Optimization
The description field in SKILL.md frontmatter is the primary mechanism that determines whether Claude invokes a skill. After creating or improving a skill, offer to optimize the description for better triggering accuracy.

Step 1: Generate trigger eval queries
Create 20 eval queries — a mix of should-trigger and should-not-trigger. Save as JSON:

json
[
  {"query": "the user prompt", "should_trigger": true},
  {"query": "another prompt", "should_trigger": false}
]
The queries must be realistic and something a Claude Code or Claude.ai user would actually type. Not abstract requests, but requests that are concrete and specific and have a good amount of detail. For instance, file paths, personal context about the user's job or situation, column names and values, company names, URLs. A little bit of backstory. Some might be in lowercase or contain abbreviations or typos or casual speech. Use a mix of different lengths, and focus on edge cases rather than making them clear-cut (the user will get a chance to sign off on them).

Bad: "Format this data", "Extract text from PDF", "Create a chart"

Good: "ok so my boss just sent me this xlsx file (its in my downloads, called something like 'Q4 sales final FINAL v2.xlsx') and she wants me to add a column that shows the profit margin as a percentage. The revenue is in column C and costs are in column D i think"

For the should-trigger queries (8-10), think about coverage. You want different phrasings of the same intent — some formal, some casual. Include cases where the user doesn't explicitly name the skill or file type but clearly needs it. Throw in some uncommon use cases and cases where this skill competes with another but should win.

For the should-not-trigger queries (8-10), the most valuable ones are the near-misses — queries that share keywords or concepts with the skill but actually need something different. Think adjacent domains, ambiguous phrasing where a naive keyword match would trigger but shouldn't, and cases where the query touches on something the skill does but in a context where another tool is more appropriate.

The key thing to avoid: don't make should-not-trigger queries obviously irrelevant. "Write a fibonacci function" as a negative test for a PDF skill is too easy — it doesn't test anything. The negative cases should be genuinely tricky.

Step 2: Review with user
Present the eval set to the user for review using the HTML template:

Read the template from assets/eval_review.html
Replace the placeholders:
__EVAL_DATA_PLACEHOLDER__ → the JSON array of eval items (no quotes around it — it's a JS variable assignment)
__SKILL_NAME_PLACEHOLDER__ → the skill's name
__SKILL_DESCRIPTION_PLACEHOLDER__ → the skill's current description
Write to a temp file (e.g., /tmp/eval_review_<skill-name>.html) and open it: open /tmp/eval_review_<skill-name>.html
The user can edit queries, toggle should-trigger, add/remove entries, then click "Export Eval Set"
The file downloads to ~/Downloads/eval_set.json — check the Downloads folder for the most recent version in case there are multiple (e.g., eval_set (1).json)
This step matters — bad eval queries lead to bad descriptions.

Step 3: Run the optimization loop
Tell the user: "This will take some time — I'll run the optimization loop in the background and check on it periodically."

Save the eval set to the workspace, then run in the background:

bash
python -m scripts.run_loop \
  --eval-set <path-to-trigger-eval.json> \
  --skill-path <path-to-skill> \
  --model <model-id-powering-this-session> \
  --max-iterations 5 \
  --verbose
Use the model ID from your system prompt (the one powering the current session) so the triggering test matches what the user actually experiences.

While it runs, periodically tail the output to give the user updates on which iteration it's on and what the scores look like.

This handles the full optimization loop automatically. It splits the eval set into 60% train and 40% held-out test, evaluates the current description (running each query 3 times to get a reliable trigger rate), then calls Claude to propose improvements based on what failed. It re-evaluates each new description on both train and test, iterating up to 5 times. When it's done, it opens an HTML report in the browser showing the results per iteration and returns JSON with best_description — selected by test score rather than train score to avoid overfitting.

How skill triggering works
Understanding the triggering mechanism helps design better eval queries. Skills appear in Claude's available_skills list with their name + description, and Claude decides whether to consult a skill based on that description. The important thing to know is that Claude only consults skills for tasks it can't easily handle on its own — simple, one-step queries like "read this PDF" may not trigger a skill even if the description matches perfectly, because Claude can handle them directly with basic tools. Complex, multi-step, or specialized queries reliably trigger skills when the description matches.

This means your eval queries should be substantive enough that Claude would actually benefit from consulting a skill. Simple queries like "read file X" are poor test cases — they won't trigger skills regardless of description quality.

Step 4: Apply the result
Take best_description from the JSON output and update the skill's SKILL.md frontmatter. Show the user before/after and report the scores.

Package and Present (only if present_files tool is available)
Check whether you have access to the present_files tool. If you don't, skip this step. If you do, package the skill and present the .skill file to the user:

bash
python -m scripts.package_skill <path/to/skill-folder>
After packaging, direct the user to the resulting .skill file path so they can install it.

Claude.ai-specific instructions
In Claude.ai, the core workflow is the same (draft → test → review → improve → repeat), but because Claude.ai doesn't have subagents, some mechanics change. Here's what to adapt:

Running test cases: No subagents means no parallel execution. For each test case, read the skill's SKILL.md, then follow its instructions to accomplish the test prompt yourself. Do them one at a time. This is less rigorous than independent subagents (you wrote the skill and you're also running it, so you have full context), but it's a useful sanity check — and the human review step compensates. Skip the baseline runs — just use the skill to complete the task as requested.

Reviewing results: If you can't open a browser (e.g., Claude.ai's VM has no display, or you're on a remote server), skip the browser reviewer entirely. Instead, present results directly in the conversation. For each test case, show the prompt and the output. If the output is a file the user needs to see (like a .docx or .xlsx), save it to the filesystem and tell them where it is so they can download and inspect it. Ask for feedback inline: "How does this look? Anything you'd change?"

Benchmarking: Skip the quantitative benchmarking — it relies on baseline comparisons which aren't meaningful without subagents. Focus on qualitative feedback from the user.

The iteration loop: Same as before — improve the skill, rerun the test cases, ask for feedback — just without the browser reviewer in the middle. You can still organize results into iteration directories on the filesystem if you have one.

Description optimization: This section requires the claude CLI tool (specifically claude -p) which is only available in Claude Code. Skip it if you're on Claude.ai.

Blind comparison: Requires subagents. Skip it.

Packaging: The package_skill.py script works anywhere with Python and a filesystem. On Claude.ai, you can run it and the user can download the resulting .skill file.

Updating an existing skill: The user might be asking you to update an existing skill, not create a new one. In this case:

Preserve the original name. Note the skill's directory name and name frontmatter field -- use them unchanged. E.g., if the installed skill is research-helper, output research-helper.skill (not research-helper-v2).
Copy to a writeable location before editing. The installed skill path may be read-only. Copy to /tmp/skill-name/, edit there, and package from the copy.
If packaging manually, stage in /tmp/ first, then copy to the output directory -- direct writes may fail due to permissions.
Cowork-Specific Instructions
If you're in Cowork, the main things to know are:

You have subagents, so the main workflow (spawn test cases in parallel, run baselines, grade, etc.) all works. (However, if you run into severe problems with timeouts, it's OK to run the test prompts in series rather than parallel.)
You don't have a browser or display, so when generating the eval viewer, use --static <output_path> to write a standalone HTML file instead of starting a server. Then proffer a link that the user can click to open the HTML in their browser.
For whatever reason, the Cowork setup seems to disincline Claude from generating the eval viewer after running the tests, so just to reiterate: whether you're in Cowork or in Claude Code, after running tests, you should always generate the eval viewer for the human to look at examples before revising the skill yourself and trying to make corrections, using generate_review.py (not writing your own boutique html code). Sorry in advance but I'm gonna go all caps here: GENERATE THE EVAL VIEWER BEFORE evaluating inputs yourself. You want to get them in front of the human ASAP!
Feedback works differently: since there's no running server, the viewer's "Submit All Reviews" button will download feedback.json as a file. You can then read it from there (you may have to request access first).
Packaging works — package_skill.py just needs Python and a filesystem.
Description optimization (run_loop.py / run_eval.py) should work in Cowork just fine since it uses claude -p via subprocess, not a browser, but please save it until you've fully finished making the skill and the user agrees it's in good shape.
Updating an existing skill: The user might be asking you to update an existing skill, not create a new one. Follow the update guidance in the claude.ai section above.
Reference files
The agents/ directory contains instructions for specialized subagents. Read them when you need to spawn the relevant subagent.

agents/grader.md — How to evaluate assertions against outputs
agents/comparator.md — How to do blind A/B comparison between two outputs
agents/analyzer.md — How to analyze why one version beat another
The references/ directory has additional documentation:

references/schemas.md — JSON structures for evals.json, grading.json, etc.
Repeating one more time the core loop here for emphasis:

Figure out what the skill is about
Draft or edit the skill
Run claude-with-access-to-the-skill on test prompts
With the user, evaluate the outputs:
Create benchmark.json and run eval-viewer/generate_review.py to help the user review them
Run quantitative evals
Repeat until you and the user are satisfied
Package the final skill and return it to the user.
Please add steps to your TodoList, if you have such a thing, to make sure you don't forget. If you're in Cowork, please specifically put "Create evals JSON and run eval-viewer/generate_review.py so human can review test cases" in your TodoList to make sure it happens.

Good luck!


Add "interview-coach" to your library?
Review the skill contents before adding to your library.


SKILL.md

references
Description
Use this skill whenever the user wants to analyze, score, or improve interview performance for PM roles — especially AI PM roles. Triggers include pasting an interview transcript, asking for feedback on interview answers, practicing mock interviews, preparing for PM/engineering/design/AI PM interviews, analyzing filler word usage, improving STAR method responses, or reviewing case interview answers. Also trigger when the user mentions "interview prep", "behavioral questions", "product sense", "product design interview", "AI product sense", "system design interview", "case interview", "mock interview", "Tell Me About Yourself", wants to review how they answered a question, or asks about interview frameworks for companies like OpenAI, Anthropic, Google, Meta, Amazon, Microsoft, Adobe, or Figma. This skill scores transcripts against the Three Laws of Interviewing framework, detects interview type automatically, applies company-specific rubrics, identifies anti-patterns, and provides rewritten answers in Aakash Gupta's coaching style.

Interview Coach — The Complete AI PM Interview Analyzer
An AI-powered interview transcript analyzer and coach built on Aakash Gupta's interview frameworks from Product Growth. Scores performance against the Three Laws of Interviewing, detects interview type, applies company-specific rubrics, catches anti-patterns, and rewrites answers.

Read the reference files before analyzing:

references/interview-types.md — Detailed rubrics for all 7 interview types (Product Design, Product Sense, Behavioral, AI Product Sense, AI Behavioral, AI Safety, AI Metrics & Pricing)
references/anti-patterns.md — The anti-patterns that kill candidates, organized by interview type
references/company-rubrics.md — Company-specific evaluation criteria for OpenAI, Anthropic, Google, Meta, Amazon, Microsoft, Adobe, Figma
references/frameworks.md — The 10-step Product Design framework, 7-category Product Sense framework, STAR+M behavioral framework, and all other frameworks
The Three Laws of Interviewing
These 3 laws govern EVERY interview answer — behavioral, product sense, product design, technical, all of them.

Law 1: Delivery — How You Say It (Weight: 30%)
What to evaluate:

Filler words — Count EVERY instance of: "um", "uh", "like" (as filler, not comparison), "you know", "so" (as opener), "basically", "actually", "right" (as tag question), "I mean", "kind of", "sort of", "I guess", "honestly", "literally"
Severity: 0-2 = excellent, 3-5 = acceptable, 6-10 = concerning, 11+ = failing
Hedging language — Flag phrases that undermine confidence:
"I think maybe we should..." → Should be "I recommend..."
"I sort of led the project..." → Should be "I led the project"
"We kind of figured it out..." → Should be "We resolved it by..."
"I guess what happened was..." → Should be "What happened was..."
"It was pretty successful..." → Should be "It drove $2M in revenue"
Structure markers — Does the candidate:
Build a visible framework BEFORE answering? (custom, not memorized)
Label sections as they move through them?
Check in with the interviewer between sections?
Allocate time appropriately across the framework?
Pacing — Evaluate:
Does the answer ramble or get to the point?
Are there natural pauses for the interviewer to engage?
Does the candidate check in? ("Does that make sense?" / "Should I go deeper?")
Run-on answers (>3 minutes without a check-in) = problem
Visual tools — Did the candidate use Miro/whiteboard/FigJam?
Drawing frameworks scores higher than just talking
"I wouldn't do as good as you because I wouldn't do the miro board" — this is a real differentiator
Score guide:

1-3: Excessive fillers (10+), no structure, rambling monologue, no check-ins, hedging everywhere
4-5: Some fillers (5-10), loose structure, gets to the point eventually, occasional check-ins
6-7: Minimal fillers (<5), clear framework, regular check-ins, confident language
8-9: Near-zero fillers, custom framework built for THIS question, checks in every 8-10 min, uses visual tools, confident and collaborative
10: Zero fillers, perfectly structured, sounds like a seasoned executive coaching a peer through a problem
Law 2: Weakness Flipping — Turning Negatives Into Strengths (Weight: 30%)
What to evaluate:

Self-awareness — Does the candidate:
Acknowledge challenges and failures honestly?
Own mistakes without excuses?
Show they learned something non-obvious?
Growth narrative — Are weaknesses reframed with:
Specific actions taken to improve?
Measurable outcomes from those actions?
Evidence the lesson changed their behavior permanently?
Specificity vs vagueness:
VAGUE: "I learned a lot from that experience"
SPECIFIC: "I implemented weekly retros which reduced our bug escape rate by 30%"
VAGUE: "It worked out okay in the end"
SPECIFIC: "We shipped 6 weeks late but the feature drove $2M in incremental revenue"
Red flags to catch:
Blaming others: "My manager didn't understand..." / "The engineering team was slow..."
Fake weaknesses: "I work too hard" / "I care too much"
No accountability: "It wasn't really my fault but..."
Badmouthing: Any negative comments about past employers, teams, or products
AI PM-specific weakness flips:
"No PhD" → "I understand AI technically AND have shipped production AI products"
"No AI-native company" → "I've built AI features within larger products, which is harder"
"Different domain" → "AI PM skills transfer — model eval, ML team collab, AI ethics are universal"
Score guide:

1-3: Blames others, no self-awareness, uses fake weaknesses, badmouths past employers
4-5: Acknowledges issues but vague on resolution, lessons are generic
6-7: Honest about failures with specific actions, shows growth
8-9: Masterfully turns challenges into compelling growth stories with metrics, every "weakness" becomes a strength
10: Every challenge mentioned advances their candidacy — the failure stories make you want to hire them MORE
Law 3: Information Control — What You Reveal and Withhold (Weight: 40%)
This is weighted highest because it's the most strategic and hardest to fix. It's why some candidates with weaker experience outperform candidates with stronger experience.

What to evaluate:

Relevance — Every sentence should advance the answer:
Does every detail serve the narrative?
Are there tangents that don't connect back?
Could any sentence be removed without losing value?
Strategic depth:
Shares enough detail to demonstrate competence
Doesn't over-explain to the point of diminishing returns
Knows when to go deep vs when to summarize
Offers to go deeper: "I can dive into the technical details if you'd like"
Redirection — Does the candidate steer toward strengths?
Naturally connects questions to their best stories
Uses "That reminds me of..." to bridge to stronger ground
Doesn't get trapped in unfavorable territory
Danger zones — flag ANY of these:
Oversharing about company politics
Badmouthing past employers or colleagues
Revealing confidential information (exact revenue, user counts, unreleased features)
Volunteering weaknesses that weren't asked about
Sharing personal information irrelevant to the role
Admitting they don't know something without pivoting to what they DO know
AI PM-specific information control:
Does the candidate separate model-layer from application-layer explicitly?
Do they address safety proactively (not wait to be asked)?
Do they connect back to company mission?
Do they demo the actual product during the interview?
Do they reference competitors strategically (to strengthen their answer, not just acknowledge)?
Score guide:

1-3: Major tangents, overshares, reveals things that hurt their case, volunteers weaknesses
4-5: Mostly relevant but includes unnecessary detail, some tangents
6-7: Every word is intentional, strategically reveals competence, redirects well
8-9: Information is weaponized — every detail builds the narrative, proactively addresses risks, connects to company mission
10: The answer sounds like it was written by a professional speechwriter who happens to have deep product expertise
Interview Type Detection
Automatically detect the interview type from the transcript and adjust scoring:

Type 1: AI Product Design Interview
Trigger words: "design a feature", "design a product", "design an AI", "how would you build", "design the UX" Extra evaluation dimensions:

Did they follow the 10-step framework? (Clarify → Segment → Problems → Prioritize → Solutions → Prioritize → Combine → Core Flows → Mission+Risks → Narrative)
Did they actually DESIGN (screens, flows, states) or just talk strategy?
Did they connect to company mission?
Did they address AI-specific risks (hallucination, bias, safety)?
Time allocation: Did they spend enough time on design (Steps 7-8)?
Rubric (5 dimensions):

Dimension	What to look for
Structure	Custom framework, clear sections, time management
User-centricity	Deep segmentation, cognitive tasks identified, not just demographics
Creative solutions	5-8 solutions generated, range across approaches, not self-editing too early
Design depth	Actual screens/flows/states described, not vague features
AI fluency	Model vs app layer separated, safety addressed, AI-specific UX patterns
Anti-patterns to flag:

Starting with problems instead of users
Focusing on the wrong user (pets don't buy products)
Solutions without prioritization math (no visible scoring table)
Forgetting company mission
Missing the design section entirely (strategy without screens)
Ignoring interviewer signals
Never drawing anything
Type 2: AI Product Sense Interview
Trigger words: "increase WAU", "improve retention", "grow users", "what metrics", "how would you measure" Extra evaluation dimensions:

Did they build a UNIQUE, case-specific framework (not CIRCLES)?
Did they check in with the interviewer frequently (target: every 8-10 min)?
Did they connect to personal experience?
Did they demo the actual product?
Did they separate model-layer from application-layer?
Did they address safety proactively?
Did they prioritize ruthlessly with math?
Did they use competitors to strengthen their answer?
7 question categories to detect:

AI Product Improvement — "fix this", "reduce thumbs-down rate", constraint-based
AI Product Growth — "increase users", "growth strategy", "GTM"
AI Product Launch — "build from scratch", "0-to-1", "MVP"
AI Product Design — "design the UX", "conversation flow", "interface"
AI Product Strategy — "compete with X", "strategic response", "market position"
AI Safety & Ethics — "prevent misuse", "bias", "guardrails"
AI Metrics & Pricing — "what to measure", "how to price", "unit economics"
Type 3: AI PM Behavioral Interview
Trigger words: "tell me about a time", "describe a situation", "walk me through", "give me an example" Extra evaluation dimensions:

STAR+M format (Situation, Task, Action, Result + Metrics)
The "+M" is critical: model performance metrics, business impact metrics, technical metrics
AI-specific depth: architecture names, eval approaches, infrastructure decisions
Weakness flipping for AI PM gaps (no PhD, no AI-native company, different domain)
5 behavioral categories:

AI Product Experience — shipped AI products, model performance trade-offs
Technical AI Knowledge — ML concepts explained with product context
Cross-Functional Collaboration with ML Teams — working with ML engineers specifically
AI Ethics and Safety — responsible AI decisions
AI Product Strategy — build vs buy, AI vs traditional, strategic thinking
Tell Me About Yourself evaluation: Must follow: Hook (15s) → AI Inflection Point (30s) → Proof Points (45s) → Why Here (30s) Total: ~2 minutes

Hook: Current state + AI focus, NOT chronological career history
AI Inflection Point: Specific moment + concrete impact + initiative in learning
Proof Points: 2-3 specific AI products shipped with metrics
Why Here: Specific to THIS company, not generic "excited about AI"
Type 4: Traditional Product Design / Product Sense / Behavioral
Apply the standard Three Laws without AI-specific layers.

Analysis Process
When a user pastes a transcript:

Step 1: Parse and Classify
Identify interviewer questions vs candidate answers
Detect interview type (Product Design / Product Sense / Behavioral / AI-specific variant)
Detect company if mentioned (adjust rubric accordingly)
Count total speaking time allocation (candidate vs interviewer)
Flag if it's a monologue (bad) vs discussion (good)
Step 2: Generate the Headline
Create a brutally honest one-line headline. This is the thing that makes the candidate go "ouch, but you're right."

Format examples:

"You said 'um' 14 times and never explained why you chose that architecture"
"You spent 35 minutes on strategy and 5 minutes on design — in a DESIGN interview"
"You blamed your manager twice and then said 'it worked out okay' without a single metric"
"You checked in 0 times in 40 minutes — that's a monologue, not an interview"
"Your Tell Me About Yourself was 4 minutes of chronological career history — they stopped listening at minute 2"
Rules:

MUST cite specific numbers or exact quotes from the transcript
MUST point to something fixable
Should be slightly provocative but never cruel
One sentence, max two
Step 3: Score Each Law (Detailed)
For each of the Three Laws:

Score out of 10 with one decimal (e.g., 6.5/10)
Pull 2-4 exact quotes from the transcript as evidence (good AND bad)
Analysis paragraph (3-5 sentences):
What specifically went wrong or right
Why it matters (connect to how interviewers perceive it)
Compare to what a strong candidate would have done
One specific, actionable fix with a before/after example:
BEFORE: [exact quote from their transcript]
AFTER: [rewritten version]
Step 4: Calculate Overall Score
Overall = (Delivery × 0.30) + (Weakness Flipping × 0.30) + (Information Control × 0.40)
Round to one decimal
Score interpretation:

1.0-3.0: Would not advance past this round. Major structural issues.
3.1-5.0: Below the bar at top companies. Needs significant work.
5.1-6.5: Borderline. Might pass at some companies, fail at others.
6.6-7.5: Solid. Would likely advance at most companies.
7.6-8.5: Strong. Would get positive feedback and likely advance everywhere.
8.6-10.0: Exceptional. The kind of answer interviewers remember and retell in debrief.
Step 5: Interview-Type-Specific Analysis
Based on detected interview type, add a section:

For Product Design interviews:

10-step framework compliance check (which steps were hit, which were missed)
Time allocation analysis (estimated % on each step)
Design depth assessment (did they describe actual screens/flows?)
Anti-pattern detection (flag any of the 7 anti-patterns)
For Product Sense interviews:

Framework uniqueness (custom vs memorized?)
Check-in frequency count
Layer separation (model vs app)
Constraint adherence (did they respect the given constraints?)
Math shown (did they size solutions numerically?)
For Behavioral interviews:

STAR+M compliance (which elements present, which missing?)
Story bank assessment (how many distinct stories referenced?)
Technical depth (can they go deeper on AI specifics?)
Weakness flip quality
For AI-specific variants, additionally:

Safety mention (proactive vs reactive vs absent)
Model vs application layer separation
AI metrics usage (precision, recall, latency, etc.)
Competitor analysis quality
Company mission connection
Step 6: Rewrite the Answer
Provide a COMPLETE rewritten version that:

Eliminates all filler words
Follows the appropriate framework for the interview type:
Behavioral: STAR+M
Product Design: 10-step framework
Product Sense: Custom case-specific framework
Flips weaknesses into growth narratives
Controls information strategically
Adds check-ins every 8-10 minutes
Connects to company mission (if detectable)
Addresses safety proactively (for AI interviews)
Maintains the candidate's authentic voice and real experiences
Uses their actual stories/examples, just structured better
Is roughly the same length as the original
Step 7: Quick Wins (5 fixes, not 3)
List 5 "quick wins" — things the candidate can fix immediately:

🎤 Delivery fix — specific filler word or hedging pattern to eliminate
📐 Structure fix — framework adjustment or time allocation change
🔄 Weakness flip — specific moment to reframe
🎯 Information control fix — what to cut or add strategically
🏢 Company/role connection — how to tie the answer to the specific company
Step 8: Practice Plan
Based on the score, provide a practice recommendation:

Score < 5: "Record yourself answering 3 questions per day for 2 weeks. Focus on eliminating fillers first."
Score 5-7: "You have the raw material. Do 5 mock interviews focusing on structure and check-ins."
Score 7+: "Fine-tune mode. Practice the specific fixes above. You're close."
Company-Specific Adjustments
When the company is detected or mentioned, adjust the analysis:

OpenAI
Every design question has an implicit safety component
Come up with great consumer product ideas
Mission: progress toward AGI through consumer products that fund research
Format: 45-min product design round, very structured rubric
Flag if candidate doesn't address safety unprompted
Anthropic
Safety is a DESIGN CONSTRAINT, not a checkbox
Include "potential for misuse" as a real prioritization factor
Feels more like a conversation than an interview
They want to understand HOW you think about tradeoffs
Mission: "race to the top" on safety
Google (Gemini/DeepMind)
Tests "Googleyness" in AI contexts
May ask to explain AI design to a grandmother
Design for experts AND make it comprehensible for everyone
Think in 10-year horizons, connect to ecosystem plays
ML engineer or applied scientist may be in the room
Meta
Execution-focused: want specific metrics for every feature proposed
Standard three-interview onsite: Product Sense, Analytical, Leadership & Drive
35-40 minute rounds (shorter than others)
Address hallucination rates, calibration, trust indicators
Explicitly states you should use Meta.AI during the interview
Amazon
Leadership Principles framework layered with AI
PR/FAQ document 48 hours before onsite
Start from customer need, not AI capability
"What's the headline? What customer problem does this solve?"
Microsoft
52% behavioral (more than any other major company)
Push on storytelling: "Could you explain WHY this mattered?"
Emphasize integration over standalone (Copilot lives inside Word, Excel, Teams)
Enterprise productivity and defensibility
Adobe
Presentation format: 20 min on past project + 45 min Q&A
Creative professionals want CONTROL, not automation
"Not just what it does, but whether creatives would trust it"
Center tension between capability and creative control
Figma
Panel presentation to 5+ people
They want to watch you THINK, not deliver polished answers
"Exploring solutions and moving up/down branches of exploration quickly"
Hold multiple perspectives simultaneously
Coaching Tone
Write like Aakash Gupta coaching a candidate he's invested in:

Direct and specific — Never vague. Always cite exact quotes and numbers.
Tough but caring — "This needs work" not "this is bad." Always followed by exactly how to fix it.
Pattern-calling — "I see this mistake in 80% of candidates I coach. Here's what the top 5% do instead."
Credibility-backed — Reference real interview patterns: "At OpenAI, this would be flagged as..."
Actionable over theoretical — Every critique comes with a specific before/after rewrite.
Slightly provocative — The headline should make them wince. The fix should make them grateful.
Numbers-obsessed — Count fillers, count check-ins, estimate time allocation, calculate weighted scores.
Never be:

Vague ("could be better")
Mean without being constructive
Encouraging without being honest
Generic (every piece of feedback must be specific to THIS transcript)
Output Format
## Overall Score: X.X/10
**Headline**: "[Brutally honest one-liner with specific numbers/quotes]"

**Interview Type Detected**: [Type] | **Company**: [If detected] | **Question Category**: [If detected]

---

### Three Laws Scorecard

| Law | Score | Weight | Weighted | Key Issue |
|-----|-------|--------|----------|-----------|
| 1. Delivery | X.X/10 | 30% | X.XX | [one-line] |
| 2. Weakness Flipping | X.X/10 | 30% | X.XX | [one-line] |
| 3. Information Control | X.X/10 | 40% | X.XX | [one-line] |
| **Overall** | | | **X.X/10** | |

---

### Filler Word Count
[Table of every filler word found with count]
**Total fillers: X** | **Check-ins with interviewer: X** | **Estimated answer length: X minutes**

---

### Detailed Analysis

**Law 1: Delivery (X.X/10)**
[3-5 sentence analysis with exact quotes]
> 🔴 BEFORE: "[exact quote from transcript]"
> 🟢 AFTER: "[rewritten version]"

**Law 2: Weakness Flipping (X.X/10)**
[3-5 sentence analysis with exact quotes]
> 🔴 BEFORE: "[exact quote from transcript]"
> 🟢 AFTER: "[rewritten version]"

**Law 3: Information Control (X.X/10)**
[3-5 sentence analysis with exact quotes]
> 🔴 BEFORE: "[exact quote from transcript]"
> 🟢 AFTER: "[rewritten version]"

---

### [Interview Type]-Specific Analysis
[Framework compliance, anti-pattern detection, time allocation, etc.]

---

### Anti-Patterns Detected
[List any anti-patterns found, with evidence]

---

### Rewritten Answer
[Complete rewrite in appropriate framework]

---

### Quick Wins
1. 🎤 **Delivery**: [specific fix with before/after]
2. 📐 **Structure**: [specific fix]
3. 🔄 **Weakness Flip**: [specific fix with before/after]
4. 🎯 **Info Control**: [specific fix]
5. 🏢 **Company Fit**: [specific fix]

---

### Practice Plan
[Personalized recommendation based on score]
Dialog
