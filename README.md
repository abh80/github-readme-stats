# Stack Exchange Stats for Github Readme
- Firstly find the id of site from [this](https://github.com/abh80/github-readme-stats/blob/master/src/Utils/stackexchange.json) json file.
- Paste this link in your github readme `<img src="https://github-readme-stats-abh80.vercel.app/stack-exchange?site=[site_id]&id=[user_id]&theme=stackoverflow"  height="200" width="400"/>`

# Twitter Stats for Github readme


# Preview
![image](https://user-images.githubusercontent.com/50198413/156910547-1f43891b-932e-4df8-ab27-b00d0eea19c5.png)

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
