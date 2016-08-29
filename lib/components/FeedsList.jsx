import React from 'react';
import Telescope from 'meteor/nova:lib';

const FeedsList = ({results, currentUser, ready}) => {
  if (!!results.length) {
    return (
      <div className="posts-list">
        <div className="posts-list-content">
          {results.map(feed => <Telescope.components.FeedsItem key={feed._id} feed={feed}/>)}
        </div>
      </div>
    )
  } else if (!ready) {
    return (
      <div className="posts-list">
        <div className="posts-list-content">
          <Telescope.components.PostsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className="posts-list">
        <div className="posts-list-content">
          No feeds to display.
        </div>
      </div>
    )  
  }
};

export default FeedsList;