import { Typography, Link, Divider } from "@mui/material";

const PageHeader = ({ title, subTitle, linkText, link, divider, children }) => {
  return (
    <div style={{ paddingTop: "10px" }}>
      <Typography variant="h5" noWrap component="span">
        {title}
      </Typography>
      {subTitle && (
        <Typography variant="h7" noWrap component="div">
          {subTitle}
        </Typography>
      )}

      {linkText && (
        <Typography
          style={{ float: "right", textTransform: "uppercase" }}
          variant="h7"
          noWrap
          component="span"
        >
          <Link color="secondary.main" component={RouterLink} to={`${link}`}>
            {`${linkText}`}
          </Link>
        </Typography>
      )}
      {children}
      {divider && (
        <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
      )}
    </div>
  );
};

export default PageHeader;
