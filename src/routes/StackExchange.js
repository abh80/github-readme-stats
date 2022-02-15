const express = require("express");
const router = express.Router();
const axios = require("axios");
const SVG = require("../Utils/SVG");
const themes = require("../themes.json");
const FormatNumber = require("../Utils/FormatNumber");
const site_info = require("../Utils/stackexchange.json");
let style = `
@keyframes imgIn{
    from {
        rx: 0;
    }
    to {
        rx: 5;
    }
}
.profile-img{
    animation: imgIn 1s;
}
@keyframes fadeIn{
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
.basic-fade {
    animation: fadeIn 1s;
}
@keyframes circleIn{
    from {
        r: 0;
    }
    to {
        r: 5;
    }
}
.circle-animation{
    animation: circleIn 1s;
}
.circle-animation-2{
    animation: circleIn2 1s;
}
@keyframes circleIn2{
    from {
        r: 0;
    }
    to {
        r: 70;
    }
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
`;
router.get("/", async (req, res) => {
  res.removeHeader("X-Powered-By");
  if (!req.query.site) {
    return res.status(400).send("Missing `site` parameter");
  } else if (!req.query.id) {
    return res.status(400).send("Missing username id (`id`) parameter");
  }
  const id = req.query.id;
  const site = req.query.site;
  if (!site_info[site]) return res.status(404).send("Invalid site");
  const url = `https://api.stackexchange.com/2.2/users/${id}?site=${site}`;
  let theme = themes.stack_default;
  if (req.query.theme) {
    theme = themes[req.query.theme];
    if (!theme) {
      return res.status(400).send("Invalid theme");
    }
  }
  try {
    const { data } = await axios.get(url);

    if (!data.items.length) return res.status(404).send("User not found");
    let user = data.items[0];
    let svg = new SVG(400, 200);
    svg.appendStyle(style);
    svg.append(
      svg
        .createElement("clipPath")
        .addAttr("id", "image-circle")
        .append(
          svg
            .createElement("circle")
            .addAttr("r", "70")
            .addAttr("cx", "70")
            .addAttr("cy", "100")
            .addAttr("class", "circle-animation-2")
        )
    );
    const icon_image = Buffer.from(
      (
        await axios.get(site_info[site].icon, {
          responseType: "arraybuffer",
        })
      ).data,
      "binary"
    ).toString("base64");

    svg.append(
      svg
        .createElement("clipPath")
        .addAttr("id", "imageH")
        .append(
          svg
            .createElement("rect", 20, 50, 100, 100)
            .addAttr("rx", "5")
            .addAttr("class", "profile-img")
            .addAttr("clip-path", "url(#image-circle)")
        )
    );
    const profile_image = Buffer.from(
      (
        await axios.get(user.profile_image, {
          responseType: "arraybuffer",
        })
      ).data,
      "binary"
    ).toString("base64");
    svg.append(
      svg
        .createElement("rect", 0.5, 0.5, "399", "199")
        .addAttr("rx", "4.5")
        .addAttr("fill", theme.background)
        .addAttr("stroke", theme.border)
    );
    svg.append(
      svg
        .createElement("image", 20, 10, 30, 30)
        .addAttr("href", `data:image/png;base64,${icon_image}`)
    );
    svg.append(
      svg
        .createElement("text", 55, 30)
        .addAttr("fill", theme.text)
        .addAttr("style", "font-size:15px;font-family:Arial;font-weight:bold")
        .append(site_info[site].name + " Stats")
    );
    svg.append(
      svg
        .createElement("image", 20, 50, 100, 100)
        .addAttr("href", `data:image/png;base64,${profile_image}`)
        .addAttr("clip-path", "url(#imageH)")
    );
    svg.append(
      svg
        .createElement("text", 130, 75)
        .addAttr(
          "fill",
          theme.header_text.length > 17
            ? theme.header_text.substring(0, 17) + "..."
            : theme.header_text
        )
        .addAttr("class", "basic-fade")
        .addAttr(
          "style",
          "font-family:Arial;font-size: 25px;font-weight: bold;"
        )
        .append(user.display_name)
    );
    let rep = FormatNumber(user.reputation).toString();
    svg.append(
      svg
        .createElement("text", 132, 100)
        .addAttr("fill", theme.text)
        .addAttr("style", "font-size:15px;font-family:Arial;font-weight:600;")
        .addAttr("class", "basic-fade")
        .append(rep)
    );
    svg.append(
      svg
        .createElement("text", 132 + rep.length * 7.5 + 7, 100)
        .addAttr("fill", theme.secondary_text)
        .addAttr("style", "font-size:15px;font-family:Arial;font-weight:600;")
        .addAttr("class", "basic-fade")
        .append("Reputation")
    );
    let badges = user.badge_counts;
    let x = 137;
    if (badges.gold) {
      svg.append(
        svg
          .createElement("circle")
          .addAttr("r", "5")
          .addAttr("fill", "#ffcc01")
          .addAttr("cx", x)
          .addAttr("cy", 150)
          .addAttr("class", "circle-animation")
      );
      svg.append(
        svg
          .createElement("text", x + 10, 154)
          .addAttr("fill", theme.text)
          .append(badges.gold.toString())
          .addAttr("style", "font-size:12px;font-family:Arial;font-weight:500;")
          .addAttr("class", "basic-fade")
      );
      x += 25 + badges.gold.toString().length * 6;
    }
    if (badges.silver) {
      svg.append(
        svg
          .createElement("circle")
          .addAttr("r", "5")
          .addAttr("fill", "#cccccc")
          .addAttr("cx", x)
          .addAttr("cy", 150)
          .addAttr("class", "circle-animation")
      );
      svg.append(
        svg
          .createElement("text", x + 10, 154)
          .addAttr("fill", theme.text)
          .append(badges.silver.toString())
          .addAttr("style", "font-size:12px;font-family:Arial;font-weight:500;")
          .addAttr("class", "basic-fade")
      );
      x += 25 + badges.silver.toString().length * 6;
    }
    if (badges.bronze) {
      svg.append(
        svg
          .createElement("circle")
          .addAttr("r", "5")
          .addAttr("fill", "#cd7f32")
          .addAttr("cx", x)
          .addAttr("cy", 150)
          .addAttr("class", "circle-animation")
      );
      svg.append(
        svg

          .createElement("text", x + 10, 154)
          .addAttr("fill", theme.text)
          .append(badges.bronze.toString())
          .addAttr("style", "font-size:12px;font-family:Arial;font-weight:500;")
          .addAttr("class", "basic-fade")
      );
      x += 25 + badges.bronze.toString().length * 6;
    }
    let member_for = {
      days: Math.floor((Date.now() - user.creation_date) / 86400000),
      months: Math.floor((Date.now() - user.creation_date) / 2592000),
      years: Math.floor((Date.now() - user.creation_date) / 31536000),
    };
    // let member_for_string = "Member for ";
    // if (member_for.years > 0) {
    //   member_for_string += member_for.years + " years ";
    // }
    // if (member_for.months > 0) {
    //   member_for_string += member_for.months + " months ";
    // }
    // if (member_for.days > 0) {
    //   member_for_string += member_for.days + " days";
    // }
    // svg.append(
    //   svg

    //     .createElement("text", 132, 125)
    //     .addAttr("fill", theme.secondary_text)
    //     .append(member_for_string)
    //     .addAttr("style", "font-size:12px;font-family:Arial;font-weight:500;")
    //     .addAttr("class", "basic-fade")
    // );
    svg.append(
      svg
        .createElement("rect", 600, 0, 600, 400)
        .addAttr("fill", theme.border)
        .addAttr("id", "intro")
    );

    return res.send(svg.build());
  } catch (err) {
    console.error(err);
    res.status(404).send("Cannot find user with id " + id);
  }
});

module.exports = router;
