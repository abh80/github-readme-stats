const axios = require("axios");
require("dotenv").config();
const Canvas = require("canvas");
const fs = require("fs");
const themes = require("./themes.json");
const Util = require("../Util");

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
    drawImage(data).then((img) => fs.writeFileSync("./Twitter_Stats.png", img));
  });

async function drawImage(data) {
  let canvas = Canvas.createCanvas(800, 400);
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = themes.twitter_default.border;
  Util.roundRect(ctx, 0, 0, 800, 400, 10, true, false);

  ctx.fillStyle = themes.twitter_default.background;
  Util.roundRect(ctx, 5, 5, 790, 390, 10, true, false);
  // draw circlular profile image
  ctx.beginPath();
  ctx.arc(120, 200, 100, 0, Math.PI * 2, true);
  ctx.save();
  ctx.clip();
  ctx.drawImage(
    await Canvas.loadImage(
      data.data.profile_image_url.replace("_normal", "")
    ),
    20,
    100,
    200,
    200
  );
  ctx.closePath();
  ctx.restore();
  ctx.drawImage(
    await Canvas.loadImage(
      fs.readFileSync(__dirname + themes.twitter_default["logo-file"])
    ),
    30,
    20,
    30,
    25
  );
  ctx.fillStyle = themes.twitter_default.text;
  ctx.font = "semibold 20px Arial";
  ctx.fillText("Twitter Stats", 70, 40);

  ctx.font = "bold 30px Arial";
  ctx.fillText(data.data.name, 240, 150);

  ctx.font = "semibold 20px Arial";
  ctx.fillStyle = themes.twitter_default.secondary_text;
  ctx.fillText("@" + data.data.username, 240, 180);

  ctx.font = "bold 20px Arial";
  ctx.fillStyle = themes.twitter_default.text;
  ctx.fillText(data.data.public_metrics.followers_count, 240, 300);
  ctx.measureText(data.data.public_metrics.followers_count).width;
  ctx.font = "condensed 20px Arial";
  ctx.fillStyle = themes.twitter_default.secondary_text;
  ctx.fillText(
    "Followers",
    240 +
      5 +
      ctx.measureText(data.data.public_metrics.followers_count).width,
    300
  );
  ctx.font = "bold 20px Arial";
  ctx.fillStyle = themes.twitter_default.text;
  ctx.fillText(
    data.data.public_metrics.following_count,
    240 +
      15 +
      ctx.measureText(
        data.data.public_metrics.followers_count + "Following"
      ).width,
    300
  );
  ctx.font = "condensed 20px Arial";
  ctx.fillStyle = themes.twitter_default.secondary_text;
  ctx.fillText(
    "Following",
    240 +
      15 +
      ctx.measureText(
        data.data.public_metrics.followers_count + "Following"
      ).width +
      15 +
      ctx.measureText(data.data.public_metrics.following_count).width,
    300
  );
  // break the description into 3 lines and exclude the other linees
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
  lines.forEach((line, i) => {
    ctx.font = "18px Arial";
    ctx.fillStyle = themes.twitter_default.text;
    ctx.fillText(line, 245, 210 + i * 20);
  });
  const img = canvas.toBuffer();
  return img;
}
