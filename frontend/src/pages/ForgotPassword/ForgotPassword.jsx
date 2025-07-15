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
  import { useNavigate } from "react-router-dom";
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
  
  
  
  function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
  
    
  
    const handleSubmit = (e) => {
      e.preventDefault(); // Prevent page refresh
  
      const data = { email };
  
      axios.post("http://localhost:5000/user/forgot-password", {email})
          .then(response => {
            
              
              if (response.data.status === "Success") {
                
                navigate("/")
              }
          })
          .catch(error => console.log(error));
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
            Forgot Password
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
                label="Username (email)"
                fullWidth
                variant="outlined"
                size="small"
                error={!!emailError}
                helperText={emailError}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError("")
                }}
              />
            </Box>
            
            <Button
              fullWidth
              sx={{ mt: 2 , backgroundColor: '#2168BA', color: 'white'}}
              variant="contained"
              type="submit"
            >
              Send Link
            </Button>
          </form>
         
        </LoginDiv>
      </MainDiv>
    );
  }
  
  export default ForgotPassword;
  