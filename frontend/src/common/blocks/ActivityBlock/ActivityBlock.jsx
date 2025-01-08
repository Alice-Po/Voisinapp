import { ACTIVITY_TYPES, OBJECT_TYPES } from '@semapps/activitypub-components';
import Create from './Create';
import Announce from './Announce';

const ActivityBlock = ({ activity, showReplies, clickOnContent }) => {
  switch (activity.type) {
    case ACTIVITY_TYPES.ANNOUNCE:
      return <div data-testid="activity-block"><Announce activity={activity} /></div>;

    case ACTIVITY_TYPES.CREATE:
      return <div data-testid="activity-block"><Create activity={activity} showReplies={showReplies} clickOnContent={clickOnContent} /></div>;

    case OBJECT_TYPES.NOTE:
      return <div data-testid="activity-block"><Create activity={{ object: activity }} showReplies={showReplies} clickOnContent={clickOnContent} /></div>;

    default:
      // console.debug(
      //   `Activities or objects of type ${activity.type} are not displayed`,
      //   activity
      // );
      return null;
  }
};

ActivityBlock.defaultProps = {
  showReplies: true,
  clickOnContent: true
};

export default ActivityBlock;
