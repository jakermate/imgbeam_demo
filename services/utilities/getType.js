
const videoFormats = [
    ".mp4",
    ".mov",
    ".avi",
    ".webm",
    ".mpeg",
    ".flv",
    ".mkv",
    ".mpv",
    ".wmv",
  ]
  const imageFormats = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".apng",
    ".tiff",
    ".tif",
    ".bmp",
    ".xcf",
    ".webp",
    ".svg",
  ]
  module.exports.default = function getType(file) {
    console.log("checking " + file)
    let type
    videoFormats.forEach((str) => {
      if (file.includes(str)) {
        type = "video"
      }
    })
    imageFormats.forEach((str) => {
      if (file.includes(str)) {
        type = "image"
      }
    })
    return type
  }