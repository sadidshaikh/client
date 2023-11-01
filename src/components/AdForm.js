// max character for prod name 15 chars
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import FileBase64 from "react-file-base64";
import storage from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// MUI
import {
  Box,
  Paper,
  TextField,
  Button,
  InputLabel,
  Typography,
  Input,
} from "@mui/material";
// Files
import Alert from "./Alert";
import {
  boxStyle,
  adFormArea,
  formComponent,
  formTextField,
  formSubmitButtonContainer,
} from "./css/adStyles";
import LoadingDisplay from "./LoadingDisplay";
// Actions
import { postAd } from "../actions/ad";
import { setAlert, clearAlerts } from "../actions/alert";

const AdForm = (props) => {
  const [form, setForm] = useState({
    productName: "",
    description: "",
    basePrice: 0,
    duration: 300,
    category: "",
    image: "",
  });
  const [imageURL, setImageURL] = useState("");
  const [file, setFile] = useState("");

  const [uploading, setUploading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    return () => {
      props.clearAlerts();
    };
  }, []);

  const handleFormChange = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for empty fields
    if (form.productName === "") {
      return props.setAlert("Product name required!");
    }
    if (form.basePrice.toString() === "0") {
      return props.setAlert("Base price required!");
    }
    if (form.category === "") {
      return props.setAlert("Category required!");
    }
    if (!file) {
      return props.setAlert("Image requred!");
    }
    if (form.duration.toString() === "0") {
      setForm({ ...form, duration: 300 });
    }

    if (!file) {
      alert("Please upload an image first!");
    }

    const storageRef = ref(storage, `ImageStore/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        props.setAlert("Image upload failed, try again!");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          props.postAd({ ...form, image: downloadURL });
        });
      }
    );
    // await props.postAd({ ...form, image: imageURL });
    navigate("/");
    // console.log(imageURL);
  };

  // Check if user is logged
  if (!props.isAuth) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Fragment>
      <Box sx={boxStyle}>
        <Paper sx={adFormArea}>
          {/* Page title */}
          <Typography variant="h4">Post Ad</Typography>
          <Alert />

          {/* Form */}
          <Box sx={formComponent}>
            <InputLabel>Art Piece Title*</InputLabel>
            <TextField
              name="productName"
              onChange={(e) => {
                handleFormChange(e);
              }}
              size="small"
              sx={formTextField}
            ></TextField>
          </Box>

          <Box sx={formComponent}>
            <InputLabel>Description*</InputLabel>
            <TextField
              name="description"
              multiline
              placeholder="Description"
              onChange={(e) => handleFormChange(e)}
              size="small"
              rows={3}
              sx={formTextField}
            />
          </Box>

          <Box sx={formComponent}>
            <InputLabel>Base Price*</InputLabel>
            <TextField
              name="basePrice"
              onChange={(e) => {
                handleFormChange(e);
              }}
              size="small"
              placeholder="Auction will start from this price point."
              sx={formTextField}
            ></TextField>
          </Box>

          <Box sx={formComponent}>
            <InputLabel>Duration*</InputLabel>
            <TextField
              name="duration"
              onChange={(e) => {
                handleFormChange(e);
              }}
              size="small"
              placeholder="Duration in seconds (Max 1 hour)"
              sx={formTextField}
            ></TextField>
          </Box>

          <Box sx={formComponent}>
            <InputLabel>Category*</InputLabel>
            <TextField
              name="category"
              onChange={(e) => {
                handleFormChange(e);
              }}
              size="small"
              placeholder="Modern Art, Contemporary, Post-War ..."
              sx={formTextField}
            ></TextField>
          </Box>

          {uploading ? (
            <LoadingDisplay />
          ) : (
            <Box sx={formComponent}>
              <InputLabel>Upload imageURL*</InputLabel>
              {/* <FileBase64
                type="file"
                multiple={false}
                onDone={({ base64 }) => {
                  setImageURL(base64);
                }}
              /> */}
              <input type="file" accept="image/*" onChange={handleChange} />
              {imageURL === "" && (
                <Typography variant="caption">
                  jpg, png or gif maximum 3 MB
                </Typography>
              )}
              {/* <label htmlFor='imageFile'>{fileName}</label> */}
            </Box>
          )}

          <Box sx={formSubmitButtonContainer}>
            {!uploading && (
              <Button variant="contained" onClick={(e) => handleSubmit(e)}>
                Submit
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  isAuth: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { postAd, setAlert, clearAlerts })(
  AdForm
);
