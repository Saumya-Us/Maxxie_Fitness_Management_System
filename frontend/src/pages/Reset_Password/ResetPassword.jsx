import {
  Box,
  Button,
  Grid,
  Link,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
//   import { setIsAuth } from "../../reducers/isAuthSlise";
import { useDispatch } from "react-redux";
import BG from "../../Assests/BG.jpg";
//import Logopng from "../../Assests/logo-no-background.png";
import Logopng from "../../Assests/maxxieslogos.png";
import FlexContainer from "../../components/FlexContainer/FlexContainer";
// import { Input as BaseInput } from '@mui/base/Input';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const MainDiv = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  minWidth: "100vw",
  margin: 0,
  padding: 0,
  backgroundImage: `url(${BG})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const LoginDiv = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "300px",
  },
  [theme.breakpoints.up("sm")]: {
    width: "300px",
  },
  [theme.breakpoints.up("md")]: {
    width: "350px",
  },
  [theme.breakpoints.up("lg")]: {
    width: "350px",
  },
  borderRadius: "20px",
  backgroundColor: "white",
  padding: "20px",
}));

function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [error, setError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmpasswordError, setConfirmpasswordError] = useState("");
  const { id, token } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh

    // Basic validation
    if (!newPassword) {
      setNewPasswordError("Please enter a new password");
      return;
    }

    if (!confirmpassword) {
      setConfirmpasswordError("Please confirm your password");
      return;
    }

    if (newPassword !== confirmpassword) {
      setConfirmpasswordError("Passwords do not match");
      return;
    }

    // If all good, proceed to reset
    axios
      .post(`http://localhost:5000/user/reset-password/${id}/${token}`, {
        newPassword,
      })
      .then((response) => {
        if (response.data.status === "Success") {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        setError("Something went wrong. Please try again.");
      });
  };

  return (
    <MainDiv>
      <LoginDiv>
        <Typography
          textAlign={"center"}
          color={"black"}
          fontSize={"22px"}
          fontWeight={600}
        >
          Reset Password
        </Typography>
        <FlexContainer
          sx={{
            justifyContent: "center",
            mt: 2,
          }}
        >
          <img src={Logopng} alt="logo" width={"180px"} />
        </FlexContainer>
        <form onSubmit={handleSubmit}>
          <Box mt={3}>
            <TextField
              label="New Paasword"
              fullWidth
              variant="outlined"
              size="small"
              type="password"

              error={!!newPasswordError}
              helperText={newPasswordError}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setNewPasswordError("");
              }}
            />
          </Box>
          <Box mt={2}>
            <TextField
              label="Confirm Password"
              fullWidth
              variant="outlined"
              type="password"
              // error={!!errors.password}
              // {...register("password", { required: true })}
              size="small"
              error={!!confirmpasswordError} // Show error style if error exists
              helperText={confirmpasswordError} // Show error message
              onChange={(event) => {
                setConfirmpassword(event.target.value);
                setConfirmpasswordError(""); 
              }}
              
            />
          </Box>
          <Button
            fullWidth
            sx={{ mt: 2, backgroundColor: "#2168BA", color: "white" }}
            variant="contained"
            type="submit"
          >
            Reset Password
          </Button>
        </form>
      </LoginDiv>
    </MainDiv>
  );
}
export default ResetPassword;
