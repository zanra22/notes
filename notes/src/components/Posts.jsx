import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
  CardActions,
} from "@mui/material";

function Post({ post }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(60); // Default max height

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [showFullContent, post.content]);

  const wordsLimit = 20; // Adjust the number of words you want to display initially

  const contentToShow = showFullContent
    ? post.content
    : post.content.split(" ").slice(0, wordsLimit).join(" ") + " ...";

  return (
    <Card
      sx={{
        maxWidth: "100%",
        width: "800",
        maxHeight: '100%',
        marginBottom: 10,
        backgroundColor: "#424242d1",
        color: "#d0d0d0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea>
        <CardContent>
          <Typography
            gutterBottom
            component="div"
            ref={contentRef}
            sx={{
              overflow: "hidden",
              transition: "max-height 1.5s",
              maxHeight: showFullContent ? `${contentHeight}px` : "60px", // Use the dynamic height
            }}
          >
            {contentToShow}
          </Typography>
          {post.content.split(" ").length > wordsLimit && (
            <span
              style={{ color: "whitesmoke", fontSize: "15px" }}
              className="see-more-button"
              onClick={() => setShowFullContent(!showFullContent)}
            >
              {showFullContent ? "See Less" : "See More"}
            </span>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">By: {post.user}</Typography>
        <Button variant="filled" size="small">
          Report this post
        </Button>
      </CardActions>
    </Card>
  );
}

export default Post;
