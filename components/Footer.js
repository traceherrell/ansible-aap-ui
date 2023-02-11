import { Link, Box, Container, Stack } from "@mui/material";

const footerExtLinks = [
  {
    title: "Yeti Automation",
    path: "",
  },
  {
    title: "Report a Problem",
    path: "",
  },
  {
    title: "Feature Request",
    path: "",
  },
  {
    title: "Contact Us",
    path: "",
  },
];

const footerIntLinks = [{ title: "Terms of Use", path: "terms-of-use" }];

const Footer = () => {
  return (
    <footer>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50px",
          backgroundColor: "primary.main",
          color: "#fff",
          paddingTop: "10px",
        }}
        elevation={3}
      >
        <Container maxWidth="false">
          <Link
            sx={{ textDecoration: "none", marginLeft: "20px" }}
            href=""
            color="inherit"
          >
            {" "}
            &copy; {new Date().getFullYear()}{" "}
          </Link>

          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2, md: 4 }}
            display="inline"
            sx={{ float: "right" }}
          >
            {footerExtLinks.map((link, index) => (
              <Link
                key={`footer-extlink-${index}`}
                data-testid={`footer-extlink-${index}`}
                href={link.path}
                color="inherit"
                underline="none"
                target="_blank"
                rel="noreferrer"
              >
                {link.title}
              </Link>
            ))}
            {footerIntLinks.map((link, index) => (
              <Link
                key={`footer-intlink-${index}`}
                data-testid={`footer-intlink-${index}`}
                color="inherit"
                underline="none"
                component={RouterLink}
                to={link.path}
              >
                {link.title}
              </Link>
            ))}
          </Stack>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
