import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  Drawer,
  TextareaAutosize,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import BG from "../Assests/BG2.jpg";
import Logopng from "../Assests/maxxieslogos.png";

// Sidebar button config
const sidebarButtons = [
  { text: "Home", icon: <Icon icon="codicon:home" fontSize={28} />, route: "/home", color: "primary" },
  { text: "Session", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/session-home", color: "primary" },
  { text: "Store", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/user-store", color: "primary" },
  { text: "Workout Plans", icon: <Icon icon="mdi:cart" fontSize={28} />, route: "/workout-plans-user", color: "primary" },
  { text: "Diet Plan", icon: <Icon icon="uis:schedule" fontSize={28} />, route: "/diet-plan-user", color: "warning" },
  { text: "Membership Plan", icon: <Icon icon="codicon:edit-session" fontSize={28} />, route: "/membership-plans-user", color: "primary" },
];

// Star rating component (MUI styled)
const StarRating = ({ value, onChange, disabled }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Tooltip title={`${star} Star${star > 1 ? "s" : ""}`} key={star}>
        <IconButton
          size="small"
          onClick={() => !disabled && onChange(star)}
          disabled={disabled}
          sx={{
            color: star <= value ? "#FFD600" : "#E0E0E0",
            fontSize: 22,
            transition: "color 0.2s",
            "&:hover": { color: "#FFC107" },
          }}
          aria-label={`${star} star`}
        >
          ★
        </IconButton>
      </Tooltip>
    ))}
  </Box>
);

