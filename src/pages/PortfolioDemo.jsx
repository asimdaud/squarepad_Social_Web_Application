import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormGroup,
  Input,
  Progress,
  Row,
} from "reactstrap";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import {
  getDemoState,
  resetDemoState,
  saveDemoState,
  selfProfileId,
  validDemoTabs,
} from "../demo/demoStorage";
import "../assets/css/portfolio-demo.css";

const tabMeta = {
  timeline: {
    label: "Timeline",
    eyebrow: "Live Feed",
    title: "A social product demo with believable motion, identity, and interaction depth.",
    description:
      "Compose posts, react to other creators, move between profiles, and show the whole product system without depending on auth or paid backend features.",
  },
  profile: {
    label: "Profile",
    eyebrow: "Identity System",
    title: "Profiles feel connected because every surface resolves from the same person graph.",
    description:
      "Edit your own profile, browse anyone else, and see names, handles, comments, chats, and groups stay in sync across the entire app.",
  },
  messages: {
    label: "Messages",
    eyebrow: "Conversation Layer",
    title: "Messaging stays contextual instead of floating as a disconnected demo panel.",
    description:
      "Open threads from people, comments, and group members, then jump back to a profile without losing the story of who you are talking to.",
  },
  groups: {
    label: "Groups",
    eyebrow: "Community Rooms",
    title: "Groups are real spaces with owners, members, activity, and a reason to click deeper.",
    description:
      "Join communities, browse their members, inspect group-led conversations, and show how SquarePad expands beyond feed and chat into social structure.",
  },
  admin: {
    label: "Admin",
    eyebrow: "Health Dashboard",
    title: "The admin layer now reflects actual activity rather than cinematic placeholder metrics.",
    description:
      "Surface live totals, strongest posts, active groups, and conversation load directly from the same demo data powering the rest of the product.",
  },
};

const reactionDefs = [
  { key: "like", label: "Like", icon: "heart" },
  { key: "comment", label: "Comment", icon: "bubble" },
  { key: "share", label: "Share", icon: "share" },
];

const placeholderPalettes = [
  ["#EFF6FF", "#DBEAFE", "#1E3A8A"],
  ["#F5F3FF", "#EDE9FE", "#5B21B6"],
  ["#ECFDF5", "#D1FAE5", "#065F46"],
  ["#FEF3C7", "#FDE68A", "#92400E"],
  ["#FFE4E6", "#FECDD3", "#9F1239"],
];

const cardMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] },
};

const listMotion = (index = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.2,
    delay: Math.min(index * 0.04, 0.2),
    ease: [0.2, 0.8, 0.2, 1],
  },
});

const waitForPolish = (ms = 220) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const hashString = (value = "") =>
  value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

