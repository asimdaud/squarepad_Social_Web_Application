import React from "react";
import azoresImage from "../assets/azores-trail.webp";
import kyotoImage from "../assets/kyoto-lane.webp";
import amalfiImage from "../assets/amalfi-coast.webp";

const photos = { azores: azoresImage, kyoto: kyotoImage, amalfi: amalfiImage };

const InsightsDashboard = ({
  posts,
  profiles,
  groups,
  conversations,
  places,
  peopleConnected,
  tripLocations,
  savedItems,
  savedPosts,
  memberships,
  likes,
  comments,
  messages,
  busiestPost,
  busiestConversation,
  onOpenPlace,
  onOpenMessages,
}) => {
  const maxActivity = places.reduce((max, place) => Math.max(max, place.activityScore), 1);
  const activePlaces = places.filter((place) => place.activityScore > 0);

  return (
    <section className="insights-page">
      <div className="insights-lede">
        <div>
          <span className="section-kicker">LIVE DEMO DATA</span>
          <h2>Current community activity</h2>
          <p>Counts use the posts, follows, saves, and messages stored in this browser.</p>
        </div>
        <span className="insights-date">LOCAL DATA</span>
      </div>

      <div className="insight-metrics">
        <article className="metric-card metric-feature">
          <span>TRIP NOTES SHARED</span>
          <strong>{posts.length}</strong>
          <small>Across the community journal</small>
          <div className="metric-bars" aria-label="Activity signals by place">
            {activePlaces.map((place) => <i key={place.id || place.city} title={`${place.city}: ${place.activityScore} activity signals`} style={{ height: `${Math.max(16, (place.activityScore / maxActivity) * 100)}%` }} />)}
          </div>
        </article>
        <article className="metric-card">
          <span>PEOPLE CONNECTED</span>
          <strong>{peopleConnected}</strong>
          <small>Unique followers and mutual connections</small>
          <div className="metric-foot"><span>POST LOCATIONS</span><b>{tripLocations}</b></div>
        </article>
        <article className="metric-card">
          <span>TRIP ITEMS SAVED</span>
          <strong>{savedItems}</strong>
          <small>Saved notes and places on this device</small>
          <div className="metric-foot"><span>SAVED POSTS</span><b>{savedPosts}</b></div>
        </article>
        <article className="metric-card">
          <span>COMMUNITY CIRCLES</span>
          <strong>{groups.length}</strong>
          <small>Active groups in the local demo</small>
          <div className="metric-foot"><span>MEMBERSHIPS</span><b>{memberships}</b></div>
        </article>
        <article className="metric-card">
          <span>COMMUNITY ENGAGEMENT</span>
          <strong>{likes + comments}</strong>
          <small>{likes} likes · {comments} comments</small>
          <div className="metric-foot"><span>ACTIVE POSTS</span><b>{posts.length}</b></div>
        </article>
        <article className="metric-card">
          <span>MESSAGES EXCHANGED</span>
          <strong>{messages}</strong>
          <small>{conversations.length} active conversations</small>
          <div className="metric-foot"><span>TRAVELERS CONNECTED</span><b>{peopleConnected}</b></div>
        </article>
      </div>

      <div className="insight-columns">
        <article className="insight-panel">
          <div className="panel-heading">
            <span className="section-kicker">DESTINATIONS BY ACTIVITY</span>
            <h3>Most active destinations</h3>
          </div>
          {activePlaces.length ? activePlaces.slice(0, 5).map((place, index) => (
            <button className="trending-row" key={place.id || place.city} onClick={() => onOpenPlace(place)}>
              <span className="trending-rank">{String(index + 1).padStart(2, "0")}</span>
              <img src={photos[place.imageKey] || photos.azores} alt="" />
              <span><strong>{place.city}</strong><small>{place.noteCount} notes · {place.country}</small></span>
              <span className="trending-saves">{place.activityScore} signals</span>
            </button>
          )) : <p className="insights-empty">Share a trip note to surface places here.</p>}
        </article>

        <article className="insight-panel circle-activity">
          <div className="panel-heading">
            <span className="section-kicker">GROUP ACTIVITY</span>
            <h3>Latest group discussions</h3>
          </div>
          {groups.slice(0, 4).map((group, index) => (
            <div className="pulse-row" key={group.id}>
              <span className="pulse-index">{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{group.name}</strong><p>{group.spotlight}</p></div>
              <span className="pulse-count">{group.memberIds.length} joined</span>
            </div>
          ))}
        </article>

        <article className="insight-panel wide-insight">
          <div className="panel-heading">
            <span className="section-kicker">POSTS & CONVERSATIONS</span>
            <h3>Most active threads</h3>
          </div>
          <div className="activity-highlights">
            <div>
              <span>LEADING TRIP NOTE</span>
              <strong>{busiestPost ? `${profiles[busiestPost.authorId]?.name || "Traveler"} · ${busiestPost.location}` : "No notes yet"}</strong>
              <small>{busiestPost ? `${busiestPost.likes} likes and ${busiestPost.commentsData.length} comments` : "Share a first note to get started."}</small>
            </div>
            <div>
              <span>BUSIEST CONVERSATION</span>
              <strong>{busiestConversation ? profiles[busiestConversation.profileId]?.name : "No conversations yet"}</strong>
              <small>{busiestConversation ? `${busiestConversation.messages.length} messages in this thread` : "Start a conversation from Messages."}</small>
            </div>
            <button className="text-arrow" onClick={onOpenMessages}>Open messages →</button>
          </div>
        </article>
      </div>

      <div className="insights-note">
        <span className="online-dot" />
        <span>Every count is calculated from the current local posts, connections, saves, and messages.</span>
      </div>
    </section>
  );
};

export default InsightsDashboard;
