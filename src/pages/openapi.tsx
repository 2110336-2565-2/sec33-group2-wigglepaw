import { type NextPage } from "next";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const OpenAPI: NextPage = () => {
  return <SwaggerUI url="/api/openapi" />;
};

export default OpenAPI;
