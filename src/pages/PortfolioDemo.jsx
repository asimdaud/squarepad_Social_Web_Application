import React, { useEffect, useMemo, useState } from "react";
import { getDemoState, saveDemoState, selfProfileId, validDemoTabs } from "../demo/demoStorage";
import TravelMap from "../components/TravelMap";
import InsightsDashboard from "../components/InsightsDashboard";
import azoresImage from "../assets/azores-trail.webp";
import kyotoImage from "../assets/kyoto-lane.webp";
import amalfiImage from "../assets/amalfi-coast.webp";
import "../assets/css/portfolio-demo.css";

const photos = { azores: azoresImage, kyoto: kyotoImage, amalfi: amalfiImage };
const SAVED_ITEMS_KEY = "squarepad_saved_v2";
const LEGACY_SAVED_ITEMS_KEY = "wayfarer_saved_v1";
const navItems = [
  ["timeline", "Your feed", "⌂"],
  ["explore", "Explore", "⌕"],
  ["map", "Traveller map", "◎"],
  ["messages", "Messages", "↗"],
  ["groups", "Communities", "◈"],
  ["profile", "Your profile", "◌"],
  ["insights", "Community insights", "↗"],
];
const stories = [
  { id: "story-maya", personId: "person-maya", place: "The coast before breakfast", location: "Cadaqués, Spain", imageKey: "amalfi", stamp: "TODAY · 08:14" },
  { id: "story-ray", personId: "person-raymond", place: "A walk through the old city", location: "London, UK", imageKey: "kyoto", stamp: "TODAY · 07:02" },
  { id: "story-priya", personId: "person-priya", place: "One more cup, then the train", location: "Singapore", imageKey: "azores", stamp: "YESTERDAY · 18:46" },
  { id: "story-omar", personId: "person-omar", place: "Where the road meets the dunes", location: "Al Marmoom, UAE", imageKey: "amalfi", stamp: "YESTERDAY · 16:21" },
];
const destinations = [
  { id: "place-sete-cidades", city: "Sete Cidades", country: "Azores, Portugal", imageKey: "azores", type: "Trails", lat: 37.86, lon: -25.79, note: "Crater lakes, cloud-soft mornings, and a trail worth taking slowly." },
  { id: "place-kyoto", city: "Kyoto", country: "Japan", imageKey: "kyoto", type: "City", lat: 35.01, lon: 135.77, note: "Early starts, lantern-lit lanes, and the pleasure of getting pleasantly lost." },
  { id: "place-amalfi", city: "Amalfi Coast", country: "Italy", imageKey: "amalfi", type: "Coast", lat: 40.63, lon: 14.60, note: "Small harbors and big views, best seen from the water." },
  { id: "place-lisbon", city: "Lisbon", country: "Portugal", imageKey: "azores", type: "City", lat: 38.72, lon: -9.14, note: "A city for walking with no particular destination in mind." },
];

