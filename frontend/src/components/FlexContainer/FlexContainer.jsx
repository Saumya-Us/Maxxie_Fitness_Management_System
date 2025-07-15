import { Box } from "@mui/material";
import propTypes from "prop-types";

/**
 * Readymade FlexContainer component.
 * Use sx prop to add or override styles.
 * By default it has display: flex, alignItems: center, justifyContent: center
 *
 */
const FlexContainer = ({ sx, children, onClick= ()=> {} }) => {
  return (
    <Box
    onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default FlexContainer;

FlexContainer.propTypes = {
  sx: propTypes.object,
  children: propTypes.node,
};