// Modal for viewing all feedbacks
function FeedbackModal({ open, onClose, feedbacks, planName }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: {
            backgroundColor: "rgba(20,20,30,0.85)",
            backdropFilter: "blur(2px)",
          },
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90vw", sm: 500 },
            maxHeight: "80vh",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 3,
            outline: "none",
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Feedbacks for {planName}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          {feedbacks.length === 0 ? (
            <Typography color="text.secondary">No feedback yet.</Typography>
          ) : (
            feedbacks.map((fb) => (
              <Box key={fb._id} sx={{ mb: 2, borderBottom: "1px solid #eee", pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <StarRating value={fb.rating} onChange={() => {}} disabled={true} />
                  <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                    by {fb.user} on {new Date(fb.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {fb.comment}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

function DietPlanUser() {
  const [dietPlans, setDietPlans] = useState([]);
  const [feedbackInput, setFeedbackInput] = useState({});
  const [loading, setLoading] = useState({ plans: true, feedback: {} });
  const [success, setSuccess] = useState({});
  const [error, setError] = useState(null);

  // For modal and feedback stats
  const [feedbackStats, setFeedbackStats] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFeedbacks, setModalFeedbacks] = useState([]);
  const [modalPlanName, setModalPlanName] = useState("");
  const [showAddFeedback, setShowAddFeedback] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sidebar content
  const SidebarContent = (
    <Box
      component="aside"
      sx={{
        width: { xs: 250, sm: 320 },
        minHeight: "100vh",
        backgroundImage: `url(${BG})`,
        backgroundColor: "rgba(34, 69, 98, 0.92)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
        boxShadow: 4,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <img src={Logopng} alt="Logo" style={{ width: 120, borderRadius: 12, marginTop: 80 }} />
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          letterSpacing: 2,
          mb: 4,
          color: "#fff",
          textShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        Maxxies
      </Typography>
      <Box sx={{ width: "90%" }}>
        {sidebarButtons.map((btn) => (
          <Button
            key={btn.text}
            variant="contained"
            color={btn.color}
            fullWidth
            startIcon={btn.icon}
            sx={{
              mb: 2,
              minHeight: 56,
              borderRadius: 3,
              fontWeight: "bold",
              fontSize: 17,
              justifyContent: "flex-start",
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.18)",
                color: "#fff",
                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.12)",
              },
            }}
            onClick={() => {
              navigate(btn.route);
              if (isMobile) setDrawerOpen(false);
            }}
          >
            {btn.text}
          </Button>
        ))}
      </Box>
    </Box>
  );

  // Fetch diet plans and feedback stats
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/diet-plans");
        setDietPlans(res.data);

        // For each plan, fetch feedbacks for stats
        const stats = {};
        await Promise.all(
          res.data.map(async (plan) => {
            const fbRes = await axios.get(
              `http://localhost:5000/api/diet-feedback/plan/${plan._id}`
            );
            const feedbacks = fbRes.data || [];
            const ratingSum = feedbacks.reduce((acc, fb) => acc + (fb.rating || 0), 0);
            stats[plan._id] = {
              count: feedbacks.length,
              ratingSum,
              feedbacks,
              commentCount: feedbacks.filter((fb) => fb.comment && fb.comment.trim()).length,
            };
          })
        );
        setFeedbackStats(stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load diet plans");
      } finally {
        setLoading((prev) => ({ ...prev, plans: false }));
      }
    };
    fetchPlans();
  }, []);

  const handleFeedbackChange = (planId, field, value) => {
    setFeedbackInput((prev) => ({
      ...prev,
      [planId]: { ...prev[planId], [field]: value },
    }));
  };

  const submitFeedback = async (planId) => {
    const { rating, comment } = feedbackInput[planId] || {};
    if (!rating || !comment || comment.length < 5) {
      alert("Please provide a rating and comment (at least 5 characters)");
      return;
    }
    setLoading((prev) => ({
      ...prev,
      feedback: { ...prev.feedback, [planId]: true },
    }));

    try {
      await axios.post("http://localhost:5000/api/diet-feedback", {
        dietPlanId: planId,
        user: "Current User", // Replace with actual user from auth
        rating,
        comment,
      });

      setSuccess((prev) => ({ ...prev, [planId]: true }));
      setFeedbackInput((prev) => ({
        ...prev,
        [planId]: { rating: 0, comment: "" },
      }));

      // Refresh feedback stats for this plan
      const fbRes = await axios.get(
        `http://localhost:5000/api/diet-feedback/plan/${planId}`
      );
      setFeedbackStats((prev) => ({
        ...prev,
        [planId]: {
          count: fbRes.data.length,
          ratingSum: fbRes.data.reduce((acc, fb) => acc + (fb.rating || 0), 0),
          feedbacks: fbRes.data,
          commentCount: fbRes.data.filter((fb) => fb.comment && fb.comment.trim()).length,
        },
      }));

      setTimeout(() => setSuccess((prev) => ({ ...prev, [planId]: false })), 3000);
      setShowAddFeedback((prev) => ({ ...prev, [planId]: false }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading((prev) => ({
        ...prev,
        feedback: { ...prev.feedback, [planId]: false },
      }));
    }
  };

  // Feedback stats helpers
  const getAverageRating = (planId) => {
    const stat = feedbackStats[planId];
    if (!stat || !stat.count) return "-";
    return (stat.ratingSum / stat.count).toFixed(1);
  };
  const getCommentCount = (planId) => {
    const stat = feedbackStats[planId];
    return stat ? stat.commentCount : 0;
  };
  const getFeedbackCount = (planId) => {
    const stat = feedbackStats[planId];
    return stat ? stat.count : 0;
  };

  // Modal open handler
  const handleOpenModal = (planId, planName) => {
    setModalFeedbacks(feedbackStats[planId]?.feedbacks || []);
    setModalPlanName(planName);
    setModalOpen(true);
  };

  // Layout
  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        m: 0,
        p: 0,
        display: "flex",
        flexDirection: "row",
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      {/* Sidebar: Drawer for mobile, fixed for desktop */}
      {isMobile ? (
        <>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: "absolute",
              top: 18,
              left: 18,
              zIndex: 1301,
              bgcolor: "rgba(34,69,98,0.92)",
              color: "#fff",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "rgba(34,69,98,1)",
              },
            }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                backgroundImage: `url(${BG})`,
                backgroundColor: "rgba(1, 21, 37, 0.92)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#ffff",
              },
            }}
          >
            {SidebarContent}
          </Drawer>
        </>
      ) : (
        SidebarContent
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          px: { xs: 1, sm: 6 },
          py: 6,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            bgcolor: "rgba(255,255,255,0.7)",
            borderRadius: 5,
            boxShadow: 10,
            p: { xs: 2, sm: 4 },
            overflowX: "auto",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Diet Plans
          </Typography>
          {loading.plans ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 4,
                boxShadow: 5,
                background: "rgba(245,248,255,0.80)",
                mb: 2,
              }}
            >
              <Table
                sx={{
                  minWidth: 100,
                  "& th": {
                    background: "linear-gradient(90deg, #224562 0%, #2e5c7a 100%)",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 17,
                    borderBottom: "2px solid #e3e8ee",
                  },
                  "& td": {
                    fontSize: 16,
                    borderBottom: "1px solid #e3e8ee",
                  },
                  "& tr:hover td": {
                    background: "rgba(34,69,98,0.06)",
                  },
                }}
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Diet Type</TableCell>
                    <TableCell>Food Allergies</TableCell>
                    <TableCell>Medical Conditions</TableCell>
                    <TableCell>Caloric Goal</TableCell>
                    <TableCell sx={{ minWidth: 280 }}>Feedback</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dietPlans.map((plan) => (
                    <TableRow key={plan._id} hover>
                      <TableCell>{plan.dietType}</TableCell>
                      <TableCell>{plan.foodAllergies}</TableCell>
                      <TableCell>{plan.medicalConditions}</TableCell>
                      <TableCell>{plan.caloricIntakeGoal}</TableCell>
                      <TableCell sx={{ minWidth: 280 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Tooltip title="View all feedbacks">
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => handleOpenModal(plan._id, plan.dietType)}
                            >
                              View All Feedbacks
                            </Button>
                          </Tooltip>
                          <Tooltip title="Add feedback">
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                setShowAddFeedback((prev) => ({
                                  ...prev,
                                  [plan._id]: !prev[plan._id],
                                }))
                              }
                            >
                              Add Feedback
                            </Button>
                          </Tooltip>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <b>{getFeedbackCount(plan._id)}</b> Feedbacks
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <b>{getAverageRating(plan._id)}</b> Avg. Rating
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <b>{getCommentCount(plan._id)}</b> Comments
                          </Typography>
                        </Box>
                        {showAddFeedback[plan._id] && (
                          <Box sx={{ mt: 1, mb: 1, p: 1.5, bgcolor: "rgba(245,248,255,0.90)", borderRadius: 2 }}>
                            <Typography variant="subtitle2" mb={0.5}>
                              Add Feedback
                            </Typography>
                            <StarRating
                              value={feedbackInput[plan._id]?.rating || 0}
                              onChange={(val) => handleFeedbackChange(plan._id, "rating", val)}
                              disabled={loading.feedback[plan._id]}
                            />
                            <TextareaAutosize
                              minRows={3}
                              placeholder="Your feedback (min 5 characters)"
                              style={{
                                width: "100%",
                                border: "1px solid #ccc",
                                borderRadius: 5,
                                marginTop: 8,
                                padding: 8,
                                fontSize: 15,
                                background: "#f8fafc",
                                resize: "vertical",
                              }}
                              value={feedbackInput[plan._id]?.comment || ""}
                              onChange={(e) => handleFeedbackChange(plan._id, "comment", e.target.value)}
                              disabled={loading.feedback[plan._id]}
                            />
                            <Button
                              sx={{
                                mt: 1,
                                fontWeight: "bold",
                                borderRadius: 2,
                                boxShadow: "0 2px 8px 0 rgba(34,69,98,0.09)",
                              }}
                              variant="contained"
                              color="primary"
                              onClick={() => submitFeedback(plan._id)}
                              disabled={loading.feedback[plan._id]}
                            >
                              {loading.feedback[plan._id] ? "Submitting..." : "Submit"}
                            </Button>
                            {success[plan._id] && (
                              <Typography color="success.main" fontSize={13} mt={1}>
                                Feedback submitted!
                              </Typography>
                            )}
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
      <FeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        feedbacks={modalFeedbacks}
        planName={modalPlanName}
      />
    </Box>
  );
}

export default DietPlanUser;
