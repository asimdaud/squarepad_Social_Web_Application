const STORAGE_KEY = "squarepad_portfolio_demo_v7";

export const selfProfileId = "self";
export const validDemoTabs = ["timeline", "profile", "messages", "groups", "admin"];

const createComment = (id, authorId, body, timeLabel) => ({
  id,
  authorId,
  body,
  timeLabel,
});

const createMessage = (id, senderId, body, timeLabel) => ({
  id,
  senderId,
  body,
  timeLabel,
});

const createInitialState = () => ({
  settings: {
    theme: "light",
  },
  profile: {
    name: "Asim Daud",
    username: "asimdaud",
    bio: "Built SquarePad to explore what a social platform feels like when feed, profile, chat, groups, and community health all feel like one coherent product.",
    role: "Product Designer & Frontend Engineer",
    location: "Islamabad, PK",
    followingIds: ["person-maya", "person-raymond", "person-priya", "person-lina"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  people: [
    {
      id: "person-maya",
      name: "Maya Torres",
      username: "mayat",
      bio: "Design lead focused on product storytelling, motion systems, and maker communities.",
      role: "Creative Lead",
      location: "Barcelona, ES",
      coverImageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
      followingIds: ["person-jordan", "person-raymond", "person-nia", "person-omar", "self"],
      isFollowing: true,
      status: "Active now",
      accent: "cyan",
    },
    {
      id: "person-jordan",
      name: "Jordan Lee",
      username: "jlee",
      bio: "Frontend engineer who loves practical UI systems and snappy social interactions.",
      role: "Frontend Engineer",
      location: "Austin, US",
      coverImageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
      followingIds: ["person-maya", "person-zoe", "person-omar", "self"],
      isFollowing: false,
      status: "Away",
      accent: "amber",
    },
    {
      id: "person-raymond",
      name: "Raymond Kim",
      username: "raymondkim",
      bio: "Community manager highlighting new groups, welcoming members, and keeping the feed healthy.",
      role: "Community Lead",
      location: "London, UK",
      coverImageUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
      followingIds: ["person-maya", "person-nia", "person-lina", "self"],
      isFollowing: true,
      status: "Online",
      accent: "rose",
    },
    {
      id: "person-nia",
      name: "Nia Smith",
      username: "nias",
      bio: "Independent founder sharing product notes, launch experiments, and honest reflections.",
      role: "Founder",
      location: "Berlin, DE",
      coverImageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80",
      followingIds: ["person-maya", "person-priya", "self"],
      isFollowing: false,
      status: "Recently active",
      accent: "green",
    },
    {
      id: "person-omar",
      name: "Omar Haddad",
      username: "ohaddad",
      bio: "Engineer building fast prototypes, polished interfaces, and the tooling behind them.",
      role: "Product Engineer",
      location: "Dubai, AE",
      coverImageUrl:
        "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80",
      followingIds: ["person-jordan", "person-priya", "person-raymond"],
      isFollowing: false,
      status: "Heads down",
      accent: "cyan",
    },
    {
      id: "person-priya",
      name: "Priya Kapoor",
      username: "priyak",
      bio: "Researcher translating user behavior into product decisions and calm, confident flows.",
      role: "Product Researcher",
      location: "Singapore, SG",
      coverImageUrl:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
      followingIds: ["person-lina", "person-maya", "self"],
      isFollowing: true,
      status: "In review",
      accent: "amber",
    },
    {
      id: "person-lina",
      name: "Lina Chen",
      username: "linachen",
      bio: "Brand and visual designer turning product surfaces into memorable experiences.",
      role: "Brand Designer",
      location: "Toronto, CA",
      coverImageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
      followingIds: ["person-maya", "person-nia", "self"],
      isFollowing: false,
      status: "Sketching",
      accent: "rose",
    },
    {
      id: "person-zoe",
      name: "Zoe Park",
      username: "zoep",
      bio: "Growth-minded operator balancing community momentum, events, and launch energy.",
      role: "Growth Lead",
      location: "Seoul, KR",
      coverImageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      followingIds: ["person-raymond", "person-nia", "person-priya"],
      isFollowing: false,
      status: "Planning a launch",
      accent: "green",
    },
  ],
  posts: [
    {
      id: "post-1",
      authorId: selfProfileId,
      caption:
        "Rebuilt SquarePad into a portfolio-safe demo without flattening the product. The challenge was keeping feed, chat, groups, and admin feeling alive at the same time.",
      timeLabel: "Featured",
      mood: "Launch",
      hasImage: true,
      imageUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      likesByIds: ["person-maya", "person-jordan", "person-raymond", "person-priya"],
      commentsData: [
        createComment("p1-c1", "person-jordan", "The flow feels production-ready now.", "4m ago"),
        createComment("p1-c2", "person-maya", "This is the kind of portfolio artifact that explains itself.", "2m ago"),
      ],
    },
    {
      id: "post-2",
      authorId: selfProfileId,
      caption:
        "The hardest design problem here was tone. The timeline wants energy, profile wants intimacy, groups want warmth, and admin needs clarity without feeling sterile.",
      timeLabel: "24m ago",
      mood: "Systems",
      hasImage: true,
      imageUrl:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      likesByIds: ["person-maya", "person-raymond", "person-lina"],
      commentsData: [
        createComment("p2-c1", "person-priya", "That tonal balance is what makes it feel like one product.", "12m ago"),
      ],
    },
    {
      id: "post-3",
      authorId: "person-maya",
      groupId: "g-design-systems",
      caption:
        "The profile view is finally strong enough to stand on its own. It feels more like a creator space and less like a settings screen.",
      timeLabel: "58m ago",
      mood: "Review",
      hasImage: true,
      imageUrl:
        "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
      likesByIds: [selfProfileId, "person-lina", "person-nia"],
      commentsData: [
        createComment("p3-c1", "person-lina", "The pacing and hierarchy are much better now.", "25m ago"),
      ],
    },
    {
      id: "post-4",
      authorId: "person-jordan",
      groupId: "g-frontend-circle",
      caption:
        "Thread switching feels fast, and the follow/message states finally have enough friction and feedback to feel believable.",
      timeLabel: "1h ago",
      mood: "Feedback",
      hasImage: true,
      imageUrl:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80",
      likesByIds: [selfProfileId, "person-omar"],
      commentsData: [
        createComment("p4-c1", "person-raymond", "The new feedback rhythm is a big improvement.", "38m ago"),
      ],
    },
    {
      id: "post-5",
      authorId: "person-raymond",
      groupId: "g-community-lab",
      caption:
        "Community features matter most when they create momentum without looking busy. SquarePad is getting close to that balance now.",
      timeLabel: "2h ago",
      mood: "Community",
      hasImage: false,
      likesByIds: [selfProfileId, "person-maya", "person-zoe"],
      commentsData: [
        createComment("p5-c1", selfProfileId, "That balance is exactly what I was chasing.", "1h ago"),
      ],
    },
    {
      id: "post-6",
      authorId: "person-nia",
      groupId: "g-startup-builders",
      caption:
        "I love that the new groups area can actually carry the story of the product instead of being a decorative grid.",
      timeLabel: "3h ago",
      mood: "Founders",
      hasImage: true,
      imageUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      likesByIds: [selfProfileId, "person-priya"],
      commentsData: [
        createComment("p6-c1", "person-zoe", "The join flow and member list really help.", "2h ago"),
      ],
    },
    {
      id: "post-7",
      authorId: "person-priya",
      groupId: "g-product-council",
      caption:
        "The strongest thing about this demo is that every click pays off. Nothing feels dead or placeholder-only anymore.",
      timeLabel: "5h ago",
      mood: "Research",
      hasImage: false,
      likesByIds: [selfProfileId, "person-maya", "person-lina", "person-raymond"],
      commentsData: [],
    },
    {
      id: "post-8",
      authorId: "person-lina",
      groupId: "g-creative-network",
      caption:
        "The light theme gives the product a much broader range. It now feels portfolio-ready for people outside the very technical crowd too.",
      timeLabel: "8h ago",
      mood: "Visual",
      hasImage: true,
      imageUrl:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      likesByIds: [selfProfileId, "person-maya", "person-zoe"],
      commentsData: [
        createComment("p8-c1", "person-omar", "The dark mode still looks strong too.", "3h ago"),
      ],
    },
  ],
  conversations: [
    {
      id: "chat-1",
      profileId: "person-maya",
      messages: [
        createMessage("m1", "person-maya", "The feed composer feels premium now. The smaller motions are doing the right amount of work.", "8m ago"),
        createMessage("m2", selfProfileId, "That was the goal. I wanted it to feel intentional without screaming for attention.", "6m ago"),
        createMessage("m3", "person-maya", "It reads like a product, not a mockup.", "Just now"),
      ],
    },
    {
      id: "chat-2",
      profileId: "person-raymond",
      messages: [
        createMessage("m4", "person-raymond", "The new groups interactions finally explain why the community layer matters.", "32m ago"),
        createMessage("m5", selfProfileId, "Exactly. I wanted groups to feel inhabited, not decorative.", "28m ago"),
      ],
    },
    {
      id: "chat-3",
      profileId: "person-jordan",
      messages: [
        createMessage("m6", "person-jordan", "The profile route is much clearer now that self and person views are separated.", "1h ago"),
        createMessage("m7", selfProfileId, "That identity split fixed a lot of weird context bugs.", "55m ago"),
      ],
    },
  ],
  groups: [
    {
      id: "g-frontend-circle",
      name: "Frontend Circle",
      category: "UI Systems",
      description:
        "A focused space for interaction design, component systems, animation experiments, and launch feedback from builders who care about the details.",
      imageUrl:
        "https://images.unsplash.com/photo-1516382799247-87df95d790b7?auto=format&fit=crop&w=1000&q=80",
      tags: ["React", "UI", "Motion", "A11y"],
      ownerId: "person-jordan",
      memberIds: [selfProfileId, "person-jordan", "person-maya", "person-omar", "person-priya"],
      spotlight: "This week: critique the motion pass and tighten keyboard states.",
    },
    {
      id: "g-design-systems",
      name: "Design Systems Lab",
      category: "Design Systems",
      description:
        "A home for component language, interaction consistency, tokens, editorial UX decisions, and the design-engineering details that make products feel finished.",
      imageUrl:
        "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1000&q=80",
      tags: ["Tokens", "Components", "Design Ops", "Patterns"],
      ownerId: "person-maya",
      memberIds: [
        selfProfileId,
        "person-maya",
        "person-jordan",
        "person-lina",
        "person-priya",
      ],
      spotlight: "Current lab: how far can a lightweight token system carry a demo into interview-ready territory?",
    },
    {
      id: "g-startup-builders",
      name: "Startup Builders",
      category: "Founders",
      description:
        "Builders sharing launch plans, pivots, roadmap decisions, and the traction updates that tell the real story.",
      imageUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
      tags: ["Growth", "Launch", "Product"],
      ownerId: "person-nia",
      memberIds: [selfProfileId, "person-nia", "person-zoe", "person-raymond"],
      spotlight: "Current thread: what makes a portfolio project feel hireable instead of academic?",
    },
    {
      id: "g-creative-network",
      name: "Creative Network",
      category: "Culture",
      description:
        "A broad creative collective for designers, artists, writers, and side-project founders who care about craft above all else.",
      imageUrl:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80",
      tags: ["Brand", "Design", "Writing", "Community"],
      ownerId: "person-lina",
      memberIds: [selfProfileId, "person-lina", "person-maya", "person-priya", "person-zoe"],
      spotlight: "Featured prompt: design one detail today that reviewers will remember tomorrow.",
    },
    {
      id: "g-community-lab",
      name: "Community Lab",
      category: "Operations",
      description:
        "The place for onboarding rituals, moderation flows, healthy conversation systems, and community health thinking.",
      imageUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
      tags: ["Safety", "Moderation", "Community"],
      ownerId: "person-raymond",
      memberIds: [selfProfileId, "person-raymond", "person-maya", "person-zoe"],
      spotlight: "Open review: which moderation signals deserve dashboard space?",
    },
    {
      id: "g-product-council",
      name: "Product Council",
      category: "Strategy",
      description:
        "Deep dives on product decisions, research readouts, prioritization tradeoffs, and the stories behind the roadmap.",
      imageUrl:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
      tags: ["PM", "Research", "Roadmaps"],
      ownerId: "person-priya",
      memberIds: [selfProfileId, "person-priya", "person-nia", "person-jordan"],
      spotlight: "Today: how much polish changes the perception of product quality in interviews.",
    },
  ],
  admin: {
    queue: [
      {
        id: "q-1",
        title: "Content review",
        note: "One group post is waiting for a final moderation pass before getting featured.",
        status: "Pending",
      },
      {
        id: "q-2",
        title: "Group launch",
        note: "Creative Network is preparing a new weekly prompt and needs the hero slot.",
        status: "Review",
      },
      {
        id: "q-3",
        title: "Safety check",
        note: "Conversation health is strong, but one thread needs a follow-up from the community lead.",
        status: "Stable",
      },
    ],
  },
});

const normalizeComments = (comments, fallbackComments = []) => {
  const source = Array.isArray(comments) ? comments : [];
  const base = source.length > 0 ? source : fallbackComments;

  return base.map((comment, index) => ({
    id: comment.id || `comment-${index + 1}`,
    authorId: comment.authorId || fallbackComments[index]?.authorId || selfProfileId,
    body: comment.body || "",
    timeLabel: comment.timeLabel || "Just now",
  }));
};

const normalizePost = (post, fallbackPost) => {
  const fallback = fallbackPost || {};
  const source = post || {};
  const commentsData = normalizeComments(source.commentsData, fallback.commentsData || []);

  return {
    ...fallback,
    ...source,
    commentsData,
    likesByIds:
      Array.isArray(source.likesByIds) && source.likesByIds.length >= 0
        ? source.likesByIds
        : fallback.likesByIds || [],
  };
};

const normalizePerson = (person, fallbackPerson) => {
  const fallback = fallbackPerson || {};
  const source = person || {};

  return {
    ...fallback,
    ...source,
    followingIds:
      Array.isArray(source.followingIds) && source.followingIds.length >= 0
        ? source.followingIds
        : fallback.followingIds || [],
    isFollowing: Boolean(source.isFollowing),
  };
};

const normalizeConversation = (conversation, fallbackConversation) => {
  const fallback = fallbackConversation || {};
  const source = conversation || {};

  return {
    ...fallback,
    ...source,
    messages:
      Array.isArray(source.messages) && source.messages.length > 0
        ? source.messages.map((message, index) => ({
            id: message.id || `message-${index + 1}`,
            senderId: message.senderId || fallback.messages?.[index]?.senderId || selfProfileId,
            body: message.body || "",
            timeLabel: message.timeLabel || "Just now",
          }))
        : fallback.messages || [],
  };
};

const normalizeGroup = (group, fallbackGroup) => {
  const fallback = fallbackGroup || {};
  const source = group || {};

  return {
    ...fallback,
    ...source,
    tags:
      Array.isArray(source.tags) && source.tags.length > 0 ? source.tags : fallback.tags || [],
    memberIds:
      Array.isArray(source.memberIds) && source.memberIds.length > 0
        ? source.memberIds
        : fallback.memberIds || [selfProfileId],
  };
};

const mergeDemoState = (saved = {}) => {
  const init = createInitialState();
  const savedPosts = Array.isArray(saved.posts) ? saved.posts : [];

  return {
    ...init,
    ...saved,
    settings: { ...init.settings, ...(saved.settings || {}) },
    profile: {
      ...init.profile,
      ...(saved.profile || {}),
      followingIds:
        saved.profile && Array.isArray(saved.profile.followingIds)
          ? saved.profile.followingIds
          : init.profile.followingIds,
    },
    people:
      Array.isArray(saved.people) && saved.people.length > 0
        ? saved.people.map((person, index) =>
            normalizePerson(person, init.people[index % init.people.length])
          )
        : init.people,
    posts:
      savedPosts.length > 0
        ? savedPosts.map((post, index) => normalizePost(post, init.posts[index % init.posts.length]))
        : init.posts,
    conversations:
      Array.isArray(saved.conversations) && saved.conversations.length > 0
        ? saved.conversations.map((conversation, index) =>
            normalizeConversation(conversation, init.conversations[index % init.conversations.length])
          )
        : init.conversations,
    groups:
      Array.isArray(saved.groups) && saved.groups.length > 0
        ? saved.groups.map((group, index) =>
            normalizeGroup(group, init.groups[index % init.groups.length])
          )
        : init.groups,
    admin: {
      ...init.admin,
      ...(saved.admin || {}),
      queue:
        saved.admin && Array.isArray(saved.admin.queue) && saved.admin.queue.length > 0
          ? saved.admin.queue
          : init.admin.queue,
    },
  };
};

export const getDemoState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = createInitialState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const merged = mergeDemoState(JSON.parse(raw));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    const initial = createInitialState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
};

export const saveDemoState = (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

export const resetDemoState = () => {
  const initial = createInitialState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};
