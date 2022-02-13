const axios = require("axios");
require("dotenv").config();
const fs = require("fs");
const themes = require("./themes.json");

if (!process.env.token) {
  console.log("Please set your twitter token in .env");
  process.exit(1);
}
if (!process.env.twitter_username) {
  console.log("Please set your twitter username in .env");
  process.exit(1);
}
// axios
//   .get(
//     "https://api.twitter.com/2/users/by/username/" +
//       process.env.twitter_username +
//       "?user.fields=public_metrics,profile_image_url,description",
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.token}`,
//       },
//     }
//   )
//   .then(({ data }) => {
//     console.log(data)
//     drawImage(data).then((img) => fs.writeFileSync("./Twitter_Stats.svg", img));
//   });
let theme = themes.twitter_default;

let svg = `<svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
<style>
svg {
  background-color: ${theme.background};
  border-radius:10px;
  border: 4px solid ${theme.border};
}
</style>
<clipPath id="imageH">
    <circle cx="95" cy="150" r="75" />
  </clipPath>
<image x="25" y="10" width="30" height="30" href="${theme["logo-file"]}"></image>
  <text x="65" y="30" fill="#fff" style="font-size:18px;font-family:Arial;font-weight:bold">Twitter Stats</text>
`;
drawImage({
  data: {
    public_metrics: {
      followers_count: 18,
      following_count: 169,
      tweet_count: 214,
      listed_count: 0,
    },
    description:
      "Music lover and learning programming.\n" +
      "\n" +
      "Interested in learning about NEOs and SETI.",
    profile_image_url:
      "https://pbs.twimg.com/profile_images/1492808960176717824/TYZXt4ST.jpg",
    name: "Stars Tracker",
    username: "TrackerStars",
    id: "1363710222913560577",
  },
}).then((v) => fs.writeFileSync("test.svg", v));
async function drawImage(data) {
  let description = data.data.description;
  let lines = description.split("\n");
  lines = lines.filter((line) => line.trim());
  if (lines.length == 1) {
    lines = description.match(new RegExp(".{1," + 60 + "}", "g"));
  }
  lines.forEach((line, i) => {
    if (line.length > 60) {
      if (lines.length > 1) {
        lines[i + 2] = lines[i + 1];
      }
      lines[i + 1] = line.slice(0, 60);
      lines[i] = line.slice(60);
    }
  });
  if (lines.length > 3) {
    lines[2] = lines[2] + "...";
  }
  lines = lines.slice(0, 3);
  svg += data.data.username;
  svg += `<image clip-path="url(#imageH)" x="20" y="75" width="150" height="150" href="${data.data.profile_image_url}"></image>`
  svg += "</svg>";
  return svg;
}
