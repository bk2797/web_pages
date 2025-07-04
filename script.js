// script.js

document.addEventListener('DOMContentLoaded', function () {
      // TÜM DETAY POPUP'LARI AYNI ANDA YÖNETEN KOD
  const allInfoBtns = document.querySelectorAll('.detail-item, .kadın-dogum-item');

  allInfoBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const info = this.getAttribute('data-info');
      const targetId = this.getAttribute('data-target');
      const detailBox = document.getElementById(targetId);

      // Önce tüm açık kutuları kapat (hem GETAT hem Kadın Doğum)
      document.querySelectorAll('.detail-info.active, .kadın-dogum-info.active').forEach(box => {
        if (box !== detailBox) box.classList.remove('active');
      });

      // Aynı bilgiye tıklanırsa kutuyu kapat
      if (detailBox.classList.contains('active') && detailBox.innerHTML === info) {
        detailBox.classList.remove('active');
        return;
      }

      // Kutu kapalıysa ya da farklı bilgiye tıklanırsa
      detailBox.innerHTML = info;
      detailBox.classList.add('active');
    });
  });

  // Boş bir yere tıklayınca tüm kutuları kapat
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.detail-info.active, .kadın-dogum-info.active').forEach(box => {
      box.classList.remove('active');
    });
  });
});
// MULTISLIDER - Her foto için tek nokta, tam kaydırma, responsive ve dokunmatik desteği
document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.multislide-track');
    if (!track) return;
    const items = document.querySelectorAll('.multislide-item');
    const dotsBox = document.querySelector('.multislide-dots');
    let currentSlide = 0;

    // Noktaları oluştur
    items.forEach((item, i) => {
        const dot = document.createElement('span');
        dot.className = 'multislide-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsBox.appendChild(dot);
    });

    function updateDots() {
        document.querySelectorAll('.multislide-dot').forEach((d, i) =>
            d.classList.toggle('active', i === currentSlide)
        );
    }

    function goToSlide(idx) {
    currentSlide = idx;
    const itemWidth = items[0].offsetWidth;
    const trackParentWidth = track.parentElement.offsetWidth;

    // Kaç kutu ekranda görünüyor?
    const visibleCount = Math.floor(trackParentWidth / itemWidth);

    // Maksimum kaydırma miktarı: Son kutu tam sağda görünsün
    let maxTranslate = (items.length * itemWidth) - trackParentWidth;
    if (maxTranslate < 0) maxTranslate = 0;

    // Eğer tıklanan kutu sonlardan biriyse, son kutu sağda olacak şekilde hizala
    let translate = idx * itemWidth;
    if (translate > maxTranslate) translate = maxTranslate;

    track.style.transform = `translateX(${-translate}px)`;
    updateDots();
}

    // Responsive için resize takibi
     window.addEventListener('resize', () => {
        goToSlide(currentSlide);
    });

    // Dokunmatik kaydırma desteği
    let startX = 0, deltaX = 0;
    track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        track.style.transition = "none";
    });

    track.addEventListener('touchmove', e => {
        deltaX = e.touches[0].clientX - startX;
        const itemWidth = items[0].offsetWidth;
        const visibleCount = Math.floor(track.parentElement.offsetWidth / itemWidth);
        const maxStart = Math.max(0, items.length - visibleCount);
        let slideTo = currentSlide;
        if (slideTo > maxStart) slideTo = maxStart;
        let translate = -slideTo * itemWidth + deltaX;

        // Sola ve sağa kaymayı sınırla
        const minTranslate = -maxStart * itemWidth;
        const maxTranslate = 0;
        if (translate < minTranslate) translate = minTranslate;
        if (translate > maxTranslate) translate = maxTranslate;
        track.style.transform = `translateX(${translate}px)`;
    });

    track.addEventListener('touchend', e => {
        track.style.transition = "transform 0.5s";
        const itemWidth = items[0].offsetWidth;
        const visibleCount = Math.floor(track.parentElement.offsetWidth / itemWidth);
        const maxStart = Math.max(0, items.length - visibleCount);

        if (deltaX > 60 && currentSlide > 0) currentSlide--;
        else if (deltaX < -60 && currentSlide < items.length - 1) currentSlide++;
        // Son elemana tıklayınca, sonu sağa yasla
        let slideTo = currentSlide;
        if (slideTo > maxStart) slideTo = maxStart;
        currentSlide = slideTo;

        goToSlide(currentSlide);
        deltaX = 0;
    });

    goToSlide(0);
});