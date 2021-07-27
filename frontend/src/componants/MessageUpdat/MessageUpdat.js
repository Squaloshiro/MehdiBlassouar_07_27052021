import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "../Button/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../pages/LandingPage/landingpage.scss";
import api from "../../config/api";
import { useState } from "react";
import Input from "../../componants/Input/Input";
import { useRef } from "react";
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    width: "600px",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs({ viewUpdateMessage, element }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const userNameRef = useRef(null);
  console.log("------------userNameRef------------------------");
  console.log(userNameRef);
  console.log("------------------------------------");
  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const updateMessage = async () => {
    setOpen(false);
    const obj = { title, content };
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/messages/" + element.id,
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      viewUpdateMessage(response.data);
    } catch (error) {}
  };

  return (
    <div className="card-position" key={element.id}>
      <Button color="primary" ref={userNameRef} onClick={handleClickOpen} title="Modifier" />

      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Modifier votre publication
        </DialogTitle>
        <DialogContent dividers>
          <div>
            <div>
              <img className="co-logo" alt="img" src="http://placehold.it/40x40" />
              <div className="co-name">
                <div>{element.User.username}</div>
              </div>
              <div className="time">
                <div>{element.createdAt}</div> · <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
              </div>
            </div>
            <div className="content">
              <Input onChange={onChangeTitle} value={title} label={element.title}></Input>
            </div>
            {element.attachment ? (
              <div className="reference">
                <img alt="img" className="reference-thumb" src={element.attachment} />
                <div className="reference-content">
                  <div className="reference-subtitle">
                    <Input onChange={onChangeContent} value={content} label={element.title}></Input>
                  </div>
                  <div className="reference-font">Groupomania</div>
                </div>
              </div>
            ) : (
              <div className="reference">
                <div className="reference-content">
                  <div className="reference-subtitle">
                    <Input onChange={onChangeContent} value={content} label={element.title}></Input>
                  </div>
                  <div className="reference-font">Groupomania</div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={updateMessage} color="primary">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
