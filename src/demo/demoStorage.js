const STORAGE_KEY = "squarepad_demo_v2";
const LEGACY_STORAGE_KEY = "wayfarer_demo_v1";

export const selfProfileId = "self";
export const validDemoTabs = ["timeline", "explore", "map", "messages", "groups", "profile", "insights", "admin"];

const comment = (id, authorId, body, timeLabel) => ({ id, authorId, body, timeLabel });
const message = (id, senderId, body, timeLabel) => ({ id, senderId, body, timeLabel });

const createInitialState = () => ({
  profile: {
    name: "Asim Daud",
    username: "asimdaud",
    bio: "Collecting long walks, small cafes, and the kind of places that stay with you.",
    role: "Slow-travel enthusiast",
    location: "Islamabad, Pakistan",
    followingIds: ["person-maya", "person-raymond", "person-priya", "person-lina"],
    homeBase: "Islamabad",
  },
  people: [
    { id: "person-maya", name: "Maya Torres", username: "mayat", bio: "Taking the scenic route through every city. Always looking for a good market and a better view.", role: "Photographer & curious walker", location: "Barcelona, Spain", homeBase: "Barcelona", followingIds: ["person-jordan", "person-raymond", "person-nia", "person-omar", "self"], isFollowing: true, status: "On the move", accent: "lime" },
    { id: "person-jordan", name: "Jordan Lee", username: "jlee", bio: "Weekend trains, neighborhood bakeries, and a camera roll full of side streets.", role: "Railway wanderer", location: "Austin, Texas", homeBase: "Austin", followingIds: ["person-maya", "person-zoe", "person-omar", "self"], isFollowing: false, status: "Planning a trip", accent: "amber" },
    { id: "person-raymond", name: "Raymond Kim", username: "raymondkim", bio: "A few years of one-way tickets taught me to stay an extra day.", role: "Independent traveler", location: "London, UK", homeBase: "London", followingIds: ["person-maya", "person-nia", "person-lina", "self"], isFollowing: true, status: "Around today", accent: "moss" },
    { id: "person-nia", name: "Nia Smith", username: "nias", bio: "Finding the quiet edges of loud cities and sharing the route notes.", role: "City explorer", location: "Berlin, Germany", homeBase: "Berlin", followingIds: ["person-maya", "person-priya", "self"], isFollowing: false, status: "Recently active", accent: "coral" },
    { id: "person-omar", name: "Omar Haddad", username: "ohaddad", bio: "Desert mornings, old ports, and the long way there.", role: "Slow traveler", location: "Dubai, UAE", homeBase: "Dubai", followingIds: ["person-jordan", "person-priya", "person-raymond"], isFollowing: false, status: "In the field", accent: "amber" },
    { id: "person-priya", name: "Priya Kapoor", username: "priyak", bio: "Looking for the human story behind every place. Usually near a train station.", role: "Writer & researcher", location: "Singapore", homeBase: "Singapore", followingIds: ["person-lina", "person-maya", "self"], isFollowing: true, status: "Around today", accent: "lime" },
    { id: "person-lina", name: "Lina Chen", username: "linachen", bio: "A sketchbook, one small bag, and an unreasonable number of saved bakeries.", role: "Illustrator on the road", location: "Toronto, Canada", homeBase: "Toronto", followingIds: ["person-maya", "person-nia", "self"], isFollowing: false, status: "Sketching somewhere", accent: "coral" },
    { id: "person-zoe", name: "Zoe Park", username: "zoep", bio: "Finding places by following the sound of the neighborhood.", role: "Food & culture writer", location: "Seoul, South Korea", homeBase: "Seoul", followingIds: ["person-raymond", "person-nia", "person-priya"], isFollowing: false, status: "Planning a trip", accent: "moss" },
  ],
  posts: [
    { id: "post-1", authorId: "self", caption: "First light on the trail above Sete Cidades. We took the longer path and found the whole crater to ourselves. Worth every extra step.", location: "Sete Cidades, Azores", lat: 37.86, lon: -25.79, timeLabel: "Featured", mood: "Trail notes", imageKey: "azores", hasImage: true, likesByIds: ["person-maya", "person-jordan", "person-raymond", "person-priya"], commentsData: [comment("p1-c1", "person-jordan", "Adding this to my slow list. Which trail did you take?", "4m ago"), comment("p1-c2", "person-maya", "That light is unreal. The west rim at sunrise is magic.", "2m ago")] },
    { id: "post-2", authorId: "self", caption: "A tiny breakfast counter in Kyoto, no menu in English and the best tamago sandwich I've had in years. Leave room for the second coffee.", location: "Nishiki Market, Kyoto", lat: 35.0116, lon: 135.7681, timeLabel: "Yesterday", mood: "Local find", imageKey: "kyoto", hasImage: true, likesByIds: ["person-maya", "person-raymond", "person-lina"], commentsData: [comment("p2-c1", "person-priya", "The places you stumble into are always the ones you remember.", "12m ago")] },
    { id: "post-3", authorId: "person-maya", groupId: "g-design-systems", caption: "Took the first ferry out and walked the old port before the day-trippers arrived. The bakery by the blue door opens at seven.", location: "Cadaqués, Spain", lat: 42.2889, lon: 3.2777, timeLabel: "58m ago", mood: "Local find", imageKey: "amalfi", hasImage: true, likesByIds: ["self", "person-lina", "person-nia"], commentsData: [comment("p3-c1", "person-lina", "The blue door bakery is now a landmark in my notes.", "25m ago")] },
    { id: "post-4", authorId: "person-jordan", groupId: "g-frontend-circle", caption: "The night train arrived an hour late. Nobody minded. We watched the city wake up from the station steps.", location: "Lisbon, Portugal", lat: 38.7223, lon: -9.1393, timeLabel: "1h ago", mood: "On the way", imageKey: "azores", hasImage: true, likesByIds: ["self", "person-omar"], commentsData: [comment("p4-c1", "person-raymond", "Best way to arrive, honestly.", "38m ago")] },
    { id: "post-5", authorId: "person-raymond", groupId: "g-community-lab", caption: "A walking loop for rainy London: bookshop, covered market, warm pub, then the river when the clouds finally break.", location: "South Bank, London", lat: 51.5055, lon: -0.0754, timeLabel: "2h ago", mood: "Walking route", imageKey: "kyoto", hasImage: false, likesByIds: ["self", "person-maya", "person-zoe"], commentsData: [comment("p5-c1", "self", "Saved this for the next grey Sunday.", "1h ago")] },
    { id: "post-6", authorId: "person-nia", groupId: "g-startup-builders", caption: "Found a pocket of wild green right in the middle of the city. Bring a book, not a schedule.", location: "Tempelhofer Feld, Berlin", lat: 52.4733, lon: 13.4031, timeLabel: "3h ago", mood: "Quiet corner", imageKey: "amalfi", hasImage: true, likesByIds: ["self", "person-priya"], commentsData: [comment("p6-c1", "person-zoe", "This is what I want more of in every city.", "2h ago")] },
    { id: "post-7", authorId: "person-priya", groupId: "g-product-council", caption: "Three slow hours in Little India: flower stalls, filter coffee, and a conversation with a shopkeeper about the old neighborhood.", location: "Little India, Singapore", lat: 1.3066, lon: 103.8518, timeLabel: "5h ago", mood: "Neighborhood", imageKey: "kyoto", hasImage: false, likesByIds: ["self", "person-maya", "person-lina", "person-raymond"], commentsData: [] },
    { id: "post-8", authorId: "person-lina", groupId: "g-creative-network", caption: "A long lunch in the shade, looking out at the water. The Amalfi bus is a ride, but the view makes the bends worth it.", location: "Amalfi Coast, Italy", lat: 40.6281, lon: 14.6023, timeLabel: "8h ago", mood: "On the way", imageKey: "amalfi", hasImage: true, likesByIds: ["self", "person-maya", "person-zoe"], commentsData: [comment("p8-c1", "person-omar", "Take the ferry back if you can. Completely different view.", "3h ago")] },
  ],
  conversations: [
    { id: "chat-1", profileId: "person-maya", messages: [message("m1", "person-maya", "Your Azores notes made me move my dates. Any chance you remember the name of that guesthouse?", "8m ago"), message("m2", "self", "Casa do Vale — family-run, and the breakfast is a reason to stay on its own.", "6m ago"), message("m3", "person-maya", "Perfect. I owe you a coffee when our paths cross.", "Just now")] },
    { id: "chat-2", profileId: "person-raymond", messages: [message("m4", "person-raymond", "I put the South Bank loop in the London group. Feel free to add your own stops.", "32m ago"), message("m5", "self", "Will do. Bookshop first, always.", "28m ago")] },
    { id: "chat-3", profileId: "person-jordan", messages: [message("m6", "person-jordan", "Have you done the Lisbon to Porto train? Debating an overnight stop.", "1h ago"), message("m7", "self", "Absolutely stop in Coimbra if you can spare a day.", "55m ago")] },
  ],
  groups: [
    { id: "g-frontend-circle", name: "The Long Way Round", category: "Slow travel", description: "For travelers who choose the scenic route, take the local train, and leave space in the itinerary.", imageKey: "azores", tags: ["Rail journeys", "Walking", "Slow travel"], ownerId: "person-jordan", memberIds: ["self", "person-jordan", "person-maya", "person-omar", "person-priya"], spotlight: "This week: share a route that got better when you slowed down." },
    { id: "g-design-systems", name: "Island Notes", category: "Coast & islands", description: "Ferry timetables, quiet coves, small harbors, and useful notes from the edges of the map.", imageKey: "amalfi", tags: ["Islands", "Coastal walks", "Ferries"], ownerId: "person-maya", memberIds: ["self", "person-maya", "person-jordan", "person-lina", "person-priya"], spotlight: "Current thread: the island you would return to tomorrow." },
    { id: "g-startup-builders", name: "A Table for One More", category: "Food & culture", description: "The best meal is usually the one you found by asking someone who lives there.", imageKey: "kyoto", tags: ["Markets", "Coffee", "Neighborhoods"], ownerId: "person-nia", memberIds: ["self", "person-nia", "person-zoe", "person-raymond"], spotlight: "Current thread: the tiny place you almost walked past." },
    { id: "g-creative-network", name: "Field Notes Club", category: "Travel journals", description: "A shared notebook for small observations, unhurried days, and stories that don't fit on a checklist.", imageKey: "azores", tags: ["Journals", "Photography", "Stories"], ownerId: "person-lina", memberIds: ["self", "person-lina", "person-maya", "person-priya", "person-zoe"], spotlight: "Featured prompt: what detail made a place feel like yours?" },
    { id: "g-community-lab", name: "City on Foot", category: "Walking routes", description: "Thoughtful city walks built by people who know where to turn, pause, and look up.", imageKey: "amalfi", tags: ["Walking", "City guides", "Local"], ownerId: "person-raymond", memberIds: ["self", "person-raymond", "person-maya", "person-zoe"], spotlight: "Open call: a two-hour walk with one excellent coffee stop." },
    { id: "g-product-council", name: "Window Seat Society", category: "Getting there", description: "Train rides, ferry decks, and the in-between places that become the best part of a trip.", imageKey: "kyoto", tags: ["Rail", "Ferries", "Routes"], ownerId: "person-priya", memberIds: ["self", "person-priya", "person-nia", "person-jordan"], spotlight: "Today: where has the journey been better than the arrival?" },
  ],
  places: [],
});

