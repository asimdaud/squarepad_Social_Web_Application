// import db from "../utils/firebase";
import * as firebase from "firebase";

const db =   firebase
.firestore()
.collection("timeline")
.doc(JSON.parse(localStorage.getItem("uid")));

export default {
  /**
   * this function will be fired when you first time run the app,
   * and it will fetch first 5 posts, here I retrieve them in descending order, until the last added post appears first.
   */
  postsFirstBatch: async function () {
    try {
      const data = await db
        .collection("timelinePosts")
        .orderBy("time", "desc")
        .startAfter("1617710830035")
        .limit(5)
        .get();

      let posts = [];
      let lastKey;
      data.forEach((doc) => {
        let data = doc.data();
        posts.push({
username: data.username,
            userId: data.userId,
            title: "post",
            profilePic: data.userAvatar,
            image: data.image,
            caption: data.caption ? data.caption : null,
            postId: data.postId,
            timeStamp: data.time,
            type: data.type ? data.type : null,
            video: data.video ? data.video : null,
            locName: data.location ? data.location.locationName : null,
            });
        lastKey = data.time;
        console.log(JSON.stringify(data.time))
        console.log(data)
      });

      return { posts, lastKey };
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * this function will be fired each time the user click on 'More Posts' button,
   * it receive key of last post in previous batch, then fetch next 5 posts
   * starting after last fetched post.  
   */
  postsNextBatch: async (key) => {
    try {
      const data = await db
      .collection("timelinePosts")
        .orderBy("time", "desc")
        .startAfter(key)
        .limit(5)
        .get();

      let posts = [];
      let lastKey;
      data.forEach((doc) => {
        let data = doc.data();
        posts.push({
username: data.username,
            userId: data.userId,
            title: "post",
            profilePic: data.userAvatar,
            image: data.image,
            caption: data.caption ? data.caption : null,
            postId: data.postId,
            timeStamp: data.time,
            type: data.type ? data.type : null,
            video: data.video ? data.video : null,
            locName: data.location ? data.location.locationName : null,
            });
        lastKey = data.time;      });
      return { posts, lastKey };
    } catch (e) {
      console.log(e);
    }
  }
};