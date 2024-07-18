const generateMemeBtn = document.querySelector(".meme-generator .generate-meme-btn");
const memeImage = document.querySelector(".meme-generator img");
const memeTitle = document.querySelector(".meme-generator .meme-title");
const memeAuthor = document.querySelector(".meme-generator .meme-author");
const loader = document.querySelector(".loader");
const shareBtn = document.querySelector(".meme-generator .share-btn");
const likeBtn = document.querySelector(".meme-generator .like-btn");
const heartAnimation = document.querySelector(".heart-animation");
const laughingEmojiAnimation = document.querySelector(".laughing-emoji-animation");

const updateDetails = (url, title, author) => {
  memeImage.setAttribute("src", url);
  memeImage.onload = () => {
    memeImage.style.display = 'block';
    loader.style.display = 'none';
  };
  memeTitle.innerHTML = title;
  memeAuthor.innerHTML = `Meme by: ${author}`;
};

const generateMeme = () => {
  loader.style.display = 'block';
  memeImage.style.display = 'none';
  memeTitle.innerHTML = 'Loading...';
  memeAuthor.innerHTML = '';

  fetch("https://meme-api.com/gimme/wholesomememes")
    .then((response) => response.json())
    .then((data) => {
      updateDetails(data.url, data.title, data.author);
    });
};

const shareMeme = () => {
  const url = memeImage.src;
  const text = `Check out this meme: ${memeTitle.innerHTML}`;
  if (navigator.share) {
    navigator.share({
      title: 'Meme Generator',
      text: text,
      url: url,
    })
    .catch(console.error);
  } else {
    alert("Share feature is not supported in this browser.");
  }
};

const likeMeme = () => {
  heartAnimation.style.display = 'block';
  heartAnimation.style.left = `${likeBtn.offsetLeft + likeBtn.offsetWidth / 2 - heartAnimation.offsetWidth / 2}px`;
  heartAnimation.style.top = `${likeBtn.offsetTop - heartAnimation.offsetHeight}px`;
  setTimeout(() => {
    heartAnimation.style.display = 'none';
    laughingEmojiAnimation.style.display = 'block';
    setTimeout(() => {
      laughingEmojiAnimation.style.display = 'none';
    }, 1000);
  }, 600);
};

generateMemeBtn.addEventListener("click", generateMeme);
shareBtn.addEventListener("click", shareMeme);
likeBtn.addEventListener("click", likeMeme);

generateMeme();