import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Assingnements, {kanjiAssignmentsLoader} from "~/pages/Assignements";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Assingnements />,
        loader: kanjiAssignmentsLoader,
      }
    ],
  },
]);