const initials = (name = "") => name.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
const Icon = ({ name, size = 18 }) => {
  const paths = {
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    comment: <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6.5A7.5 7.5 0 1 1 20 11.5Z" />,
    save: <path d="M6 4h12v17l-6-4-6 4V4Z" />,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    send: <><path d="m21 3-7.5 18-3.8-7.7L2 9.5 21 3Z" /><path d="M9.7 13.3 21 3" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

function Avatar({ person, size = "" }) {
  return <span className={`avatar ${size} tone-${person?.accent || "lime"}`} aria-hidden="true">{initials(person?.name || "?")}</span>;
}

function Photo({ imageKey, className = "", alt = "" }) {
  return <img className={`travel-photo ${className}`} src={photos[imageKey] || photos.azores} alt={alt} loading="lazy" />;
}

function PostCard({ post, profiles, groupsById, onLike, onSave, onComment, onDeleteComment, onProfile, onGroup, onDeletePost, onShare, saved }) {
  const author = profiles[post.authorId] || profiles.self;
  const [draft, setDraft] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const group = groupsById[post.groupId];
  return (
    <article className="post-card">
      <header className="post-header">
        <button className="identity-button" onClick={() => onProfile(author.id)} aria-label={`View ${author.name}'s profile`}><Avatar person={author} /><span className="identity-copy"><strong>{author.name}</strong><small>@{author.username} <span>·</span> {post.timeLabel}</small></span></button>
        <div className="post-menu-wrap">
          <button className="icon-button" aria-label="Post actions" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>···</button>
          {menuOpen && <div className="post-menu" role="menu"><button role="menuitem" onClick={() => { onShare(post); setMenuOpen(false); }}>Copy trip note</button>{post.authorId === selfProfileId && <button role="menuitem" className="danger" onClick={() => { onDeletePost(post.id); setMenuOpen(false); }}>Delete post</button>}</div>}
        </div>
      </header>
      {group && <button className="post-group-link" onClick={() => onGroup(group.id)}>Shared in {group.name}</button>}
      <p className="post-caption">{post.caption}</p>
      {post.location && <div className="post-location"><Icon name="pin" size={14} /><span>{post.location}</span><span className="location-separator">/</span><span>{post.mood}</span></div>}
      {post.hasImage && <Photo imageKey={post.imageKey} alt={`${post.location || "Travel"}: ${post.caption}`} className="post-photo" />}
      <div className="post-actions">
        <button className={`action-link ${post.likedByMe ? "liked" : ""}`} onClick={() => onLike(post.id)} aria-pressed={post.likedByMe}><Icon name="heart" size={17} /> <span>{post.likes}</span></button>
        <button className="action-link" onClick={() => document.getElementById(`comment-${post.id}`)?.focus()}><Icon name="comment" size={17} /> <span>{post.commentsData.length} notes</span></button>
        <button className={`action-link save-action ${saved ? "saved" : ""}`} onClick={() => onSave(post.id)} aria-pressed={saved}><Icon name="save" size={16} /><span>{saved ? "Saved" : "Save"}</span></button>
      </div>
      {post.commentsData.length > 0 && <div className="comment-list">{post.commentsData.map((item) => {
        const commenter = profiles[item.authorId] || profiles.self;
        return <div className="comment-row" key={item.id}><Avatar person={commenter} size="tiny" /><p><strong>{commenter.name}</strong> {item.body} <small>{item.timeLabel}</small></p>{item.authorId === selfProfileId && <button className="delete-comment" aria-label={`Delete your comment: ${item.body}`} onClick={() => onDeleteComment(post.id, item.id)}>Delete</button>}</div>;
      })}</div>}
      <form className="comment-form" onSubmit={(event) => { event.preventDefault(); if (draft.trim()) { onComment(post.id, draft.trim()); setDraft(""); } }}>
        <Avatar person={profiles.self} size="tiny" /><label className="sr-only" htmlFor={`comment-${post.id}`}>Add a travel note</label><input id={`comment-${post.id}`} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add a note..." /><button type="submit" aria-label="Post comment" disabled={!draft.trim()}><Icon name="send" size={16} /></button>
      </form>
    </article>
  );
}

const PortfolioDemo = ({ history, match }) => {
  const routeTab = match?.params?.tab || "timeline";
  const [state, setState] = useState(() => getDemoState());
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [draftPlace, setDraftPlace] = useState("");
  const [activeStory, setActiveStory] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(destinations[0]);
  const [selectedChatId, setSelectedChatId] = useState("chat-1");
  const [chatDraft, setChatDraft] = useState("");
  const [profileDraft, setProfileDraft] = useState(state.profile);
  const [profileEditing, setProfileEditing] = useState(false);
  const [viewingProfileId, setViewingProfileId] = useState(selfProfileId);
  const [activeFilter, setActiveFilter] = useState("All");
  const [toast, setToast] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const currentStorage = localStorage.getItem(SAVED_ITEMS_KEY);
      const legacyStorage = localStorage.getItem(LEGACY_SAVED_ITEMS_KEY);
      const saved = JSON.parse(currentStorage || legacyStorage || "[]");
      if (!currentStorage && legacyStorage && Array.isArray(saved)) localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(saved));
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  });
  const [photoKey, setPhotoKey] = useState("azores");

  useEffect(() => { saveDemoState(state); }, [state]);
  useEffect(() => { try { localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(savedIds)); } catch { /* local demo */ } }, [savedIds]);
  useEffect(() => { if (validDemoTabs.includes(routeTab) && routeTab !== "admin") return; if (routeTab === "admin") history.replace("/demo/insights"); else history.replace("/demo/timeline"); }, [routeTab, history]);
  useEffect(() => { setProfileDraft(state.profile); }, [state.profile]);
  useEffect(() => { document.title = "Squarepad — travel, shared"; }, []);
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(""), 2800); return () => window.clearTimeout(timer); }, [toast]);

  const people = useMemo(() => state.people.map((traveler) => ({
    ...traveler,
    visited: new Set(state.posts.filter((post) => post.authorId === traveler.id).map((post) => (post.location || "").trim().toLowerCase()).filter(Boolean)).size,
  })), [state.people, state.posts]);
  const profiles = useMemo(() => ({
    self: {
      id: selfProfileId,
      accent: "lime",
      status: "Here for the journey",
      ...state.profile,
      visited: new Set(state.posts.filter((post) => post.authorId === selfProfileId).map((post) => (post.location || "").trim().toLowerCase()).filter(Boolean)).size,
    },
    ...Object.fromEntries(people.map((person) => [person.id, person])),
  }), [people, state.profile, state.posts]);
  const groupsById = useMemo(() => Object.fromEntries(state.groups.map((group) => [group.id, group])), [state.groups]);
  const posts = useMemo(() => state.posts.map((post) => {
    const likes = post.likesByIds || [];
    return { ...post, likes: likes.length, likedByMe: likes.includes(selfProfileId), commentsData: post.commentsData || [] };
  }), [state.posts]);
  const postPlaces = useMemo(() => {
    const knownPlaces = [...destinations, ...(state.places || [])];
    const locations = new Map();
    state.posts.forEach((post) => {
      if (!Number.isFinite(post.lat) || !Number.isFinite(post.lon) || !post.location?.trim()) return;
      const location = post.location.trim();
      const locationKey = location.toLowerCase();
      if (knownPlaces.some((place) => locationKey.includes(place.city.toLowerCase())) || locations.has(locationKey)) return;
      const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
      const authorLocation = profiles[post.authorId]?.location || "";
      const authorParts = authorLocation.split(",").map((part) => part.trim());
      let country = parts.slice(1).join(", ");
      if (parts.length > 1 && authorParts.length > 1 && authorParts[0].toLowerCase() === parts.slice(1).join(", ").toLowerCase()) {
        country = authorLocation;
      }
      locations.set(locationKey, {
        id: `post-place-${locationKey.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
        city: parts[0] || location,
        country: country || authorLocation || "Shared trip",
        type: "Community note",
        lat: post.lat,
        lon: post.lon,
        note: post.caption,
        imageKey: post.imageKey,
        fromPost: true,
      });
    });
    return [...locations.values()];
  }, [state.posts, state.places, profiles]);
  const allPlaces = useMemo(() => [...destinations, ...(state.places || []), ...postPlaces], [state.places, postPlaces]);
  const mapPlaces = useMemo(() => allPlaces.map((place) => {
    const placePosts = posts.filter((post) => (post.location || "").toLowerCase().includes(place.city.toLowerCase()));
    const noteCount = placePosts.length;
    const likeCount = placePosts.reduce((sum, post) => sum + post.likes, 0);
    const commentCount = placePosts.reduce((sum, post) => sum + post.commentsData.length, 0);
    const savedPostCount = placePosts.filter((post) => savedIds.includes(post.id)).length;
    const savedPlaceCount = savedIds.includes(`place-${place.city}`) ? 1 : 0;
    return {
      ...place,
      noteCount,
      likeCount,
      commentCount,
      activityScore: noteCount + likeCount + commentCount + savedPostCount + savedPlaceCount,
    };
  }), [allPlaces, posts, savedIds]);
  const selectedMapPlace = mapPlaces.find((place) => place.id === selectedPlace.id || place.city === selectedPlace.city) || mapPlaces[0];
  const trendingPlaces = useMemo(() => [...mapPlaces].filter((place) => place.activityScore > 0).sort((a, b) => b.activityScore - a.activityScore), [mapPlaces]);
  const filteredPosts = useMemo(() => posts.filter((post) => {
    const author = profiles[post.authorId] || profiles.self;
    const text = [post.caption, post.location, post.mood, author.name, author.username, groupsById[post.groupId]?.name].join(" ").toLowerCase();
    const matchesText = text.includes(query.trim().toLowerCase());
    const matchesFilter = activeFilter === "All" || post.mood === activeFilter || post.location?.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesText && matchesFilter;
  }), [posts, profiles, groupsById, query, activeFilter]);
  const filteredGroups = useMemo(() => state.groups.filter((group) => `${group.name} ${group.description} ${group.category} ${(group.tags || []).join(" ")}`.toLowerCase().includes(query.toLowerCase())), [state.groups, query]);
  const activeChat = state.conversations.find((thread) => thread.id === selectedChatId) || state.conversations[0];
  const activeChatPerson = profiles[activeChat?.profileId] || profiles["person-maya"];
  const go = (tab) => { setMobileMenu(false); if (tab === "profile") { setViewingProfileId(selfProfileId); setProfileEditing(false); } history.push(`/demo/${tab}`); };
  const updatePosts = (transform) => setState((current) => ({ ...current, posts: transform(current.posts) }));
  const openProfile = (id = selfProfileId) => { setViewingProfileId(id || selfProfileId); setProfileEditing(false); setMobileMenu(false); history.push("/demo/profile"); };
  const toggleFollow = (id) => setState((current) => ({ ...current, profile: { ...current.profile, followingIds: current.profile.followingIds.includes(id) ? current.profile.followingIds.filter((item) => item !== id) : [...current.profile.followingIds, id] } }));
  const toggleLike = (id) => updatePosts((items) => items.map((post) => post.id === id ? { ...post, likesByIds: (post.likesByIds || []).includes(selfProfileId) ? post.likesByIds.filter((personId) => personId !== selfProfileId) : [...(post.likesByIds || []), selfProfileId] } : post));
  const toggleSave = (id) => { setSavedIds((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]); setToast(savedIds.includes(id) ? "Removed from your saved places." : "Saved to your trip list."); };
  const addComment = (postId, body) => updatePosts((items) => items.map((post) => post.id === postId ? { ...post, commentsData: [...(post.commentsData || []), { id: `comment-${Date.now()}`, authorId: selfProfileId, body, timeLabel: "Just now" }] } : post));
  const deleteComment = (postId, commentId) => updatePosts((items) => items.map((post) => post.id === postId ? { ...post, commentsData: (post.commentsData || []).filter((item) => item.id !== commentId) } : post));
  const deletePost = (id) => { if (!window.confirm("Delete this trip note?")) return; updatePosts((items) => items.filter((post) => post.id !== id)); setSavedIds((items) => items.filter((item) => item !== id)); setToast("Trip note deleted."); };
  const publishPost = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    const location = draftPlace.trim() || "Somewhere on the way";
    const linkedPlace = mapPlaces.find((place) => location.toLowerCase().includes(place.city.toLowerCase()));
    updatePosts((items) => [{
      id: `post-${Date.now()}`,
      authorId: selfProfileId,
      caption: draft.trim(),
      location,
      ...(linkedPlace ? { lat: linkedPlace.lat, lon: linkedPlace.lon, placeId: linkedPlace.id } : {}),
      timeLabel: "Just now",
      mood: "Trip note",
      imageKey: photoKey,
      hasImage: true,
      likesByIds: [],
      commentsData: [],
    }, ...items]);
    setDraft(""); setDraftPlace(""); setToast("Your travel note is on the map.");
  };
  const sendMessage = (event) => { event.preventDefault(); if (!chatDraft.trim() || !activeChat) return; const body = chatDraft.trim(); setState((current) => ({ ...current, conversations: current.conversations.map((thread) => thread.id === activeChat.id ? { ...thread, messages: [...thread.messages, { id: `message-${Date.now()}`, senderId: selfProfileId, body, timeLabel: "Just now" }] } : thread) })); setChatDraft(""); };
  const toggleGroup = (id) => setState((current) => ({ ...current, groups: current.groups.map((group) => group.id === id ? { ...group, memberIds: group.memberIds.includes(selfProfileId) ? group.memberIds.filter((member) => member !== selfProfileId) : [...group.memberIds, selfProfileId] } : group) }));
  const saveProfile = (event) => { event.preventDefault(); setState((current) => ({ ...current, profile: { ...current.profile, ...profileDraft } })); setProfileEditing(false); setToast("Your traveller profile is updated."); };
  const sharePost = async (post) => { try { if (navigator.clipboard) await navigator.clipboard.writeText(`${post.location || "Trip note"} — ${post.caption}`); setToast("Trip note copied."); } catch { setToast("Trip note ready to share."); } };
  const person = profiles.self;
  const viewedProfile = profiles[viewingProfileId] || person;
  const isOwnProfile = viewedProfile.id === selfProfileId;
  const totalMessages = state.conversations.reduce((sum, thread) => sum + thread.messages.length, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.commentsData.length, 0);
  const totalMembers = state.groups.reduce((sum, group) => sum + group.memberIds.length, 0);
  const currentPeopleIds = new Set(people.map((traveler) => traveler.id));
  const totalConnections = new Set([
    ...(state.profile.followingIds || []),
    ...people.filter((traveler) => (traveler.followingIds || []).includes(selfProfileId)).map((traveler) => traveler.id),
  ].filter((personId) => currentPeopleIds.has(personId))).size;
  const uniqueTripLocations = new Set(posts.map((post) => (post.location || "").trim().toLowerCase()).filter(Boolean)).size;
  const savedPostCount = posts.filter((post) => savedIds.includes(post.id)).length;
  const topPlace = trendingPlaces[0] || null;
  const topPost = posts.reduce((best, post) => !best || post.likes + post.commentsData.length > best.likes + best.commentsData.length ? post : best, null);
  const busiestThread = state.conversations.reduce((best, thread) => !best || thread.messages.length > best.messages.length ? thread : best, null);
  const currentTab = routeTab === "admin" ? "insights" : routeTab;
  const tripCountForProfile = (profileId) => new Set(posts
    .filter((post) => post.authorId === profileId)
    .map((post) => (post.location || "").trim().toLowerCase())
    .filter(Boolean)).size;
  const addMapPlace = (place) => {
    setState((current) => ({ ...current, places: [...(current.places || []), place] }));
    setSelectedPlace(place);
    setToast(`${place.city} is on your travel map.`);
  };
  const removeMapPlace = (placeId) => {
    const removed = (state.places || []).find((place) => place.id === placeId);
    setState((current) => ({ ...current, places: (current.places || []).filter((place) => place.id !== placeId) }));
    if (removed) {
      setSavedIds((current) => current.filter((id) => id !== `place-${removed.city}`));
      setSelectedPlace(destinations[0]);
      setToast(`${removed.city} was removed from your map.`);
    }
  };
  const writeNoteFromPlace = (place) => {
    setDraftPlace(`${place.city}, ${place.country}`);
    go("timeline");
  };

  if (!validDemoTabs.includes(routeTab) || routeTab === "admin") return null;

  const pageInfo = {
    timeline: ["Feed", "Trip notes from your circle", "Posts, recommendations, and photos shared by people you follow."],
    explore: ["Explore", "Find your next stop", "Browse places linked to trip notes and local recommendations."],
    map: ["Traveller map", "Trips on the map", "Add places and see where posts, reactions, and saves are happening."],
    messages: ["Messages", "Plan a trip together", "Ask about a route, share a tip, or start a conversation."],
    groups: ["Communities", "Travel groups", "Join discussions about routes, food, walking, and local places."],
    profile: ["Traveller profile", "Your profile and trip history", "Review your notes, saved places, and people you follow."],
    insights: ["Community insights", "Activity across Squarepad", "Counts update from posts, reactions, saves, messages, and connections."],
  }[currentTab];

  return (
    <main className="wayfarer-app">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <button className="brand-mark" onClick={() => go("timeline")} aria-label="Squarepad home"><span className="brand-symbol">s</span><span>squarepad<span className="brand-period">.</span></span></button>
        <div className="topbar-search"><Icon name="search" size={17} /><label className="sr-only" htmlFor="global-search">Search places, people and stories</label><input id="global-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a place, a person, a story..." /></div>
        <button className="avatar-button" aria-label="Open your profile" onClick={() => go("profile")}><Avatar person={person} size="small" /></button>
        <button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-expanded={mobileMenu} aria-label="Toggle navigation">{mobileMenu ? "Close" : "Menu"}</button>
      </header>
      <div className="app-layout">
        <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
          <div className="sidebar-label">YOUR JOURNEY</div>
          <nav aria-label="Main navigation">{navItems.map(([tab, label, glyph]) => <button key={tab} className={`nav-item ${currentTab === tab ? "active" : ""}`} onClick={() => go(tab)}><span className="nav-glyph" aria-hidden="true">{glyph}</span><span>{label}</span>{tab === "messages" && state.conversations.length > 0 && <span className="nav-count">{state.conversations.length}</span>}</button>)}</nav>
          <div className="sidebar-spacer" />
          <div className="sidebar-card">
            <div className="sidebar-card-top"><span className="online-dot" /> YOUR ACTIVITY</div>
            <p>{posts.length} trip notes shared across Squarepad.</p>
            <span className="sidebar-byline">{uniqueTripLocations} locations · {totalConnections} travelers connected</span>
          </div>
          <button className="sidebar-profile" onClick={() => go("profile")}><Avatar person={person} size="small" /><span><strong>{person.name}</strong><small>@{person.username}</small></span><span className="profile-chevron">↗</span></button>
        </aside>
        <section className="main-column">
          <div className="page-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> SQUAREPAD · TRAVEL</div><h1>{pageInfo[1]}</h1><p>{pageInfo[2]}</p></div>
            {currentTab === "map" && <span className="live-label"><i /> {mapPlaces.length} places in atlas</span>}
          </div>
          {currentTab === "timeline" && <section className="timeline-page">
            <div className="story-strip"><div className="story-strip-head"><strong>Stories from your circle</strong><span>STORIES <span className="story-count">{stories.length}</span></span></div><div className="story-row">
              <button className="story-create" onClick={() => go("profile")}><span className="story-plus">+</span><span>Your story</span></button>
              {stories.map((story) => { const author = profiles[story.personId]; return <button className="story-card" key={story.id} onClick={() => setActiveStory(story)} style={{ backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(8,17,13,.88)), url(${photos[story.imageKey]})` }} aria-label={`View ${author.name}'s story: ${story.place}`}><span className="story-ring"><Avatar person={author} size="tiny" /></span><span className="story-name">{author.name.split(" ")[0]}</span><span className="story-place">{story.location}</span></button>; })}
            </div></div>
            <form className="composer" onSubmit={publishPost}><div className="composer-head"><Avatar person={person} /><div><strong>Share a travel note</strong><span>Add a tip, photo, or place from your trip.</span></div><span className="composer-marker"><Icon name="pin" size={15} /> TRIP NOTE</span></div><label className="sr-only" htmlFor="post-draft">Write your travel note</label><textarea id="post-draft" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="What should another traveler know?" rows="3" /><div className="composer-tools"><label className="location-input"><Icon name="pin" size={15} /><span className="sr-only">Location</span><input value={draftPlace} onChange={(event) => setDraftPlace(event.target.value)} placeholder="Add a place" /></label><label className="image-select">PHOTO <select value={photoKey} onChange={(event) => setPhotoKey(event.target.value)} aria-label="Choose a trip photo"><option value="azores">Azores trail</option><option value="kyoto">Kyoto lane</option><option value="amalfi">Amalfi coast</option></select></label><button className="primary-button" type="submit" disabled={!draft.trim()}>Share note <Icon name="arrow" size={16} /></button></div></form>
            <div className="feed-heading"><div><span className="section-kicker">FROM YOUR CIRCLE</span><h2>Fresh from the road</h2></div><button className="quiet-button" onClick={() => go("explore")}>Explore all <Icon name="arrow" size={15} /></button></div>
            {filteredPosts.map((post) => <PostCard key={post.id} post={post} profiles={profiles} groupsById={groupsById} onLike={toggleLike} onSave={toggleSave} onComment={addComment} onDeleteComment={deleteComment} onProfile={openProfile} onGroup={() => go("groups")} onDeletePost={deletePost} onShare={sharePost} saved={savedIds.includes(post.id)} />)}
            {filteredPosts.length === 0 && <div className="empty-state"><span className="empty-mark">W</span><h3>No notes found yet.</h3><p>Try another search, or share the first story from this corner of the map.</p></div>}
          </section>}
          {currentTab === "explore" && <section className="explore-page">
            <div className="explore-controls"><span className="section-kicker">GO WHERE YOU'RE CURIOUS</span><div className="filter-row">{["All", "Trails", "City", "Coast", "Local find", "Walking route"].map((filter) => <button key={filter} className={`filter-chip ${activeFilter === filter ? "selected" : ""}`} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div></div>
            <div className="destination-grid">{mapPlaces.filter((destination) => (activeFilter === "All" || destination.type === activeFilter) && `${destination.city} ${destination.country} ${destination.note}`.toLowerCase().includes(query.toLowerCase())).map((destination, index) => <article className={`destination-card destination-${index + 1}`} key={destination.id || destination.city}><button className="destination-image-button" onClick={() => { setSelectedPlace(destination); go("map"); }} aria-label={`View ${destination.city} on map`}><Photo imageKey={destination.imageKey} alt={destination.city} className="destination-photo" /><span className="destination-index">{String(index + 1).padStart(2, "0")}</span><span className="destination-type">{destination.type}</span></button><div className="destination-copy"><div><h2>{destination.city}</h2><p>{destination.country}</p></div><button className="round-arrow" aria-label={`Explore ${destination.city} on map`} onClick={() => { setSelectedPlace(destination); go("map"); }}><Icon name="arrow" size={17} /></button><p className="destination-note">{destination.note}</p><div className="destination-footer"><span><Icon name="save" size={14} /> {destination.noteCount} trip notes · {destination.activityScore} activity signals</span><button onClick={() => toggleSave(`place-${destination.city}`)}>{savedIds.includes(`place-${destination.city}`) ? "Saved" : "Save place"}</button></div></div></article>)}</div>
            <div className="feed-heading explore-feed-heading"><div><span className="section-kicker">TRAVELLERS' NOTES</span><h2>Go beyond the guidebook</h2></div><span className="results-count">{filteredPosts.length} notes</span></div>
            <div className="explore-notes">{filteredPosts.slice(0, 4).map((post) => <PostCard key={post.id} post={post} profiles={profiles} groupsById={groupsById} onLike={toggleLike} onSave={toggleSave} onComment={addComment} onDeleteComment={deleteComment} onProfile={openProfile} onGroup={() => go("groups")} onDeletePost={deletePost} onShare={sharePost} saved={savedIds.includes(post.id)} />)}</div>
          </section>}
          {currentTab === "map" && <section className="map-page travel-map-page"><TravelMap places={mapPlaces} selectedPlace={selectedMapPlace} searchQuery={query} savedIds={savedIds} onSelectPlace={setSelectedPlace} onAddPlace={addMapPlace} onRemovePlace={removeMapPlace} onToggleSave={toggleSave} onWriteNote={writeNoteFromPlace} /></section>}
          {currentTab === "messages" && <section className="messages-page"><div className="messages-shell">
            <aside className="thread-list">
              <div className="thread-list-title"><div><span className="section-kicker">YOUR TRAVEL CIRCLE</span><h2>Conversations</h2></div><span className="thread-number">{state.conversations.length.toString().padStart(2, "0")}</span></div>
              {state.conversations.map((thread) => { const chatPerson = profiles[thread.profileId]; const last = thread.messages[thread.messages.length - 1]; return <button key={thread.id} className={`thread-item ${thread.id === activeChat?.id ? "thread-active" : ""}`} onClick={() => setSelectedChatId(thread.id)}><Avatar person={chatPerson} /><span className="thread-copy"><strong>{chatPerson.name}</strong><small>{last?.body || "Start a conversation"}</small></span><span className="thread-time">{last?.timeLabel}</span></button>; })}
              <button className="start-conversation" onClick={() => { const first = state.people.find((personData) => !state.conversations.some((thread) => thread.profileId === personData.id)); if (!first) { setToast("You're already connected with everyone here."); return; } const thread = { id: `chat-${Date.now()}`, profileId: first.id, messages: [] }; setState((current) => ({ ...current, conversations: [...current.conversations, thread] })); setSelectedChatId(thread.id); }}>+ Start a new conversation</button>
            </aside>
            <div className="chat-pane">{activeChat ? <>
              <header className="chat-header"><Avatar person={activeChatPerson} /><div><strong>{activeChatPerson.name}</strong><small><i className="online-dot" /> {activeChatPerson.status} · {activeChatPerson.location}</small></div><button className="quiet-button" onClick={() => openProfile(activeChatPerson.id)}>View profile <Icon name="arrow" size={14} /></button></header>
              <div className="chat-context"><span className="context-rule" /> <span>MESSAGES · LOCAL DEMO</span> <span className="context-rule" /></div>
              <div className="message-stream" aria-live="polite">{activeChat.messages.map((item) => <div key={item.id} className={`message-row ${item.senderId === selfProfileId ? "mine" : ""}`}>{item.senderId !== selfProfileId && <Avatar person={profiles[item.senderId]} size="tiny" />}<div className="message-bubble"><p>{item.body}</p><small>{item.timeLabel}</small></div></div>)}{activeChat.messages.length === 0 && <div className="empty-chat"><span>—</span><p>Send a message to start planning.</p></div>}</div>
              <form className="message-composer" onSubmit={sendMessage}><label className="sr-only" htmlFor="message-draft">Write a message</label><input id="message-draft" value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} placeholder={`Write to ${activeChatPerson.name.split(" ")[0]}...`} /><button type="submit" disabled={!chatDraft.trim()} aria-label="Send message"><Icon name="send" size={17} /></button></form>
            </> : <div className="empty-state"><h3>No conversations yet</h3><p>Start a conversation with someone in your travel circle.</p></div>}</div>
          </div></section>}
          {currentTab === "groups" && <section className="groups-page"><div className="group-feature"><div className="group-feature-image"><Photo imageKey="azores" alt="Mountain path at sunrise" /><div className="feature-stamp">TRAVEL DISCUSSIONS</div></div><div className="group-feature-copy"><span className="section-kicker">SQUAREPAD GROUPS</span><h2>Talk travel with people who share your interests.</h2><p>Swap useful routes, local food finds, and advice for your next trip.</p><button className="text-arrow" onClick={() => setQuery("slow travel")}>Browse slow travel <Icon name="arrow" size={15} /></button></div></div><div className="feed-heading"><div><span className="section-kicker">YOUR GROUPS</span><h2>Groups for your next trip</h2></div><span className="results-count">{filteredGroups.length} groups</span></div><div className="groups-grid">{filteredGroups.map((group, index) => { const owner = profiles[group.ownerId]; const joined = group.memberIds.includes(selfProfileId); const groupPosts = posts.filter((post) => post.groupId === group.id); return <article className="group-card" key={group.id}><div className={`group-cover cover-${index % 3}`}><Photo imageKey={group.imageKey} alt="" /><span className="group-category">{group.category}</span><span className="group-serial">GROUP / {String(index + 1).padStart(2, "0")}</span></div><div className="group-card-body"><div className="group-owner"><Avatar person={owner} size="tiny" /><span>Started by <strong>{owner.name}</strong></span></div><h3>{group.name}</h3><p>{group.description}</p><div className="group-tags">{group.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="group-spotlight"><span>DISCUSSION PROMPT</span><p>{group.spotlight}</p></div><div className="group-card-footer"><span><strong>{group.memberIds.length}</strong> travelers <span>·</span> {groupPosts.length} notes</span><button className={joined ? "joined-button" : "join-button"} onClick={() => toggleGroup(group.id)}>{joined ? "Joined" : "Join group"}</button></div>{groupPosts[0] && <button className="group-story-link" onClick={() => go("timeline")}>Read latest: “{groupPosts[0].caption.slice(0, 58)}...” <Icon name="arrow" size={13} /></button>}</div></article>; })}</div></section>}
          {currentTab === "profile" && <section className="profile-page">
            <div className="profile-cover"><Photo imageKey="azores" alt="Azores coastline" /><div className="cover-caption">TRIP NOTES · {viewedProfile.location.toUpperCase()}</div></div>
            <div className="profile-main">
              <div className="profile-identity">
                <Avatar person={viewedProfile} size="large" />
                <div><span className="section-kicker">{isOwnProfile ? "YOUR PROFILE" : "TRAVELER PROFILE"}</span><h2>{viewedProfile.name}</h2><p>@{viewedProfile.username} <span>·</span> {viewedProfile.location}</p></div>
                {isOwnProfile ? <button className="secondary-button" onClick={() => setProfileEditing(!profileEditing)}>{profileEditing ? "Cancel edit" : "Edit profile"}</button> : <button className={`follow-button profile-follow ${state.profile.followingIds.includes(viewedProfile.id) ? "is-following" : ""}`} onClick={() => toggleFollow(viewedProfile.id)}>{state.profile.followingIds.includes(viewedProfile.id) ? "Following" : "Follow"}</button>}
              </div>
              {profileEditing && isOwnProfile
                ? <form className="profile-edit-form" onSubmit={saveProfile}><label>Name<input value={profileDraft.name} onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })} /></label><label>Username<input value={profileDraft.username} onChange={(event) => setProfileDraft({ ...profileDraft, username: event.target.value.replace(/^@/, "") })} /></label><label>Home base<input value={profileDraft.location} onChange={(event) => setProfileDraft({ ...profileDraft, location: event.target.value })} /></label><label>About your travels<textarea value={profileDraft.bio} onChange={(event) => setProfileDraft({ ...profileDraft, bio: event.target.value })} rows="3" /></label><button className="primary-button" type="submit">Save profile <Icon name="arrow" size={15} /></button></form>
                : <><p className="profile-bio">{viewedProfile.bio}</p><div className="profile-stats"><div><strong>{viewedProfile.visited}</strong><span>PLACES IN NOTES</span></div><div><strong>{(viewedProfile.followingIds || []).length}</strong><span>TRAVELERS FOLLOWED</span></div><div><strong>{isOwnProfile ? savedIds.length : posts.filter((post) => post.authorId === viewedProfile.id).length}</strong><span>{isOwnProfile ? "ITEMS SAVED" : "TRIP NOTES"}</span></div></div></>}
              <div className="profile-saved">
                <div className="feed-heading"><div><span className="section-kicker">{isOwnProfile ? "YOUR TRAVEL CIRCLE" : "TRAVEL CIRCLE"}</span><h2>Travelers in your circle</h2></div></div>
                <div className="people-row">{people.map((traveler) => <article className="person-card" key={traveler.id}><button className="person-main" onClick={() => openProfile(traveler.id)}><Avatar person={traveler} /><span><strong>{traveler.name}</strong><small>{traveler.location}</small><small>{traveler.visited} places in notes</small></span></button><button className={`follow-button ${state.profile.followingIds.includes(traveler.id) ? "is-following" : ""}`} onClick={() => toggleFollow(traveler.id)}>{state.profile.followingIds.includes(traveler.id) ? "Following" : "Follow"}</button></article>)}</div>
              </div>
              <div className="feed-heading profile-post-heading"><div><span className="section-kicker">NOTES FROM {isOwnProfile ? "YOUR" : `${viewedProfile.name.split(" ")[0].toUpperCase()}'S`} TRIPS</span><h2>{isOwnProfile ? "Your recent notes" : "Recent trip notes"}</h2></div></div>
              {posts.filter((post) => post.authorId === viewedProfile.id).map((post) => <PostCard key={post.id} post={post} profiles={profiles} groupsById={groupsById} onLike={toggleLike} onSave={toggleSave} onComment={addComment} onDeleteComment={deleteComment} onProfile={openProfile} onGroup={() => go("groups")} onDeletePost={deletePost} onShare={sharePost} saved={savedIds.includes(post.id)} />)}
            </div>
          </section>}
          {currentTab === "insights" && <InsightsDashboard posts={posts} profiles={profiles} groups={state.groups} conversations={state.conversations} places={mapPlaces} peopleConnected={totalConnections} tripLocations={uniqueTripLocations} savedItems={savedIds.length} savedPosts={savedPostCount} memberships={totalMembers} likes={totalLikes} comments={totalComments} messages={totalMessages} busiestPost={topPost} busiestConversation={busiestThread} onOpenPlace={(place) => { setSelectedPlace(place); go("map"); }} onOpenMessages={() => go("messages")} />}
          <footer className="app-footer"><span>SQUAREPAD · TRAVEL COMMUNITY DEMO</span><span>LOCAL DEMO DATA</span></footer>
        </section>
        {currentTab === "timeline" && <aside className="right-rail"><div className="rail-card rail-destination"><div className="rail-image"><Photo imageKey={topPlace?.imageKey || "amalfi"} alt={topPlace?.city || "Trip location"} /><span>FROM YOUR TRIP NOTES</span></div><div className="rail-copy"><span className="section-kicker">MOST ACTIVE PLACE</span><h3>{topPlace?.city || "No location notes yet"}</h3><p>{topPlace ? `${topPlace.noteCount} trip notes · ${topPlace.activityScore} activity signals.` : "Add a location to a post to see it on your map."}</p><button className="text-arrow" onClick={() => { if (topPlace) setSelectedPlace(topPlace); go("map"); }}>{topPlace ? "View on map" : "Open map"} <Icon name="arrow" size={14} /></button></div></div><div className="rail-card people-rail"><div className="rail-heading"><span className="section-kicker">TRAVELERS YOU FOLLOW</span><button onClick={() => go("profile")}>VIEW ALL</button></div>{people.slice(0, 4).map((traveler) => <div className="rail-person" key={traveler.id}><button className="rail-person-identity" onClick={() => setToast(`${traveler.name} is ${traveler.status.toLowerCase()}.`)}><Avatar person={traveler} size="tiny" /><span><strong>{traveler.name}</strong><small>{traveler.location}</small></span></button><button className="rail-follow" aria-label={`Follow ${traveler.name}`} onClick={() => toggleFollow(traveler.id)}>{state.profile.followingIds.includes(traveler.id) ? "✓" : "+"}</button></div>)}</div><div className="rail-quote"><span>YOUR ACTIVITY</span><p>{posts.length} trip notes posted</p><small>{uniqueTripLocations} locations · {totalConnections} travelers connected</small></div></aside>}
      </div>
      {activeStory && <div className="modal-backdrop" role="presentation" onClick={() => setActiveStory(null)}><section className="story-modal" role="dialog" aria-modal="true" aria-label={`${profiles[activeStory.personId]?.name}'s story`} onClick={(event) => event.stopPropagation()} style={{ backgroundImage: `linear-gradient(180deg,rgba(5,12,9,.08),rgba(5,12,9,.76)),url(${photos[activeStory.imageKey]})` }}><button className="story-close" onClick={() => setActiveStory(null)} aria-label="Close story"><Icon name="close" /></button><div className="story-progress"><i /></div><div className="story-modal-meta"><Avatar person={profiles[activeStory.personId]} size="tiny" /><span><strong>{profiles[activeStory.personId]?.name}</strong><small>{activeStory.stamp}</small></span></div><div className="story-modal-copy"><span>{activeStory.location}</span><h2>{activeStory.place}</h2><button onClick={() => { setActiveStory(null); go("explore"); }}>See travel notes <Icon name="arrow" size={15} /></button></div></section></div>}
      {toast && <div className="toast-message" role="status">{toast}<button onClick={() => setToast("")} aria-label="Dismiss"><Icon name="close" size={14} /></button></div>}
    </main>
  );
};

