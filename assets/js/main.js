/**
 * 美翔 コーポレートサイト — main.js
 * 大規模リニューアル（方向性B）版。素のJS、CDN依存ゼロ。
 *
 * 機能:
 *  1. ヘッダー凝縮（スクロール検知 → .is-solid）
 *  2. モバイルメニュー（ハンバーガー／オーバーレイ）
 *  3. スクロールリビール（IntersectionObserver → .is-visible）
 *  4. ギャラリー カテゴリフィルタ
 *  5. お問い合わせフォーム（Web3Forms 送信 + サンクス表示）
 *  6. アンカーリンク スムーズスクロール（ヘッダー分オフセット）
 *  ※ ヒーロー初期アニメーションはCSS(@keyframes fadeUp)で自動。
 */

(function () {
  'use strict';

  /* 1. ヘッダー凝縮 */
  const header = document.querySelector('.hdr');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-solid', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* 2. モバイルメニュー */
  const burger     = document.querySelector('.hdr__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay    = document.querySelector('.menu-overlay');

  function openMenu() {
    burger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    burger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    burger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    if (overlay) overlay.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* 3. スクロールリビール */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* 4. ギャラリー カテゴリフィルタ */
  const filterBtns   = document.querySelectorAll('.gal__fbtn');
  const galleryItems = document.querySelectorAll('.gal__item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.category;
        galleryItems.forEach((item) => {
          const show = (cat === 'all' || item.dataset.category === cat);
          item.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* 5. お問い合わせフォーム（Web3Forms 送信 + サンクス表示）
        access_key がプレースホルダの間はデモ挙動（実送信せずサンクス表示のみ）。
        本物のキー(UUID)に差し替えると自動で実送信に切り替わる。 */
  const contactForm = document.querySelector('#contact-form');
  const thanksBlock = document.querySelector('.contact__thanks');

  if (contactForm && thanksBlock) {
    const showThanks = () => {
      contactForm.style.display = 'none';
      thanksBlock.classList.add('is-visible');
      thanksBlock.setAttribute('tabindex', '-1');
      thanksBlock.focus();
      thanksBlock.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      const submitBtn = contactForm.querySelector('.form-submit');
      const submitHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '送信中...';
      }

      const accessKey = (contactForm.querySelector('input[name="access_key"]') || {}).value || '';
      const keyIsLive = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(accessKey);

      if (!keyIsLive) {
        setTimeout(showThanks, 600);
        return;
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            showThanks();
          } else {
            throw new Error(data && data.message ? data.message : 'send failed');
          }
        })
        .catch(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitHTML;
          }
          alert('送信に失敗しました。お手数ですが、時間をおいて再度お試しください。');
        });
    });
  }

  /* 6. アンカーリンク スムーズスクロール */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetTop, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

})();
