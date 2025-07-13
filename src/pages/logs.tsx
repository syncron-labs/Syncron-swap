import { GetServerSideProps, NextPage } from "next";

const LogsPage: NextPage<{ logData: any }> = ({ logData }) => {
  // console.log("logs: ", logData);

  return (
    <>
      <div
        style={{
          padding: 16,
        }}
      >
        {logData?.noFile ? (
          <>
            <div>{logData?.noFile}</div>
          </>
        ) : null}

        {!logData?.fileInfo ? null : <>{logData?.fileInfo}</>}
      </div>
    </>
  );
};

export default LogsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const envStatus = process.env.NEXT_PUBLIC_LOG_URL_PUBLIC_ACCESS;

  if (envStatus != "true") {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }

  const fs = require("fs");
  const logData: any = {};
  const fileQuery = ctx.query?.file;
  const file = `${process.cwd()}/storage/logs/${fileQuery}`;

  if (!fileQuery) {
    logData.noFile = "No file requested!";

    return {
      props: {
        logData: logData,
      },
    };
  }

  if (!fs.existsSync(file)) {
    logData.noFile = "File does not exist!";
  } else {
    logData.noFile = null;

    logData.fileInfo = fs.readFileSync(file, "utf8");
  }

  // console.log("file: ", fileQuery, logData, file);

  return {
    props: {
      logData: logData,
    },
  };
};
