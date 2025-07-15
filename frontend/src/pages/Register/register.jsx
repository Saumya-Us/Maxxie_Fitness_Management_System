import {
  Box,
  Button,
  Grid,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Axios from "axios";
import React, { useCallback, useState } from "react";
import BG from "../../Assests/BG.jpg";
import Logopng from "../../Assests/maxxieslogos.png";
import FlexContainer from "../../components/FlexContainer/FlexContainer";
import { useNavigate } from "react-router-dom";

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

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [confirmPassworderror, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emaiFormatlError, setEmaiFormatlError] = useState("");
  const [passworderror, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [role, setRole] = useState("member");
  const [adminCode, setAdminCode] = useState("");
  const [adminCodeError, setAdminCodeError] = useState("");
  const ADMIN_SECRET = "ADMIN2024"; // You may want to move this to env or backend
  const [backendError, setBackendError] = useState("");

  const navigate = useNavigate();
  //   const validateInputs = () => {

  //     setErrors(tempErrors);
  //     return Object.keys(tempErrors).length === 0;
  //   };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload
    setBackendError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-z]{2,50}$/;
    const passwordRegex =
      /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/;

    const phoneRegex = /^0\d{9}$/;

    if (!firstName.match(nameRegex)) {
      setFirstNameError("Invalid first name.");
      return;
    }
    setFirstNameError("");
    if (!lastName.match(nameRegex)) {
      setLastNameError("Invalid last name.");
      return;
    }
    setLastNameError("");
    if (!email.match(emailRegex)) {
      setEmaiFormatlError("Invalid email format.");
      return;
    }
    setEmaiFormatlError("");
    console.log("Password:", password);
    console.log("Regex Test:", passwordRegex.test(password));

    if (!password.match(passwordRegex)) {
      setPasswordError(
        "Password must be between 8 and 32 characters, with uppercase, lowercase, number, and special character."
      );
      return;
    }
    setPasswordError("");
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match!");
      return;
    }

    // Reset error if passwords match
    setConfirmPasswordError("");
    if (!phone.match(phoneRegex)) {
      setPhoneError("Phone number must start with '0' and be 10 digits.");
      return;
    }
    setPhoneError("");
    if (isNaN(height) || height < 50 || height > 250) {
      setHeightError("Height must be between 50 and 250 cm.");
      return;
    }
    setHeightError("");
    if (isNaN(weight) || weight < 20 || weight > 300) {
      setWeightError("Weight must be between 20 and 300 kg.");
      return;
    }
    setWeightError("");

    if (role === "admin") {
      if (adminCode !== ADMIN_SECRET) {
        setAdminCodeError("Invalid admin secret code.");
        return;
      }
      setAdminCodeError("");
    }

    try {
      // Check if the email already exists
      const emailExists = await Axios.get(
        `http://localhost:5000/user/email-check/${email}`
      );
      if (emailExists.data.exists) {
        setEmailError("Email already exists! Please use a different one.");
        return;
      }

      // Reset email error if email is valid
      setEmailError("");

      // Proceed with the registration if email is not already taken
      await Axios.post("http://localhost:5000/user", {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        phone: phone,
        height: height,
        weight: weight,
        role: role,
        adminCode: role === "admin" ? adminCode : ""
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          setBackendError(err.response.data.error);
        } else {
          setBackendError("Registration failed. Please try again.");
        }
      });
    } catch (err) {
      setBackendError("Registration failed. Please try again.");
      console.error("Error registering user:", err);
    }
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
          Register
        </Typography>
        <FlexContainer
          sx={{
            justifyContent: "center",
            mt: 2,
            mb: 2,
          }}
        >
          <img src={Logopng} alt="logo" width={"120px"} />
        </FlexContainer>
        <form onSubmit={handleRegister}>
          {backendError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {backendError}
            </Typography>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                fullWidth
                variant="outlined"
                size="small"
                error={!!firstNameError}
                helperText={firstNameError}
                onChange={(event) => {
                  setFirstName(event.target.value);
                  setFirstNameError("");
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                fullWidth
                variant="outlined"
                size="small"
                error={!!lastNameError}
                helperText={lastNameError}
                onChange={(event) => {
                  setLastName(event.target.value);
                  setLastNameError("");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Username (Email)"
                fullWidth
                variant="outlined"
                size="small"
                error={!!emaiFormatlError || !!emailError} // Show error style if error exists
                helperText={emaiFormatlError || emailError} // Show error message
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmaiFormatlError("");
                  setEmailError("");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                fullWidth
                type="password"
                variant="outlined"
                size="small"
                error={!!passworderror}
                helperText={passworderror}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError("");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                fullWidth
                type="password"
                variant="outlined"
                size="small"
                error={!!confirmPassworderror} // Show error style if error exists
                helperText={confirmPassworderror} // Show error message
                onChange={(event) => {
                  setconfirmPassword(event.target.value);
                
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                fullWidth
                variant="outlined"
                size="small"
                error={!!phoneError}
                helperText={phoneError}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setPhoneError("");
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Height"
                fullWidth
                variant="outlined"
                size="small"
                error={!!heightError}
                helperText={heightError}
                onChange={(event) => {
                  setHeight(event.target.value);
                  setHeightError("");
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Weight"
                fullWidth
                variant="outlined"
                size="small"
                error={!!weightError}
                helperText={weightError}
                onChange={(event) => {
                  setWeight(event.target.value);
                  setWeightError("");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Role"
                value={role}
                onChange={e => setRole(e.target.value)}
                SelectProps={{ native: true }}
                fullWidth
                variant="outlined"
                size="small"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </TextField>
            </Grid>
            {role === "admin" && (
              <Grid item xs={12}>
                <TextField
                  label="Admin Secret Code"
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={!!adminCodeError}
                  helperText={adminCodeError}
                  onChange={e => setAdminCode(e.target.value)}
                />
              </Grid>
            )}
          </Grid>
          <Button
            fullWidth
            sx={{ mt: 2, backgroundColor: "#2168BA", color: "white" }}
            variant="contained"
            type="submit"
          >
            Register
          </Button>
        </form>
        <FlexContainer
          sx={{
            my: 2,
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Button fullWidth variant="outlined"
          sx={{  backgroundColor: "white", color: "#2168BA" }}
           onClick={() => navigate("/")}>
            I Already Have an Account
          </Button>
        </FlexContainer>
      </LoginDiv>
    </MainDiv>
  );
}

export default Register;