export const getDemoState = () => {
  try {
    const currentStorage = localStorage.getItem(STORAGE_KEY);
    const legacyStorage = localStorage.getItem(LEGACY_STORAGE_KEY);
    const saved = JSON.parse(currentStorage || legacyStorage || "null");
    if (!currentStorage && legacyStorage && saved) localStorage.setItem(STORAGE_KEY, legacyStorage);
    const initial = createInitialState();
    if (!saved || saved.version !== 1) {
      const fresh = { ...initial, version: 1 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    return {
      ...initial,
      ...saved,
      profile: { ...initial.profile, ...(saved.profile || {}) },
      people: Array.isArray(saved.people) ? saved.people : initial.people,
      posts: Array.isArray(saved.posts)
        ? saved.posts.map((post) => {
          const seededPost = initial.posts.find((item) => item.id === post.id);
          return seededPost
            ? { ...seededPost, ...post, lat: post.lat ?? seededPost.lat, lon: post.lon ?? seededPost.lon }
            : post;
        })
        : initial.posts,
      conversations: Array.isArray(saved.conversations) ? saved.conversations : initial.conversations,
      groups: Array.isArray(saved.groups) ? saved.groups : initial.groups,
      places: Array.isArray(saved.places) ? saved.places : initial.places,
      version: 1,
    };
  } catch {
    return { ...createInitialState(), version: 1 };
  }
};

export const saveDemoState = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: 1 })); } catch { /* storage may be unavailable */ }
};

export const resetDemoState = () => {
  const initial = { ...createInitialState(), version: 1 };
  saveDemoState(initial);
  return initial;
};
