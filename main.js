window.addEventListener("load", function () {
  // Khai báo biến
  const songList = document.querySelector(".song-list");
  const songCurrent = document.querySelector(".song-current");
  const audio = document.querySelector(".audio");
  const play = document.querySelector(".player-play-icon");
  const progress = document.querySelector("#progressBar");
  const totalTimeCurrentSong = document.querySelector(".time-total");
  const timeCurrent = document.querySelector(".time-current");
  const prevBtn = document.querySelector(".player-prev-icon");
  const nextBtn = document.querySelector(".player-next-icon");
  const repeatBtn = document.querySelector(".player-repeat-icon");
  const randomBtn = document.querySelector(".player-random-icon");
  const player = document.querySelector(".player");

  // Chương trình
  const app = {
    countUp: 0,
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    // Đối tượng lưu mảng danh sách bài hát
    songs: [
      {
        name: "Thuận theo ý trời",
        artist: "Bùi anh tuấn",
        image: "./images/ThuanTheoYTroi.jpg",
        path: "./playlist/ThuanTheoYTroi.mp3",
      },
      {
        name: "Tình nào không như tình đầu",
        artist: "Trung Quân Idol",
        image: "./images/TinhNaoKhongNhuTinhDau.jpg",
        path: "./playlist/TinhNaoKhongNhuTinhDau.mp3",
      },
      {
        name: "Không phải em đúng không",
        artist: "Dương hoàng yến, Bùi anh tuấn",
        image: "./images/KhongPhaiEmDungKhong.jpg",
        path: "./playlist/KhongPhaiEmDungKhong.mp3",
      },
      {
        name: "Cố gắng vô hình",
        artist: "Văn võ ngọc nhân",
        image: "./images/CoGangVoHinh.jpg",
        path: "./playlist/CoGangVoHinh.mp3",
      },
      {
        name: "Lặng yên",
        artist: "Bùi anh tuấn, Ái phương",
        image: "./images/LangYenDuoiVucSau.jpg",
        path: "./playlist/LangYenDuoiVucSau.mp3",
      },
      {
        name: "Nơi tình yêu bắt đầu",
        artist: "Bùi anh tuấn",
        image: "./images/NoiTinhYeuBatDau.jpg",
        path: "./playlist/NoiTinhYeuBatDau.mp3",
      },
      {
        name: "Chưa bao giờ em quên",
        artist: "Hương ly",
        image: "./images/ChuaBaoGioEmQuen.jpg",
        path: "./playlist/ChuaBaoGioEmQuen.mp3",
      },
      {
        name: "Hà nội mùa lá bay",
        artist: "Bùi anh tuấn, Dương trường giang",
        image: "./images/HaNoiMuaLaBay.jpg",
        path: "./playlist/HaNoiMuaLaBay.mp3",
      },
    ],

    // Hàm render bài hát hiện tại (Khi chương trình bắt đầu sẽ render bài hát đầu tiên trong mảng))
    renderCurrentSong: function (index) {
      const me = this;
      const song = this.songs[index];
      const html = `<img
          src="${song.image}"
          alt=""
          class="song-img"
        />
        <p>Song - <span class="song-name">${song.name}</span></p>
        <p>Artist - <span class="song-singer">${song.artist}</span></p>`;

      songCurrent.innerHTML = html;

      // Cập nhật đường dẫn bài hát vào audio tag
      audio.setAttribute("src", song.path);
      audio.addEventListener("loadedmetadata", function () {
        totalTimeCurrentSong.textContent = me.formatTime(audio.duration);
      });

      // Cập nhật đường dẫn bài hát vào audio tag
      // let promise = new Promise(function (resolve, reject) {
      //   if (audio.getAttribute("src")) {
      //     resolve();
      //   } else {
      //     reject();
      //   }
      // });

      // promise
      //   .then(function () {
      //     totalTimeCurrentSong.textContent = me.formatTime(audio.duration);
      //   })
      //   .catch(function () {
      //     totalTimeCurrentSong.textContent = `Lỗi hiển thị`;
      //   });
    },

    // Hàm định dạng lại thời gian theo định dạng mm:ss
    formatTime: function (timeSeconds) {
      timeSeconds = Math.ceil(timeSeconds);
      let minutes = parseInt(timeSeconds / 60);
      let minutesText = minutes >= 10 ? minutes : `0${minutes}`;
      let seconds = Math.ceil(timeSeconds % 60);
      let secondsText = seconds >= 10 ? seconds : `0${seconds}`;
      return `${minutesText}:${secondsText}`;
    },

    // Hàm xử lý thêm class active cho bài hát đang được chọn
    highlightSongSelected: function (index) {
      const songItems = document.querySelectorAll(".song-item");
      songItems.forEach((songItem) => {
        songItem.classList.remove("active");
      });
      document
        .querySelector(`.song-item[data-index="${index}"]`)
        .classList.add("active");
    },

    // Hàm xử lý khi chuyển bài hát tiếp theo
    nextSong: function () {
      const me = this;
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
      // Load bài hát và tổng thời gian của bài hát
      this.renderCurrentSong(this.currentIndex);
      // Scroll đến bài hát đang phát
      this.scrollToActiveSong();
      // Thêm màu cho bài hát hiện tại
      this.highlightSongSelected(this.currentIndex);
      // Cho bài hát chạy từ đầu
      timeCurrent.textContent = `00:00`;
      progress.value = 0;
      if (this.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    },

    // Hàm xử lý khi quay lại bài hát phía trước
    previousSong: function () {
      const me = this;
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
      }
      // Load bài hát và tổng thời gian của bài hát
      this.renderCurrentSong(this.currentIndex);
      // Scroll đến bài hát đang phát
      this.scrollToActiveSong();
      // Thêm màu cho bài hát hiện tại
      this.highlightSongSelected(this.currentIndex);
      // Cho bài hát chạy từ đầu
      timeCurrent.textContent = `00:00`;
      progress.value = 0;
      if (this.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    },

    // Hàm xử lý phát ngãu nhiên bài hát trong danh sách
    randomSong: function () {
      const me = this;
      const currentIndex = this.currentIndex;
      do {
        this.currentIndex = Math.floor(Math.random() * this.songs.length);
      } while (currentIndex === this.currentIndex);
      // Load bài hát và tổng thời gian của bài hát
      this.renderCurrentSong(this.currentIndex);
      // Scroll đến bài hát đang phát
      this.scrollToActiveSong();
      // Thêm màu cho bài hát hiện tại
      this.highlightSongSelected(this.currentIndex);
      // Cho bài hát chạy từ đầu
      timeCurrent.textContent = `00:00`;
      progress.value = 0;
      if (this.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    },

    // Hàm xử lý scroll đến bài hát được phát
    scrollToActiveSong: function () {
      setTimeout(function () {
        document.querySelector(".song-item.active").scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    },

    // Hàm tạo mới tooltip
    createTooltip: function (content) {
      const tooltip = document.createElement("span");
      tooltip.classList.add("tooltip");
      tooltip.textContent = content;
      player.appendChild(tooltip);
      return tooltip;
    },

    // Hàm xóa tooltip
    removeTooltip: function () {
      const tooltip = player.querySelector(".tooltip");
      if (tooltip) {
        tooltip.parentNode.removeChild(tooltip);
      }
    },

    // Hàm lắng nghe các sự kiện của DOM
    handleEvent: function () {
      const me = this;
      // Lắng nghe sự kiện click button play
      play.addEventListener("click", function (e) {
        if (me.isPlaying == false) {
          audio.play();
        } else {
          audio.pause();
        }
      });

      // Lắng nghe sự kiện play của audio
      audio.addEventListener("play", function () {
        play.classList.add("fa-pause");
        play.classList.remove("fa-play");
        me.isPlaying = true;
        // Chạy thời gian bài hát
        me.countUp = setInterval(function () {
          timeCurrent.textContent = me.formatTime(audio.currentTime);
        }, 1000);
      });

      // Lắng nghe sự kiện pause của audio
      audio.addEventListener("pause", function () {
        play.classList.add("fa-play");
        play.classList.remove("fa-pause");
        me.isPlaying = false;
        // Hủy interval countUp
        clearInterval(me.countUp);
      });

      // Lắng nghe sự kiện thay đổi tiến dộ của bài hát
      audio.addEventListener("timeupdate", function () {
        // Progress chạy khi bài hát chạy
        if (audio.duration) {
          const progressPercent = (audio.currentTime / audio.duration) * 100;
          progress.value = progressPercent;
        }
      });

      // Lắng nghe sự kiện kết thúc bài hát hiện tại
      audio.addEventListener("ended", function () {
        // Khi bài hát hiện tại kết thúc, nó sẽ kiểm tra xem nút repeat có kích hoạt hay không
        // 1. Nếu có, lặp lại bài hát hiện tại
        if (me.isRepeat) {
          timeCurrent.textContent = `00:00`;
          progress.value = 0;
          audio.play();
        } else {
          // 2. Nếu không lặp lại bài hát, thì kiểm tra xem nút random có kích hoạt hay không
          // 2.1. Nếu có
          if (me.isRandom) {
            me.randomSong();
            audio.play();
          }
          // 2.2. Nếu không
          else {
            me.nextSong();
            audio.play();
          }
        }
      });

      // Lắng nghe sự kiện kéo thả progress (tua)
      progress.addEventListener("input", function (e) {
        const seekTime = (e.target.value * audio.duration) / 100;
        audio.currentTime = seekTime;
        timeCurrent.textContent = me.formatTime(audio.currentTime);
      });

      // Lắng nghe sự kiện chuyển bài hát tiếp theo trong danh sách
      nextBtn.addEventListener("click", function () {
        if (me.isRandom) {
          me.randomSong();
        } else {
          me.nextSong();
        }
      });

      // Lắng nghe sự kiện quay lại bài hát phía trước trong danh sách
      prevBtn.addEventListener("click", function () {
        if (me.isRandom) {
          me.randomSong();
        } else {
          me.previousSong();
        }
      });

      // Lắng nghe sự kiện click vào nút phát lại bài hát
      repeatBtn.addEventListener("click", function (e) {
        me.isRepeat = !me.isRepeat;
        e.target.classList.toggle("active", me.isRepeat);
      });

      // Lắng nghe sự kiện di chuột vào nút phát lại
      repeatBtn.addEventListener("mouseenter", function (e) {
        // Lấy ra nội dung tooltip
        const content = e.target.dataset.tooltip;
        const tooltip = me.createTooltip(content);
        // Lấy ra vị trí của nút
        const coordinate = e.target.getBoundingClientRect();
        const { left, top, width } = coordinate;
        const subtrahendLeft = (tooltip.offsetWidth - width) / 2;
        const margin = 10;
        tooltip.style.left = `${left - subtrahendLeft - margin}px`;
        const triagle = 18;
        tooltip.style.top = `${top - tooltip.offsetHeight - triagle}px`;
      });

      // Lắng nghe sự kiện di chuột ra khỏi nút phát lại
      repeatBtn.addEventListener("mouseleave", function () {
        // Xóa tooltip
        me.removeTooltip();
      });

      // Lắng nghe sự kiện click vào nút phát ngẫu nhiên bài hát
      randomBtn.addEventListener("click", function (e) {
        me.isRandom = !me.isRandom;
        e.target.classList.toggle("active", me.isRandom);
      });

      // Lắng nghe sự kiện di chuột vào nút random
      randomBtn.addEventListener("mouseenter", function (e) {
        // Lấy ra nội dung tooltip
        const content = e.target.dataset.tooltip;
        const tooltip = me.createTooltip(content);
        // Lấy ra vị trí của nút
        const coordinate = e.target.getBoundingClientRect();
        const { left, top, width } = coordinate;
        const subtrahendLeft = (tooltip.offsetWidth - width) / 2;
        const margin = 10;
        tooltip.style.left = `${left - subtrahendLeft - margin}px`;
        const triagle = 18;
        tooltip.style.top = `${top - tooltip.offsetHeight - triagle}px`;
      });

      // Lắng nghe sự kiện di chuột ra khỏi nút random
      randomBtn.addEventListener("mouseleave", function () {
        // Xóa tooltip
        me.removeTooltip();
      });

      // Lắng nghe sự kiện chọn bài hát trong danh sách phát
      songList.addEventListener("click", function (e) {
        if (e.target.matches(".song-item")) {
          const index = e.target.dataset.index;
          me.currentIndex = index;
          me.highlightSongSelected(me.currentIndex);
          me.scrollToActiveSong();
          me.renderCurrentSong(me.currentIndex);
          audio.play();
        }
      });
    },

    // Hàm render danh sách bài hát
    renderListSong: function () {
      const html = this.songs.map((song, index) => {
        return `<li class="song-item ${
          index === this.currentIndex ? "active" : ""
        }" data-index=${index}>
        <i class="fas fa-compact-disc song-item-icon"></i>
        <p class="song-item-name">${song.name}</p>
        <span>Artist - </span>
        <p class="song-item-singer">${song.artist}</p>  
      </li>`;
      });

      songList.insertAdjacentHTML("afterbegin", html.join(""));

      // document.querySelector(".song-item:first-child").classList.add("active");
    },

    // Hàm start chương trình
    start: function () {
      let me = this;
      this.renderListSong();
      this.renderCurrentSong(this.currentIndex);
      this.handleEvent();
    },
  };

  // Chạy chương trình
  app.start();
});
