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
axios
  .get(
    "https://api.twitter.com/2/users/by/username/" +
      process.env.twitter_username +
      "?user.fields=public_metrics,profile_image_url,description",
    {
      headers: {
        Authorization: `Bearer ${process.env.token}`,
      },
    }
  )
  .then(({ data }) => {
    drawImage(data).then((img) => fs.writeFileSync("./Twitter_Stats.svg", img));
  });

let theme = themes.twitter_default;
if (process.env.twitter_theme) {
  theme = themes[process.env.twitter_theme];
  if (!theme) {
    console.log("Theme not found");
    process.exit(1);
  }
}

let svg = `<svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
<style>
svg {
  background-color: ${theme.background};
  border-radius:10px;
  border: 4px solid ${theme.border};
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes imgIn {
  from {
    r: 0;
  }
  to {
    r: 75;
  }
}
.default-fade {
  animation: fadeIn 2s;
}
#profile-pic {
  animation: imgIn 2s;
}
@keyframes introAnim {
  0% {
    x:0;
    width: 0;
  }
  50% {
    x:0;
    width: 600;
  }
  100% {
    x: 600;
  }
}
#intro {
  animation: introAnim 1s;
}
</style>
<clipPath id="imageH">
    <circle cx="95" cy="150" r="75" id="profile-pic"/>
  </clipPath>
<image x="25" y="10" width="30" height="30" href="${theme["logo-file"]}"></image>
  <text x="65" y="30" fill="#fff" style="font-size:18px;font-family:Arial;font-weight:bold">Twitter Stats</text>
`;

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
  svg += `<image clip-path="url(#imageH)" x="20" y="75" width="150" height="150" href="${data.data.profile_image_url.replace("_normal","")}"></image>`;
  svg += `<text class="default-fade" x="175" y="105" fill="#fff" style="font-size:25px;font-family:Arial;font-weight:bold">${data.data.name}</text>`;
  svg +=
    "<text class='default-fade' x='178' y='130' fill='#ffffff80' style='font-size:20px;font-family:Arial;font-weight:bold'>@" +
    data.data.username +
    "</text>";
  lines.forEach((line, i) => {
    svg += `<text x="178" y="${
      i * 20 + 160
    }" fill="#fff" class="default-fade" style="font-size:18px;font-family:Arial;font-weight:500">${line}</text>`;
  });

  svg += `<text class="default-fade" x="178" y="240" fill="#fff" style="font-size:18px;font-family:Arial;font-weight:bold">${data.data.public_metrics.followers_count}</text>`;
  svg += `<text class="default-fade" x="${
    178 + data.data.public_metrics.followers_count.toString().length * 9 + 7
  }" y="240" fill="#ffffff80" style="font-size:18px;font-family:Arial;font-weight:bold">Followers</text>`;
  svg += `<text class="default-fade" x="${
    178 +
    data.data.public_metrics.followers_count.toString().length * 9 +
    "Followers".length * 9 +
    20
  }" y="240" fill="#fff" style="font-size:18px;font-family:Arial;font-weight:bold">${
    data.data.public_metrics.following_count
  }</text>`;

  svg += `<text class="default-fade" x="${
    178 +
    data.data.public_metrics.followers_count.toString().length * 9 +
    "Followers".length * 9 +
    20 +
    data.data.public_metrics.following_count.toString().length * 9 +
    7
  }" y="240" fill="#ffffff80" style="font-size:18px;font-family:Arial;font-weight:bold">Followings</text>`;
  svg += `<rect id="intro" width="600" x="600" y="0" height="400" style="fill:${theme.border};"></rect>`;
  svg += "</svg>";
  return svg;
}
