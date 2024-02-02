// SplashPage.js

import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Link,
  Grid,
  List,
  TextareaAutosize,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AOS from "aos";
import { listPost, newPost } from "../actions/postActions";
import Posts from "../components/Posts";
import Loader from "../components/Loader";

const SplashScreen = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;
  const listPostState = useSelector((state) => state.listPosts);
  const { loading: postLoading, posts } = listPostState;
  const createPostState = useSelector((state) => state.createPost);
  const { loading: createLoading, post } = createPostState;

  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 1500,
      easing: "ease-out-cubic",
    });

    // Check if the dialog has been shown before
    const hasDialogBeenShown = localStorage.getItem("dialogShown");

    if (userInfo) {
      dispatch(listPost());
      console.log(JSON.parse(userInfo).posted);
    }
    if (hasDialogBeenShown) {
      setConfirmationOpen(false);
      // Mark the dialog as shown in local storage
      localStorage.removeItem("dialogShown");
    }
  }, [userInfo, dispatch]);

  const handleAddPost = async (e) => {
    e.preventDefault();
    await dispatch(newPost(JSON.parse(userInfo).username, content));
    dispatch(listPost());
    setConfirmationOpen(false);
  };

  const handleConfirmPost = (e) => {
    e.preventDefault();
    setConfirmationOpen(false);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
  };
  return (
    <Container position="static" maxWidth="md">
      {userInfo ? (
        <>
          {loading || postLoading || createLoading ? (
            <Loader />
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight="20vh"
              textAlign="center"
            >
              <TextareaAutosize
                aria-label="empty textarea"
                className="custom-textarea"
                hidden={JSON.parse(JSON.stringify(userInfo)).posted ? true : false}
                name="content"
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                style={{
                  marginTop: 100,
                  height: 100,
                  width: 800,
                  minWidth: "94%",
                  maxWidth: "100%",
                  minHeight: 100,
                  fontSize: "20px",
                }}
                rowsmin={3}
                onClick={() => {
                  const hasDialogBeenShown =
                    localStorage.getItem("dialogShown");
                  if (!hasDialogBeenShown) {
                    setConfirmationOpen(true);
                    // Mark the dialog as shown in local storage
                    localStorage.setItem("dialogShown", "true");
                  }
                }}
              />

              {/* Button to add a new post */}
              <Button
                type="submit"
                variant="outlined"
                onClick={handleAddPost}

                sx={{
                  mt: 2,
                  mb: 2,
                  color: "inherit",
                  borderColor: "white !important",
                  display: JSON.parse(userInfo).posted === true ? "none" : "block",
                }}
              >
                Add Post
              </Button>
              <List>
                {posts.map((post) => (
                  <Grid key={post._id} item marginTop={JSON.parse(userInfo).posted === true ? 10 : 0}>
                    <Posts post={post} />
                  </Grid>
                ))}
              </List>

              {/* Confirmation Dialog */}
              <Dialog
                PaperProps={{
                  sx: {
                    backgroundColor: "black",
                    color: "white !important",
                  },
                }}
                open={isConfirmationOpen}
                onClose={handleCloseConfirmation}
              >
                <DialogTitle>Heads Up!</DialogTitle>
                <DialogContent>
                  You only have one chance to post. Make sure to make it count!
                  <br />
                  <br />
                  Consider this as a gentle haven for the unspoken.
                  <br />
                  <br />
                  So feel free to express your thoughts.
                  <br />
                  Write the unwritten, heal the unseen, let the silence speak
                  and compassion listen.
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="outlined"
                    onClick={handleConfirmPost}
                    sx={{
                      color: "inherit",
                      borderColor: "white !important",
                    }}
                  >
                    Got it!
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}
        </>
      ) : (
        <>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            textAlign="center"
          >
            <Typography
              data-aos={"fade-down"}
              variant="h3"
              component="h1"
              gutterBottom
            >
              Welcome to Inkcognito
            </Typography>
            <Typography paragraph data-aos={"fade-right"} variant="subtitle1">
              Where silence Speaks and Compassion Listens.
            </Typography>
            <Box mt={3}>
              <Button
                sx={{ background: "#a3a3a3d1", color: "white" }}
                data-aos={"fade-up"}
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/auth/login"
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default SplashScreen;
