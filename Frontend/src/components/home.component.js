import { createTheme, ThemeProvider } from "@mui/material/styles";
import PublicPage from "./PublicPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue
    },
    secondary: {
      main: "#d32f2f", // Red
    },
    background: {
      default: "#f5f5f5", // Light gray
    },
  },
  typography: {
    h2: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
});

export const Home = () => (
  <ThemeProvider theme={theme}>
    <PublicPage />
  </ThemeProvider>
);
export default Home;