module.exports = function FormatNumber(num) {
  num = num.toString();
  if (num < 1000) {
    return num;
  }
  if (num < 10000) {
    return num.charAt(0) + "," + num.substring(1);
  }
  return (num / 1000).toFixed(num % 1000 != 0) + "k";
};
