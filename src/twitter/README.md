# Twitter Stats for Github readme


# Preview
<a href="https://twitter.com/TrackerStars"><img src="https://raw.githubusercontent.com/abh80/github-readme-stats/master/src/twitter/preview.svg"/></a>

# Usage
There is a little complicacy in configuring the twitter stats as it has rate-limit, we cannot host one for everyone

**Steps** to install the twitter stats into your repo:

- Head over to [Twitter-Developer-Portal](https://developer.twitter.com/en/portal/dashboard) and create a new / use an exisiting application.

- Copy the **Bearer Token** and save it somewhere.
  
  <img src ="https://user-images.githubusercontent.com/50198413/153985540-9979ae6b-335e-4490-9fbe-377ff0114efe.png" width="400" height="250"/>


- Now go to your github repo (for me its abh80/abh80), then head over to **settings** then secrets > Actions.

- Create a new repository secret named `TWITTER_TOKEN` and paste your **Bearer Token** there.

- Now create a new repository secret named `TWITTER_USERNAME` and paste your **twitter username** there.
  
 ![image](https://user-images.githubusercontent.com/50198413/153985828-a7b67b68-0bea-4e15-9520-b7d66aa35a6e.png)


- Now simply copy the workflow action into your repository https://github.com/abh80/abh80/blob/master/.github/workflows/twitter_stats.yml

- To embed in into your readme simply use `<img src="./Twitter_Stats.svg"/>`

- Enjoy!
