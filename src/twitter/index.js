const axios = require("axios");
require("dotenv").config();
const fs = require("fs");
const themes = require("../themes.json");
const SVG = require("../Utils/SVG");

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

let svg = new SVG(600, 300);
let style = `
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
  }`;
svg.appendStyle(style);

async function drawImage(data) {
  const profilePic = await axios.get(
    data.data.profile_image_url.replace("_normal", ""),
    {
      responseType: "arraybuffer",
    }
  );
  const profilePic64 = Buffer.from(profilePic.data, "binary").toString(
    "base64"
  );

  const logoPic = await axios.get(theme["logo-file"], {
    responseType: "arraybuffer",
  });
  const logoPic64 = Buffer.from(logoPic.data, "binary").toString("base64");
  svg.append(
    svg
      .createElement("rect", 0.5, 0.5, "99.8%", "99.7%")
      .addAttr("rx", 4.5)
      .addAttr("fill", theme.background)
      .addAttr("stroke", theme.border)
  );

  svg.append(
    svg
      .createElement("clipPath")
      .addAttr("id", "imageH")
      .append(
        svg
          .createElement("circle")
          .addAttr("id", "profile-pic")
          .addAttr("r", "75")
          .addAttr("cx", "95")
          .addAttr("cy", "150")
      )
  );
  svg.append(
    svg
      .createElement("image", 25, 10, 30, 30)
      .addAttr("href", `data:image/png;base64,${logoPic64}`)
  );
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

  svg.append(
    svg
      .createElement("image", 20, 75, 150, 150)
      .addAttr("href", `data:image/png;base64,${profilePic64}`)
      .addAttr("clip-path", "url(#imageH)")
  );
  svg.append(
    svg
      .createElement("text", 175, 105)
      .addAttr("fill", theme.header_text)
      .addAttr("class", "default-fade")
      .addAttr("style", "font-size:25px;font-family:Arial;font-weight:bold")
      .append(data.data.name)
  );
  lines.forEach((line, i) => {
    svg.append(
      svg
        .createElement("text", 178, 160 + i * 20)
        .addAttr("fill", theme.text)
        .addAttr("class", "default-fade")
        .addAttr("style", "font-size:18px;font-family:Arial;font-weight:500")
        .append(line)
    );
  });
  svg.append(
    svg
      .createElement("text", 178, 130)
      .addAttr("fill", theme.secondary_text)
      .addAttr("class", "default-fade")
      .addAttr("style", "font-size:20px;font-family:Arial;font-weight:bold")
      .append("@" + data.data.username)
  );

  svg.append(
    svg
      .createElement("text", 178, 240)
      .addAttr("fill", theme.text)
      .addAttr("class", "default-fade")
      .addAttr("style", "font-size:18px;font-family:Arial;font-weight:bold")
      .append(data.data.public_metrics.followers_count.toString())
  );
  svg.append(
    svg
      .createElement(
        "text",
        178 +
          data.data.public_metrics.followers_count.toString().length * 9 +
          7,
        240
      )
      .addAttr("fill", theme.secondary_text)
      .addAttr("class", "default-fade")
      .addAttr("style", "font-size:18px;font-family:Arial;font-weight:bold")
      .append("Followers")
  );

  svg.append(
    svg
      .createElement(
        "text",
        178 +
          data.data.public_metrics.followers_count.toString().length * 9 +
          "Followers".length * 9 +
          20,
        240
      )
      .addAttr("fill", theme.text)
      .addAttr("class", "default-fade")
      .addAttr("style", "font-size:18px;font-family:Arial;font-weight:bold")
      .append(data.data.public_metrics.following_count.toString())
  );
  svg.append(
    svg

      .createElement(
        "text",
        178 +
          data.data.public_metrics.followers_count.toString().length * 9 +
          "Followers".length * 9 +
          20 +
          data.data.public_metrics.following_count.toString().length * 9 +
          7,
        240
      )
      .addAttr("fill", theme.secondary_text)
      .addAttr("class", "default-fade")
      .addAttr("style", "font-size:18px;font-family:Arial;font-weight:bold")
      .append("Following")
  );
  svg.append(
    svg
      .createElement("rect", 600, 0, 600, 400)
      .addAttr("fill", theme.border)
      .addAttr("id", "intro")
  );
  svg.append(
    svg
      .createElement("text", 60, 30)
      .addAttr("fill", theme.text)
      .addAttr("style", "font-size:18px;font-family:Arial;font-weight:bold")
      .append("Twitter Stats")
  );
  return svg.build();
}
