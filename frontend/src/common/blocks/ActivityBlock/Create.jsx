import { Card, LinearProgress } from "@mui/material";
import { useGetOne } from "react-admin";
import Note from "./Note";
import isObject from "isobject";

const Create = ({ activity, showReplies, clickOnContent }) => {
  let {
    data: createdObject,
    isLoading,
    error,
  } = useGetOne(
    "Activity",
    {
      id: activity.object,
    },
    {
      enabled: !isObject(activity.object),
    }
  );

  if (isObject(activity.object)) createdObject = activity.object;

  if (isLoading) {
    return (
      <Card sx={{ p: 4 }}>
        <LinearProgress />
      </Card>
    );
  } else if (error) {
    console.log(
      `Could not load object ${activity.object}. Error message: ${error.message}`
    );
    return null;
  }

  // Do not display replies
  if (!showReplies && createdObject.inReplyTo) {
    return null;
  }

  // Skip rendering if the note is expired
  const isExpired = createdObject.endTime 
    ? new Date(createdObject.endTime) < new Date() 
    : false;

  return (
    <Card sx={{
       p: 1,
       opacity: isExpired ? 0.5 : 1,
       backgroundColor: isExpired ? '#f0f0f0' : 'white',
       '&:not(:last-child)': {
         mb: 1
       }
    }}>
      <Note
        object={createdObject}
        activity={activity}
        clickOnContent={clickOnContent}
      />
    </Card>
  );
};

Create.defaultProps = {
  showReplies: true,
  clickOnContent: true,
};

export default Create;
