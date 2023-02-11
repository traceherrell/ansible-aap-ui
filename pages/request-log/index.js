import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import RequestLog from "./RequestLog";

const ServiceRequestLog = () => {
  const { get } = useFetchWithAuth();

  const getData = async (page, rowsPerPage, onlyMine) => {
    let url = `/servicerequest?page=${page}&size=${rowsPerPage}&getAllRequests=${!onlyMine}`;
    const response = await get(url);
    if (response && response.ok) {
      return await response.json();
    }
    console.error(response);
    return [];
  };

  return <RequestLog fetchData={getData} />;
};

export default ServiceRequestLog;
