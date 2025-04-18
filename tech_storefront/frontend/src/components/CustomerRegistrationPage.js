import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100%',
  padding: 0,       
  [theme.breakpoints.up('sm')]: {
    padding: 0,
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [serverError, setServerError] = React.useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const firstName = document.getElementById('Fname');
    const lastName = document.getElementById('Lname');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!firstName.value || firstName.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('First name is required.');
      isValid = false;
    } else if (!lastName.value || lastName.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Last name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    // Sign out any existing user
    const csrftoken = getCookie("csrftoken");
    await fetch("/api/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      credentials: "include",
    });

    const form = event.target;
    const data = {
      email: form.email.value,
      first_name: form.Fname.value,
      last_name: form.Lname.value,
      country: form.country.value,
      city: form.city.value,
      state: form.state.value,
      zip_code: form.zip_code.value,
      street_address: form.street_address.value,
      password: form.password.value,
    };

    try {
      const response = await fetch('/api/customer-registration/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.email && errorData.email.length > 0) {
          setEmailError(true);
          setEmailErrorMessage(errorData.email[0]);
        } else {
          setServerError("Registration failed. Please check your input.");
        }
        return;
      }

      // Log in the new user
      const loginRes = await fetch("/api/sign-in/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        credentials: "include",
      });

      if (!loginRes.ok) {
        setServerError("Registration succeeded but automatic sign-in failed. Please sign in manually.");
        return;
      }

      // Now fetch the current user and set context
      const userRes = await fetch("/api/current-user/", { credentials: "include" });
      const userData = await userRes.json();
      setUser(userData);

      navigate("/products"); // Redirect to products page

    } catch (error) {
      setServerError("Network error. Please try again.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
            minHeight: "100vh",
            width: "100vw",
            backgroundImage: 'url("/static/hero.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
      >
        {/* Header */}
        <Box
          sx={{
            width: "100%",
            background: "rgba(255,255,255,0.95)",
            borderBottom: "1.5px solid #e0e0e0",
            borderRadius: "0px 0px 15px 15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, md: 4 },
            py: 1,
            minHeight: 56,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1400,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 2, md: 8 },
            }}
          >
            <RouterLink to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <Box
                component="img"
                src="/static/favicon2.ico"
                alt="FGG Tech"
                sx={{
                  width: 36,
                  height: 36,
                  mr: 3,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0, color: "black" }}>
                FGG Tech
              </Typography>
            </RouterLink>
            <Stack direction="row" spacing={2}>
              <Button
                component={RouterLink}
                to="/sign-in"
                variant="outlined"
                color="primary"
                sx={{
                    fontWeight: 600,
                    borderRadius: "999px",
                    boxShadow: "none",
                    // Custom hover effect:
                    "&:hover": {
                      backgroundColor: "1875D2",
                      boxShadow: "none",
                    },
                  }}
              >
                Sign In
              </Button>
              <Button
                component={RouterLink}
                to="/customer-registration"
                variant="contained"
                color="primary"
                sx={{
                    fontWeight: 600,
                    borderRadius: "999px",
                    boxShadow: "none",
                    // Custom hover effect:
                    "&:hover": {
                      backgroundColor: "1875D2",
                      boxShadow: "none",
                    },
                  }}
              >
                Create Account
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Registration Card */}
        <SignUpContainer direction="column" justifyContent="space-between" sx={{ flex: 1 }}>
          <Card
            variant="outlined"
            sx={{
              width: { xs: "100%", sm: 450 },
              p: 4,
              m: "auto",
              maxHeight: "80vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              borderRadius: 8,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              {/* Name Row */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="Fname">First name</FormLabel>
                  <TextField
                    autoComplete="Fname"
                    name="Fname"
                    required
                    id="Fname"
                    placeholder="Paul"
                    error={nameError}
                    helperText={nameErrorMessage}
                    color={nameError ? 'error' : 'primary'}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="Lname">Last name</FormLabel>
                  <TextField
                    autoComplete="Lname"
                    name="Lname"
                    required
                    id="Lname"
                    placeholder="Atreides"
                    error={nameError}
                    helperText={nameErrorMessage}
                    color={nameError ? 'error' : 'primary'}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                  />
                </FormControl>
              </Box>

              {/* Email */}
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="your@email.com"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  error={emailError}
                  helperText={emailErrorMessage}
                  color={emailError ? 'error' : 'primary'}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </FormControl>

              {/* Password */}
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  color={passwordError ? 'error' : 'primary'}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </FormControl>

              {/* Address Row 1: Country & City */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <TextField
                    required
                    id="country"
                    name="country"
                    placeholder="Canada"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="city">City</FormLabel>
                  <TextField
                    required
                    id="city"
                    name="city"
                    placeholder="Calgary"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                  />
                </FormControl>
              </Box>

              {/* Address Row 2: State & Zip Code */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="state">State/Province</FormLabel>
                  <TextField
                    id="state"
                    name="state"
                    placeholder="Alberta"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="zip_code">Zip Code</FormLabel>
                  <TextField
                    required
                    id="zip_code"
                    name="zip_code"
                    placeholder="T2N 1N4"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                  />
                </FormControl>
              </Box>

              {/* Street Address */}
              <FormControl>
                <FormLabel htmlFor="street_address">Street Address</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="street_address"
                  name="street_address"
                  placeholder="123 Main St"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </FormControl>

              {serverError && (
                <Typography color="error" sx={{ textAlign: "center" }}>
                  {serverError}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
                sx={{
                    fontWeight: 600,
                    borderRadius: "999px",
                    boxShadow: "none",
                    // Custom hover effect:
                    "&:hover": {
                      backgroundColor: "1875D2",
                      boxShadow: "none",
                    },
                  }}
              >
                Sign up
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link
                  href="/sign-in/"
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Card>
        </SignUpContainer>
      </Box>
    </>
  );
}
