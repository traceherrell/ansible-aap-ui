import { useContext } from "react";

import {
  Stepper,
  Step,
  StepLabel,
  Container,
  Typography,
  Link,
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

import PageHeader from "../../components/PageHeader";
import { JobContext } from "../../context/JobContext";
import GlobalInfo from "./actvities/GlobalInfo";

const ServiceRequestPipeLine = () => {
  const { jobList } = useContext(JobContext);
  const { step } = useParams();
  const STEP = step ? parseInt(step) : 1;

  const getSteps = () => {
    let steps = [];
    let step = 1;
    jobList.forEach((activity) => {
      steps.push({
        step: step++,
        label: activity.activity,
        key: activity.id,
        activity: activity,
      });
    });
    steps.push({
      step: step++,
      label: "Gobal Information",
      key: "global-information",
      activity: null,
    });

    return steps;
  };

  const steps = getSteps();

  let i = 1;
  return (
    <Container maxWidth={false}>
      <PageHeader
        title="Complete Your Service Request"
        subTitle="Please complete and ensure the accuracy of data requirements for your Service Request. "
        linkText=""
        link=""
      >
        {" "}
        <Typography sx={{ paddingTop: "10px" }} color="secondary">
          {" "}
          <Link
            color="secondary.main"
            sx={{ textDecoration: "none" }}
            component={RouterLink}
            to={"/service-request"}
          >
            <ArrowLeftIcon
              sx={{
                paddingTop: "5px",
                marginBottom: "-5px",
                marginLeft: "-5px",
              }}
            />{" "}
            Change the order of service activities
          </Link>
        </Typography>
      </PageHeader>
      <Stepper
        sx={{ marginTop: "20px", marginBottom: "50px" }}
        activeStep={STEP - 1}
      >
        {steps.map((item) => (
          <Step key={item.key}>
            <StepLabel>{item.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {jobList.map((job) => {
        return (
          <div hidden={STEP !== i++} key={i}>
            <job.component activityId={job.id} />
          </div>
        );
      })}
      <div hidden={STEP !== i}>
        <GlobalInfo />
      </div>
    </Container>
  );
};

export default ServiceRequestPipeLine;
