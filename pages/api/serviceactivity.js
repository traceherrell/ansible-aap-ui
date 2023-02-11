import { getActivityStatus } from "./activities";

export default function handler(req, res) {
  res.status(200).json(getActivityStatus());
}
