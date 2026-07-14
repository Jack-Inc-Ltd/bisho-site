/**
 * 美翔 コーポレートサイト — main.js
 * 素のJS、CDN依存ゼロ
 *
 * 機能:
 *  1. ヘッダー凝縮（スクロール検知）
 *  2. ハンバーガーメニュー（モバイル）
 *  3. スクロールリビール（IntersectionObserver）
 *  4. ヒーロー初期アニメーション
 *  5. ギャラリー カテゴリフィルタ
 *  6. お問い合わせフォーム 送信ダミー + サンクス表示
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     1. ヘッダー凝縮
  ---------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 初期確認
  }


  /* ----------------------------------------------------------------
     2. ハンバーガーメニュー
  ---------------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay    = document.querySelector('.menu-overlay');

  function openMenu() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // モバイルメニューのリンクをクリックしたら閉じる
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Escキーで閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }


  /* ----------------------------------------------------------------
     3. スクロールリビール（IntersectionObserver）
  ---------------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (!prefersReducedMotion) {
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      // IntersectionObserver非対応時は即表示
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  } else {
    // reduced-motion: すべて即表示
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
    });
  }


  /* ----------------------------------------------------------------
     4. ヒーロー 初期アニメーション
  ---------------------------------------------------------------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    if (prefersReducedMotion) {
      hero.classList.add('is-revealed');
    } else {
      // ページ読み込み後に少し待ってから開始
      requestAnimationFrame(() => {
        setTimeout(() => {
          hero.classList.add('is-revealed');
        }, 80);
      });
    }
  }


  /* ----------------------------------------------------------------
     5. ギャラリー カテゴリフィルタ
  ---------------------------------------------------------------- */
  const filterBtns  = document.querySelectorAll('.gallery__filter-btn');
  const galleryItems = document.querySelectorAll('.gallery__item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // active状態の更新
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const cat = btn.dataset.category;

        galleryItems.forEach((item) => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  }


  /* ----------------------------------------------------------------
     6. お問い合わせフォーム（Web3Forms 送信 + サンクス表示）
        受信先キー(access_key)がプレースホルダのままの間はデモ挙動
        （実送信せずサンクス表示のみ）。本物のキー(UUID)に差し替えると
        自動で実送信に切り替わる。→ 稼働化はキー1行の差し替えだけ。
  ---------------------------------------------------------------- */
  const contactForm  = document.querySelector('#contact-form');
  const thanksBlock  = document.querySelector('.contact__thanks');

  if (contactForm && thanksBlock) {
    const showThanks = () => {
      contactForm.style.display = 'none';
      thanksBlock.classList.add('is-visible');
      // サンクスブロックにフォーカスを移動（アクセシビリティ）
      thanksBlock.setAttribute('tabindex', '-1');
      thanksBlock.focus();
      // 画面内にスクロール
      thanksBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // HTML5 バリデーション確認
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      // 送信ボタンを無効化（二重送信防止）
      const submitBtn = contactForm.querySelector('.form-submit');
      const submitHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '送信中...';
      }

      // access_key が本物（UUID形式）なら実送信、プレースホルダならデモ挙動
      const accessKey = (contactForm.querySelector('input[name="access_key"]') || {}).value || '';
      const keyIsLive = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(accessKey);

      if (!keyIsLive) {
        // デモ挙動（受信先キー未設定）：実送信せずサンクス表示のみ
        setTimeout(showThanks, 600);
        return;
      }

      // 本番：Web3Forms へ実送信
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


  /* ----------------------------------------------------------------
     アンカーリンク スムーズスクロール（ヘッダー分オフセット）
  ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  });

})();
