import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useState, useEffect } from "react";
import api from "../../config/api";
import { useHistory } from "react-router";
import DestroyComment from "../DestroyComment/DestroyComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostComment from "../PostComment/PostComment";
import CommentLike from "../CommentLike/Commentlike";
import ViewComment from "../ViewComment/ViewComment";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function SimpleAccordion({ updatViewMessage, messageId, modifyComment, newComments, myUserId }) {
  const classes = useStyles();
  const history = useHistory();
  const [comments, setcomments] = useState([]);

  const getCommentApi = async () => {
    if (sessionStorage.getItem("groupomaniaToken")) {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));

      try {
        const response = await api({
          method: "get",
          url: "/comment/" + messageId,
          headers: { Authorization: `Bearer ${token}` },
        });

        setcomments(response.data);
      } catch (error) {
        history.push("/connexion");
      }
    } else {
      history.push("/connexion");
    }
  };

  const deleteOneComment = (commentId) => {
    const idToRemove = commentId;
    const filteredMessages = comments.filter((item) => item.id !== idToRemove);
    setcomments(filteredMessages);
  };

  const modifyCommentLike = ({ commentsId, like, dislike }) => {
    const newComments = comments.filter((element) => {
      if (element.id === commentsId) {
        element.likes = like;
        element.dislikes = dislike;
      }
      return element;
    });
    setcomments(newComments);
  };

  const postComment = (newComments) => {
    setcomments(newComments);
  };

  const viewUpdateComments = (updateComments) => {
    setcomments(updateComments);
  };

  return (
    <div className={classes.root}>
      <Accordion onClick={getCommentApi}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className={classes.heading}>Commentaires</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="flex-position">
              {comments &&
                comments.map((element) => {
                  return (
                    <div key={element.id} className="card-position">
                      <div className="f-card">
                        <div className="header">
                          <div className="options"></div>
                          <img className="co-logo" alt="img" src={element.User.avatar} />
                          <div className="co-name">
                            <a href="#">{element.User.username}</a>
                          </div>
                          <div className="time">
                            <div>{element.createdAt}</div> · <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
                          </div>
                        </div>
                        <div className="content">
                          <div>{element.content} </div>
                        </div>
                        <div className="social">
                          <div className="social-content"></div>
                          <div className="social-buttons">
                            <span>
                              <CommentLike
                                modifyCommentLike={modifyCommentLike}
                                commentsId={element.id}
                                like={element.likes}
                                dislike={element.dislikes}
                              />
                            </span>
                            <span>
                              {element.UserId === myUserId ? (
                                <DestroyComment
                                  modifyComment={modifyComment}
                                  newComments={newComments}
                                  commentsId={element.id}
                                  messageId={messageId}
                                  deleteOneComment={deleteOneComment}
                                />
                              ) : (
                                <></>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              <PostComment
                modifyComment={modifyComment}
                newComments={newComments}
                updatViewMessage={updatViewMessage}
                postComment={postComment}
                messageId={messageId}
              />
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
