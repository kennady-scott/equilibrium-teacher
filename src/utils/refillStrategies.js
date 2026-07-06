// Quick Refill strategies — tiny nervous-system resets for teachers.
// `seconds` is how long the strategy takes; the picker offers a strategy that
// fits within the time the teacher says they have.
export const REFILL_STRATEGIES = [
  // ── 30 seconds ──────────────────────────────────────────────
  { title: 'The 30-Second Drop', seconds: 30, body: 'Drop your shoulders. Unclench your jaw. Let your tongue rest. Take one slow breath. That counts.' },
  { title: 'Before You Open the Email', seconds: 30, body: 'Put both feet on the floor. Take one breath. Ask: Does this need an answer right now? If not, come back later.' },
  { title: 'The Doorway Pause', seconds: 30, body: 'Before you walk into your classroom, stop for one breath. Inhale: I am here. Exhale: One thing at a time.' },
  { title: 'The Hand Reset', seconds: 30, body: 'Unclench your hands. Stretch your fingers wide. Make two slow fists. Shake your hands out.' },
  { title: 'The Mirror Check-In', seconds: 30, body: 'Ask yourself: How am I doing, really? Whatever the answer is, you don’t have to fix it right now.' },
  { title: 'The Forehead Reset', seconds: 30, body: 'Raise your eyebrows as high as you can. Hold for three seconds. Release completely. Repeat twice.' },
  { title: 'The Name-It Moment', seconds: 30, body: 'Finish this sentence: Right now, I feel ______. No explanation required.' },
  { title: 'The Between-Classes Reset', seconds: 30, body: 'Shake out your hands. Roll your shoulders backward. Take one breath. New class. New moment.' },
  { title: 'The Pippin Pause', seconds: 30, body: 'Do nothing. Seriously. No breathing technique. No reflection question. No productivity. Pippin will wait with you. ❤️' },

  // ── 1 minute ────────────────────────────────────────────────
  { title: 'The Hallway Reset', seconds: 60, body: 'On your way to your next task, notice three things you can see, two things you can hear, and one thing you can feel. You’re here.' },
  { title: 'The Cold Coffee Check-In', seconds: 60, body: 'While you take three sips of your drink, ask: What do I need most right now? Don’t solve it. Just notice.' },
  { title: 'The Window Break', seconds: 60, body: 'Look out a window. Find the farthest thing you can see. Let your eyes rest there for three slow breaths.' },
  { title: 'The After-the-Bell Exhale', seconds: 60, body: 'When the room finally gets quiet, don’t move yet. Sit. Let your exhale be a little longer than your inhale.' },
  { title: 'The Tiny No', seconds: 60, body: 'Think of one thing you can say no to today. Not forever. Just today.' },
  { title: 'The 3-Breath Transition', seconds: 60, body: 'One breath for what happened. One for where you are now. One for what comes next.' },
  { title: 'The Good Thing You Missed', seconds: 60, body: 'Find one small moment from today that felt good. A student joke. Warm coffee. Sunlight. A lesson that clicked. Stay with it for a few seconds.' },
  { title: 'The One-Line Brain Dump', seconds: 60, body: 'Write down the one thought taking up the most space in your brain. Just one sentence. You don’t have to do anything about it yet.' },
  { title: 'The Teacher Chair Reset', seconds: 60, body: 'Sit all the way back in your chair. Put both feet down. Let the chair hold your weight for one full minute.' },
  { title: 'The Permission Slip', seconds: 60, body: 'Finish this sentence: Today, I give myself permission to ______. Keep it small.' },
  { title: 'The Sound Refill', seconds: 60, body: 'Close your eyes if that’s comfortable. Find the farthest sound you can hear. Then find the closest.' },
  { title: 'The Phone-Down Minute', seconds: 60, body: 'Turn your phone face down. Look around the room you’re actually in. Stay there for one minute.' },

  // ── 2 minutes ───────────────────────────────────────────────
  { title: 'The Parking Lot Release', seconds: 120, body: 'Before you drive home, name one thing that went well, one thing that was hard, and one thing you’re leaving at school.' },
  { title: 'The Water Bottle Refill', seconds: 120, body: 'Go fill your water bottle. While it fills, do absolutely nothing else. No scrolling. No email. Just wait.' },
  { title: 'The Desk Reset', seconds: 120, body: 'Clear one tiny space on your desk—just enough room for your hands. Stop there. You don’t have to clean the whole room.' },
  { title: 'The Outside Air Refill', seconds: 120, body: 'Step outside. Notice the temperature before deciding whether you like it. Look at the sky. Take three breaths.' },
  { title: 'The One-Thing List', seconds: 120, body: 'Look at your list. Choose the one thing that matters most today. Let everything else be secondary for now.' },
  { title: 'The End-of-Day Evidence', seconds: 120, body: 'Name three things you did today that no evaluation rubric will ever measure.' },
  { title: 'The Before-Bed Release', seconds: 120, body: 'Name one thing that can wait until tomorrow. Then say: I am allowed to stop for today.' },

  // ── 3 minutes ───────────────────────────────────────────────
  { title: 'The One-Song Refill', seconds: 180, body: 'Put on one song you love. No email. No grading. No multitasking. Just one song.' },
  { title: 'The Nowhere Walk', seconds: 180, body: 'Walk without trying to accomplish anything. Down the hall. Around the building. Across the parking lot. Then come back.' },
];

// Human label for a duration in seconds
export const durationLabel = (s) => (s < 60 ? `${s} SEC` : `${s / 60} MIN`);

// Pick a random strategy that fits within the available time (seconds).
export function pickRefill(maxSeconds, excludeTitle) {
  let pool = REFILL_STRATEGIES.filter(s => s.seconds <= maxSeconds && s.title !== excludeTitle);
  if (pool.length === 0) pool = REFILL_STRATEGIES.filter(s => s.seconds <= maxSeconds);
  return pool[Math.floor(Math.random() * pool.length)];
}