export function Welcome({ history }) {
  const [notice, setNotice] = useState(false);
  const [email, setEmail] = useState("");
  const [demoData] = useState(() => getDemoState());
  const featuredPost = demoData.posts[0];
  const featuredAuthor = featuredPost?.authorId === selfProfileId
    ? demoData.profile
    : demoData.people.find((traveler) => traveler.id === featuredPost?.authorId);
  useEffect(() => { document.title = "Squarepad — sign-in preview"; }, []);
  const submit = (event) => { event.preventDefault(); setNotice(true); };
  return (
    <main className="welcome-page">
      <section className="welcome-visual">
        <div className="welcome-brand"><span className="brand-symbol">s</span><span>squarepad<span className="brand-period">.</span></span></div>
        <div className="welcome-story">
          <span className="eyebrow"><span className="eyebrow-line" /> TRAVEL POSTS & LOCAL RECOMMENDATIONS</span>
          <h1>Travel posts<br />and local finds.</h1>
          <p>Share trip notes, save places, and ask other travelers for recommendations.</p>
          <div className="welcome-quote">
            <span>“</span>
            <p>{featuredPost?.caption || "Share a trip note to see it featured here."}</p>
            <small>{featuredPost?.location || "From the Squarepad demo"}{featuredAuthor?.name ? ` · ${featuredAuthor.name}` : ""}</small>
          </div>
          <div className="welcome-foot">TRIPS · PLACES · PEOPLE <span>SQUAREPAD</span></div>
        </div>
      </section>
      <section className="welcome-form-side">
        <button className="welcome-back" onClick={() => history.push("/demo/timeline")}>← Open the demo</button>
        <div className="welcome-form-wrap">
          <span className="welcome-kicker">SIGN-IN PAGE PREVIEW</span>
          <h2>Welcome back.</h2>
          <p>Sign-in is disabled here. You can explore Squarepad without an account.</p>
          <form className="welcome-form" onSubmit={submit}>
            <label htmlFor="welcome-email">Email address</label>
            <input id="welcome-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="off" />
            <button type="submit">Continue <Icon name="arrow" size={17} /></button>
          </form>
          <div className="welcome-divider"><span>OR</span></div>
          <button className="demo-access" onClick={() => history.push("/demo/timeline")}>Open Squarepad demo <Icon name="arrow" size={16} /></button>
          <p className="demo-disclaimer">This page is a visual preview. It does not create accounts or send or store email addresses.</p>
          {notice && <p className="demo-notice" role="status">This sign-in page is a visual demo. Your email was not sent or stored.</p>}
          <div className="welcome-legal"><span>SQUAREPAD</span><span>DEMO PREVIEW</span></div>
        </div>
      </section>
    </main>
  );
}

export default PortfolioDemo;
