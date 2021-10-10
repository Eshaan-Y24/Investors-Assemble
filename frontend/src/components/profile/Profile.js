import classes from "./Profile.module.css";
import React, { useEffect, useState } from "react";
import Navbar from "../homepage/Navbar";
import dp from "../images/profile.png";
import Newpost from "../feed/Newpost";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import SlidingPane from "react-sliding-pane";
import { Fade } from "react-awesome-reveal";
const Profile = (props) => {
  const [userPosts, setUserPosts] = useState([]);

  const { userId } = props;
  const { user } = props;
  useEffect(() => {
    let mounted = true;
    const fetchUserPosts = async () => {
      const { data } = await axios.get(`/api/posts/profile/${userId}`);
      if (mounted) {
        setUserPosts(data);
      }
    };
    fetchUserPosts();
    return () => {
      mounted = false;
    };
  }, [userId, userPosts]);

  const [state, setState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
  });

  return (
    <div className={classes.wrapper}>
      <Navbar
        pos="relative"
        round="0"
        clicker={() => setState({ isPaneOpenLeft: true })}
      />
      <div className={classes.container}>
        <div className={classes.leftpane}>
          <img
            src={user.avatar === "" ? props.image : user.avatar}
            alt="404_user_img"
          />
          <h2>{user.name}</h2>
          <h3> {user.isInvestor === 0 ? "Startup" : "Investor"}</h3>
          <p className={classes.bio}>{user.bio}</p>
          <h3 className={classes.date}> Joined: {format(user.createdAt)}</h3>
          {userId === user._id && (
            <Link to="/user/editprofile">
              <h3>Edit Profile</h3>
            </Link>
          )}
        </div>
        <div className={classes.rightpane}>
          <h1>MY POSTS</h1>
          {userPosts.length > 0
            ? userPosts.map((post) => (
                <Fade delay={2}>
                  <Newpost
                    postId={post._id}
                    loggedUser={user}
                    key={post._id}
                    userId={post.userId}
                    time={format(post.createdAt)}
                    desc={post.desc}
                    img={post.img}
                  />
                </Fade>
              ))
            : "NO POSTS AVAILABLE"}
          <SlidingPane
            closeIcon={<div>Some div containing custom close icon.</div>}
            isOpen={state.isPaneOpenLeft}
            title="Hey, it is optional pane title.  I can be React component too."
            from="left"
            onRequestClose={() => setState({ isPaneOpenLeft: false })}
            width="50%"
            from="left"
          >
            <ul className={classes.overlay}>
              {user && (
                <Link to="/feed" className={classes.listitem}>
                  <li className={classes.listitem}>Feed</li>
                </Link>
              )}
              {user && (
                <Link to="/user/profile" className={classes.listitem}>
                  <li className={classes.listitem}>Profile</li>
                </Link>
              )}
              {user && (
                <Link to="/logout" className={classes.listitem}>
                  <li className={classes.listitem}>Log Out</li>
                </Link>
              )}
            </ul>
          </SlidingPane>
        </div>
      </div>
    </div>
  );
};

export default Profile;

Profile.defaultProps = {
  name: "Default Name",
  text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolores modi aliquid possimus explicabo atque illum ullam nisi maiores voluptas, similique illo, natus ratione veritatis enim voluptatum adipisci quisquam ea temporibus numquam rem id necessitatibus quasi nulla. Hic praesentium ipsum perferendis, numquam veritatis sit, maiores fuga repellendus tempora accusantium saepe ab.",
  password: "loremipsumdolersetamet",
  bio: "consectetur adipisicing elit. Dllendus  adipisicing elit. Dllendus  adipisicing elit. Dllendus tempora accusantium",
  image: dp,
  date: "24th July",
  accounttype: "investor",
};