const createPlaceholderDataUri = (label = "SquarePad") => {
  const [bgStart, bgEnd, textColor] =
    placeholderPalettes[hashString(label) % placeholderPalettes.length];
  const mark = initials(label) || "SP";
  const safeLabel = label.slice(0, 28);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgStart}" />
          <stop offset="100%" stop-color="${bgEnd}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)" rx="40" />
      <circle cx="1000" cy="140" r="140" fill="rgba(255,255,255,0.4)" />
      <circle cx="160" cy="670" r="190" fill="rgba(255,255,255,0.35)" />
      <text x="100" y="355" font-size="170" font-family="Arial, sans-serif" font-weight="700" fill="${textColor}">${mark}</text>
      <text x="104" y="435" font-size="46" font-family="Arial, sans-serif" fill="${textColor}" opacity="0.88">${safeLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const pluralize = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

const ReactionIcon = ({ type }) => {
  if (type === "heart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 21s-7.2-4.3-9.6-8.9C.4 8 .9 4.8 3.5 3.1 6 .9 9.2 1.4 12 4.1 14.8 1.4 18 .9 20.5 3.1c2.6 1.7 3.1 4.9 1.1 9-2.4 4.6-9.6 8.9-9.6 8.9Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "bubble") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M20 3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3v3.2c0 .6.7.9 1.1.5L11.8 18H20a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-2 8H6V9h12v2Zm0-4H6V5h12v2Zm-6 8H6v-2h6v2Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M14.5 5.5 20 11l-5.5 5.5M20 11H8.5a4 4 0 0 0-4 4v3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Avatar = ({ name, size = "md", accent = "default" }) => (
  <div className={`sp-avatar sp-avatar-${size} accent-${accent}`} aria-hidden="true">
    {initials(name) || "?"}
  </div>
);

const SafeMediaImage = ({ src, alt, label, className = "", height = 180 }) => {
  const [resolvedSrc, setResolvedSrc] = useState(src || createPlaceholderDataUri(label));

  useEffect(() => {
    setResolvedSrc(src || createPlaceholderDataUri(label));
  }, [label, src]);

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={`sp-media-image ${className}`}
      style={{ height, width: "100%", objectFit: "cover" }}
      loading="lazy"
      onError={() => setResolvedSrc(createPlaceholderDataUri(label))}
    />
  );
};

const PortfolioDemo = ({ history, match }) => {
  const routeTab = match?.params?.tab;
  const initialDemoState = getDemoState();

  const [demoState, setDemoState] = useState(() => initialDemoState);
  const [activeTab, setActiveTab] = useState(
    validDemoTabs.includes(routeTab) ? routeTab : "timeline"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [draftPost, setDraftPost] = useState("");
  const [chatDraft, setChatDraft] = useState("");
  const [profileDraft, setProfileDraft] = useState(() => initialDemoState.profile);
  const [profileViewMode, setProfileViewMode] = useState("self");
  const [selectedPersonId, setSelectedPersonId] = useState(
    () => initialDemoState.people[0]?.id || null
  );
  const [selectedGroupId, setSelectedGroupId] = useState(
    () => initialDemoState.groups[0]?.id || null
  );
  const [activeConversationId, setActiveConversationId] = useState(
    () => initialDemoState.conversations[0]?.id || null
  );
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [openPostMenuId, setOpenPostMenuId] = useState(null);
  const [pendingPost, setPendingPost] = useState(false);
  const [pendingProfile, setPendingProfile] = useState(false);
  const [pendingReset, setPendingReset] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(false);
  const [pendingCommentPostId, setPendingCommentPostId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [pendingPanelFocus, setPendingPanelFocus] = useState(false);
  const panelHeadingRef = useRef(null);
  const menuTriggerRefs = useRef({});

  useEffect(() => {
    saveDemoState(demoState);
  }, [demoState]);

  useEffect(() => {
    setProfileDraft(demoState.profile);
  }, [demoState.profile]);

  useEffect(() => {
    if (!routeTab || !validDemoTabs.includes(routeTab)) {
      history.replace("/demo/timeline");
      return;
    }
    setActiveTab(routeTab);
  }, [history, routeTab]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!event.target.closest(".portfolio-post-menu")) {
        setOpenPostMenuId(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!openPostMenuId) return undefined;

    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      const trigger = menuTriggerRefs.current[openPostMenuId];
      setOpenPostMenuId(null);
      if (trigger) {
        window.setTimeout(() => trigger.focus(), 0);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [openPostMenuId]);

  useEffect(() => {
    if (!pendingPanelFocus || !panelHeadingRef.current) return undefined;

    const frame = window.requestAnimationFrame(() => {
      panelHeadingRef.current.focus();
      setPendingPanelFocus(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeConversationId, activeTab, pendingPanelFocus, profileViewMode, selectedGroupId, selectedPersonId]);

  useEffect(() => {
    if (!statusMessage) return undefined;

    const timeoutId = window.setTimeout(() => setStatusMessage(""), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [statusMessage]);

  const updateDemoState = (updater) => {
    setDemoState((state) => updater(state));
  };

  const updatePosts = (updater) => {
    updateDemoState((state) => ({ ...state, posts: updater(state.posts) }));
  };

  const updateGroups = (updater) => {
    updateDemoState((state) => ({ ...state, groups: updater(state.groups) }));
  };

  const updateConversations = (updater) => {
    updateDemoState((state) => ({ ...state, conversations: updater(state.conversations) }));
  };

  const selfFollowingIds = useMemo(() => {
    const fallbackIds = demoState.people.filter((person) => person.isFollowing).map((person) => person.id);
    const ids =
      Array.isArray(demoState.profile.followingIds) && demoState.profile.followingIds.length >= 0
        ? demoState.profile.followingIds
        : fallbackIds;

    return [...new Set(ids)].filter((id) =>
      demoState.people.some((person) => person.id === id)
    );
  }, [demoState.people, demoState.profile.followingIds]);

  const selfProfile = useMemo(
    () => ({
      id: selfProfileId,
      accent: "violet",
      status: "Signed in",
      ...demoState.profile,
      followingIds: selfFollowingIds,
    }),
    [demoState.profile, selfFollowingIds]
  );

  const peopleProfiles = useMemo(
    () =>
      demoState.people.map((person) => ({
        ...person,
        isFollowing: selfFollowingIds.includes(person.id),
      })),
    [demoState.people, selfFollowingIds]
  );

  const profiles = useMemo(() => [selfProfile, ...peopleProfiles], [peopleProfiles, selfProfile]);

  const profilesById = useMemo(
    () =>
      profiles.reduce((accumulator, profile) => {
        accumulator[profile.id] = profile;
        return accumulator;
      }, {}),
    [profiles]
  );

  const followerCountsById = useMemo(() => {
    const counts = profiles.reduce((accumulator, profile) => {
      accumulator[profile.id] = 0;
      return accumulator;
    }, {});

    profiles.forEach((profile) => {
      const followingIds =
        profile.id === selfProfileId ? selfFollowingIds : profile.followingIds || [];
      followingIds.forEach((followedId) => {
        if (typeof counts[followedId] === "number") {
          counts[followedId] += 1;
        }
      });
    });

    return counts;
  }, [profiles, selfFollowingIds]);

  const groupsById = useMemo(
    () =>
      demoState.groups.reduce((accumulator, group) => {
        accumulator[group.id] = group;
        return accumulator;
      }, {}),
    [demoState.groups]
  );

  const decoratedPosts = useMemo(
    () =>
      demoState.posts.map((post) => {
        const author = profilesById[post.authorId] || selfProfile;
        const likesByIds = [...new Set(post.likesByIds || [])].filter((id) => profilesById[id]);
        const commentsData = (post.commentsData || []).map((comment) => ({
          ...comment,
          author: profilesById[comment.authorId] || selfProfile,
          isMine: comment.authorId === selfProfileId,
        }));

        return {
          ...post,
          author,
          likesByIds,
          likes: likesByIds.length,
          commentsData,
          comments: commentsData.length,
          likedByMe: likesByIds.includes(selfProfileId),
          isMine: post.authorId === selfProfileId,
          group: post.groupId ? groupsById[post.groupId] || null : null,
        };
      }),
    [demoState.posts, groupsById, profilesById, selfProfile]
  );

  const decoratedConversations = useMemo(
    () =>
      demoState.conversations.map((conversation) => {
        const profile = profilesById[conversation.profileId] || peopleProfiles[0] || selfProfile;
        const messages = (conversation.messages || []).map((message) => ({
          ...message,
          sender: profilesById[message.senderId] || selfProfile,
          isMine: message.senderId === selfProfileId,
        }));
        const lastMessage = messages[messages.length - 1];

        return {
          ...conversation,
          profile,
          messages,
          preview: lastMessage?.body || `Start a thread with ${profile.name}.`,
          timeLabel: lastMessage?.timeLabel || "Now",
        };
      }),
    [demoState.conversations, peopleProfiles, profilesById, selfProfile]
  );

  useEffect(() => {
    if (!selectedPersonId || !profilesById[selectedPersonId] || selectedPersonId === selfProfileId) {
      setSelectedPersonId(peopleProfiles[0]?.id || null);
    }
  }, [peopleProfiles, profilesById, selectedPersonId]);

  useEffect(() => {
    if (!activeConversationId || !decoratedConversations.find((item) => item.id === activeConversationId)) {
      setActiveConversationId(decoratedConversations[0]?.id || null);
    }
  }, [activeConversationId, decoratedConversations]);

  useEffect(() => {
    if (!selectedGroupId || !groupsById[selectedGroupId]) {
      setSelectedGroupId(demoState.groups[0]?.id || null);
    }
  }, [demoState.groups, groupsById, selectedGroupId]);

  const activeConversation = useMemo(
    () =>
      decoratedConversations.find((conversation) => conversation.id === activeConversationId) ||
      decoratedConversations[0] ||
      null,
    [activeConversationId, decoratedConversations]
  );

  const selectedPerson = useMemo(
    () => profilesById[selectedPersonId] || peopleProfiles[0] || null,
    [peopleProfiles, profilesById, selectedPersonId]
  );

  const selfPosts = useMemo(
    () => decoratedPosts.filter((post) => post.authorId === selfProfileId),
    [decoratedPosts]
  );

  const selectedPersonPosts = useMemo(
    () => decoratedPosts.filter((post) => post.authorId === selectedPerson?.id),
    [decoratedPosts, selectedPerson]
  );

  const filteredPosts = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return decoratedPosts;

    return decoratedPosts.filter((post) =>
      [
        post.author.name,
        `@${post.author.username}`,
        post.caption,
        post.mood,
        post.timeLabel,
        post.group?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [decoratedPosts, searchTerm]);

  const filteredGroups = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return demoState.groups;

    return demoState.groups.filter((group) => {
      const owner = profilesById[group.ownerId];
      return [
        group.name,
        group.category,
        group.description,
        group.spotlight,
        owner?.name,
        ...(group.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [demoState.groups, profilesById, searchTerm]);

  const filteredConversations = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return decoratedConversations;

    return decoratedConversations.filter((conversation) =>
      [conversation.profile.name, conversation.preview, ...conversation.messages.map((message) => message.body)]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [decoratedConversations, searchTerm]);

  const currentGroup = useMemo(() => {
    const scopedGroup =
      filteredGroups.find((group) => group.id === selectedGroupId) ||
      demoState.groups.find((group) => group.id === selectedGroupId);

    return scopedGroup || filteredGroups[0] || demoState.groups[0] || null;
  }, [demoState.groups, filteredGroups, selectedGroupId]);

  const currentGroupPosts = useMemo(
    () =>
      decoratedPosts.filter(
        (post) => post.groupId && currentGroup && post.groupId === currentGroup.id
      ),
    [currentGroup, decoratedPosts]
  );

  const isPersonProfileView = activeTab === "profile" && profileViewMode === "person" && selectedPerson;
  const viewedProfile = isPersonProfileView ? selectedPerson : selfProfile;
  const viewedProfilePosts = isPersonProfileView ? selectedPersonPosts : selfPosts;
  const activeThreadProfile = activeConversation?.profile || selfProfile;
  const activeTheme = demoState.settings?.theme === "dark" ? "dark" : "light";
  const currentMeta = tabMeta[activeTab] || tabMeta.timeline;
  const themeLabel = activeTheme === "dark" ? "Midnight" : "Air";
  const followedProfiles = peopleProfiles.filter((person) => selfFollowingIds.includes(person.id));
  const peopleCount = peopleProfiles.length + 1;
  const socialActivityCount = decoratedPosts.reduce(
    (sum, post) => sum + post.likes + post.comments,
    0
  );

  const heroStats = [
    {
      label: isPersonProfileView ? "Viewing" : "Signed in as",
      value: viewedProfile.name,
      detail: viewedProfile.role,
    },
    {
      label: "People in demo",
      value: peopleCount.toString(),
      detail: `${followedProfiles.length} followed by you`,
    },
    {
      label: "Interaction count",
      value: socialActivityCount.toString(),
      detail: "Likes and comments across the product",
    },
    {
      label: "Theme",
      value: themeLabel,
      detail: "Switch anytime from demo settings",
    },
  ];

  const adminSnapshot = useMemo(() => {
    const totalPosts = decoratedPosts.length;
    const totalLikes = decoratedPosts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = decoratedPosts.reduce((sum, post) => sum + post.comments, 0);
    const totalMessages = decoratedConversations.reduce(
      (sum, conversation) => sum + conversation.messages.length,
      0
    );
    const totalMembers = demoState.groups.reduce(
      (sum, group) => sum + (group.memberIds || []).length,
      0
    );
    const totalFollowers = Object.values(followerCountsById).reduce((sum, count) => sum + count, 0);
    const topPost = decoratedPosts.reduce(
      (best, post) =>
        post.likes + post.comments > best.score
          ? { score: post.likes + post.comments, post }
          : best,
      { score: -1, post: null }
    ).post;
    const topGroup = demoState.groups.reduce(
      (best, group) =>
        (group.memberIds || []).length > best.count
          ? { count: (group.memberIds || []).length, group }
          : best,
      { count: -1, group: null }
    ).group;
    const busiestThread = decoratedConversations.reduce(
      (best, conversation) =>
        conversation.messages.length > best.count
          ? { count: conversation.messages.length, conversation }
          : best,
      { count: -1, conversation: null }
    ).conversation;
    const strongestProfile = profiles.reduce(
      (best, profile) =>
        (followerCountsById[profile.id] || 0) > best.count
          ? { count: followerCountsById[profile.id] || 0, profile }
          : best,
      { count: -1, profile: null }
    ).profile;

    return {
      metrics: [
        {
          label: "Posts live",
          value: totalPosts.toString(),
          detail: "Visible across timeline, profiles, and groups",
          progress: Math.min(100, 20 + totalPosts * 9),
        },
        {
          label: "Engagement",
          value: totalLikes.toString(),
          detail: `${totalComments} comments layered into the feed`,
          progress: Math.min(100, 18 + totalLikes * 4),
        },
        {
          label: "Messages",
          value: totalMessages.toString(),
          detail: `${decoratedConversations.length} active threads`,
          progress: Math.min(100, 18 + totalMessages * 5),
        },
        {
          label: "Followers",
          value: totalFollowers.toString(),
          detail: "Derived from the live follow graph",
          progress: Math.min(100, 16 + totalFollowers * 8),
        },
        {
          label: "Group members",
          value: totalMembers.toString(),
          detail: `${demoState.groups.length} interactive communities`,
          progress: Math.min(100, 18 + totalMembers * 4),
        },
        {
          label: "People graph",
          value: profiles.length.toString(),
          detail: "Profiles connected across the demo",
          progress: Math.min(100, 24 + profiles.length * 8),
        },
      ],
      queue: [
        topPost
          ? {
              id: "insight-post",
              title: "Most active post",
              note: `${topPost.author.name} is leading with ${pluralize(
                topPost.likes,
                "like"
              )} and ${pluralize(topPost.comments, "comment")}.`,
              status: "Feed",
            }
          : null,
        topGroup
          ? {
              id: "insight-group",
              title: "Largest group",
              note: `${topGroup.name} currently has ${pluralize(
                (topGroup.memberIds || []).length,
                "member"
              )} interacting around it.`,
              status: "Group",
            }
          : null,
        busiestThread
          ? {
              id: "insight-thread",
              title: "Busiest thread",
              note: `${busiestThread.profile.name}'s thread contains ${pluralize(
                busiestThread.messages.length,
                "message"
              )}.`,
              status: "Chat",
            }
          : null,
        strongestProfile
          ? {
              id: "insight-profile",
              title: "Most followed profile",
              note: `${strongestProfile.name} is followed by ${pluralize(
                followerCountsById[strongestProfile.id] || 0,
                "person"
              )}.`,
              status: "People",
            }
          : null,
      ].filter(Boolean),
    };
  }, [decoratedConversations, decoratedPosts, demoState.groups, followerCountsById, profiles]);

  const setTheme = (theme) => {
    if (theme === activeTheme) return;
    updateDemoState((state) => ({
      ...state,
      settings: { ...(state.settings || {}), theme },
    }));
    setStatusMessage(theme === "dark" ? "Dark mode enabled." : "Light theme enabled.");
  };

  const openOwnProfile = () => {
    setProfileViewMode("self");
    setActiveTab("profile");
    setPendingPanelFocus(true);
    history.push("/demo/profile");
  };

  const openProfile = (personId) => {
    if (!personId || personId === selfProfileId) {
      openOwnProfile();
      return;
    }

    setSelectedPersonId(personId);
    setProfileViewMode("person");
    setActiveTab("profile");
    setPendingPanelFocus(true);
    history.push("/demo/profile");
  };

  const openProfileById = (profileId) => {
    if (profileId === selfProfileId) {
      openOwnProfile();
      return;
    }
    openProfile(profileId);
  };

  const goToTab = (tab) => {
    if (tab === "profile") {
      openOwnProfile();
      return;
    }

    setActiveTab(tab);
    setPendingPanelFocus(true);
    history.push(`/demo/${tab}`);
  };

  const openGroup = (groupId) => {
    if (!groupId) return;
    setSelectedGroupId(groupId);
    setActiveTab("groups");
    setPendingPanelFocus(true);
    history.push("/demo/groups");
  };

  const addPost = async () => {
    const caption = draftPost.trim();
    if (!caption || pendingPost) return;

    setPendingPost(true);
    await waitForPolish();

    updatePosts((posts) => [
      {
        id: `post-${Date.now()}`,
        authorId: selfProfileId,
        caption,
        timeLabel: "Just now",
        mood: "New",
        hasImage: false,
        likesByIds: [],
        commentsData: [],
      },
      ...posts,
    ]);

    setDraftPost("");
    setPendingPost(false);
    setStatusMessage("Post published.");
  };

  const deletePost = (postId) => {
    const postToDelete = demoState.posts.find((post) => post.id === postId);
    if (!postToDelete || postToDelete.authorId !== selfProfileId) return;

    const confirmed = window.confirm("Delete this post from your demo feed?");
    if (!confirmed) return;

    updatePosts((posts) => posts.filter((post) => post.id !== postId));
    setCommentDrafts((state) => {
      const next = { ...state };
      delete next[postId];
      return next;
    });
    setExpandedPostId((current) => (current === postId ? null : current));
    setOpenPostMenuId(null);
    setPendingPanelFocus(true);
    setStatusMessage("Post deleted.");
  };

  const toggleLike = (postId) => {
    const targetPost = decoratedPosts.find((post) => post.id === postId);
    if (!targetPost) return;

    updatePosts((posts) =>
      posts.map((post) => {
        if (post.id !== postId) return post;
        const likesByIds = post.likesByIds || [];
        const nextLikes = likesByIds.includes(selfProfileId)
          ? likesByIds.filter((id) => id !== selfProfileId)
          : [...likesByIds, selfProfileId];
        return { ...post, likesByIds: nextLikes };
      })
    );

    setStatusMessage(targetPost.likedByMe ? "Like removed." : "Post liked.");
  };

  const setCommentDraft = (postId, value) => {
    setCommentDrafts((state) => ({ ...state, [postId]: value }));
  };

  const submitComment = async (postId) => {
    const body = (commentDrafts[postId] || "").trim();
    if (!body || pendingCommentPostId === postId) return;

    setPendingCommentPostId(postId);
    await waitForPolish();

    updatePosts((posts) =>
      posts.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              commentsData: [
                ...(post.commentsData || []),
                {
                  id: `comment-${Date.now()}`,
                  authorId: selfProfileId,
                  body,
                  timeLabel: "Just now",
                },
              ],
            }
      )
    );

    setCommentDrafts((state) => ({ ...state, [postId]: "" }));
    setExpandedPostId(postId);
    setPendingCommentPostId(null);
    setStatusMessage("Comment added.");
  };

  const deleteComment = (postId, commentId) => {
    updatePosts((posts) =>
      posts.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              commentsData: (post.commentsData || []).filter((comment) => comment.id !== commentId),
            }
      )
    );

    setStatusMessage("Comment deleted.");
  };

  const toggleFollow = (personId) => {
    const person = profilesById[personId];
    if (!person || person.id === selfProfileId) return;

    updateDemoState((state) => {
      const currentIds = Array.isArray(state.profile.followingIds) ? state.profile.followingIds : [];
      const nextFollowingIds = currentIds.includes(personId)
        ? currentIds.filter((id) => id !== personId)
        : [...currentIds, personId];

      return {
        ...state,
        profile: {
          ...state.profile,
          followingIds: nextFollowingIds,
        },
        people: state.people.map((entry) =>
          entry.id !== personId
            ? entry
            : {
                ...entry,
                isFollowing: nextFollowingIds.includes(personId),
              }
        ),
      };
    });

    setStatusMessage(
      selfFollowingIds.includes(personId) ? `Unfollowed ${person.name}.` : `Following ${person.name}.`
    );
  };

  const openConversationForProfile = (personId) => {
    if (!personId || personId === selfProfileId) {
      goToTab("messages");
      return;
    }

    const existing = demoState.conversations.find((item) => item.profileId === personId);
    if (existing) {
      setActiveConversationId(existing.id);
    } else {
      const person = profilesById[personId];
      if (person) {
        const newConversation = {
          id: `chat-${Date.now()}`,
          profileId: personId,
          messages: [
            {
              id: `message-${Date.now()}`,
              senderId: personId,
              body: `Started a fresh demo thread with ${person.name}.`,
              timeLabel: "Just now",
            },
          ],
        };

        updateConversations((conversations) => [newConversation, ...conversations]);
        setActiveConversationId(newConversation.id);
      }
    }

    setActiveTab("messages");
    setPendingPanelFocus(true);
    history.push("/demo/messages");
  };

  const saveProfile = async () => {
    if (pendingProfile) return;

    setPendingProfile(true);
    await waitForPolish();

    updateDemoState((state) => ({
      ...state,
      profile: {
        ...state.profile,
        ...profileDraft,
        followingIds: state.profile.followingIds || [],
      },
    }));

    setPendingProfile(false);
    setStatusMessage("Profile saved.");
  };

  const sendMessage = async () => {
    const body = chatDraft.trim();
    if (!body || !activeConversation || pendingMessage) return;

    setPendingMessage(true);
    await waitForPolish();

    updateConversations((conversations) =>
      conversations.map((conversation) =>
        conversation.id !== activeConversation.id
          ? conversation
          : {
              ...conversation,
              messages: [
                ...(conversation.messages || []),
                {
                  id: `message-${Date.now()}`,
                  senderId: selfProfileId,
                  body,
                  timeLabel: "Just now",
                },
              ],
            }
      )
    );

    setChatDraft("");
    setPendingMessage(false);
    setStatusMessage("Message sent.");
  };

  const toggleGroupMembership = (groupId) => {
    const group = groupsById[groupId];
    if (!group) return;

    const isMember = (group.memberIds || []).includes(selfProfileId);
    updateGroups((groups) =>
      groups.map((item) =>
        item.id !== groupId
          ? item
          : {
              ...item,
              memberIds: isMember
                ? (item.memberIds || []).filter((id) => id !== selfProfileId)
                : [...new Set([...(item.memberIds || []), selfProfileId])],
            }
      )
    );

    setStatusMessage(isMember ? `Left ${group.name}.` : `Joined ${group.name}.`);
  };

  const restoreDemo = async () => {
    if (pendingReset) return;

    setPendingReset(true);
    await waitForPolish(260);

    const restored = resetDemoState();
    setDemoState(restored);
    setProfileDraft(restored.profile);
    setProfileViewMode("self");
    setSelectedPersonId(restored.people[0]?.id || null);
    setSelectedGroupId(restored.groups[0]?.id || null);
    setActiveConversationId(restored.conversations[0]?.id || null);
    setExpandedPostId(null);
    setDraftPost("");
    setChatDraft("");
    setSearchTerm("");
    setCommentDrafts({});
    setOpenPostMenuId(null);
    setPendingPanelFocus(true);
    history.push("/demo/timeline");
    setPendingReset(false);
    setStatusMessage("Demo state restored.");
  };

  const sharePost = async (postId) => {
    const shareUrl = `${window.location.origin}/demo/timeline#${postId}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setStatusMessage("Share link copied.");
        return;
      }
    } catch {
      // Ignore clipboard issues and fall back to a status message.
    }

    setStatusMessage(`Share link ready: ${shareUrl}`);
  };

  const renderProfileLink = (profile, options = {}) => {
    if (!profile) return null;

    const {
      meta,
      size = "md",
      className = "",
      compact = false,
      trailing,
      label,
      key,
    } = options;

    return (
      <button
        key={key || profile.id}
        type="button"
        className={`portfolio-profile-link ${compact ? "compact" : ""} ${className}`.trim()}
        onClick={() => openProfileById(profile.id)}
        aria-label={label || `Open ${profile.name}'s profile`}
      >
        <Avatar name={profile.name} size={size} accent={profile.accent} />
        <span className="portfolio-profile-link-copy">
          <strong>{profile.name}</strong>
          <small>{meta || `@${profile.username}`}</small>
        </span>
        {trailing ? <span className="portfolio-profile-link-trailing">{trailing}</span> : null}
      </button>
    );
  };

  const renderPostCard = (post, index = 0, options = {}) => {
    const showGroupLink = options.showGroupLink !== false;
    const commentInputId = `comment-input-${post.id}`;
    const menuId = `post-menu-${post.id}`;
    const isCommentsOpen = expandedPostId === post.id;
    const commentDraft = commentDrafts[post.id] || "";

    return (
      <motion.article key={post.id} {...listMotion(index)} className="portfolio-post-card">
        <div className="portfolio-post-head">
          {renderProfileLink(post.author, {
            meta: post.timeLabel,
            className: "portfolio-post-author",
            label: `Open ${post.author.name}'s profile`,
          })}
          <div className="portfolio-post-head-actions">
            {post.group && showGroupLink ? (
              <button
                type="button"
                className="portfolio-inline-chip interactive"
                onClick={() => openGroup(post.group.id)}
              >
                {post.group.name}
              </button>
            ) : null}
            <span className="portfolio-inline-chip">{post.mood}</span>
            {post.isMine ? (
              <div className="portfolio-post-menu">
                <button
                  type="button"
                  className="portfolio-post-menu-trigger"
                  ref={(node) => {
                    menuTriggerRefs.current[post.id] = node;
                  }}
                  onClick={() =>
                    setOpenPostMenuId((current) => (current === post.id ? null : post.id))
                  }
                  aria-expanded={openPostMenuId === post.id}
                  aria-controls={menuId}
                  aria-label={`Open actions for ${post.caption.slice(0, 24) || "this post"}`}
                >
                  <span />
                  <span />
                  <span />
                </button>
                <AnimatePresence>
                  {openPostMenuId === post.id ? (
                    <motion.div {...cardMotion} id={menuId} className="portfolio-post-menu-popover" role="menu">
                      <button type="button" role="menuitem" onClick={() => sharePost(post.id)}>
                        Copy share link
                      </button>
                      <button type="button" role="menuitem" onClick={() => deletePost(post.id)}>
                        Delete post
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        </div>

        <p className="portfolio-post-copy">{post.caption}</p>

        {post.hasImage ? (
          <SafeMediaImage
            src={post.imageUrl}
            alt={`${post.author.name} shared on SquarePad`}
            label={`${post.author.name} post`}
            className="portfolio-post-image"
            height={220}
          />
        ) : null}

        <div className="portfolio-post-stats">
          <span>{pluralize(post.likes, "like")}</span>
          <span>{pluralize(post.comments, "comment")}</span>
        </div>

        <div className="portfolio-reaction-row">
          {reactionDefs.map((reaction) => {
            if (reaction.key === "like") {
              return (
                <button
                  key={reaction.key}
                  type="button"
                  className={`portfolio-reaction-pill ${post.likedByMe ? "active" : ""}`}
                  onClick={() => toggleLike(post.id)}
                  aria-pressed={post.likedByMe}
                >
                  <ReactionIcon type={reaction.icon} />
                  <span>{reaction.label}</span>
                </button>
              );
            }

            if (reaction.key === "comment") {
              return (
                <button
                  key={reaction.key}
                  type="button"
                  className={`portfolio-reaction-pill ${isCommentsOpen ? "active" : ""}`}
                  onClick={() => setExpandedPostId((current) => (current === post.id ? null : post.id))}
                  aria-pressed={isCommentsOpen}
                  aria-controls={`comments-${post.id}`}
                >
                  <ReactionIcon type={reaction.icon} />
                  <span>{reaction.label}</span>
                </button>
              );
            }

            return (
              <button
                key={reaction.key}
                type="button"
                className="portfolio-reaction-pill"
                onClick={() => sharePost(post.id)}
              >
                <ReactionIcon type={reaction.icon} />
                <span>{reaction.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {isCommentsOpen ? (
            <motion.div {...cardMotion} id={`comments-${post.id}`} className="portfolio-comments-panel">
              <div className="portfolio-comments-list">
                {post.commentsData.length > 0 ? (
                  post.commentsData.map((comment) => (
                    <div key={comment.id} className="portfolio-comment-item">
                      {renderProfileLink(comment.author, {
                        meta: comment.timeLabel,
                        className: "portfolio-comment-author",
                        compact: true,
                      })}
                      <p className="portfolio-comment-body">{comment.body}</p>
                      {comment.isMine ? (
                        <button
                          type="button"
                          className="portfolio-comment-delete"
                          onClick={() => deleteComment(post.id, comment.id)}
                          aria-label="Delete your comment"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="portfolio-empty-state compact">
                    <strong className="portfolio-empty-title">No comments yet</strong>
                    <p className="portfolio-empty-copy">
                      Start the conversation to show how this post performs in the demo.
                    </p>
                  </div>
                )}
              </div>

              <div className="portfolio-comment-form">
                <label className="portfolio-sr-only" htmlFor={commentInputId}>
                  Add a comment
                </label>
                <Input
                  id={commentInputId}
                  className="portfolio-input"
                  placeholder="Add a comment"
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(post.id, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      submitComment(post.id);
                    }
                  }}
                />
                <Button
                  className={pendingCommentPostId === post.id ? "portfolio-primary-btn is-loading" : "portfolio-primary-btn"}
                  disabled={!commentDraft.trim() || pendingCommentPostId === post.id}
                  onClick={() => submitComment(post.id)}
                >
                  {pendingCommentPostId === post.id ? (
                    <>
                      <span className="portfolio-btn-spinner" aria-hidden="true" />
                      Posting...
                    </>
                  ) : (
                    "Post comment"
                  )}
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.article>
    );
  };

  const renderTimeline = () => (
    <Row className="portfolio-content-grid">
      <Col xl="4" lg="12" className="mb-4">
        <motion.div {...cardMotion}>
          <Card className="portfolio-shell-card portfolio-stage-card">
            <CardBody>
              <div className="portfolio-section-head">
                <span className="portfolio-dot" />
                <h2 className="portfolio-eyebrow mb-0">Compose</h2>
              </div>
              {renderProfileLink(selfProfile, {
                meta: "Publishing locally in portfolio mode",
                className: "portfolio-composer-identity",
              })}
              <FormGroup className="mt-3 mb-3">
                <label className="portfolio-field-label" htmlFor="timeline-post-input">
                  Publish post
                </label>
                <Input
                  id="timeline-post-input"
                  type="textarea"
                  rows="5"
                  className="portfolio-input"
                  placeholder="Share a product insight, a launch note, or something reviewers should remember."
                  value={draftPost}
                  onChange={(event) => setDraftPost(event.target.value)}
                  aria-describedby="timeline-post-hint"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && event.ctrlKey) {
                      addPost();
                    }
                  }}
                />
              </FormGroup>
              <div className="portfolio-card-meta">
                <span className="portfolio-inline-chip" id="timeline-post-hint">
                  Ctrl + Enter publishes instantly
                </span>
                <Button
                  className={pendingPost ? "portfolio-primary-btn is-loading" : "portfolio-primary-btn"}
                  onClick={addPost}
                  disabled={!draftPost.trim() || pendingPost}
                >
                  {pendingPost ? (
                    <>
                      <span className="portfolio-btn-spinner" aria-hidden="true" />
                      Publishing...
                    </>
                  ) : (
                    "Publish post"
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div {...cardMotion} transition={{ ...cardMotion.transition, delay: 0.06 }}>
          <Card className="portfolio-shell-card portfolio-support-card mt-4">
            <CardBody>
              <div className="portfolio-section-head">
                <span className="portfolio-dot" />
                <h2 className="portfolio-eyebrow mb-0">Following</h2>
              </div>
              <p className="portfolio-muted-copy mb-3">
                Your follow graph drives profile buttons, group membership, counts, and thread entry points.
              </p>
              <div className="portfolio-mini-stack">
                {followedProfiles.length > 0 ? (
                  followedProfiles.map((person) =>
                    renderProfileLink(person, {
                      key: person.id,
                      meta: person.status,
                      className: "portfolio-mini-person",
                      compact: true,
                    })
                  )
                ) : (
                  <div className="portfolio-empty-state compact">
                    <strong className="portfolio-empty-title">You are not following anyone yet</strong>
                    <p className="portfolio-empty-copy">
                      Open a profile and follow someone to populate this section.
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </Col>

      <Col xl="8" lg="12">
        <div className="portfolio-post-list">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => renderPostCard(post, index))
          ) : (
            <Card className="portfolio-shell-card portfolio-empty-card">
              <CardBody>
                <div className="portfolio-empty-state">
                  <p className="portfolio-eyebrow mb-2">Timeline</p>
                  <strong className="portfolio-empty-title">
                    {searchTerm ? "No posts match this search" : "The timeline is empty"}
                  </strong>
                  <p className="portfolio-empty-copy">
                    {searchTerm
                      ? "Try another keyword or clear the search to bring the feed back into view."
                      : "Publish a post to repopulate the feed."}
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </Col>
    </Row>
  );

  const renderProfile = () => {
    const followersCount = followerCountsById[viewedProfile.id] || 0;
    const followingCount =
      viewedProfile.id === selfProfileId
        ? selfFollowingIds.length
        : (viewedProfile.followingIds || []).length;

    return (
      <Row className="portfolio-content-grid">
        <Col xl="4" lg="12" className="mb-4">
          <motion.div {...cardMotion}>
            <Card className="portfolio-shell-card portfolio-stage-card">
              <CardBody>
                <SafeMediaImage
                  src={viewedProfile.coverImageUrl}
                  alt={`${viewedProfile.name} cover`}
                  label={viewedProfile.name}
                  className="portfolio-profile-cover"
                  height={160}
                />
                <div className="portfolio-profile-hero">
                  {renderProfileLink(viewedProfile, {
                    size: "lg",
                    meta: viewedProfile.location,
                    className: "portfolio-profile-identity",
                  })}
                  <Badge className="portfolio-badge-soft mt-3">{viewedProfile.role}</Badge>
                  <p className="portfolio-muted-copy mt-3 mb-0">{viewedProfile.bio}</p>
                </div>

                <div className="portfolio-stat-row">
                  <div className="portfolio-stat-card">
                    <strong>{viewedProfilePosts.length}</strong>
                    <span>Posts</span>
                  </div>
                  <div className="portfolio-stat-card">
                    <strong>{followersCount}</strong>
                    <span>Followers</span>
                  </div>
                  <div className="portfolio-stat-card">
                    <strong>{followingCount}</strong>
                    <span>Following</span>
                  </div>
                </div>

                {isPersonProfileView ? (
                  <div className="portfolio-action-row mt-3">
                    <Button
                      className={viewedProfile.isFollowing ? "portfolio-secondary-btn" : "portfolio-primary-btn"}
                      onClick={() => toggleFollow(viewedProfile.id)}
                      aria-pressed={viewedProfile.isFollowing}
                    >
                      {viewedProfile.isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button className="portfolio-secondary-btn" onClick={() => openConversationForProfile(viewedProfile.id)}>
                      Message
                    </Button>
                    <Button className="portfolio-ghost-btn" onClick={openOwnProfile}>
                      View my profile
                    </Button>
                  </div>
                ) : (
                  <div className="portfolio-card-meta mt-3">
                    <span className="portfolio-inline-chip">Everything here updates app-wide</span>
                    <Button className="portfolio-secondary-btn" onClick={() => goToTab("timeline")}>
                      Open composer
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          <motion.div {...cardMotion} transition={{ ...cardMotion.transition, delay: 0.06 }}>
            <Card className="portfolio-shell-card portfolio-support-card mt-4">
              <CardBody>
                <div className="portfolio-section-head">
                  <span className="portfolio-dot" />
                  <h2 className="portfolio-eyebrow mb-0">People</h2>
                </div>
                <div className="portfolio-mini-stack mt-3">
                  {peopleProfiles.map((person) =>
                    renderProfileLink(person, {
                      key: person.id,
                      meta: `${followerCountsById[person.id] || 0} followers`,
                      className:
                        isPersonProfileView && selectedPerson?.id === person.id
                          ? "portfolio-mini-person is-active"
                          : "portfolio-mini-person",
                      compact: true,
                      trailing: person.status,
                    })
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </Col>

        <Col xl="8" lg="12">
          {!isPersonProfileView ? (
            <Row>
              <Col lg="7" className="mb-4">
                <motion.div {...cardMotion}>
                  <Card className="portfolio-shell-card portfolio-stage-card">
                    <CardBody>
                      <div className="portfolio-section-head">
                        <span className="portfolio-dot" />
                        <h2 className="portfolio-eyebrow mb-0">Edit profile</h2>
                      </div>
                      <Row className="mt-2">
                        <Col md="6">
                          <FormGroup>
                            <label className="portfolio-field-label" htmlFor="profile-display-name">
                              Display name
                            </label>
                            <Input
                              id="profile-display-name"
                              className="portfolio-input"
                              value={profileDraft.name}
                              onChange={(event) =>
                                setProfileDraft({ ...profileDraft, name: event.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label className="portfolio-field-label" htmlFor="profile-username">
                              Username
                            </label>
                            <Input
                              id="profile-username"
                              className="portfolio-input"
                              value={profileDraft.username}
                              onChange={(event) =>
                                setProfileDraft({
                                  ...profileDraft,
                                  username: event.target.value.replace(/\s+/g, ""),
                                })
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label className="portfolio-field-label" htmlFor="profile-role">
                              Role
                            </label>
                            <Input
                              id="profile-role"
                              className="portfolio-input"
                              value={profileDraft.role}
                              onChange={(event) =>
                                setProfileDraft({ ...profileDraft, role: event.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label className="portfolio-field-label" htmlFor="profile-location">
                              Location
                            </label>
                            <Input
                              id="profile-location"
                              className="portfolio-input"
                              value={profileDraft.location}
                              onChange={(event) =>
                                setProfileDraft({ ...profileDraft, location: event.target.value })
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup>
                        <label className="portfolio-field-label" htmlFor="profile-bio">
                          Bio
                        </label>
                        <Input
                          id="profile-bio"
                          type="textarea"
                          rows="4"
                          className="portfolio-input"
                          value={profileDraft.bio}
                          onChange={(event) =>
                            setProfileDraft({ ...profileDraft, bio: event.target.value })
                          }
                        />
                      </FormGroup>
                      <div className="portfolio-card-meta">
                        <span className="portfolio-inline-chip">
                          Saving here updates your posts, comments, and message identity everywhere.
                        </span>
                        <Button
                          className={pendingProfile ? "portfolio-primary-btn is-loading" : "portfolio-primary-btn"}
                          onClick={saveProfile}
                          disabled={pendingProfile}
                        >
                          {pendingProfile ? (
                            <>
                              <span className="portfolio-btn-spinner" aria-hidden="true" />
                              Saving...
                            </>
                          ) : (
                            "Save profile"
                          )}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              </Col>

              <Col lg="5" className="mb-4">
                <motion.div {...cardMotion} transition={{ ...cardMotion.transition, delay: 0.06 }}>
                  <Card className="portfolio-shell-card portfolio-support-card">
                    <CardBody>
                      <div className="portfolio-section-head">
                        <span className="portfolio-dot" />
                        <h2 className="portfolio-eyebrow mb-0">Appearance</h2>
                      </div>
                      <p className="portfolio-muted-copy mt-3 mb-3">
                        Use the brighter glass theme by default, or switch into the darker workspace when you want a more dramatic presentation.
                      </p>
                      <div className="portfolio-theme-toggle" role="group" aria-label="Theme selection">
                        <button
                          type="button"
                          className={activeTheme === "light" ? "active" : ""}
                          onClick={() => setTheme("light")}
                          aria-pressed={activeTheme === "light"}
                        >
                          Light
                        </button>
                        <button
                          type="button"
                          className={activeTheme === "dark" ? "active" : ""}
                          onClick={() => setTheme("dark")}
                          aria-pressed={activeTheme === "dark"}
                        >
                          Dark
                        </button>
                      </div>
                      <div className="portfolio-card-meta mt-4">
                        <span className="portfolio-inline-chip">Theme is persisted locally</span>
                        <Button
                          className={pendingReset ? "portfolio-secondary-btn is-loading" : "portfolio-secondary-btn"}
                          onClick={restoreDemo}
                          disabled={pendingReset}
                        >
                          {pendingReset ? (
                            <>
                              <span className="portfolio-btn-spinner" aria-hidden="true" />
                              Resetting...
                            </>
                          ) : (
                            "Reset demo state"
                          )}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          ) : null}

          <Card className="portfolio-shell-card portfolio-stage-card">
            <CardBody>
              <div className="portfolio-section-head">
                <span className="portfolio-dot" />
                <h2 className="portfolio-eyebrow mb-0">
                  {isPersonProfileView ? `${viewedProfile.name}'s posts` : "Your posts"}
                </h2>
              </div>
              <div className="portfolio-post-list mt-3">
                {viewedProfilePosts.length > 0 ? (
                  viewedProfilePosts.map((post, index) =>
                    renderPostCard(post, index, { showGroupLink: true })
                  )
                ) : (
                  <div className="portfolio-empty-state">
                    <strong className="portfolio-empty-title">No posts here yet</strong>
                    <p className="portfolio-empty-copy">
                      {isPersonProfileView
                        ? `${viewedProfile.name} has not posted in this demo yet.`
                        : "Publish something from the timeline and it will appear here instantly."}
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderMessages = () => (
    <Row className="portfolio-content-grid">
      <Col xl="4" lg="12" className="mb-4">
        <motion.div {...cardMotion}>
          <Card className="portfolio-shell-card portfolio-stage-card">
            <CardBody>
              <div className="portfolio-section-head">
                <span className="portfolio-dot" />
                <h2 className="portfolio-eyebrow mb-0">Thread focus</h2>
              </div>
              {activeConversation ? (
                <>
                  <SafeMediaImage
                    src={activeThreadProfile.coverImageUrl}
                    alt={`${activeThreadProfile.name} cover`}
                    label={activeThreadProfile.name}
                    className="portfolio-message-cover"
                    height={140}
                  />
                  <div className="portfolio-message-profile mt-3">
                    {renderProfileLink(activeThreadProfile, {
                      size: "lg",
                      meta: activeThreadProfile.status,
                      className: "portfolio-message-profile-link",
                    })}
                    <p className="portfolio-muted-copy mt-3 mb-0">{activeThreadProfile.bio}</p>
                  </div>
                  <div className="portfolio-action-row mt-3">
                    <Button
                      className={activeThreadProfile.isFollowing ? "portfolio-secondary-btn" : "portfolio-primary-btn"}
                      onClick={() => toggleFollow(activeThreadProfile.id)}
                      aria-pressed={activeThreadProfile.isFollowing}
                      disabled={activeThreadProfile.id === selfProfileId}
                    >
                      {activeThreadProfile.id === selfProfileId
                        ? "Your profile"
                        : activeThreadProfile.isFollowing
                        ? "Following"
                        : "Follow"}
                    </Button>
                    <Button className="portfolio-ghost-btn" onClick={() => openProfileById(activeThreadProfile.id)}>
                      View profile
                    </Button>
                  </div>
                </>
              ) : (
                <div className="portfolio-empty-state compact">
                  <strong className="portfolio-empty-title">No threads yet</strong>
                  <p className="portfolio-empty-copy">
                    Open a profile and start messaging to seed the inbox.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        <motion.div {...cardMotion} transition={{ ...cardMotion.transition, delay: 0.06 }}>
          <Card className="portfolio-shell-card portfolio-support-card mt-4">
            <CardBody>
              <div className="portfolio-section-head">
                <span className="portfolio-dot" />
                <h2 className="portfolio-eyebrow mb-0">People</h2>
              </div>
              <div className="portfolio-mini-stack mt-3">
                {peopleProfiles.map((person) =>
                  renderProfileLink(person, {
                    key: person.id,
                    meta: person.status,
                    className: "portfolio-mini-person",
                    compact: true,
                    trailing: "Open profile",
                  })
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </Col>

      <Col xl="8" lg="12">
        <Card className="portfolio-shell-card portfolio-stage-card">
          <CardBody>
            <div className="portfolio-section-head">
              <span className="portfolio-dot" />
              <h2 className="portfolio-eyebrow mb-0">Inbox</h2>
            </div>

            <div className="portfolio-messages-shell mt-3">
              <div className="portfolio-thread-column">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation, index) => (
                    <motion.button
                      key={conversation.id}
                      type="button"
                      {...listMotion(index)}
                      className={`portfolio-thread-card ${activeConversationId === conversation.id ? "active" : ""}`}
                      onClick={() => setActiveConversationId(conversation.id)}
                      aria-pressed={activeConversationId === conversation.id}
                    >
                      <Avatar name={conversation.profile.name} accent={conversation.profile.accent} />
                      <span className="portfolio-thread-copy">
                        <span className="portfolio-thread-top">
                          <strong>{conversation.profile.name}</strong>
                          <small>{conversation.timeLabel}</small>
                        </span>
                        <span>{conversation.preview}</span>
                      </span>
                    </motion.button>
                  ))
                ) : (
                  <div className="portfolio-empty-state compact">
                    <strong className="portfolio-empty-title">No matching threads</strong>
                    <p className="portfolio-empty-copy">
                      Clear the search or open a new conversation from a profile.
                    </p>
                  </div>
                )}
              </div>

              <div className="portfolio-chat-column">
                {activeConversation ? (
                  <>
                    <div className="portfolio-chat-header">
                      {renderProfileLink(activeThreadProfile, {
                        meta: "Local-first demo thread",
                        className: "portfolio-chat-identity",
                      })}
                      <Badge className="portfolio-badge-soft">
                        {pluralize(activeConversation.messages.length, "message")}
                      </Badge>
                    </div>

                    <div className="portfolio-chat-messages">
                      {activeConversation.messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          {...listMotion(index)}
                          className={`portfolio-message-row ${message.isMine ? "mine" : ""}`}
                        >
                          {!message.isMine ? (
                            <button
                              type="button"
                              className="portfolio-message-avatar-button"
                              onClick={() => openProfileById(message.sender.id)}
                              aria-label={`Open ${message.sender.name}'s profile`}
                            >
                              <Avatar name={message.sender.name} accent={message.sender.accent} size="sm" />
                            </button>
                          ) : null}
                          <div className={`portfolio-message-bubble ${message.isMine ? "mine" : ""}`}>
                            <span className="portfolio-message-name">
                              {message.isMine ? "You" : message.sender.name}
                            </span>
                            <p>{message.body}</p>
                            <small>{message.timeLabel}</small>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="portfolio-chat-composer">
                      <label className="portfolio-sr-only" htmlFor="message-compose-input">
                        Type a message
                      </label>
                      <Input
                        id="message-compose-input"
                        className="portfolio-input"
                        placeholder="Send a message"
                        value={chatDraft}
                        onChange={(event) => setChatDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button
                        className={pendingMessage ? "portfolio-primary-btn is-loading" : "portfolio-primary-btn"}
                        onClick={sendMessage}
                        disabled={!chatDraft.trim() || pendingMessage}
                      >
                        {pendingMessage ? (
                          <>
                            <span className="portfolio-btn-spinner" aria-hidden="true" />
                            Sending...
                          </>
                        ) : (
                          "Send message"
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="portfolio-empty-state">
                    <strong className="portfolio-empty-title">No active thread</strong>
                    <p className="portfolio-empty-copy">
                      Choose a person to start the conversation view.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );

  const renderGroups = () => {
    const currentGroupOwner = currentGroup ? profilesById[currentGroup.ownerId] || selfProfile : null;
    const currentGroupMembers = currentGroup
      ? (currentGroup.memberIds || []).map((memberId) => profilesById[memberId]).filter(Boolean)
      : [];
    const isCurrentGroupMember = currentGroup
      ? (currentGroup.memberIds || []).includes(selfProfileId)
      : false;

    return (
      <Row className="portfolio-content-grid">
        <Col xl="5" lg="12" className="mb-4">
          <motion.div {...cardMotion}>
            <Card className="portfolio-shell-card portfolio-stage-card">
              <CardBody>
                <div className="portfolio-section-head">
                  <span className="portfolio-dot" />
                  <h2 className="portfolio-eyebrow mb-0">Communities</h2>
                </div>
                <div className="portfolio-group-grid mt-3">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group, index) => {
                      const owner = profilesById[group.ownerId];
                      const isActive = currentGroup?.id === group.id;
                      const isMember = (group.memberIds || []).includes(selfProfileId);

                      return (
                        <motion.button
                          key={group.id}
                          type="button"
                          {...listMotion(index)}
                          className={`portfolio-group-card ${isActive ? "active" : ""}`}
                          onClick={() => setSelectedGroupId(group.id)}
                        >
                          <SafeMediaImage
                            src={group.imageUrl}
                            alt={group.name}
                            label={group.name}
                            className="portfolio-group-card-image"
                            height={116}
                          />
                          <span className="portfolio-group-card-copy">
                            <span className="portfolio-group-card-top">
                              <Badge className="portfolio-badge-soft">{group.category}</Badge>
                              <small>{pluralize((group.memberIds || []).length, "member")}</small>
                            </span>
                            <strong>{group.name}</strong>
                            <span>{group.spotlight}</span>
                            <small>Hosted by {owner?.name || "SquarePad"}</small>
                          </span>
                          <span className={`portfolio-group-status ${isMember ? "joined" : ""}`}>
                            {isMember ? "Joined" : "Preview"}
                          </span>
                        </motion.button>
                      );
                    })
                  ) : (
                    <div className="portfolio-empty-state">
                      <strong className="portfolio-empty-title">No groups match this search</strong>
                      <p className="portfolio-empty-copy">
                        Try a broader keyword to bring the group catalogue back.
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </Col>

        <Col xl="7" lg="12">
          {currentGroup ? (
            <>
              <motion.div {...cardMotion}>
                <Card className="portfolio-shell-card portfolio-stage-card">
                  <CardBody>
                    <SafeMediaImage
                      src={currentGroup.imageUrl}
                      alt={currentGroup.name}
                      label={currentGroup.name}
                      className="portfolio-group-cover"
                      height={184}
                    />
                    <div className="portfolio-group-hero">
                      <div>
                        <div className="portfolio-section-head mb-2">
                          <span className="portfolio-dot" />
                          <h2 className="portfolio-eyebrow mb-0">{currentGroup.category}</h2>
                        </div>
                        <h3 className="portfolio-card-title portfolio-group-title">{currentGroup.name}</h3>
                        <p className="portfolio-muted-copy">{currentGroup.description}</p>
                      </div>
                      <div className="portfolio-action-row">
                        <Button
                          className={isCurrentGroupMember ? "portfolio-secondary-btn" : "portfolio-primary-btn"}
                          onClick={() => toggleGroupMembership(currentGroup.id)}
                          aria-pressed={isCurrentGroupMember}
                        >
                          {isCurrentGroupMember ? "Leave group" : "Join group"}
                        </Button>
                        <Button className="portfolio-ghost-btn" onClick={() => openProfileById(currentGroup.ownerId)}>
                          View host
                        </Button>
                      </div>
                    </div>

                    <div className="portfolio-group-meta">
                      <div className="portfolio-inline-stack">
                        <span className="portfolio-inline-chip">
                          {pluralize((currentGroup.memberIds || []).length, "member")}
                        </span>
                        <span className="portfolio-inline-chip">{currentGroup.spotlight}</span>
                      </div>
                      <div className="portfolio-tag-row">
                        {(currentGroup.tags || []).map((tag) => (
                          <span key={tag} className="portfolio-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              <Row className="mt-4">
                <Col lg="5" className="mb-4">
                  <motion.div {...cardMotion} transition={{ ...cardMotion.transition, delay: 0.06 }}>
                    <Card className="portfolio-shell-card portfolio-support-card h-100">
                      <CardBody>
                        <div className="portfolio-section-head">
                          <span className="portfolio-dot" />
                          <h2 className="portfolio-eyebrow mb-0">Members</h2>
                        </div>
                        <div className="portfolio-mini-stack mt-3">
                          {currentGroupMembers.map((member) =>
                            renderProfileLink(member, {
                              key: member.id,
                              meta: member.role,
                              className: "portfolio-mini-person",
                              compact: true,
                              trailing: member.id === currentGroupOwner?.id ? "Host" : null,
                            })
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                </Col>

                <Col lg="7" className="mb-4">
                  <motion.div {...cardMotion} transition={{ ...cardMotion.transition, delay: 0.1 }}>
                    <Card className="portfolio-shell-card portfolio-stage-card h-100">
                      <CardBody>
                        <div className="portfolio-section-head">
                          <span className="portfolio-dot" />
                          <h2 className="portfolio-eyebrow mb-0">Group activity</h2>
                        </div>
                        <div className="portfolio-post-list mt-3">
                          {currentGroupPosts.length > 0 ? (
                            currentGroupPosts.map((post, index) =>
                              renderPostCard(post, index, { showGroupLink: false })
                            )
                          ) : (
                            <div className="portfolio-empty-state">
                              <strong className="portfolio-empty-title">No posts in this group yet</strong>
                              <p className="portfolio-empty-copy">
                                Join the group and publish from the timeline with a matching group tag if you want to extend the story later.
                              </p>
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </>
          ) : null}
        </Col>
      </Row>
    );
  };

  const renderAdmin = () => (
    <Row className="portfolio-content-grid">
      <Col xl="8" lg="12" className="mb-4">
        <motion.div {...cardMotion}>
          <Card className="portfolio-shell-card portfolio-stage-card">
            <CardBody>
              <div className="portfolio-section-head">
                <span className="portfolio-dot" />
                <h2 className="portfolio-eyebrow mb-0">System snapshot</h2>
              </div>
              <Row className="mt-3">
                {adminSnapshot.metrics.map((metric, index) => (
                  <Col md="6" className="mb-4" key={metric.label}>
                    <motion.div {...listMotion(index)} className="portfolio-admin-stat">
                      <span className="portfolio-admin-stat-label">{metric.label}</span>
                      <strong>{metric.value}</strong>
                      <p className="portfolio-admin-stat-detail">{metric.detail}</p>
                      <Progress value={metric.progress} className="portfolio-progress" />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </motion.div>
      </Col>

      <Col xl="4" lg="12" className="mb-4">
        <motion.div {...cardMotion} transition={{ ...cardMotion.transition, delay: 0.06 }}>
          <Card className="portfolio-shell-card portfolio-support-card">
            <CardBody>
              <div className="portfolio-section-head">
                <span className="portfolio-dot" />
                <h2 className="portfolio-eyebrow mb-0">Live insights</h2>
              </div>
              <div className="portfolio-mini-stack mt-3">
                {adminSnapshot.queue.map((item) => (
                  <div className="portfolio-insight-card" key={item.id}>
                    <div className="portfolio-insight-top">
                      <strong>{item.title}</strong>
                      <Badge className="portfolio-badge-soft">{item.status}</Badge>
                    </div>
                    <p>{item.note}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </Col>
    </Row>
  );

  const tabContent = {
    timeline: renderTimeline(),
    profile: renderProfile(),
    messages: renderMessages(),
    groups: renderGroups(),
    admin: renderAdmin(),
  };

  return (
    <main className={`portfolio-demo-page theme-${activeTheme}`}>
      <div className="portfolio-bg-shape shape-one" />
      <div className="portfolio-bg-shape shape-two" />
      <div className="portfolio-bg-shape shape-three" />

      <div className="portfolio-live-region portfolio-sr-only" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </div>

      <header className="portfolio-appbar">
        <Container className="portfolio-shell-container">
          <div className="portfolio-appbar-inner">
            <div className="portfolio-appbar-brand">
              <div className="portfolio-appbar-brandmark">
                <span className="sp-logo-dot" />
                <strong>SquarePad</strong>
              </div>
              <span className="sp-demo-pill">Portfolio Edition</span>
            </div>

            <nav className="portfolio-nav" aria-label="Demo sections">
              {validDemoTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`portfolio-route-pill ${activeTab === tab ? "active" : ""}`}
                  onClick={() => goToTab(tab)}
                  aria-current={activeTab === tab ? "page" : undefined}
                >
                  {tabMeta[tab].label}
                </button>
              ))}
            </nav>

            <div className="portfolio-appbar-actions">
              <div className="portfolio-search-shell" role="search">
                <label className="portfolio-sr-only" htmlFor="demo-search-input">
                  Search demo content
                </label>
                <span className="portfolio-search-icon">/</span>
                <Input
                  id="demo-search-input"
                  className="portfolio-search-input"
                  placeholder={`Search ${currentMeta.label.toLowerCase()}`}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="portfolio-theme-toggle compact" role="group" aria-label="Theme selection">
                <button
                  type="button"
                  className={activeTheme === "light" ? "active" : ""}
                  onClick={() => setTheme("light")}
                  aria-pressed={activeTheme === "light"}
                >
                  Light
                </button>
                <button
                  type="button"
                  className={activeTheme === "dark" ? "active" : ""}
                  onClick={() => setTheme("dark")}
                  aria-pressed={activeTheme === "dark"}
                >
                  Dark
                </button>
              </div>

              <Button
                className={pendingReset ? "portfolio-secondary-btn is-loading" : "portfolio-secondary-btn"}
                onClick={restoreDemo}
                disabled={pendingReset}
              >
                {pendingReset ? (
                  <>
                    <span className="portfolio-btn-spinner" aria-hidden="true" />
                    Resetting...
                  </>
                ) : (
                  "Reset"
                )}
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <section className="portfolio-stage-shell">
        <Container className="portfolio-shell-container">
          <motion.div {...cardMotion} className="portfolio-stage-intro">
            <div className="portfolio-stage-copy">
              <p className="portfolio-eyebrow">{currentMeta.eyebrow}</p>
              <h1 className="portfolio-stage-title">{currentMeta.title}</h1>
              <p className="portfolio-stage-description">{currentMeta.description}</p>
              <div className="portfolio-inline-stack">
                <button type="button" className="portfolio-inline-chip interactive" onClick={openOwnProfile}>
                  My profile
                </button>
                <button type="button" className="portfolio-inline-chip interactive" onClick={() => goToTab("timeline")}>
                  Timeline
                </button>
                <button type="button" className="portfolio-inline-chip interactive" onClick={() => goToTab("messages")}>
                  Messages
                </button>
              </div>
            </div>

            <div className="portfolio-stage-panel">
              <div className="portfolio-stage-panel-top">
                {renderProfileLink(viewedProfile, {
                  meta: isPersonProfileView ? "Viewing profile" : "Signed in as",
                  className: "portfolio-stage-profile-link",
                })}
                <span className="portfolio-inline-chip">{currentMeta.label}</span>
              </div>

              <div className="portfolio-stage-stats">
                {heroStats.map((stat) => (
                  <div className="portfolio-stage-stat" key={stat.label}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <small>{stat.detail}</small>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <section className="portfolio-content-region" aria-labelledby="portfolio-panel-title">
            <h2 className="portfolio-sr-only" id="portfolio-panel-title" ref={panelHeadingRef} tabIndex="-1">
              {currentMeta.label}
            </h2>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} {...cardMotion}>
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </section>
        </Container>
      </section>

      <SimpleFooter />
    </main>
  );
};

export default PortfolioDemo;
